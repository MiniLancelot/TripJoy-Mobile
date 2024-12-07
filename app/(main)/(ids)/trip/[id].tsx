import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import Mapbox, {
  Camera,
  MapView,
  ShapeSource,
  SymbolLayer,
  Images,
} from "@rnmapbox/maps";
import { point, featureCollection } from "@turf/helpers";
import axios from "axios";
import { useRouter } from "expo-router"; // Import the useRouter hook

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
Mapbox.setAccessToken(accessToken);

const pinIcon = require("@/assets/images/others/pin.png"); // Custom pin icon

const Map = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<number[] | null>(null);
  const cameraRef = useRef<any>(null);
  const router = useRouter(); // Get the router instance

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=VN`;

    try {
      const response = await axios.get(url);
      const results = response.data;

      if (results.length) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
        Alert.alert("No Results", "No locations found within Vietnam.");
      }
    } catch (error) {
      console.error("Error fetching geocoding results:", error);
      Alert.alert("Error", "Unable to search for location.");
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery) handleSearch(searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, handleSearch]);

  const handleSelectLocation = (location: any) => {
    const longitude = parseFloat(location.lon);
    const latitude = parseFloat(location.lat);
    setCurrentLocation([longitude, latitude]);

    // Move the camera to the selected location
    cameraRef.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 15,
      duration: 1000,
    });

    setSearchResults([]); // Clear results after selection
    setSearchQuery(location.display_name); // Update search box with the selected place name

    Alert.alert(
      "Selected Location",
      `Latitude: ${latitude}, Longitude: ${longitude}`
    );
  };

  const cameraFeature = currentLocation
    ? featureCollection([point(currentLocation)])
    : null;

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a place in Vietnam..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Display search results overlayed on top of the map */}
      {searchQuery.trim() && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item, index) => `${item.place_id}-${index}`}
          style={styles.resultsOverlay}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectLocation(item)}
            >
              <Text style={styles.resultText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
        >
          <Camera
            ref={cameraRef}
            followUserLocation={false}
            zoomLevel={15}
            centerCoordinate={currentLocation || [105.85, 21.03]} // Default to Hanoi
          />

          {/* Show selected location pin */}
          {cameraFeature && (
            <ShapeSource id="cameraLocation" shape={cameraFeature}>
              <SymbolLayer
                id="selected-location-pin"
                style={{
                  iconImage: "pinIcon",
                  iconSize: 0.5, // Adjust size
                }}
              />
              <Images images={{ pinIcon }} />
            </ShapeSource>
          )}
        </MapView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    zIndex: 2, // Ensure it's above everything
    backgroundColor: "#13c892",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  searchContainer: {
    padding: 10,
    position: "absolute",
    top: 60,
    width: "100%",
    zIndex: 2, // Ensure search bar is above the map
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  resultsOverlay: {
    position: "absolute",
    top: 110, // Position below the search bar and back button
    left: 10,
    right: 10,
    maxHeight: 200, // Limit list height
    backgroundColor: "#fff",
    zIndex: 3, // Ensure it's above the map
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  resultItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default Map;

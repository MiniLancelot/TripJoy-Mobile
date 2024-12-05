import React, { useEffect, useRef, useState } from "react";
import { Text, StyleSheet, View, Button, TouchableOpacity, Alert } from "react-native";
import Mapbox, {
  Camera,
  MapView,
  ShapeSource,
  SymbolLayer,
  LineLayer,
  Images,
} from "@rnmapbox/maps";
import { featureCollection, point, lineString } from "@turf/helpers";
import axios from "axios";
import { Locations } from "@/constants/Locations";

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
Mapbox.setAccessToken(accessToken);

const Map = () => {
  const [route, setRoute] = useState<{ coordinates: number[][] } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [currentLocation, setCurrentLocation] = useState<number[] | null>(null);
  const cameraRef = useRef<any>(null);
  const [isAnimating, setIsAnimating] = useState(false); // Track if animation is active

  const pin = require("@/assets/images/others/pin.png");
  const camIcon = require("@/assets/images/others/avatarTest.webp");

  useEffect(() => {
    const fetchRoute = async () => {
      const coordinates = Locations.map((location) => [
        location.longtitude,
        location.latitude,
      ]);
      const start = coordinates[0];
      const end = coordinates[coordinates.length - 1];
      let url;

      if (coordinates.length > 2) {
        const waypoints = coordinates
          .slice(1, -1)
          .map((coord) => coord.join("%2C"))
          .join("%3B");
        url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.join(
          "%2C"
        )}%3B${waypoints}%3B${end.join(
          "%2C"
        )}?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=${accessToken}`;
      } else {
        url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.join(
          ","
        )};${end.join(",")}?geometries=geojson&access_token=${accessToken}`;
      }

      try {
        const response = await axios.get(url);
        const routeGeoJSON = response.data.routes[0].geometry;
        const routeDistance = response.data.routes[0].distance;
        setDistance(routeDistance);
        setRoute(routeGeoJSON);
        setCurrentLocation(coordinates[0]);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, []);

  // const startAnimation = () => {
  //   if (!route || !route.coordinates.length) return;

  //   setIsAnimating(true); // Set animation as active

  //   let index = 0;
  //   const interval = setInterval(() => {
  //     if (index < route.coordinates.length) {
  //       const nextLocation = route.coordinates[index];
  //       setCurrentLocation(nextLocation);

  //       // Use Camera's ref to animate the camera view
  //       cameraRef.current?.setCamera({
  //         centerCoordinate: nextLocation,
  //         zoomLevel: 15,
  //         duration: 1000, // Smooth animation
  //       });
  //       index++;
  //     } else {
  //       clearInterval(interval);
  //       setIsAnimating(false); // End of animation
  //     }
  //   }, 1000);
  // };

  const startAnimation = () => {
    if (!route || !route.coordinates.length) return;
  
    setIsAnimating(true); // Set animation as active
  
    let index = 0;
    const interval = setInterval(() => {
      if (index < route.coordinates.length) {
        const nextLocation = route.coordinates[index];
        setCurrentLocation(nextLocation);
  
        // Use Camera's ref to animate the camera view
        cameraRef.current?.setCamera({
          centerCoordinate: nextLocation,
          zoomLevel: 15,
          duration: 1000, // Smooth animation
        });
        index++;
      } else {
        clearInterval(interval);
        setIsAnimating(false); // End of animation
  
        // Alert when route is finished
        Alert.alert("Route Finished", "You have reached your destination!");
      }
    }, 1000); // Update location every 1 second
  };

  const locationPoints = Locations.map((location, index) => ({
    ...point([location.longtitude, location.latitude]),
    properties: {
      label: `${index + 1}. ${location.name}`,
    },
  }));
  const myLocationFeature = featureCollection(locationPoints);

  const cameraFeature = currentLocation
    ? featureCollection([point(currentLocation)])
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
        >
          <Camera
            ref={cameraRef}
            followUserLocation={false}
            zoomLevel={15}
            centerCoordinate={currentLocation || [0, 0]}
          />

          <ShapeSource id="myLocations" shape={myLocationFeature}>
            <SymbolLayer
              id="my-location-icons"
              style={{
                iconImage: "pin",
                iconSize: 0.5,
                textField: ["get", "label"],
                textSize: 14,
                textOffset: [0, 2.5],
                textColor: "#000",
              }}
            />
            <Images images={{ pin }} />
          </ShapeSource>

          {cameraFeature && (
            <ShapeSource id="cameraLocation" shape={cameraFeature}>
              <SymbolLayer
                id="camera-icon"
                style={{
                  iconImage: "camIcon",
                  iconSize: 0.15,
                }}
              />
              <Images images={{ camIcon }} />
            </ShapeSource>
          )}
          {route && (
            <ShapeSource id="routeSource" shape={lineString(route.coordinates)}>
              <LineLayer
                id="routeLayer"
                style={{
                  lineColor: "#13c892",
                  lineWidth: 3,
                  lineDasharray: [2, 2],
                  lineCap: "round",
                  lineJoin: "round",
                }}
              />
            </ShapeSource>
          )}
        </MapView>
      </View>

      {distance && (
        <View style={styles.distanceContainer}>
          <Text style={styles.distanceText}>
            Khoảng cách: {(distance / 1000).toFixed(2)} km
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={startAnimation}
          disabled={isAnimating} // Disable button during animation
        >
          <Text style={styles.buttonText}>
            {isAnimating ? "Đang chạy..." : "Bắt đầu"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    flex: 3 / 4,
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  distanceContainer: {
    padding: 10,
    alignItems: "center",
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    padding: 10,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#13c892",
    padding: 10,
    borderRadius: 5,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Map;

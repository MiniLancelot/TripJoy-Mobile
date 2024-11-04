import { View, Text, StyleSheet, Button, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import Mapbox, {
  MapView,
  Camera,
  LocationPuck,
  ShapeSource,
  LineLayer,
  PointAnnotation,
} from "@rnmapbox/maps";
import * as Location from "expo-location";

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
Mapbox.setAccessToken(accessToken);

interface Location {
  latitude: number;
  longitude: number;
}

interface Route {
  routes: {
    geometry: {
      coordinates: number[][];
    };
  }[];
}

const Map = () => {
  const [userLocation, setUserLocation] = useState<Location | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<string>("");
  const [longitude, setLongitude] = useState<string>("");

  const getLocationPermission = async () => {
    let { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    }
    showCurrentLocation();
  };

  const showCurrentLocation = async () => {
    let location = await Location.getCurrentPositionAsync({});
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    console.log(userLocation);
  };

  const getRoute = async (origin: any[], dest: any[]) => {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${accessToken}`
    );
    const data = await res.json();
    return {
      route: data,
      distance: data.routes[0].distance,
    };
  };

  const onSubmit = async () => {
    if (!latitude || !longitude) {
      console.log("Please enter valid coordinates");
      alert("Please enter valid coordinates");
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { route, distance } = await getRoute(
      [location.coords.longitude, location.coords.latitude],
      [parseFloat(longitude), parseFloat(latitude)]
    );
    setRoute(route);
    setDistance(distance);
  };

  useEffect(() => {
    getLocationPermission();
  }, []);

  const directionCoordinate = route?.routes[0].geometry.coordinates;
  const destinationCoordinate = directionCoordinate
    ? directionCoordinate[directionCoordinate.length - 1]
    : null;

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
      <MapView style={styles.map} styleURL="mapbox://styles/mapbox/streets-v12">
        {userLocation && (
          <Camera
            centerCoordinate={[userLocation.longitude, userLocation.latitude]}
            // centerCoordinate={[16.0712136, 108.2275723]}
            zoomLevel={16}
          />
        )}
        <LocationPuck
          pulsing={{ isEnabled: true }}
          puckBearingEnabled
          puckBearing="heading"
        />
        {directionCoordinate && (
          <ShapeSource
            id="routeSource"
            lineMetrics
            shape={{
              properties: {},
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: directionCoordinate,
              },
            }}
          >
            <LineLayer
              id="exampleLineLayer"
              style={{
                lineColor: "#42A2D9",
                lineCap: "round",
                lineJoin: "round",
                lineWidth: 7,
              }}
            />
          </ShapeSource>
        )}
        {destinationCoordinate && (
          <PointAnnotation
            id="destinationMarker"
            coordinate={destinationCoordinate}
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>📍</Text>
            </View>
          </PointAnnotation>
        )}
      </MapView>
      </View>
      
      <View style={{ flex: 1 / 2 }}>
        <TextInput
          style={styles.input}
          placeholder="Enter Latitude"
          value={latitude}
          onChangeText={setLatitude}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Longitude"
          value={longitude}
          onChangeText={setLongitude}
          keyboardType="numeric"
        />
        <Button title="Submit" onPress={onSubmit} />
        <Button
          title="Show My Location"
          onPress={showCurrentLocation}
          color={"pink"}
        />
        {distance && (
          <Text>
            Distance to destination: {(distance / 1000).toFixed(2)} km
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mapContainer: {
    // flex: 1 / 2,
    flex: 1, 
    margin: 15,
    borderRadius: 10,
    overflow: "hidden",
  },
  map: {
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  marker: {
    padding: 5,
    borderRadius: 5,
  },
  markerText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Map;





// import { Text, StyleSheet, View } from 'react-native';
// import Mapbox, { Camera, MapView, LocationPuck } from '@rnmapbox/maps';

// const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
// Mapbox.setAccessToken(accessToken);

// const Map = () => {
//   return (
//     <View style={styles.container}>
//       <View style={styles.mapContainer}>
//         <MapView style={styles.map} styleURL="mapbox://styles/mapbox/streets-v12">
//         <Camera
//           followUserLocation
//           followZoomLevel={16}
//           zoomLevel={16} />
//           <LocationPuck pulsing={{ isEnabled: true }} />
//         </MapView>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   mapContainer: {
//     flex: 1/2,
//     margin: 15,
//     borderRadius: 10,
//     overflow: 'hidden', // Ensures the border radius is applied
//   },
//   map: {
//     flex: 1,
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default Map;

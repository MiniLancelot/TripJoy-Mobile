// import { View, Text, StyleSheet, Button, TextInput } from "react-native";
// import React, { useState, useEffect } from "react";
// import Mapbox, {
//   MapView,
//   Camera,
//   LocationPuck,
//   ShapeSource,
//   LineLayer,
//   PointAnnotation,
// } from "@rnmapbox/maps";
// import * as Location from "expo-location";

// const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
// Mapbox.setAccessToken(accessToken);
// Mapbox.setTelemetryEnabled(false);
// interface Location {
//   latitude: number;
//   longitude: number;
// }

// interface Route {
//   routes: {
//     geometry: {
//       coordinates: number[][];
//     };
//   }[];
// }

// const Map = () => {
//   const [userLocation, setUserLocation] = useState<Location | null>(null);
//   const [route, setRoute] = useState<Route | null>(null);
//   const [distance, setDistance] = useState<number | null>(null);
//   const [latitude, setLatitude] = useState<string>("");
//   const [longitude, setLongitude] = useState<string>("");

//   const getLocationPermission = async () => {
//     let { status } = await Location.getForegroundPermissionsAsync();
//     if (status !== "granted") {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access location was denied");
//         return;
//       }
//     }
//     showCurrentLocation();
//   };

//   const showCurrentLocation = async () => {
//     let location = await Location.getCurrentPositionAsync({});
//     setUserLocation({
//       latitude: location.coords.latitude,
//       longitude: location.coords.longitude,
//     });
//     console.log(userLocation);
//   };

//   const getRoute = async (origin: any[], dest: any[]) => {
//     const res = await fetch(
//       `https://api.mapbox.com/directions/v5/mapbox/walking/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?alternatives=false&annotations=distance%2Cduration&continue_straight=true&geometries=geojson&overview=full&steps=false&access_token=${accessToken}`
//     );
//     const data = await res.json();
//     return {
//       route: data,
//       distance: data.routes[0].distance,
//     };
//   };

//   const onSubmit = async () => {
//     if (!latitude || !longitude) {
//       console.log("Please enter valid coordinates");
//       alert("Please enter valid coordinates");
//       return;
//     }

//     const location = await Location.getCurrentPositionAsync({});
//     const { route, distance } = await getRoute(
//       [location.coords.longitude, location.coords.latitude],
//       [parseFloat(longitude), parseFloat(latitude)]
//     );
//     setRoute(route);
//     setDistance(distance);
//   };

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const directionCoordinate = route?.routes[0].geometry.coordinates;
//   const destinationCoordinate = directionCoordinate
//     ? directionCoordinate[directionCoordinate.length - 1]
//     : null;

//   return (
//     <View style={styles.container}>
//       <View style={styles.mapContainer}>
//         <MapView
//           style={styles.map}
//           styleURL="mapbox://styles/mapbox/streets-v12"
//           rotateEnabled
//         >
//           {userLocation && (
//             <>
//               <Camera
//                 centerCoordinate={[userLocation.longitude, userLocation.latitude]}
//                 // centerCoordinate={[10.181667, 36.806389]}
//                 zoomLevel={16}
//                 pitch={30}
//                 animationMode={"flyTo"}
//                 animationDuration={6000}
//               />
//               {/* <PointAnnotation
//               id="destinationMarker"
//               coordinate={[10.181667, 36.806389]}
//             >
//               <View style={styles.marker}>
//                 <Text style={styles.markerText}>📍</Text>
//               </View>
//             </PointAnnotation> */}
//             </>
//           )}
//           <LocationPuck
//             pulsing={{ isEnabled: true }}
//             puckBearingEnabled
//             puckBearing="heading"
//           />
//           {directionCoordinate && (
//             <ShapeSource
//               id="routeSource"
//               lineMetrics
//               shape={{
//                 properties: {},
//                 type: "Feature",
//                 geometry: {
//                   type: "LineString",
//                   coordinates: directionCoordinate,
//                 },
//               }}
//             >
//               <LineLayer
//                 id="exampleLineLayer"
//                 style={{
//                   lineColor: "#42A2D9",
//                   lineCap: "round",
//                   lineJoin: "round",
//                   lineWidth: 7,
//                 }}
//               />
//             </ShapeSource>
//           )}
//           {destinationCoordinate && (
//             <PointAnnotation
//               id="destinationMarker"
//               coordinate={destinationCoordinate}
//             >
//               <View style={styles.marker}>
//                 <Text style={styles.markerText}>📍</Text>
//               </View>
//             </PointAnnotation>
//           )}
//         </MapView>
//       </View>

//       <View style={{ flex: 1 / 2 }}>
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Latitude"
//           value={latitude}
//           onChangeText={setLatitude}
//           keyboardType="numeric"
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Enter Longitude"
//           value={longitude}
//           onChangeText={setLongitude}
//           keyboardType="numeric"
//         />
//         <Button title="Submit" onPress={onSubmit} />
//         <Button
//           title="Show My Location"
//           onPress={showCurrentLocation}
//           color={"pink"}
//         />
//         {distance && (
//           <Text>
//             Distance to destination: {(distance / 1000).toFixed(2)} km
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   mapContainer: {
//     // flex: 1 / 2,
//     flex: 1,
//     margin: 15,
//     borderRadius: 10,
//     overflow: "hidden",
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
//   marker: {
//     padding: 5,
//     borderRadius: 5,
//   },
//   markerText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });

// export default Map;

import { Text, StyleSheet, View, Image } from "react-native";
import Mapbox, {
  Camera,
  MapView,
  LocationPuck,
  ShapeSource,
  SymbolLayer,
  LineLayer,
  Images,
} from "@rnmapbox/maps";
import { featureCollection, point, lineString } from "@turf/helpers";
// import pin from '@/assets/images/others/pin.png';
import {Locations} from "@/constants/Locations"
import { useEffect, useState } from "react";
import axios from "axios";

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
Mapbox.setAccessToken(accessToken);

// const Map = () => {
//   const pin = require("@/assets/images/others/pin.png");
//   const coordinates = Locations.map((location) => point([location.longtitude, location.latitude]));
//   const myLocationFeauture = featureCollection(coordinates);
//   const [route, setRoute] = useState(null);

  

//   return (
//     <View style={styles.container}>
//       <View style={styles.mapContainer}>
//         <MapView
//           style={styles.map}
//           styleURL="mapbox://styles/mapbox/streets-v12"
//         >
//           <Camera followUserLocation followZoomLevel={15} zoomLevel={15} />
//           <LocationPuck pulsing={{ isEnabled: true }} puckBearingEnabled />

//           <ShapeSource id="myLocations" shape={myLocationFeauture}>
//             {/* [longitude, latitude]    */}
//             <SymbolLayer
//               id="my-location-icons"
//               style={{ iconImage: "pin", iconSize: 0.5 }}
//             />
//             <Images images={{ pin }} />
//           </ShapeSource>
//         </MapView>
//       </View>
//     </View>
//   );
// };



// const Map = () => {
//   const [route, setRoute] = useState<{ coordinates: number[][] } | null>(null);
//   const pin = require("@/assets/images/others/pin.png");

//   useEffect(() => {
//     const fetchRoute = async () => {
//       const coordinates = Locations.map((location) => [location.longtitude, location.latitude]);
//       const start = coordinates[0];
//       const end = coordinates[1];
//       let url;

//       if (coordinates.length > 2) {
//         const waypoints = coordinates.slice(2).map(coord => coord.join(',')).join(';');
//         url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(',')};${waypoints};${end.join(',')}?geometries=geojson&access_token=${accessToken}`;
//       } else {
//         url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(',')};${end.join(',')}?geometries=geojson&access_token=${accessToken}`;
//       }

//       try {
//         const response = await axios.get(url);
//         const routeGeoJSON = response.data.routes[0].geometry;
//         setRoute(routeGeoJSON);
//       } catch (error) {
//         console.error("Error fetching route:", error);
//       }
//     };

//     fetchRoute();
//   }, []);

//   const locationPoints = Locations.map((location) => point([location.longtitude, location.latitude]));
//   const myLocationFeature = featureCollection(locationPoints);

//   return (
//     <View style={styles.container}>
//       <View style={styles.mapContainer}>
//         <MapView
//           style={styles.map}
//           styleURL="mapbox://styles/mapbox/streets-v12"
//         >
//           <Camera followUserLocation followZoomLevel={15} zoomLevel={15} />
//           <LocationPuck pulsing={{ isEnabled: true }} puckBearingEnabled />

//           <ShapeSource id="myLocations" shape={myLocationFeature}>
//             <SymbolLayer
//               id="my-location-icons"
//               style={{ iconImage: "pin", iconSize: 0.5 }}
//             />
//             <Images images={{ pin }} />
//           </ShapeSource>

//           {route && (
//             <ShapeSource id="routeSource" shape={lineString(route.coordinates)}>
//               <LineLayer
//                 id="routeLayer"
//                 style={{ lineColor: "blue", lineWidth: 3 }}
//               />
//             </ShapeSource>
//           )}
//         </MapView>
//       </View>
//     </View>
//   );
// };


const Map = () => {
  const [route, setRoute] = useState<{ coordinates: number[][] } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const pin = require("@/assets/images/others/pin.png");

  // useEffect(() => {
  //   const fetchRoute = async () => {
  //     const coordinates = Locations.map((location) => [location.longtitude, location.latitude]);
  //     const start = coordinates[0];
  //     // const end = coordinates[coordinates.length - 1];
  //     const end = coordinates[1];
  //     let url;

  //     if (coordinates.length > 2) {
  //       const waypoints = coordinates.slice(2).map(coord => coord.join(',')).join(';');
  //       url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(',')};${waypoints};${end.join(',')}?geometries=geojson&roundtrip=false&source=first&destination=last&access_token=${accessToken}`;
  //     } else {
  //       url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(',')};${end.join(',')}?geometries=geojson&access_token=${accessToken}`;
  //     }

  //     try {
  //       const response = await axios.get(url);
  //       const routeGeoJSON = coordinates.length > 2 ? response.data.trips[0].geometry : response.data.routes[0].geometry;
  //       const routeDistance = coordinates.length > 2 ? response.data.trips[0].distance : response.data.routes[0].distance;

  //       setRoute(routeGeoJSON);
  //       setDistance(routeDistance);

  //     } catch (error) {
  //       console.error("Error fetching route:", error);
  //     }
  //   };

  //   fetchRoute();
  // }, []);

  useEffect(() => {
    const fetchRoute = async () => {
      const coordinates = Locations.map((location) => [location.longtitude, location.latitude]);
      const start = coordinates[0];
      const end = coordinates[coordinates.length - 1];
      let url;

      if (coordinates.length > 2) {
        const waypoints = coordinates.slice(1,-1).map(coord => coord.join(',')).join(';');
        url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(',')};${waypoints};${end.join(',')}?geometries=geojson&access_token=${accessToken}`;
      } else {
        url = `https://api.mapbox.com/directions/v5/mapbox/walking/${start.join(',')};${end.join(',')}?geometries=geojson&access_token=${accessToken}`;
      }

      try {
        const response = await axios.get(url);
        const routeGeoJSON = response.data.routes[0].geometry;
        const routeDistance = response.data.routes[0].distance;
        setDistance(routeDistance);
        setRoute(routeGeoJSON);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, []);

  const locationPoints = Locations.map((location) => point([location.longtitude, location.latitude]));
  const myLocationFeature = featureCollection(locationPoints);

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          styleURL="mapbox://styles/mapbox/streets-v12"
        >
          <Camera followUserLocation followZoomLevel={15} zoomLevel={15} />
          <LocationPuck pulsing={{ isEnabled: true }} puckBearingEnabled />

          <ShapeSource id="myLocations" shape={myLocationFeature}>
            <SymbolLayer
              id="my-location-icons"
              style={{ iconImage: "pin", iconSize: 0.5 }}
            />
            <Images images={{ pin }} />
          </ShapeSource>

          {route && (
            <ShapeSource id="routeSource" shape={lineString(route.coordinates)}>
              <LineLayer
                id="routeLayer"
                style={{ lineColor: "#13c892", lineWidth: 3, lineDasharray: [2, 2], lineCap: "round", lineJoin: "round", }}
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  distanceContainer: {
    padding: 10,
    alignItems: "center",
  },
  distanceText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Map;

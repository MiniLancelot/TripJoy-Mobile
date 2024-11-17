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
      let urlTest;

      if (coordinates.length > 2) {
        const waypoints = coordinates.slice(1,-1).map(coord => coord.join('%2C')).join('%3B');
        url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.join('%2C')}%3B${waypoints}%3B${end.join('%2C')}?alternatives=true&geometries=geojson&overview=full&steps=false&access_token=${accessToken}`;      } else {
        url = `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${start.join(',')};${end.join(',')}?geometries=geojson&access_token=${accessToken}`;
      }

      console.log(url);
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

  // const locationPoints = Locations.map((location) => point([location.longtitude, location.latitude]));
  const locationPoints = Locations.map((location, index) => ({
    ...point([location.longtitude, location.latitude]),
    // properties: { ordinal: (index + 1).toString(), name: location.name }
    properties: {
      label: `${index + 1}. ${location.name}`,
    }
  }));  
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

          {/* <ShapeSource id="myLocations" shape={myLocationFeature}>
            <SymbolLayer
              id="my-location-icons"
              style={{ iconImage: "pin", iconSize: 0.5 }}
            />
            <Images images={{ pin }} />
          </ShapeSource> */}


          <ShapeSource id="myLocations" shape={myLocationFeature}>
            <SymbolLayer
              id="my-location-icons"
              style={{
                iconImage: "pin",
                iconSize: 0.5,
                textField: ['get', 'label'],
                textSize: 14,
                textOffset: [0, 2.5],
                textColor: "#000",
              }}
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




// import { View, Text } from 'react-native'
// import React, { useEffect, useState } from 'react'
// import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
// import { useAuth } from '@/app/(auth)/AuthContext';
// import { getPlanLocationById } from '@/services/plan/plan';

// type Province = {
//     provinceId: string;
//     provinceName: string;
//   };

//   type TripProps = {
//     id: string;
//     title: string;
//     estimatedStartDate: string;
//     estimatedEndDate: string;
//     provinceStart: Province;
//     provinceEnd: Province;
//   }

// const ChosenTrip = () => {
//     const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { session } = useAuth();
//   const navigation = useNavigation();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchPlan = async () => {
//     try {
//       setIsLoading(true);
//       const response = await getPlanLocationById(session.userToken.accessToken, id);
//       if (response) {
//         console.log(response.data.plan.title);
//         // setPlanData(response.data.plan);
//         setIsLoading(false);
//       }
//     } catch (err: any) {
//       setError(err.message);
//       console.log("fail")
//     }
//   }
//   useEffect(() => {
//     fetchPlan();
//   }, [])

//   return (
//     <View>
//       <Text>id</Text>
//     </View>
//   )
// }

// export default ChosenTrip

import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Mapbox, {
  Camera,
  MapView,
  ShapeSource,
  SymbolLayer,
  Images,
} from "@rnmapbox/maps";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { point, featureCollection } from "@turf/helpers";
import axios from "axios";
import { useRouter, useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/(auth)/AuthContext";
import { getPlanLocationById, addPlanLocation } from "@/services/plan/plan";
import { useTabStore } from "@/utils/store";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MyProfileModal from "@/components/Modals/MyProfileModal";
import CalendarModal from "@/components/Modals/CalendarModal";
import { Calendar } from "react-native-calendars";

type Province = {
  provinceId: string;
  provinceName: string;
};

type SearchParams = {
  id: string;
};

type TripProps = {
  id: string;
  title: string;
  estimatedStartDate: string;
  estimatedEndDate: string;
  provinceStart: Province;
  provinceEnd: Province;
};

type PlanLocationProps = {
  longitude: number;
  latitude: number;
  name: string;
  address: string;
  estimatedStartDate: string;
};

const accessToken = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN || "";
Mapbox.setAccessToken(accessToken);

const ChosenTrip = () => {
  const { id } = useLocalSearchParams<SearchParams>();
  const setSharedId = useTabStore((state) => state.setSharedId);
  const { session } = useAuth();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string | null>(today);

  const [planLocation, setPlanLocation] = useState<PlanLocationProps>({
    name: "",
    address: "",
    longitude: 0,
    latitude: 0,
    estimatedStartDate: "",
  });

  const [planData, setPlanData] = useState<TripProps | null>(null);

  const isCreatingDisabled =
    !planLocation.name ||
    !planLocation.address ||
    !planLocation.estimatedStartDate;

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentLocation, setCurrentLocation] = useState<number[] | null>(null);
  const [location, setLocation] = useState<string[] | null>(null);
  const cameraRef = useRef<any>(null);
  const router = useRouter();
  const pinIcon = require("@/assets/images/others/pin.png");

  const fetchPlan = async () => {
    try {
      setIsLoading(true);
      const response = await getPlanLocationById(
        session.userToken.accessToken,
        id
      );
      if (response) {
        console.log(response.data.plan.title);
        // setPlanData(response.data.plan);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
      console.log("fail");
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=VN`;

    try {
      const response = await axios.get(url);
      const results = response.data;

      if (results.length) {
        // console.log("Search results:", results);
        setSearchResults(results);
      } else {
        setSearchResults([]);
        // Alert.alert("No Results", "No locations found within Vietnam.");
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

  useEffect(() => {
    if (id) setSharedId(id);
  }, [id]);

  const handleSelectLocation = (location: any) => {
    const longitude = parseFloat(location.lon);
    const latitude = parseFloat(location.lat);
    const name = location.name;
    const parts = location.display_name.split(", ");
    const address = parts.slice(1).join(", ");
    setCurrentLocation([longitude, latitude]);
    // setLocation([name, address]);
    setPlanLocation({
      name: name,
      address: address,
      longitude: longitude,
      latitude: latitude,
      estimatedStartDate: selectedDate || "",
    });

    // Move the camera to the selected location
    cameraRef.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel: 15,
      duration: 1000,
    });
    // handleOpen();

    setSearchResults([]); // Clear results after selection
    setSearchQuery("");
    setSearchQuery(location.display_name); // Update search box with the selected place name

    Alert.alert(
      "Selected Location",
      `Latitude: ${latitude}, Longitude: ${longitude}, Name: ${name}, Address: ${address}`
    );
  };

  const cameraFeature = currentLocation
    ? featureCollection([point(currentLocation)])
    : null;

  const snapPoints = useMemo(() => ["33%"], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  // const handleOpen = () => bottomSheetRef.current?.expand();
  // const handleSheetChanges = useCallback((index: number) => {
  //   console.log("handleSheetChanges", index);
  // }, []);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    console.log("Selected Date:", day.dateString);
    setPlanLocation(
      (prev) =>
        (prev = {
          ...prev,
          estimatedStartDate: day.dateString,
        })
    );
    console.log("Plan Location:", planLocation);
    setIsModalOpen(false); // Close the modal on date selection
  };

  const handleAddLocation = () => {
    if (!planLocation.name || !planLocation.address) {
      Alert.alert("Error", "Please select a location first.");
      return;
    }

    if (!planLocation.estimatedStartDate) {
      Alert.alert("Error", "Please select a date first.");
      return;
    }

    addPlanLocation(
      {
        planLocation: {
          name: planLocation.name,
          address: planLocation.address,
          longitude: planLocation.longitude,
          latitude: planLocation.latitude,
          estimatedStartDate: planLocation.estimatedStartDate,
        },
      },
      session.userToken.accessToken,
      id
    )
      .then((response) => {
        console.log("Add Plan Location Response:", response.data);
        Alert.alert("Success", "Location added to the trip.");
        // navigation.navigate("/(tabs)/trip");
      })
      .catch((error) => {
        console.error("Error adding location to trip:", error);
        Alert.alert("Error", "Failed to add location to the trip.");
      });
  };

  const getFirstPart = (displayName: string) => {
    return displayName.split(",")[0];
  };

  const getRestPart = (displayName: string) => {
    const parts = displayName.split(",");
    return parts.slice(1).join(",").trim();
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <GestureHandlerRootView>
        {/* <BottomSheetModalProvider> */}
        <View style={styles.topContainer}>
          <View style={styles.backBtnWrapper}>
            <TouchableOpacity onPress={() => router.replace("/(tabs)/trip")}>
              <Ionicons name="arrow-back-outline" size={25} color="#4a4d52" />
            </TouchableOpacity>
          </View>
          <View style={styles.searchBoxContainer}>
            <TextInput
              autoFocus
              style={styles.searchBar}
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {searchQuery.trim() && searchResults.length > 0 && (
          <FlatList
            data={searchResults}
            keyExtractor={(item, index) => `${item.place_id}-${index}`}
            ListHeaderComponent={<View style={{ height: 40 }} />}
            ListFooterComponent={<View style={{ height: 10 }} />}
            style={styles.resultsOverlay}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
            }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectLocation(item)}
              >
                <View>
                  <Ionicons
                    name="location-outline"
                    size={25}
                    color="#4a4d52"
                    style={styles.locationIcon}
                  />
                </View>
                <View
                  style={{
                    borderBottomWidth: 1,
                    paddingBottom: 10,
                    borderBottomColor: "#eee",
                    gap: 5,
                    alignItems: "flex-start",
                    width: 300,
                    transform: [{ translateX: -15 }],
                  }}
                >
                  <Text style={styles.resultText}>
                    {getFirstPart(item.display_name)}
                  </Text>
                  <Text style={{ fontSize: 12 }}>
                    {getRestPart(item.display_name)}
                  </Text>
                </View>
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
              centerCoordinate={currentLocation || [108.218, 16.06]}
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
        <BottomSheet
          ref={bottomSheetRef}
          // onChange={handleSheetChanges}
          index={0}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
        >
          <BottomSheetView style={styles.contentContainer}>
            <Text
              style={{ fontSize: 20, fontWeight: "500", alignItems: "center" }}
            >
              Thêm địa điểm trên chuyến đi 🎉
            </Text>
            <View style={styles.bottomSheetInnerContainer}>
              <Text style={styles.btsLocationName}>
                {planLocation.name ? planLocation.name : "Tên địa điểm"}
              </Text>
              <Text style={styles.btsOtherFields}>
                {planLocation.address ? planLocation.address : "Địa chỉ"}
              </Text>
              {/* <Text>Long: {planLocation.longitude}</Text>
              <Text>Lat : {planLocation.latitude}</Text> */}
              <TouchableOpacity onPress={() => setIsModalOpen(true)}>
                <Text style={styles.btsOtherFields}>
                  Ngày khởi hành:{" "}
                  {planLocation.estimatedStartDate
                    ? planLocation.estimatedStartDate
                    : ""}
                </Text>
              </TouchableOpacity>

              

              {/* <TouchableOpacity
                style={{ marginTop: 10 }}
                onPress={handleAddLocation}
              >
                <Text>Thêm địa điểm vào lộ trình</Text>
              </TouchableOpacity> */}
            </View>
            <View>
            <View style={styles.loginButtonContainer}>
                <Pressable
                  onPress={handleAddLocation}
                  disabled={isCreatingDisabled || isLoading}
                  android_ripple={
                    isCreatingDisabled ? null : { color: "#b9bcc6" }
                  }
                >
                  <View
                    style={[
                      styles.innerLoginButtonContainer,
                      isCreatingDisabled && styles.loginButtonDisabled,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size={28} />
                    ) : (
                      <Text
                        style={[
                          styles.loginButtonText,
                          { color: isCreatingDisabled ? "#b9bcc6" : "#fff" },
                        ]}
                      >
                        Tạo mới
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
          </BottomSheetView>
        </BottomSheet>

        <CalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        >
          <View style={styles.modalContainer}>
            <Calendar
              current={selectedDate} // Default value if no date is selected
              onDayPress={handleDayPress}
              markedDates={
                selectedDate
                  ? {
                      [selectedDate]: {
                        selected: true,
                        disableTouchEvent: true,
                        selectedColor: "#46e835",
                      },
                    }
                  : {}
              }
              theme={{
                todayTextColor: "#46e835",
                arrowColor: "#46e835",
                selectedDayBackgroundColor: "#46e835",
                dotColor: "#46e835",
              }}
            />
          </View>
        </CalendarModal>
        {/* </BottomSheetModalProvider> */}
      </GestureHandlerRootView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
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
    top: 54,
    width: "94.2%",
    right: 12,
    maxHeight: 200,
    backgroundColor: "#fff",
    zIndex: 1,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderRadius: 10,
    // borderColor: "#ccc",
    // borderWidth: 1,
  },
  resultItem: {
    padding: 10,
    paddingLeft: 50,
    flexDirection: "row",
    gap: 0,
    alignItems: "center",
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
  },
  resultText: {
    fontSize: 16,
    fontWeight: "500",
  },

  locationIcon: {
    transform: [{ translateX: -32 }, { translateY: -21 }],
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },

  topContainer: {
    flexDirection: "row",
    width: "94%",
    paddingHorizontal: 15,
    zIndex: 2,
    position: "absolute",
    marginTop: 35,
    left: 12,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
    borderRadius: 40,
  },

  backBtnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 10,
  },

  searchBar: {
    backgroundColor: "#fff",
    // borderColor: "#E0E2DB",
    // borderWidth: 1.2,
    borderRadius: 100,
    // borderWidth: 1,
    // borderColor: "#e7e8ee",
    margin: 5,
    padding: 5,

    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: 37,
    fontSize: 16,
    lineHeight: 24,
    paddingLeft: 10,
    paddingRight: 20,
    fontWeight: "400",
  },
  searchBoxContainer: {
    // marginTop: 10,
    // marginBottom: 10,
    alignItems: "center",
    // justifyContent: "center",
    flexDirection: "row",
  },

  modalContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 16,
    transform: [{ translateX: -10 }],
  },
  modalOptionContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 20,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
  },

  bottomSheetInnerContainer: {
    gap: 10,
    marginTop: 15,
    paddingHorizontal: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    // marginLeft: -160,
  },

  btsLocationName: {
    fontSize: 18,
    fontWeight: "500",
  },

  btsOtherFields: {
    fontSize: 16,
    fontWeight: "400",
  },
  loginButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    width: "100%",
    marginTop: 25,
  },
  innerLoginButtonContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "semibold",
    lineHeight: 28,
    transform: [{ translateX: -2 }],
  },
  loginButtonDisabled: {
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },
});

export default ChosenTrip;

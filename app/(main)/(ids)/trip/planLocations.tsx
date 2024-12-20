import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Alert,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTabStore } from "@/utils/store";
import {
  changeOrderPlanLocations,
  deletePlanLocationByPlanLocationId,
  deletePlanLocationImage,
  getPlanById,
  getPlanLocationsByPlanId,
} from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";
import { set } from "date-fns";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import PlanLocationItem from "@/components/PlanLocation/PlanLocationItem";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

type PlanLocationsProps = {
  planId: string;
  locationId: string;
  planLocationId: string;
  order: number;
  images: string;
  name: string;
  address: string;
  estimatedStartDate: string;
};

const planLocations = () => {
  const { session } = useAuth();
  const sharedId = useTabStore((state) => state.sharedId);
  const [plan, setPlan] = useState<PlanLocationsProps[]>([]);
  const [chosenPlanLocation, setChosenPlanLocation] = useState<
    PlanLocationsProps | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const tempAvatar =
    "https://icons-for-free.com/iff/png/512/mountains+photo+photos+placeholder+sun+icon-1320165661388177228.png";

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getPlanLocationsByPlanId(
        session.userToken.accessToken,
        sharedId
      );
      if (data) {
        console.log("Data: ", data.data.planLocations.data);
        const filteredData: PlanLocationsProps[] =
          data.data.planLocations.data.map(
            (_item: any): PlanLocationsProps => ({
              planId: _item.planId,
              locationId: _item.locationId,
              planLocationId: _item.planLocationId,
              order: _item.order,
              images: _item.images.length != 0 ? _item.images[0].url : "",
              name: _item.locationName,
              address: _item.locationAddress,
              estimatedStartDate: _item.estimatedStartDate.split("T")[0],
            })
          );
        console.log("Filtered Data: ", filteredData);
        setPlan(filteredData);
        // console.log("Plan Locations: ", plan);
      }
    } catch (_error: any) {
      setError(_error);
      console.log("Error1233453: ", _error);
    } finally {
      setLoading(false);
    }
  };

  const planDetail = (id: string) => {
    router.push(`/(main)/(ids)/updatePlanLocation/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Plan Locations: ", plan);
  }, [plan]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isRefreshing) {
        fetchData();
        setIsRefreshing(false);
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isRefreshing]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpen = (planLocationId: string) => {
    setChosenPlanLocation(
      plan.find((item) => item.planLocationId === planLocationId)
    );
    bottomSheetRef.current?.expand();
  };
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const renderBackDrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      ></BottomSheetBackdrop>
    ),
    []
  );

  const swapItems = async (from: number, to: number) => {
    const firstItem = plan[from].planLocationId;
    const secondItem = plan[to].planLocationId;

    try {
      const response = await changeOrderPlanLocations(
        {
          PlanLocationIdFirst: firstItem,
          PlanLocationIdSecond: secondItem,
        },
        session.userToken.accessToken,
        sharedId
      );
    } catch (_error: any) {
      console.log(_error);
    } finally {
      setIsRefreshing(true);
    }
  };

  const _deletePlanLocationImage = async (id: string, data: any) => {
    try {
      const _data = {
        url: data,
      };
      const result = await deletePlanLocationImage(
        _data,
        session.userToken.accessToken,
        id
      );
      if (result) {
        console.log("Result: ", result);
        setIsRefreshing(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };
  const _deletePlanLocationByPlanId = async (id: string) => {
    Alert.alert(
      "Delete Plan Location",
      "Are you sure you want to delete this plan location?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const result = await deletePlanLocationByPlanLocationId(
                session.userToken.accessToken,
                id
              );
              if (result) {
                console.log("Result: ", result);
              }
            } catch (error: any) {
              console.log(error);
            } finally {
              setIsRefreshing(true);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen
          options={{
            headerRight: () => {
              return (
                <Pressable
                  onPress={() => setIsRefreshing(true)}
                  style={styles.settingButton}
                >
                  <Text>
                    <Ionicons name="refresh-outline" size={20} />
                  </Text>
                </Pressable>
              );
            },
          }}
        />
        <ActivityIndicator size="large" color="gray" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Stack.Screen
            options={{
              headerRight: () => {
                return (
                  <Pressable
                    onPress={() => setIsRefreshing(true)}
                    style={styles.settingButton}
                  >
                    <Text>
                      <Ionicons name="refresh-outline" size={20} />
                    </Text>
                  </Pressable>
                );
              },
            }}
          />

          <DraggableFlatList
            data={plan}
            keyExtractor={(item) => item.planLocationId}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, getIndex, drag }) => (
              <PlanLocationItem
                index={getIndex()}
                item={item}
                drag={drag}
                onDelete={_deletePlanLocationByPlanId}
                onDeleteImage={_deletePlanLocationImage}
                onDetail={planDetail}
                tempAvatar={tempAvatar}
                _onDetail={handleOpen}
              />
            )}
            onDragEnd={({ from, to }) => {
              if (from !== to) {
                swapItems(from, to);
              }
            }}
          />

          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["30%"]}
            index={-1}
            backdropComponent={renderBackDrop}
            enablePanDownToClose={true}
          >
            <BottomSheetView style={{ flex: 1 }}>
              <Text>Bottom Sheet Content</Text>
              <Text>{chosenPlanLocation?.planLocationId}</Text>
              <Text>{chosenPlanLocation?.order}</Text>
              <Text>{chosenPlanLocation?.name}</Text>
              <Text>{chosenPlanLocation?.address}</Text>
              <Text>{chosenPlanLocation?.estimatedStartDate}</Text>
            </BottomSheetView>
          </BottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
    // padding: 10,
    backgroundColor: "#fff",
  },
  itemOuterContainer: {
    padding: 15,
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e8ee",
  },
  settingButton: {
    marginRight: 20,
  },
  itemContainer: {
    flexDirection: "row",
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#ddd",
    // alignItems: "center",
  },
  itemContainer2: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  image: {
    width: 280,
    height: 220,
    borderRadius: 30,
  },
  avatar2: {
    width: 250,
    height: 250,
    // borderRadius: 100,
    marginRight: 10,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  path: {
    fontSize: 11,
    color: "#8F91A2",
  },

  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },

  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
  footerContainer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#666",
  },

  title: {
    fontSize: 17,
    fontWeight: "500",
    paddingVertical: 5,
    // paddingLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  postImage: {
    width: "32%",
    height: 190,
    borderRadius: 6,
  },
  textContainer: {
    // marginTop: 10,
  },
  interactionBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    marginTop: 15,
    gap: 40,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  like: {
    marginLeft: 5,
    fontSize: 13,
    color: "#626262",
  },
});

export default planLocations;

import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import { useTabStore } from "@/utils/store";
import {
  changeOrderPlanLocations,
  getPlanById,
  getPlanLocationsByPlanId,
} from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";
import { set } from "date-fns";
import { FlashList } from "@shopify/flash-list";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import { fi, se } from "date-fns/locale";
import { router } from "expo-router";

type PlanLocationsProps = {
  planId: string;
  locationId: string;
  planLocationId: string;
  order: number;
  images: string;
};

const planLocations = () => {
  const { session } = useAuth();
  const sharedId = useTabStore((state) => state.sharedId);
  const [plan, setPlan] = useState<PlanLocationsProps[]>([]);
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
            (item: any): PlanLocationsProps => ({
              planId: item.planId,
              locationId: item.locationId,
              planLocationId: item.planLocationId,
              order: item.order,
              images: item.images[0].url,
            })
          );
        console.log("Filtered Data: ", filteredData);
        setPlan(filteredData);
        // console.log("Plan Locations: ", plan);
      }
    } catch (_error: any) {
      setError(_error);
    } finally {
      setLoading(false);
    }
  };

  const planDetail = (id: string) => {
    router.push(`/(main)/(ids)/trip/updatePlanLocation/${id}`);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Plan Locations: ", plan);
  }, [plan]);

  useEffect(() => {
    if (isRefreshing) {
      fetchData();
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

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

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
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
    <View style={{ flex: 1, backgroundColor: "seashell" }}>
      <GestureHandlerRootView>
        <Text>Plan Locations : {sharedId}</Text>
        <Pressable onPress={() => setIsRefreshing(true)}>
          <Text>Refresh</Text>
        </Pressable>
        <DraggableFlatList
          data={plan}
          keyExtractor={(item) => item.planLocationId}
          renderItem={({ item, drag }) => (
            <View>
              <Pressable
                onLongPress={drag}
                onPress={() => planDetail(item.planLocationId)}
              >
                <Text style={styles.title}>{item.locationId}</Text>
                <Text>{item.planLocationId}</Text>
                <Pressable>
                  <Image
                    source={{
                      uri: item.images ?? tempAvatar,
                    }}
                    style={styles.image}
                  />
                </Pressable>
              </Pressable>
            </View>
          )}
          onDragEnd={({ from, to }) => {
            if (from !== to) {
              swapItems(from, to);
            }
          }}
        />
      </GestureHandlerRootView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  itemOuterContainer: {
    padding: 15,
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e8ee",
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

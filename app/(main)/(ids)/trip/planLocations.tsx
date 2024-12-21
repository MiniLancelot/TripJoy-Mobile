import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTabStore } from "@/utils/store";
import {
  addPlanLocationImage,
  changeOrderPlanLocations,
  deletePlanLocationByPlanLocationId,
  deletePlanLocationImage,
  getPlanById,
  getPlanLocationsByPlanId,
  patchNote,
  putExpense,
} from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";
import { set } from "date-fns";
import { FlashList } from "@shopify/flash-list";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import PlanLocationItem from "@/components/PlanLocation/PlanLocationItem";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import MemberMultiselect from "@/components/Multiselect/MemberMultiselect";
import { Member } from "@/constants/Member";
import MemberDropdown from "@/components/Dropdowns/MemberDropdown";
import * as ImagePicker from "expo-image-picker";

type PlanLocationsProps = {
  planId: string;
  locationId: string;
  planLocationId: string;
  order: number;
  images: any;
  name: string;
  address: string;
  estimatedStartDate: string;
  userSpenderIds?: string[];
  amount: number | null;
  payerId?: string;
  note?: string;
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

  const [members, setMembers] = useState<Member[]>([]);
  const [payer, setPayer] = useState<Member>({ userId: "", name: "" });
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");

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
              images:
                _item.images.length != 0
                  ? _item.images.map((item: any) => item.url)
                  : [],
              name: _item.locationName,
              address: _item.locationAddress,
              estimatedStartDate: _item.estimatedStartDate.split("T")[0],
              // userSpenderIds: _item.planLocationExpenses.map(
              //   (item: any) => item.userId
              // ),
              note: _item.note,
              amount: _item.amount,
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
    const _chosenPlanLocation = plan.find(
      (item) => item.planLocationId === planLocationId
    );
    setChosenPlanLocation(_chosenPlanLocation);
    setNote(_chosenPlanLocation?.note!);
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

  const _deletePlanLocationImage = async (data: string) => {
    Alert.alert("Thông báo", "Bạn có chắc chắn muốn xóa ảnh này?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Xóa",
        onPress: async () => {
          try {
            const _data = {
              url: data,
            };
            const result = await deletePlanLocationImage(
              _data,
              session.userToken.accessToken,
              chosenPlanLocation!.planLocationId
            );
            if (result) {
              console.log("Result: ", result);
              setIsRefreshing(true);
            }
          } catch (error: any) {
            console.log(error);
          }
        },
      },
    ]);
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

  const handleAddExpense = async (id: string) => {
    try {
      const data = {
        planLocationExpense: {
          // userSpenderIds: [
          //   {
          //     userId: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
          //   },
          // ],
          userSpenderIds: members.map((item) => {
            return { userId: item.userId };
          }),
          payerId: payer.userId,
          amount: amount,
        },
      };
      console.log("Data: ", data);
      const result = await putExpense(data, session.userToken.accessToken, id);
      if (result.data.isSuccess) {
        console.log("Result: ", result);
        setIsRefreshing(result.data.isSuccess);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handlePatchNote = async (id: string) => {
    try {
      const data = {
        note: note,
      };
      console.log("Data: ", data);
      const result = await patchNote(data, session.userToken.accessToken, id);
      if (result) {
        console.log("Result: ", result);
        setIsRefreshing(true);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const renderImage = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.imageContainer}
      onLongPress={() => _deletePlanLocationImage(item)}
    >
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      const parts = result.assets[0].uri.split("/"); // Chia đường dẫn theo dấu '/'
      const fileName = parts[parts.length - 1]; // Lấy phần tử cuối cùng trong mảng (tên tệp)
      const file: any = {
        uri: result.assets[0].uri,
        name: fileName,
        type: "image/jpeg",
      }
      const _formData = new FormData();
      _formData.append("image", file);
      try {
        const response = await addPlanLocationImage(_formData, session.userToken.accessToken, chosenPlanLocation!.planLocationId);
        if (response) {
          console.log("Response: ", response.data);
          setIsRefreshing(true);
        }
      } catch (error: any) {
        console.log(error);
      }
    }
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
                item={{
                  planId: item.planId,
                  locationId: item.locationId,
                  planLocationId: item.planLocationId,
                  order: item.order,
                  images: item.images[0],
                  name: item.name,
                  address: item.address,
                  estimatedStartDate: item.estimatedStartDate,
                  amount: item.amount,
                }}
                drag={drag}
                onDelete={_deletePlanLocationByPlanId}
                // onDeleteImage={_deletePlanLocationImage}
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
            snapPoints={["70%"]}
            index={-1}
            backdropComponent={renderBackDrop}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView style={{ flex: 1 }}>
              <Text>Bottom Sheet Content</Text>
              <Text>{chosenPlanLocation?.planLocationId}</Text>
              <Text>{chosenPlanLocation?.order}</Text>
              <Text>{chosenPlanLocation?.name}</Text>
              <Text>{chosenPlanLocation?.address}</Text>
              <Text>{chosenPlanLocation?.estimatedStartDate}</Text>
              <Text>Tham gia: </Text>
              <MemberMultiselect
                planId={sharedId!}
                _values={members}
                setValues={setMembers}
                bearer={session.userToken.accessToken}
                placeholder="Chọn thành viên"
              />
              <Text>Người trả: </Text>
              {members.length != 0 ? (
                <MemberDropdown
                  planId={sharedId!}
                  data={members}
                  value={payer}
                  setValue={setPayer}
                  bearer={session.userToken.accessToken}
                  placeholder="Chọn người trả"
                />
              ) : (
                <Text>Chưa có người tham gia</Text>
              )}
              <TextInput
                // style={styles.input}
                keyboardType="numeric"
                value={amount.toString()}
                onChangeText={(text) => {
                  const numericValue = text.replace(/[^0-9]/g, "");
                  setAmount(parseFloat(numericValue));
                }}
                placeholder="Số tiền"
              />
              <TextInput
                value={note}
                onChangeText={(text) => setNote(text)}
                placeholder="Ghi chú"
              />
              <Pressable
                onPress={() =>
                  handleAddExpense(chosenPlanLocation!.planLocationId)
                }
              >
                <Text>Thêm chi phí</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  handlePatchNote(chosenPlanLocation!.planLocationId)
                }
              >
                <Text>Thêm ghi chú</Text>
              </Pressable>
              <Pressable onPress={pickImage}>
                <Text>Thêm hình ảnh</Text>
              </Pressable>
              {chosenPlanLocation?.images.length != 0 ? (
                <FlashList
                  data={chosenPlanLocation?.images}
                  renderItem={renderImage}
                  estimatedItemSize={100}
                  horizontal
                />
              ) : (
                <Text>No images</Text>
              )}
            </BottomSheetScrollView>
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

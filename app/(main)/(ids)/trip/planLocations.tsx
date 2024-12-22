import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
  Alert,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { NativeViewGestureHandler } from "react-native-gesture-handler";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import DraggableFlatList from "react-native-draggable-flatlist";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
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
import AnimationTextInput from "@/components/TextInput/MyTextInput";

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
  const [isUpdateLoading, setIsUpdateLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [members, setMembers] = useState<Member[]>([]);
  const [payer, setPayer] = useState<Member>({ userId: "", name: "" });
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const snapPoints = useMemo(() => ["30%", "50%"], []);

  const isUpdateDisabled = amount.toString().length === 0;

  const tempAvatar =
    "https://icons-for-free.com/iff/png/512/mountains+photo+photos+placeholder+sun+icon-1320165661388177228.png";

  const tempImage =
    "https://eadn-wc04-920528.nxedge.io/wp-content/uploads/2023/02/placeholder-726.png";
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
    setAmount(_chosenPlanLocation?.amount! ?? 0);
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
      console.log(`Plan location id: ${id}`);
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

  const handleUpdatePlanLocation = async (id: string) => {
    await handleAddExpense(id);
    await handlePatchNote(id);
  }

  const renderImage = ({ item }: { item: string }) => (
    <View
      style={styles.imageContainer}
      // onLongPress={() => _deletePlanLocationImage(item)}
    >
      <Pressable onPress={() => _deletePlanLocationImage(item)} style={styles.deleteButton}>
                    <Ionicons name="close-circle-outline" size={23} color="#ff6188" />
                  </Pressable>
      <Image source={{ uri: item }} style={styles.btsImage} />
    </View>
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
      };
      const _formData = new FormData();
      _formData.append("image", file);
      try {
        const response = await addPlanLocationImage(
          _formData,
          session.userToken.accessToken,
          chosenPlanLocation!.planLocationId
        );
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

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
  };

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
            snapPoints={snapPoints}
            index={-1}
            backdropComponent={renderBackDrop}
            enablePanDownToClose={true}
          >
            <BottomSheetScrollView
              style={{ flex: 1, paddingBottom: 30, paddingHorizontal: 10 }}
            >
              {/* <Text style={styles.btsTitle}>{chosenPlanLocation?.planLocationId}</Text> */}
              <Text style={styles.btsTitle}>{chosenPlanLocation?.name}</Text>
              <Text style={styles.btsAddress}>
                {chosenPlanLocation?.address}
              </Text>
              <Text style={styles.btsAddress}>
                Ngày bắt đầu dự kiến:{" "}
                {chosenPlanLocation?.estimatedStartDate
                  ? formatDate(chosenPlanLocation.estimatedStartDate)
                  : ""}
              </Text>

              <View style={styles.sectionContainer}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="people" size={24} color={"#46e8a5"} />
                  <Text style={styles.btsSectionText}>Tham gia</Text>
                </View>

                <MemberMultiselect
                  planId={sharedId!}
                  _values={members}
                  setValues={setMembers}
                  bearer={session.userToken.accessToken}
                  placeholder="Chọn thành viên"
                />
              </View>

              <View style={[styles.sectionContainer, { marginTop: 10 }]}>
                <View style={styles.sectionTitleContainer}>
                  <Ionicons name="pricetag" size={24} color={"#17a1fa"} />
                  <Text style={styles.btsSectionText}>Giá</Text>
                </View>
                <AnimationTextInput
                  placeholder="Số tiền"
                  style={styles.usernameInput}
                  keyboardType="phone-pad"
                  maxLength={30}
                  value={amount.toString()}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    setAmount(numericValue ? Number(numericValue) : 0);
                  }}
                />
              </View>

              <View style={[styles.sectionContainer]}>
                <View style={[styles.sectionTitleContainer, { marginTop: 20 }]}>
                  <FontAwesome6
                    name="hand-holding-dollar"
                    size={24}
                    color={"#17a1fa"}
                  />
                  <Text style={styles.btsSectionText}>Người trả</Text>
                </View>
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
                  <View style={styles.textWrapper}>
                    <Text>Chưa có người tham gia</Text>
                  </View>
                )}
              </View>
              <View style={styles.bottomSections}>
                <View style={styles.botSection}>
                  <View
                    style={[
                      styles.sectionTitleContainer,
                      { marginTop: 20, justifyContent: "flex-start" },
                    ]}
                  >
                    <FontAwesome6
                      name="sticky-note"
                      size={24}
                      color={"#D45985"}
                    />
                    <Text style={styles.btsSectionText}>Ghi chú</Text>
                  </View>
                  <TextInput
                    value={note}
                    onChangeText={(text) => setNote(text)}
                    placeholder="Ghi chú"
                    multiline
                    numberOfLines={4}
                    style={styles.noteContainer}
                  />
                </View>
                <View style={styles.botSection}>
                  <Pressable
                    onPress={pickImage}
                    style={[
                      styles.sectionTitleContainer,
                      { marginTop: 20, justifyContent: "flex-start" },
                    ]}
                  >
                    <FontAwesome6 name="images" size={24} color={"#46e8a5"} />
                    <Text style={styles.btsSectionText}>Thêm ảnh</Text>
                  </Pressable>
                </View>
              </View>
              {/* <View style={styles.imagesContainer}> */}
              {chosenPlanLocation?.images.length != 0 ? (
                <NativeViewGestureHandler disallowInterruption={true}>
                  <FlatList
                    data={chosenPlanLocation?.images}
                    renderItem={renderImage}
                    // estimatedItemSize={100}
                    style={{ flex: 1, marginBottom:0 }}
                    scrollEnabled={true}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                </NativeViewGestureHandler>
              ) : (
                <Image
                  source={{ uri: tempImage }}
                  style={[styles.btsImage, { marginBottom: 20 }]}
                />
              )}
              {/* </View> */}

              <View style={styles.loginButtonContainer}>
                <Pressable
                onPress={() =>
                  handleAddExpense(chosenPlanLocation!.planLocationId)
                }
                  disabled={isUpdateDisabled || isUpdateLoading}
                  android_ripple={
                    isUpdateDisabled ? null : { color: "#b9bcc6" }
                  }
                  // android_ripple={{ color: "gray" }}
                >
                  <View
                    style={[
                      styles.innerLoginButtonContainer,
                      isUpdateDisabled && styles.loginButtonDisabled,
                    ]}
                  >
                    {isUpdateLoading ? (
                      <ActivityIndicator color="#fff" size={28} />
                    ) : (
                      <Text
                        style={[
                          styles.loginButtonText,
                          { color: isUpdateDisabled ? "#b9bcc6" : "#fff" },
                        ]}
                      >
                        Hoàn thành
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>

              {/* <TextInput
                value={note}
                onChangeText={(text) => setNote(text)}
                placeholder="Ghi chú"
              /> */}
              {/* <Pressable
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
              </Pressable> */}
              {/* <Pressable onPress={pickImage}>
                <Text>Thêm hình ảnh</Text>
              </Pressable> */}
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
  btsImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginHorizontal: 5,
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

  btsTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  btsAddress: {
    fontSize: 15,
    color: "#333",
    marginBottom: 10,
  },
  btsSectionText: {
    fontSize: 17,
    color: "#333",
    marginBottom: 10,
    fontWeight: "bold",
  },
  usernameInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,

    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    fontSize: 17,
    lineHeight: 24,
    paddingRight: 30,
    fontWeight: "500",
  },
  sectionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  sectionTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    paddingLeft: 15,
    marginTop: 15,
  },
  textWrapper: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#e7e8ee",
    padding: 5,
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "600",
    width: "50%",
    borderWidth: 1.2,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomSections: {
    // justifyContent: "space-between",
    // alignItems: "center",
  },
  botSection: {},
  noteContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#e7e8ee",
    padding: 10,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "400",
    width: "100%",
    borderWidth: 1.2,
    textAlignVertical: "top",
    textAlign: "left",
  },
  imagesContainer: {
    marginBottom: 20,
  },
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "95%",
    marginTop: 20
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
  },
  loginButtonDisabled: {
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },
  deleteButton: {
    position: "absolute",
    top: -5,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    zIndex: 4
  },
});

export default planLocations;

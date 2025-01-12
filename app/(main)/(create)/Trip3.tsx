import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Image,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { format, set } from "date-fns";
import ProvinceDropdown from "@/components/Dropdowns/ProvinceDropdown";
import { useAuth } from "@/app/(auth)/AuthContext";
import VehicleDropdown from "@/components/Dropdowns/VehicleDropdown";
import CustomImagePicker from "@/components/ImagePicker/CustomImagePicker";
import { addPlan } from "@/services/plan/plan";
import { router, Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AnimationTextInput from "@/components/TextInput/MyTextInput";
import Toast from "react-native-toast-message";
import { vi } from "date-fns/locale";
import { Province } from "@/utils/Provinces";

type PlanProfileProps = {
  title: string | null;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  provinceStart: Province;
  provinceEnd: Province;
  method: number;
  vehicle: number;
  avatar: any | null;
};

LocaleConfig.locales["vi"] = {
  monthNames: [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ],
  monthNamesShort: [
    "Th1",
    "Th2",
    "Th3",
    "Th4",
    "Th5",
    "Th6",
    "Th7",
    "Th8",
    "Th9",
    "Th10",
    "Th11",
    "Th12",
  ],
  dayNames: [
    "Chủ nhật",
    "Thứ hai",
    "Thứ ba",
    "Thứ tư",
    "Thứ năm",
    "Thứ sáu",
    "Thứ bảy",
  ],
  dayNamesShort: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
  today: "Hôm nay",
};

const weekDaysVN = [
  "Chủ Nhật",
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
];

// Set the default locale
LocaleConfig.defaultLocale = "vi";

const Trip3 = () => {
  const { session } = useAuth();
  const [data, setData] = useState<PlanProfileProps>({
    title: "",
    startDate: "",
    endDate: "",
    estimatedBudget: 0,
    provinceStart: { provinceId: "", provinceName: "" },
    provinceEnd: { provinceId: "", provinceName: "" },
    method: 0,
    vehicle: 0,
    avatar: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const tempAvatar =
    "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE=";

  // useEffect(() => {
  //   const handler = setTimeout(() => {
  //     console.log("Debounced data:", data);
  //   }, 300);
  //   return () => {
  //     clearTimeout(handler);
  //   };
  // }, [data]);

  const handleChangeProfileState = (field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isCreatingDisabled =
    !data.title ||
    !data.avatar ||
    !data.startDate ||
    !data.endDate ||
    !data.estimatedBudget ||
    !data.provinceStart ||
    !data.provinceEnd ||
    data.vehicle < 0;

  const renderCustomHeader = (date: string) => {
    const currentMonth = format(new Date(date), "MMMM yyyy", { locale: vi });
    return (
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{currentMonth}</Text>
    );
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleOpen = () => bottomSheetRef.current?.expand();
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

  const handleDayPress = (day: any) => {
    if (!data.startDate || (data.startDate && data.endDate)) {
      handleChangeProfileState("startDate", day.dateString);
      handleChangeProfileState("endDate", "");
    } else if (data.startDate && !data.endDate) {
      if (new Date(day.dateString) < new Date(data.startDate)) {
        handleChangeProfileState("startDate", day.dateString);
      } else {
        handleChangeProfileState("endDate", day.dateString);
      }
    }
  };

  // const createBlobFromUri = async (
  //   uri: string,
  //   fileName: string,
  //   mimeType: string
  // ): Promise<any> => {
  //   // const response = await fetch(uri); // Fetch the local file
  //   // const blob = await response.blob(); // Convert the response to Blob
  //   // return new File([blob], fileName, { type: mimeType }); // Convert Blob to File
  //   const result = {
  //     uri: uri,
  //     name: fileName,
  //     type: mimeType,
  //   };
  //   return result;
  // };

  const _addPlan = async () => {
    try {
      setIsLoading(true);
      const _form = new FormData();
      _form.append("Plan.Title", data.title ?? "");
      _form.append("Plan.StartDate", data.startDate);
      _form.append("Plan.EndDate", data.endDate);
      _form.append("Plan.EstimatedBudget", data.estimatedBudget.toString());
      _form.append("Plan.ProvinceStartId", data.provinceStart.provinceId);
      _form.append("Plan.ProvinceEndId", data.provinceEnd.provinceId);
      _form.append("Plan.Method", data.method.toString());
      _form.append("Plan.Vehicle", data.vehicle.toString());
      if (data.avatar) {
        const parts = data.avatar.split("/"); // Chia đường dẫn theo dấu '/'
        const fileName = parts[parts.length - 1]; // Lấy phần tử cuối cùng trong mảng (tên tệp)
        const file: any = {
          uri: data.avatar,
          type: "image/jpeg",
          name: fileName,
        };
        _form.append("Plan.Avatar", file);
      }
      const response = await addPlan(_form, session.userToken.accessToken);
      if (response) {
        console.log(response.data);
        setIsLoading(false);
      }
      Toast.show({
        type: "success",
        text1: "Tạo chuyến đi mới thành công",
        text2: "Hãy bắt đầu chuyến đi của bạn",
      });
      setTimeout(() => {
        router.replace("/(tabs)/trip");
      }, 500);
    } catch (err: any) {
      console.error(err);
      setIsLoading(false);
    }
  };

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
      handleChangeProfileState("avatar", result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Stack.Screen
            options={{
              title: "Tạo chuyến đi",
            }}
          />
          <ScrollView>
            <View style={styles.avatarContainer}>
              <Pressable onPress={pickImage}>
                <Image
                  source={{
                    uri: data.avatar == null ? tempAvatar : data.avatar,
                  }}
                  style={styles.image}
                />
              </Pressable>
            </View>
            <View style={styles.inputsContainer}>
              <View style={styles.outerUsernameInput}>
                <AnimationTextInput
                  placeholder="Tên chuyến đi"
                  style={styles.usernameInput}
                  autoCapitalize={"none"}
                  maxLength={30}
                  value={data.title ?? ""}
                  onChangeText={(text) =>
                    handleChangeProfileState("title", text)
                  }
                />
                {data.title!.length > 0 && (
                  <Pressable
                    style={styles.clearUserNameButton}
                    onPress={() => handleChangeProfileState("title", "")}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={21}
                      color="#9FB7B9"
                    />
                  </Pressable>
                )}
              </View>

              <Pressable
                onPress={handleOpen}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 0,
                  gap: 20,
                  paddingHorizontal: 5,
                }}
              >
                <Ionicons
                  name={"calendar-outline"}
                  size={30}
                  color={"#6b707b"}
                />
                <View style={[styles.birthdayInput, { borderWidth: 1.2 }]}>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <Text style={styles.dateText}>
                      {data.startDate === ""
                        ? "Ngày bắt đầu"
                        : `Từ ${data.startDate.split("-")[2]}-${
                            data.startDate.split("-")[1]
                          }-${data.startDate.split("-")[0]}`}
                    </Text>
                    <Text style={styles.dateText}>
                      {data.endDate === ""
                        ? "Ngày kết thúc"
                        : `đến ${data.endDate.split("-")[2]}-${
                            data.endDate.split("-")[1]
                          }-${data.endDate.split("-")[0]}`}
                    </Text>
                  </View>
                </View>
              </Pressable>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  width: "100%",
                  marginVertical: 5,
                }}
              >
                <ProvinceDropdown
                  _value={data.provinceStart}
                  setValue={(value) =>
                    handleChangeProfileState("provinceStart", value)
                  }
                  bearer={session.userToken.accessToken}
                  placeholder="Điểm bắt đầu"
                />
                <ProvinceDropdown
                  _value={data.provinceEnd}
                  setValue={(value) =>
                    handleChangeProfileState("provinceEnd", value)
                  }
                  bearer={session.userToken.accessToken}
                  placeholder="Điểm kết thúc"
                />
              </View>
              <View style={styles.outerUsernameInput}>
                <AnimationTextInput
                  placeholder="Kinh phí dự tính (đ)"
                  style={styles.otherInput}
                  autoCapitalize={"none"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  value={data.estimatedBudget.toString()}
                  onChangeText={(text) => {
                    const numericValue = text.replace(/[^0-9]/g, "");
                    handleChangeProfileState("estimatedBudget", numericValue);
                  }}
                />
                {data.estimatedBudget.toString() != "" && (
                  <Pressable
                    style={styles.clearUserNameButton}
                    onPress={() =>
                      handleChangeProfileState("estimatedBudget", "")
                    }
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={21}
                      color="#9FB7B9"
                    />
                  </Pressable>
                )}
              </View>
              <VehicleDropdown
                value={data.vehicle}
                setValue={(value) => handleChangeProfileState("vehicle", value)}
                placeholder="Chọn phương tiện"
              />
            </View>

            <View style={styles.loginButtonContainer}>
              <Pressable
                onPress={_addPlan}
                disabled={isCreatingDisabled || isLoading}
                android_ripple={
                  isCreatingDisabled ? null : { color: "#b9bcc6" }
                }
                // android_ripple={{ color: "gray" }}
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

            {/* <Pressable
              style={{
                backgroundColor: "blue",
                padding: 16,
                alignItems: "center",
              }}
              onPress={_addPlan}
            >
              <Text>Thêm chuyến đi</Text>
            </Pressable> */}
          </ScrollView>

          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["55%"]}
            index={-1}
            backdropComponent={renderBackDrop}
            enablePanDownToClose={true}
          >
            <BottomSheetView style={styles.contentContainer}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Tạo chuyến đi của bạn 🎉
                </Text>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Calendar
                  minDate={format(new Date(), "yyyy-MM-dd")}
                  // maxDate = {"2024-12-29"}
                  markingType={"period"}
                  markedDates={{
                    [data.startDate]: { startingDay: true, color: "#71d7c7" },
                    [data.endDate]: { endingDay: true, color: "#71d7c7" },
                    ...(data.startDate &&
                      data.endDate && {
                        [data.startDate]: {
                          startingDay: true,
                          color: "#51cebb",
                        },
                        [data.endDate]: { endingDay: true, color: "#51cebb" },
                        ...getMarkedDatesBetween(data.startDate, data.endDate),
                      }),
                  }}
                  onDayPress={handleDayPress}
                  renderHeader={renderCustomHeader}
                  firstDay={1} // Set Monday as the first day of the week
                  dayNames={weekDaysVN}
                  dayNamesShort={weekDaysVN.map((day) =>
                    day.replace("Thứ ", "")
                  )}
                />
              </View>
            </BottomSheetView>
          </BottomSheet>
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};

const getMarkedDatesBetween = (startDate: string, endDate: string) => {
  const dates: any = {};
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate < end) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dateString = format(currentDate, "yyyy-MM-dd");
    if (dateString !== startDate && dateString !== endDate) {
      dates[dateString] = { color: "#71d7c7", textColor: "white" };
    }
  }

  return dates;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 16,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  contentContainer: {
    flex: 1,
  },
  birthdayInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#e7e8ee",
    padding: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "87%",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    marginTop: 20,
  },
  image: {
    width: 280,
    height: 220,
    borderRadius: 30,
  },
  inputsContainer: {
    marginTop: 10,
    width: "90%",
    flex: 1,
    marginLeft: 20,
  },
  outerUsernameInput: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  usernameInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,

    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  clearUserNameButton: {
    position: "absolute",
    paddingRight: 10,
    right: 7,
  },
  otherInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,
    marginVertical: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "95%",
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
  },
  loginButtonDisabled: {
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },
});

export default Trip3;

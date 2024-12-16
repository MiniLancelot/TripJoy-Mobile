import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Button,
} from "react-native";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CheckBox from "@react-native-community/checkbox";
import { useCallback, useEffect, useRef, useState } from "react";
import { router, Stack } from "expo-router";
import { useAuth } from "@/app/(auth)/AuthContext";
import get_user_profile from "@/services/user/userProfile";
import { Calendar } from "react-native-calendars";
import update_user from "@/services/user/update_user";
import GenderDropdown from "@/components/Dropdowns/GenderDropdown";
import AnimationTextInput from "@/components/TextInput/MyTextInput";
import Toast from "react-native-toast-message";
import * as ImagePicker from 'expo-image-picker';
import { format } from "date-fns";

type UserProfileProps = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  avatar: any | null;
  dateOfBirth: string | null;
  address: any;
  gender: number | null;
};

const UpdateProfile = () => {
  const { session, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfileProps>({
    id: "",
    userName: "",
    email: "",
    phoneNumber: null,
    avatar: null,
    dateOfBirth: null,
    address: null,
    gender: null,
  });
  const [date, setDate] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [isSuccess, setIsSuccess] = useState(false);

  const handleChangeProfileState = (field: any, value: any) => {
    if (field.startsWith("address.")) {
      const addressField = field.split(".")[1];
      setProfile(
        (prev) =>
          (prev = {
            ...prev,
            address: {
              ...prev.address,
              [addressField]: value,
            },
          })
      );
    } else
      setProfile(
        (prev) =>
          (prev = {
            ...prev,
            [field]: value,
          })
      );
  };
  const isLoginDisabled =
  !profile.userName || // Username is required
  (profile.address && // Address is partially filled but incomplete
    (!profile.address.province ||
      !profile.address.ward ||
      !profile.address.district)) || 
  (!profile.address?.province && !profile.address?.ward && !profile.address?.district);
  

  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=large";

  useEffect(() => {
    fetchUser();
    setDate(profile.dateOfBirth?.split(" ")[0] ?? "2003-06-01");
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        setIsSuccess(false);
      }, 1000);
    }
    return () => {
      setIsSuccess(false);
    };
  }, [isSuccess]);

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await get_user_profile(session.userToken.accessToken);
      if (response) {
        console.log(response.data.user);
        setProfile(response.data.user.profile);
        
        // console.log(session.userInfo);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProfile = async () => {
    try {
      setIsLoading(true);
      const _form = new FormData();
      _form.append("UserName", profile.userName);
      _form.append("PhoneNumber", profile.phoneNumber ?? "");
      _form.append("DateOfBirth", profile.dateOfBirth ?? "");
      const parts = profile.avatar.url.split("/"); // Chia đường dẫn theo dấu '/'
      const fileName = parts[parts.length - 1]; // Lấy phần tử cuối cùng trong mảng (tên tệp)
      const file: any = {
        uri: profile.avatar.url,
        name: fileName,
        type: "image/jpg",
      };
      _form.append("Avatar", file);
      _form.append("Address.District", profile.address.district);
      _form.append("Address.Ward", profile.address.ward);
      _form.append("Address.Province", profile.address.province);
      _form.append("Address.Country", profile.address.country);
      _form.append("Gender", JSON.stringify(profile.gender));

      const response = await update_user(session.userToken.accessToken, _form);
      
      // const response = await update_user(session.userToken.accessToken, {
      //   UserName: profile.userName,
      //   PhoneNumber: profile.phoneNumber,
      //   DateOfBirth: profile.dateOfBirth,
      //   Avatar: {
      //     Url: "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=large",
      //     Format: 1,
      //   },
      //   Address: {
      //     district: profile.address.district,
      //     ward: profile.address.ward,
      //     province: profile.address.province,
      //   },
      //   Gender: profile.gender,
      // });
      if (response) {
        console.log(response.data);
        setIsSuccess(true);
        setIsLoading(false);
        Toast.show({
          type: "success",
          text1: "Cập nhật thành công",
          // text2: "Welcome!",
        });
        setTimeout(() => {
          router.replace("/profile");
        }, 500);
      }
    } catch (err: any) {
      setError(err.message);
      console.log(err.message);
    }
  };

  const handleOpen = () => bottomSheetRef.current?.expand();
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);
  const handleSetGender = (val: number) => {
    handleChangeProfileState("gender", val);
  };

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

  // const [image, setImage] = useState<string | null>(null);

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
      handleChangeProfileState("avatar", {url: result.assets[0].uri, format: 1});
    }
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <Stack.Screen
            options={{
              title: "Thông tin cá nhân",
            }}
          />
          <ScrollView>
            <View style={styles.avatarContainer}>
              <Pressable onPress={pickImage}>
                <Image source={{ uri: profile.avatar? profile.avatar.url : tempAvatar }} style={styles.image} />
              </Pressable>
            </View>
            <View style={styles.inputsContainer}>
              <View style={styles.outerUsernameInput}>
                <AnimationTextInput
                  placeholder="Tên đăng nhập"
                  style={styles.usernameInput}
                  autoCapitalize={"none"}
                  maxLength={30}
                  value={profile.userName}
                  onChangeText={(text) =>
                    handleChangeProfileState("userName", text)
                  }
                />
                {profile.userName.length > 0 && (
                  <Pressable
                    style={styles.clearUserNameButton}
                    onPress={() => handleChangeProfileState("userName", "")}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={21}
                      color="#9FB7B9"
                    />
                  </Pressable>
                )}
              </View>
              <View style={styles.outerUsernameInput}>
                <AnimationTextInput
                  placeholder="Số điện thoại"
                  style={styles.otherInput}
                  autoCapitalize={"none"}
                  maxLength={10}
                  keyboardType={"phone-pad"}
                  value={profile.phoneNumber == null ? "" : profile.phoneNumber}
                  onChangeText={(text) =>
                    handleChangeProfileState("phoneNumber", text)
                  }
                />
                {profile.phoneNumber && profile.phoneNumber.length > 0 && (
                  <Pressable
                    style={styles.clearUserNameButton}
                    onPress={() => handleChangeProfileState("phoneNumber", "")}
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
                  marginTop: 7,
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
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>
                    {profile.dateOfBirth === null
                      ? "Chưa có thông tin ngày sinh"
                      : profile.dateOfBirth.split(" ")[0]}
                  </Text>
                </View>
              </Pressable>
              <View style={{ marginTop: 3 }}>
                <GenderDropdown
                  value={profile.gender ?? -1}
                  setValue={handleSetGender}
                />
              </View>
              <View>
                {/* <TextInput
            value={profile.address != null ? profile.address.province : "none"}
            placeholder="Province"
            onChangeText={(text) =>
              handleChangeProfileState("address.province", text)
            }
          /> */}
                <View style={styles.outerUsernameInput}>
                  <AnimationTextInput
                    placeholder="Tỉnh / Thành phố"
                    style={styles.addressInput}
                    maxLength={40}
                    value={
                      profile.address != null ? profile.address.province : ""
                    }
                    onChangeText={(text) =>
                      handleChangeProfileState("address.province", text)
                    }
                  />
                  {profile.address && (
                    <Pressable
                      style={styles.clearUserNameButton}
                      onPress={() =>
                        handleChangeProfileState("address.province", "")
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <View style={styles.outerUsernameInput}>
                    <AnimationTextInput
                      placeholder="Phường"
                      style={styles.wardInput}
                      maxLength={40}
                      value={
                        profile.address != null ? profile.address.ward : ""
                      }
                      onChangeText={(text) =>
                        handleChangeProfileState("address.ward", text)
                      }
                    />

                    {/* {profile.address && (
                <Pressable
                  style={styles.clearUserNameButton}
                  onPress={() => handleChangeProfileState("address.province", "")}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={21}
                    color="#9FB7B9"
                  />
                </Pressable>
              )} */}
                  </View>
                  <View style={styles.outerUsernameInput}>
                    <AnimationTextInput
                      placeholder="Quận"
                      style={styles.districtInput}
                      maxLength={40}
                      value={
                        profile.address != null ? profile.address.district : ""
                      }
                      onChangeText={(text) =>
                        handleChangeProfileState("address.district", text)
                      }
                    />
                  </View>
                </View>
                {/* <TextInput
            value={profile.address != null ? profile.address.district : "none"}
            placeholder="District"
            onChangeText={(text) =>
              handleChangeProfileState("address.district", text)
            }
          /> */}
                {/* <TextInput
            value={profile.address != null ? profile.address.ward : "none"}
            placeholder="Ward"
            onChangeText={(text) =>
              handleChangeProfileState("address.ward", text)
            }
          /> */}
          
              </View>
              <View style={{marginTop: 10}}>
              <Text style={{color: "#6b707b"}}>Bạn có thể hoặc không nhập địa chỉ hoặc phải nhập đủ cả 3 trường: Phường, Quận, Thành phố</Text>

              </View>
              
            </View>
            {/* <Pressable onPress={updateProfile}>
                <Text>Nhấn vào để cập nhật</Text>
              </Pressable> */}
              <View style={styles.loginButtonContainer}>
          <Pressable
            onPress={updateProfile}
            disabled={isLoginDisabled || isLoading}
            android_ripple={isLoginDisabled ? null : { color: "#b9bcc6" }}
            // android_ripple={{ color: "gray" }}
          >
            <View
              style={[
                styles.innerLoginButtonContainer,
                isLoginDisabled && styles.loginButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size={28} />
              ) : (
                <Text
                  style={[
                    styles.loginButtonText,
                    { color: isLoginDisabled ? "#b9bcc6" : "#fff" },
                  ]}
                >
                  Cập nhật
                </Text>
              )}
            </View>
          </Pressable>
        </View>
        {/* <Button title="Pick an image from camera roll" onPress={pickImage} />
        {image && <Image source={{ uri: image }} style={{width: 200, height: 200}} />} */}
          </ScrollView>

          {/* <TextInput
            value={profile.userName}
            onChangeText={(text) => handleChangeProfileState("userName", text)}
          /> */}
          {/* <TextInput
            value={profile.phoneNumber == null ? "none" : profile.phoneNumber}
            maxLength={10}
            keyboardType={"phone-pad"}
            onChangeText={(text) =>
              handleChangeProfileState("phoneNumber", text)
            }
          /> */}

          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["50%"]}
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
                  current={profile.dateOfBirth?.split(" ")[0] ?? "2003-06-01"}
                  onDayPress={(day: any) => {
                    handleChangeProfileState("dateOfBirth", day.dateString);
                    console.log(day.dateString);
                    console.log();
                  }}
                  markedDates={{
                    [profile.dateOfBirth ?? ""]: {
                      selected: true,
                      disableTouchEvent: true,
                      selectedColor: "#46e835",
                    },
                    [date]: { marked: true },
                  }}
                  theme={{
                    todayTextColor: "#46e835",
                    arrowColor: "#46e835",
                    selectedDayBackgroundColor: "#blue",
                    dotColor: "#46e835",
                  }}
                />
              </View>
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
    backgroundColor: "#fff",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
  contentContainer: {
    flex: 1,
  },
  inputsContainer: {
    marginTop: 40,
    width: "90%",
    flex: 1,
    marginLeft: 20,
  },
  outerUsernameInput: {
    flexDirection: "row",
    alignItems: "center",
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
  addressInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,
    marginVertical: 0,
    // marginTop: 15,
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
  wardInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,
    marginVertical: 0,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 10,
    fontWeight: "500",
  },
  districtInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginLeft: -60,
    padding: 10,
    marginVertical: 0,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "77%",
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 10,
    fontWeight: "500",
  },
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "95%",
    marginTop: 90,
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

export default UpdateProfile;

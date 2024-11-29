import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Pressable,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/app/(auth)/AuthContext";
import get_user_profile from "@/services/user/userProfile";
import { Calendar } from "react-native-calendars";
import update_user from "@/services/user/update_user";

type UserProfileProps = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  avatar: string | null;
  dateOfBirth: string | null;
  address: any;
  gender: boolean | null;
};

const UpdateProfile = () => {
  const { session, logout } = useAuth();
  const [loading, setLoading] = useState(false);
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

  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=large";

  useEffect(() => {
    fetchUser();
    setDate(profile.dateOfBirth ?? "2024-06-01");
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
      setLoading(true);
      const response = await get_user_profile(session.userToken.accessToken);
      if (response) {
        console.log(response.data.user);
        setProfile(response.data.user.profile);
        // console.log(session.userInfo);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateProfile = async () => {
    try {
      setLoading(true);
      const response = await update_user(session.userToken.accessToken, {
        UserName: profile.userName,
        PhoneNumber: profile.phoneNumber,
        DateOfBirth: profile.dateOfBirth,
        Avatar: {
          Url: "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=large",
          Format: 1,
        },
        Address: {
          district: profile.address.district,
          ward: profile.address.ward,
          province: profile.address.province,
        },
        Gender: profile.gender ? 1 : 0,
      });
      if (response) {
        console.log(response);
        setIsSuccess(true);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Thông tin cá nhân",
        }}
      />
      <View style={styles.avatarContainer}>
        <Image source={{ uri: tempAvatar }} style={styles.image} />
      </View>
      <TextInput
        value={profile.userName}
        onChangeText={(text) => handleChangeProfileState("userName", text)}
      />
      <TextInput
        value={profile.phoneNumber == null ? "none" : profile.phoneNumber}
        onChangeText={(text) => handleChangeProfileState("phoneNumber", text)}
      />
      <Calendar
        current={profile.dateOfBirth ?? "2024-06-01"}
        onDayPress={(day: any) => {
          handleChangeProfileState("dateOfBirth", day.dateString);
          console.log(day.dateString);
        }}
        markedDates={{
          [profile.dateOfBirth ?? ""]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: "#46e835",
          },
          [date]: { marked: true, activeOpacity: 0 },
        }}
        theme={{
          todayTextColor: "#46e835",
          arrowColor: "#46e835",
          selectedDayBackgroundColor: "#blue",
          dotColor: "#46e835",
        }}
      />
      <TextInput
        value={profile.address != null ? profile.address.district : "none"}
        placeholder="District"
        onChangeText={(text) =>
          handleChangeProfileState("address.district", text)
        }
      />
      <TextInput
        value={profile.address != null ? profile.address.ward : "none"}
        placeholder="Ward"
        onChangeText={(text) => handleChangeProfileState("address.ward", text)}
      />
      <TextInput
        value={profile.address != null ? profile.address.province : "none"}
        placeholder="Province"
        onChangeText={(text) =>
          handleChangeProfileState("address.province", text)
        }
      />
      <View style={styles.container}>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={profile.gender ?? false}
            onValueChange={(newValue) => handleChangeProfileState("gender", newValue)}
            style={styles.checkbox}
          />
          <Text style={styles.label}>Nhấn vào checkbox nếu bạn là nam</Text>
        </View>
        <Text>Nhấn vào để xác nhận bạn là nam</Text>
      </View>
      <Text>{profile.address ? profile.address.country : " "}</Text>
      <Pressable onPress={updateProfile}>
        <Text>Update</Text>
      </Pressable>
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
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  checkboxContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: 'center',
  },
  label: {
    margin: 8,
  },
});

export default UpdateProfile;

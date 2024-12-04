import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet, Text, Pressable } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, set } from "date-fns";
import ProvinceDropdown from "@/components/Dropdowns/ProvinceDropdown";
import { useAuth } from "@/app/(auth)/AuthContext";
import VehicleDropdown from "@/components/Dropdowns/VehicleDropdown";
import CustomImagePicker from "@/components/ImagePicker/CustomImagePicker";
import { addPlan } from "@/services/plan/plan";
import { router } from "expo-router";

type PlanProfileProps = {
  title: string | null;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  provinceStartId: string;
  provinceEndId: string;
  method: number;
  vehicle: number;
  avatar: any | null;
};

const Trip3 = () => {
  const { session } = useAuth();
  const [data, setData] = useState<PlanProfileProps>({
    title: null,
    startDate: "",
    endDate: "",
    estimatedBudget: 0,
    provinceStartId: "",
    provinceEndId: "",
    method: 0,
    vehicle: 0,
    avatar: null,
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      console.log("Debounced data:", data);
    }, 300);
    return () => {
      clearTimeout(handler);
    };
  }, [data]);

  const handleChangeProfileState = (field: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

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

  const createBlobFromUri = async (
    uri: string,
    fileName: string,
    mimeType: string
  ): Promise<any> => {
    // const response = await fetch(uri); // Fetch the local file
    // const blob = await response.blob(); // Convert the response to Blob
    // return new File([blob], fileName, { type: mimeType }); // Convert Blob to File
    const result = {
      uri: uri,
      name: fileName,
      type: mimeType,
    };
    return result;
  };

  const _addPlan = async () => {
    try {
      const _form = new FormData();
      _form.append("Plan.Title", data.title ?? "");
      _form.append("Plan.StartDate", data.startDate);
      _form.append("Plan.EndDate", data.endDate);
      _form.append("Plan.EstimatedBudget", data.estimatedBudget.toString());
      _form.append("Plan.ProvinceStartId", data.provinceStartId);
      _form.append("Plan.ProvinceEndId", data.provinceEndId);
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
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Nhập tên chuyến đi"
        value={data.title ?? ""}
        onChangeText={(text) => handleChangeProfileState("title", text)}
        style={styles.input}
      />
      <Calendar
        minDate={format(new Date(), "yyyy-MM-dd")}
        markingType={"period"}
        markedDates={{
          [data.startDate]: { startingDay: true, color: "green" },
          [data.endDate]: { endingDay: true, color: "green" },
          ...(data.startDate &&
            data.endDate && {
              [data.startDate]: { startingDay: true, color: "lime" },
              [data.endDate]: { endingDay: true, color: "lime" },
              ...getMarkedDatesBetween(data.startDate, data.endDate),
            }),
        }}
        onDayPress={handleDayPress}
      />
      <TextInput
        placeholder="Nhập kinh phí dự kiến"
        keyboardType="phone-pad"
        value={data.estimatedBudget.toString()}
        onChangeText={(text) =>
          handleChangeProfileState("estimatedBudget", parseInt(text))
        }
        style={styles.input}
      />
      <ProvinceDropdown
        value={data.provinceStartId}
        setValue={(value) => handleChangeProfileState("provinceStartId", value)}
        bearer={session.userToken.accessToken}
        placeholder="Chọn tỉnh/thành phố xuất phát"
      />
      <ProvinceDropdown
        value={data.provinceEndId}
        setValue={(value) => handleChangeProfileState("provinceEndId", value)}
        bearer={session.userToken.accessToken}
        placeholder="Chọn tỉnh/thành phố kết thúc"
      />
      <VehicleDropdown
        value={data.vehicle}
        setValue={(value) => handleChangeProfileState("vehicle", value)}
        placeholder="Chọn phương tiện"
      />
      <Text>Vui lòng nhập hết các trường trước khi thêm avatar</Text>
      <CustomImagePicker
        image={data.avatar}
        setImage={(value: string) => handleChangeProfileState("avatar", value)}
      />

      <Pressable
        style={{ backgroundColor: "blue", padding: 16, alignItems: "center" }}
        onPress={_addPlan}
      >
        <Text>Thêm chuyến đi</Text>
      </Pressable>
    </View>
  );
};

const getMarkedDatesBetween = (startDate: string, endDate: string) => {
  const dates: any = {};
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    currentDate.setDate(currentDate.getDate() + 1);
    const dateString = format(currentDate, "yyyy-MM-dd");
    if (dateString !== startDate && dateString !== endDate) {
      dates[dateString] = { color: "green", textColor: "white" };
    }
  }

  return dates;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default Trip3;

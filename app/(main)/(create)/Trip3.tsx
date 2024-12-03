import React, { useEffect, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { format, set } from "date-fns";
import ProvinceDropdown from "@/components/Dropdowns/ProvinceDropdown";
import { useAuth } from "@/app/(auth)/AuthContext";
import VehicleDropdown from "@/components/Dropdowns/VehicleDropdown";

type PlanProfileProps = {
  title: string | null;
  startDate: string;
  endDate: string;
  estimatedBudget: number;
  provinceStartId: string;
  provinceEndId: string;
  method: number;
  vehicle: number;
  avatar: string | null;
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
    </View>
  );
};

const getMarkedDatesBetween = (startDate: string, endDate: string) => {
  const dates: any = {};
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    const dateString = format(currentDate, "yyyy-MM-dd");
    if (dateString !== startDate && dateString !== endDate) {
      dates[dateString] = { color: "green", textColor: "white" };
    }
    currentDate.setDate(currentDate.getDate() + 1);
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

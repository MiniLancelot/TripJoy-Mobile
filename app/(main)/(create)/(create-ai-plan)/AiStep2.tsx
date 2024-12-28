// pages/step2.tsx
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFormStore } from "@/utils/useFormStore";
import { useAuth } from "@/app/(auth)/AuthContext";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { format, addDays, isBefore } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { vi } from "date-fns/locale";

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

LocaleConfig.defaultLocale = "vi";

export default function Step2() {
  const router = useRouter();
  // const { session } = useAuth();
  const { startDate, endDate, setFormData } = useFormStore();

  const getMarkedDatesBetween = (startDate: string, endDate: string) => {
    const dates: any = {};
    let currentDate = new Date(startDate);

    while (isBefore(currentDate, new Date(endDate))) {
      currentDate = addDays(currentDate, 1);
      const dateString = format(currentDate, "yyyy-MM-dd");
      if (dateString !== startDate && dateString !== endDate) {
        dates[dateString] = { color: "#71d7c7", textColor: "white" };
      }
    }

    return dates;
  };

  const renderCustomHeader = (date: string) => {
    const currentMonth = format(new Date(date), "MMMM yyyy", { locale: vi });
    return (
      <View style={{ alignItems: "center", marginVertical: 10 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>{currentMonth}</Text>
      </View>
    );
  };

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;

    if (!startDate || (startDate && endDate)) {
      setFormData("startDate", selectedDate);
      setFormData("endDate", "");
    } else if (startDate && !endDate) {
      if (isBefore(new Date(selectedDate), new Date(startDate))) {
        setFormData("startDate", selectedDate);
      } else {
        setFormData("endDate", selectedDate);
      }
    }
  };
  const nextBtnDisabled = !startDate.trim() || !endDate.trim();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thời gian dự định cho chuyến đi</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 40,
          marginVertical: 0,
          gap: 20,
          paddingHorizontal: 20,
        }}
      >
        <Ionicons name={"calendar-outline"} size={30} color={"#6b707b"} />
        <View style={[styles.birthdayInput, { borderWidth: 1.2 }]}>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <Text style={styles.dateText}>
              {startDate === ""
                ? "Ngày bắt đầu"
                : `Từ ${startDate.split("-")[2]}-${startDate.split("-")[1]}-${
                    startDate.split("-")[0]
                  }`}
            </Text>
            <Text style={styles.dateText}>
              {endDate === ""
                ? "Ngày kết thúc"
                : `đến ${endDate.split("-")[2]}-${endDate.split("-")[1]}-${
                    endDate.split("-")[0]
                  }`}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ marginBottom: 10, marginTop: 45 }}>
        <Calendar
          minDate={format(new Date(), "yyyy-MM-dd")}
          // maxDate={format(set(new Date(), { year: 2023 }), "yyyy-MM-dd")}
          markingType={"period"}
          markedDates={{
            [startDate]: { startingDay: true, color: "#71d7c7" },
            [endDate]: { endingDay: true, color: "#71d7c7" },
            ...(startDate &&
              endDate && {
                [startDate]: {
                  startingDay: true,
                  color: "#51cebb",
                },
                [endDate]: { endingDay: true, color: "#51cebb" },
                ...getMarkedDatesBetween(startDate, endDate),
              }),
          }}
          theme={{
            todayTextColor: "#46e835",
            arrowColor: "#46e835",
            selectedDayBackgroundColor: "#46e835",
            dotColor: "#46e835",
          }}
          onDayPress={handleDayPress}
          renderHeader={renderCustomHeader}
          firstDay={1} // Set Monday as the first day of the week
          dayNames={weekDaysVN}
          dayNamesShort={weekDaysVN.map((day) => day.replace("Thứ ", ""))}
        />
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.btnWrapper,
            { backgroundColor: "#ff7324" },
          ]}
          // disabled={nextBtnDisabled}
        >
          <Text style={styles.btnText}>Trở về</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/AiStep3")}
          style={[
            styles.btnWrapper,
            nextBtnDisabled && { backgroundColor: "#ccc" },
          ]}
          disabled={nextBtnDisabled}
        >
          <Text style={styles.btnText}>Kế tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 40,
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 55,
  },
  btnWrapper: {
    backgroundColor: "#13c892",
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});

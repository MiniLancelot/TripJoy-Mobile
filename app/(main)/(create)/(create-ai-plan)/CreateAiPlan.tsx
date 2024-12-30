// pages/summary.tsx
import {
  View,
  Text,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useFormStore } from "@/utils/useFormStore";
import { useState } from "react";
import { generateAIPlan } from "@/services/AI/ai";
import { format, set } from "date-fns";
import { postPlanByAI } from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";
import Toast from "react-native-toast-message";
import { Trips } from "@/constants/Trip";
import PlanImageCarousel from "@/components/PlanCarousel/PlanImageCarousel";

interface PlanLocation {
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  estimatedStartDate: string;
}

interface AIPlanSuggestion {
  theme: string;
  details: PlanLocation[];
}

const map = [
  { label: "Xe máy", value: 0 },
  { label: "Ô tô", value: 1 },
  { label: "Tàu hỏa", value: 2 },
  { label: "Tàu thuyền", value: 3 },
  { label: "Máy bay", value: 4 },
];

const getVehicleLabel = (vehicle: string) => {
  const vehicleMap: { [key: string]: string } = {
    motor: "Xe máy",
    car: "Ô tô",
    train: "Tàu hỏa",
    boat: "Tàu thuyền",
    airplane: "Máy bay",
  };
  return vehicleMap[vehicle] || vehicle; // Default to original value if not found
};

const convertDateFormat = (dateString: string) => {
  const [day, month, year] = dateString.split("/"); // Tách chuỗi
  return `${year}-${month}-${day}`; // Ghép lại theo định dạng yyyy-MM-dd
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-"); // Tách chuỗi
  return `${day}/${month}/${year}`; // Ghép lại theo định dạng DD/MM/YYYY
};

export default function CreateAiPlan() {
  const router = useRouter();
  const { session } = useAuth();
  const {
    provinceStart,
    provinceEnd,
    startDate,
    endDate,
    estimatedBudget,
    vehicle,
    resetForm,
  } = useFormStore();
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestion] = useState<AIPlanSuggestion[]>([]);

  const calculateDaysBetweenDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Tính khoảng cách giữa 2 ngày
    const differenceInTime = end.getTime() - start.getTime(); // Kết quả là millisecond
    const differenceInDays = differenceInTime / (1000 * 60 * 60 * 24);

    return differenceInDays;
  };

  const generateAiPlan = async () => {
    try {
      setIsLoading(true);
      console.log("Start Date: ", formatDate(startDate));
      console.log("End Date: ", formatDate(endDate));
      const response = await generateAIPlan({
        startLocation: provinceStart.provinceName,
        destination: provinceEnd.provinceName,
        days: calculateDaysBetweenDates(startDate, endDate),
        start_date: formatDate(startDate),
        end_date: formatDate(endDate),
        budget: estimatedBudget,
        transport: vehicle,
      });
      if (response) {
        const data = response.data.data.trip_plans.map(
          (item: any): AIPlanSuggestion => {
            return {
              theme: item.theme,
              details: item.details.map((item: any): PlanLocation => {
                return {
                  latitude: item.latitude,
                  longitude: item.longitude,
                  name: item.location,
                  address: item.address,
                  estimatedStartDate: item.date,
                };
              }),
            };
          }
        );
        setSuggestion(data);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const choosePlan = async (item: AIPlanSuggestion) => {
    try {
      const response = await postPlanByAI(
        {
          Plan: {
            Title: item.theme,
            StartDate: startDate,
            EndDate: endDate,
            EstimatedBudget: estimatedBudget,
            ProvinceStart: provinceStart.provinceName,
            ProvinceEnd: provinceEnd.provinceName,
            Method: 1,
            Vehicle: map.find((x) => x.label === vehicle)?.value,
            PlanLocations: item.details.map((detail) => {
              return {
                Latitude: detail.latitude,
                Longitude: detail.longitude,
                Name: detail.name,
                Address: detail.address,
                EstimatedStartDate: convertDateFormat(
                  detail.estimatedStartDate
                ),
              };
            }),
          },
        },
        session.userToken.accessToken
      );
      if (response) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Plan created successfully",
        });
        resetForm();
        router.replace("/home");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Something went wrong");
    }
  };

  const renderItems = (item: AIPlanSuggestion) => {
    return (
      <View
        key={item.theme}
        style={{
          marginVertical: 10,
          borderWidth: 1,
          borderColor: "#b2b2b2",
          borderRadius: 10,
          padding: 5,
          backgroundColor: "#fff",
          elevation: 3,
          paddingVertical: 10,
          paddingHorizontal: 10,
          width: "75%",
        }}
      >
        <Text>{item.theme}</Text>
        {item.details.map((detail) => (
          <View key={detail.name} style={{ flexDirection: "row", marginLeft: 10 }}>
            <Text style={{fontWeight: 600}}>{detail.estimatedStartDate}: </Text>
            <Text>
              {detail.name} - {detail.address}
            </Text>
          </View>
        ))}
        <Button title="Tạo chuyến đi" onPress={() => choosePlan(item)} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={{ gap: 5 }}>
          <Text>Điểm bắt đầu: {provinceStart.provinceName}</Text>
          <Text>Điểm kết thúc: {provinceEnd.provinceName}</Text>
          <Text>Kinh phí dự tính: {estimatedBudget} đ</Text>
        </View>
        <Text>Thời gian khởi hành: {startDate}</Text>
        <Text>Thời gian kết thúc: {endDate}</Text>

        <Text>Phương tiện: {getVehicleLabel(vehicle)}</Text>
      </View>

      {/* <Button
        title="Generate plan"
        onPress={generateAiPlan}
        disabled={isLoading}
      /> */}
      <View style={styles.loginButtonContainer}>
        <Pressable
          onPress={generateAiPlan}
          disabled={isLoading}
          android_ripple={{ color: "#b9bcc6" }}
          // android_ripple={{ color: "gray" }}
        >
          <View
            style={[
              styles.innerLoginButtonContainer,
              isLoading && styles.loginButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size={28} />
            ) : (
              <Text
                style={[
                  styles.loginButtonText,
                  { color: isLoading ? "#b9bcc6" : "#fff" },
                ]}
              >
                Tạo gợi ý chuyến đi
              </Text>
            )}
          </View>
        </Pressable>
      </View>
      {isLoading ? (
        <View>
          <View style={{ marginVertical: 20 }}>
            <PlanImageCarousel data={Trips} />
          </View>
          <ActivityIndicator size="large" color="#b2b2b2" />
          <Text style={{ textAlign: "center" }}>Đang tạo gợi ý...</Text>
        </View>
      ) : (
        <FlatList
          data={suggestions}
          renderItem={({ item }) => renderItems(item)}
          keyExtractor={(item) => item.theme}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loginButtonDisabled: {
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },

  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "94%",
    marginTop: 20,
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
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 10,
  },
  highlightText: {
    color: "#13c892",
    fontWeight: "bold",
  },
  backBtnWrapper: {
    width: "10%",
    justifyContent: "center",
  },
  searchBoxContainer: {
    width: "90%",
    justifyContent: "center",
  },
  searchBar: {
    borderWidth: 1,
    borderColor: "#4a4d52",
    borderRadius: 10,
    padding: 10,
    width: "100%",
  },
  innerContainer: {
    gap: 5,
    marginVertical: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#b2b2b2",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "#fff",
    elevation: 3,
  },
});

// pages/summary.tsx
import {
  View,
  Text,
  Button,
  Alert,
  FlatList,
  ActivityIndicator,
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
      <View key={item.theme}>
        <Text>{item.theme}</Text>
        {item.details.map((detail) => (
          <View
            key={detail.name}
            style={{ marginLeft: 10, flexDirection: "row" }}
          >
            <Text>{detail.estimatedStartDate}: </Text>
            <Text>
              {detail.name} - {detail.address}
            </Text>
          </View>
        ))}
        <Button title="Choose Plan" onPress={() => choosePlan(item)} />
      </View>
    );
  };

  return (
    <View>
      <Text>Province Start: {provinceStart.provinceName}</Text>
      <Text>Province End: {provinceEnd.provinceName}</Text>
      <Text>Start Date: {startDate}</Text>
      <Text>End Date: {endDate}</Text>
      <Text>Estimated Budget: {estimatedBudget}</Text>
      <Text>Vehicle: {vehicle}</Text>
      <Button title="Generate plan" onPress={generateAiPlan} disabled={isLoading} />
      {isLoading ? (
        <View>
          <View style={{ marginVertical: 20 }}>
            <PlanImageCarousel data={Trips} />
          </View>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
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

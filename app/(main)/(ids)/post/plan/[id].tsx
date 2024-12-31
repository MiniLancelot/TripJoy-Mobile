import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Province } from "@/utils/Provinces";
import { getPlanById } from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";
import { ca } from "date-fns/locale";
import { createPostPlan } from "@/services/post/post";
import Toast from "react-native-toast-message";
import BouncyCheckbox from "react-native-bouncy-checkbox";

type PlanProps = {
  id: string;
  // leadUserId: string;
  title: string;
  startDate: string;
  endDate: string;
  provinceStart: Province;
  provinceEnd: Province;
  budget: number;
  vehicle: number;
};

type PlanLocation = {
  locationId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  estimatedStartDate: string;
  order: number;
};

const PostPlan = () => {
  const { session } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [planData, setPlanData] = React.useState<PlanProps>({
    id: "",
    // leadUserId: "",
    title: "",
    startDate: "",
    endDate: "",
    provinceStart: { provinceId: "", provinceName: "" },
    provinceEnd: { provinceId: "", provinceName: "" },
    budget: 0,
    vehicle: 0,
  });

  const [planLocation, setPlanLocation] = React.useState<PlanLocation[]>([]);
  const [content, setContent] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(false);
  const [isIncludePlanLocal, setIsIncludePlanLocal] =
    React.useState<boolean>(false);
  const isButtonDisabled = !content;
  React.useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const response = await getPlanById(session.userToken.accessToken, id);
      if (response) {
        const data = response.data.plan;
        const locations = response.data.plan.locations;
        setPlanData({
          id: data.id,
          // leadUserId: data.leadUserId,
          title: data.title,
          startDate: data.startDate.split("T")[0],
          endDate: data.endDate.split("T")[0],
          provinceStart: data.provinceStart,
          provinceEnd: data.provinceEnd,
          budget: data.estimatedBudget,
          vehicle: data.vehicle,
        });
        setPlanLocation(
          locations.map(
            (item: any): PlanLocation => ({
              locationId: item.id,
              name: item.name,
              address: item.address,
              latitude: item.latitude,
              longitude: item.longitude,
              estimatedStartDate: item.estimatedStartDate.split("T")[0],
              order: item.order,
            })
          )
        );
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(isIncludePlanLocal);
  }, [isIncludePlanLocal]);

  const _createPlanPost = async () => {
    try {
      const data = new FormData();
      data.append("PlanPost.Content", content);
      data.append("PlanPost.PlanId", id);
      data.append("PlanPost.PlanStartDate", planData.startDate);
      data.append("PlanPost.PlanEndDate", planData.endDate);
      // data.append("PlanPost.PlanTitle", planData.title);
      data.append("PlanPost.Budget", planData.budget.toString());
      data.append(
        "PlanPost.ProvinceStart.ProvinceId",
        planData.provinceStart.provinceId
      );
      data.append(
        "PlanPost.ProvinceEnd.ProvinceId",
        planData.provinceEnd.provinceId
      );
      data.append(
        "PlanPost.ProvinceStart.ProvinceName",
        planData.provinceStart.provinceName
      );
      data.append(
        "PlanPost.ProvinceEnd.ProvinceName",
        planData.provinceEnd.provinceName
      );
      data.append("PlanPost.Vehicle", planData.vehicle.toString());
      if (isIncludePlanLocal) {
        const extraData = planLocation.slice(0, 2);
        extraData.forEach((item, index) => {
          data.append(
            `PlanPost.PostPlanLocations[${index}].LocationId`,
            item.locationId
          );
          data.append(`PlanPost.PostPlanLocations[${index}].Name`, item.name);
          data.append(
            `PlanPost.PostPlanLocations[${index}].Address`,
            item.address
          );
          data.append(
            `PlanPost.PostPlanLocations[${index}].Coordinates.Latitude`,
            item.latitude.toString()
          );
          data.append(
            `PlanPost.PostPlanLocations[${index}].Coordinates.Longitude`,
            item.longitude.toString()
          );
          data.append(
            `PlanPost.PostPlanLocations[${index}].EstimatedStartDate`,
            item.estimatedStartDate
          );
          data.append(
            `PlanPost.PostPlanLocations[${index}].Order`,
            item.order.toString()
          );
        });
      }
      const response = await createPostPlan(
        data,
        session.userToken.accessToken
      );
      if (response) {
        Toast.show({
          type: "success",
          text1: "Tạo thành công",
          text2: "Welcome!",
        });
        router.back();
      }
      console.log(data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#fff" }}>
      <Stack.Screen
        options={{
          title: "Tạo bài viết về chuyến đi",
        }}
      />
      {/* <Text>Tạo bài viết về chuyến đi</Text> */}

      <TextInput
        placeholder="Nội dung"
        value={content}
        multiline
        numberOfLines={5}
        maxLength={300}
        onChangeText={setContent}
        style={{
          borderWidth: 1,
          borderColor: "#e6e6e6",
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          textAlignVertical: "top",
          maxHeight: 200,
        }}
      />
      {/* <Pressable
        onPress={() => {
          setIsIncludePlanLocal(!isIncludePlanLocal);
        }}
      >
        <Text>
          {isIncludePlanLocal
            ? "Đã bao gồm địa điểm"
            : "Chưa kèm theo địa điểm"}
        </Text>
      </Pressable> */}
      <BouncyCheckbox
        text="Bao gồm địa điểm"
        unFillColor="#FFFFFF"
        fillColor="#71d7c7"
        onPress={(checked) => setIsIncludePlanLocal(checked)}
        textStyle={{
          textDecorationLine: "none",
        }}
      />
      {/* <Pressable onPress={_createPlanPost}>
        <Text>Đăng</Text>
      </Pressable> */}
      <View style={styles.loginButtonContainer}>
        <Pressable
          onPress={_createPlanPost}
          disabled={isButtonDisabled || isLoading}
          android_ripple={isButtonDisabled ? null : { color: "#b9bcc6" }}
          // android_ripple={{ color: "gray" }}
        >
          <View
            style={[
              styles.innerLoginButtonContainer,
              isButtonDisabled && styles.loginButtonDisabled,
            ]}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" size={28} />
            ) : (
              <Text
                style={[
                  styles.loginButtonText,
                  { color: isButtonDisabled ? "#b9bcc6" : "#fff" },
                ]}
              >
                Tạo bài viết
              </Text>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default PostPlan;

const styles = StyleSheet.create({
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "93%",
    marginTop: 100,
    bottom: 20,
  },
  innerLoginButtonContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonDisabled: {
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },
  loginButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "semibold",
    lineHeight: 28,
  },
});

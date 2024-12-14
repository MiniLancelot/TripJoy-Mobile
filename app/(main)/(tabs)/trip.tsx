import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import CurrentTripCard from "@/components/Trips/CurrentTripCard";
import { Trips } from "@/constants/Trip";
import Carousel from "react-native-reanimated-carousel";
import TripCarousel from "@/components/Trips/TripCarousel";
import { router } from "expo-router";
import { getAllPlan, getPlanLocationById } from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 200;

type TripProps = {
  title: string;
  subtitle: string;
  illustration: string;
  id: string,
};

const Trip = () => {
  const { session, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TripProps[]>([]);
  useEffect(() => {
    setData(Trips);
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getAllPlan(session.userToken.accessToken);
      if (response) {
        console.log(response.data.plans.data);
        setData(response.data.plans.data);
        setIsLoading(false);
      }

    }catch (err: any) {
      setError(err.message);
    }
  }

  const bannerImage =
    "https://mangdendiscovery.vn/wp-content/uploads/2023/02/1-5.jpg";
  const currentImage =
    "https://image.kkday.com/v2/image/get/w_1920,h_1080,c_fit,q_55,wm_auto/s1.kkday.com/product_151787/20230909161736_apd0T/jpg";

  return (
    <ScrollView style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image source={bannerImage} style={styles.image} />
        <LinearGradient
          colors={["rgba(0,0,0,0.25)", "transparent"]}
          style={styles.gradient}
        />
        <View style={styles.bannerInnerContainer}>
          <View style={styles.bannerIcon}>
            <Ionicons name="location-outline" size={40} color={"#fff"} />
            <Text style={styles.bannerText1}>Đà Nẵng</Text>
          </View>
          <Text style={styles.bannerText2}>Chuyến đi của tôi</Text>
        </View>
      </View>
      <View style={styles.mainContainer}>
        <Text style={styles.mainText1}>Hiện tại</Text>
        <View style={styles.main1Container}>
          <CurrentTripCard
            name={"Lủng Cú"}
            startTime={"20/12"}
            endTime={"25/12"}
            isTravelling={true}
            count={3}
            image={currentImage}
          />
          <Pressable style={styles.addBtn} onPress={() => router.push("/Trip3")}>
            <FontAwesome6 name="add" size={28} color={"#fff"} />
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#fff" }}>
              Tạo mới
            </Text>
          </Pressable>
        </View>
        <View style={{flexDirection: "row", gap : 226}}>
        <Text style={styles.mainText2}>Đã đi</Text>
        <Text style={styles.seeMore}>Tất cả</Text>
        </View>
        
      </View>
      {/* <Carousel width={width} /> */}
      <View style={{paddingBottom: 50}}>
        <TripCarousel data={data} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bannerContainer: {
    position: "relative",
  },
  image: {
    width: width,
    height: IMG_HEIGHT,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  bannerInnerContainer: {
    position: "absolute",
    top: 90,
    left: 20,
  },
  bannerIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  bannerText1: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "500",
  },
  bannerText2: {
    marginTop: 5,
    fontSize: 25,
    color: "#fff",
    fontWeight: "700",
  },
  mainContainer: {
    paddingTop: 15,
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    transform: [{ translateY: -10 }],
  },
  mainText1: {
    color: "#8D909B",
    fontWeight: "800",
    fontSize: 24,
    paddingLeft: 5,
  },
  main1Container: {
    marginTop: 15,
    marginLeft: 10,
    flexDirection: "row",
    gap: 20,
  },
  addBtn: {
    backgroundColor: "#67baff",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    width: 95,
    elevation: 10,
  },
  mainText2: {
    color: "#8D909B",
    fontWeight: "800",
    fontSize: 24,
    paddingLeft: 5,
    marginTop: 20,
  },
  seeMore: {
    color: "#8D909B",
    fontWeight: "600",
    fontSize: 20,
    paddingLeft: 5,
    marginTop: 20,
  },
});

export default Trip;

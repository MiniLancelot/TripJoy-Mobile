import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import CurrentTripCard from "@/components/Trips/CurrentTripCard";
import { Trips } from "@/constants/Trip";
import Carousel from "react-native-reanimated-carousel";
import TripCarousel from "@/components/Trips/TripCarousel";
import { router } from "expo-router";
import {
  getAllPlan,
  getPlanAvailableToJoin,
  getPlanLocationById,
  postJoinRequest,
  putChangeJoinStatusPlan,
  revokeJoinRequest,
} from "@/services/plan/plan";
import { useAuth } from "@/app/(auth)/AuthContext";
import { Province } from "@/utils/Provinces";
import SuggestedTripCarousel from "@/components/Trips/SuggestedTripCarousel";
import { TripProps } from "@/utils/TripProps";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { ca } from "date-fns/locale";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 200;

// type TripProps = {
//   title: string;
//   // subtitle: string;
//   // illustration: string;
//   id: string,
//   avatar: string,
//   startDate: string,
//   endDate: string,
//   provinceStart: Province,
//   provinceEnd: Province,
//   joinStatus?: number,
//   applyStatus?: boolean,
// };

const Trip = () => {
  const { session, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TripProps[]>([]);
  const [suggestData, setSuggestData] = useState<TripProps[]>([]);
  const [chosenPlan, setChosenPlan] = useState<string>();
  const [content, setContent] = useState<string>("");
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isStatusChanged, setIsStatusChanged] = useState<boolean>(false);
  const snapPoints = useMemo(() => ["30%", "50%"], []);
  useEffect(() => {
    // setData(Trips);
    fetchPlans();
    fetchSuggestPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await getAllPlan(session.userToken.accessToken);
      if (response) {
        console.log(response.data.plans.data.map((item: any): TripProps => {
          return {
            id: item.id,
            title: item.title,
            avatar: item.avatar,
            startDate: item.startDate,
            endDate: item.endDate,
            provinceStart: item.provinceStart,
            provinceEnd: item.provinceEnd,
            joinStatus: item.joinStatus,
            applyStatus: item.applyStatus,
          };
        }));
        setData(response.data.plans.data);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchSuggestPlans = async () => {
    try {
      const _response = await getPlanAvailableToJoin(
        session.userToken.accessToken
      );
      if (_response) {
        console.log(_response.data.plans.data);
        setSuggestData(_response.data.plans.data);
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const _handleOpen = (id: string) => {
    console.log("Open bottom sheet with id: ", id);
    setChosenPlan(id);
    bottomSheetRef.current?.expand();
  };

  const handleJoinRequest = async () => {
    try {
      const response = await postJoinRequest(
        {
          Introduction: content,
        },
        session.userToken.accessToken,
        chosenPlan
      );
      if (response) {
        console.log(response.data);
        setContent("");
        bottomSheetRef.current?.close();
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
      (err.response.status == 400) ? Alert.alert("Thông báo", "Bạn đã ở trong 1 plan khác trong khoảng thời gian của plan này.") : Alert.alert("Thông báo", "Có lỗi xảy ra, vui lòng thử lại sau!");
    }
  };

  const handleRevokeRequest = async (id: string) => {
    try {
      const response = await revokeJoinRequest(
        session.userToken.accessToken,
        id
      );
      if (response) {
        console.log(response.data);
        setIsSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

    const _changeJoinStatus = async (id: string) => {
      try {
        const response = await putChangeJoinStatusPlan(
          session.userToken.accessToken,
          id
        );
        if (response) {
          console.log(response.data);
          setIsStatusChanged(true);
        }
      } catch (err: any) {
        console.log(err.message);
      }
    }

  useEffect(() => {
    if (isSuccess) {
      fetchSuggestPlans();
      setIsSuccess(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isStatusChanged) {
      fetchPlans();
      setIsStatusChanged(false);
    }
  }, [isStatusChanged]);

  const bottomSheetRef = useRef<BottomSheet>(null);

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

  const bannerImage =
    "https://mangdendiscovery.vn/wp-content/uploads/2023/02/1-5.jpg";
  const currentImage =
    "https://image.kkday.com/v2/image/get/w_1920,h_1080,c_fit,q_55,wm_auto/s1.kkday.com/product_151787/20230909161736_apd0T/jpg";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <ScrollView style={styles.container}>
          <View style={styles.bannerContainer}>
            <Image source={bannerImage} style={styles.image} />
            <LinearGradient
              colors={["rgba(0,0,0,0.25)", "transparent"]}
              style={styles.gradient}
            />
            <View style={styles.bannerInnerContainer}>
              {/* <View style={styles.bannerIcon}>
                <Ionicons name="location-outline" size={40} color={"#fff"} />
                <Text style={styles.bannerText1}>Đà Nẵng</Text>
              </View> */}
              <Text style={styles.bannerText2}>Chuyến đi của tôi</Text>
            </View>
          </View>
          <View style={styles.mainContainer}>
            {/* <Text style={styles.mainText1}>Hiện tại</Text> */}
            {/* <View style={styles.main1Container}>
              <CurrentTripCard
                name={"Lủng Cú"}
                startTime={"20/12"}
                endTime={"25/12"}
                isTravelling={true}
                count={3}
                image={currentImage}
              />
              <Pressable
                style={styles.addBtn}
                onPress={() => router.push("/Trip3")}
              >
                <FontAwesome6 name="add" size={28} color={"#fff"} />
                <Text
                  style={{ fontSize: 16, fontWeight: "500", color: "#fff" }}
                >
                  Tạo mới
                </Text>
              </Pressable>
            </View> */}
            <Pressable style={{ flexDirection: "row", gap: 226 }} onPress={() => fetchPlans()}>
              <Text style={styles.mainText2}>Chuyến đi</Text>
              {/* <Text style={styles.seeMore}>Tất cả</Text> */}
            </Pressable>
          </View>
          {/* <Carousel width={width} /> */}
          <View style={{ paddingBottom: 50 }}>
            <TripCarousel data={data} _changeJoinStatus={_changeJoinStatus}/>
            <Text style={[styles.mainText2, {marginLeft: 10, marginBottom: 16}]}>Gợi ý</Text>
            <SuggestedTripCarousel
              data={suggestData}
              _JoinRequest={_handleOpen}
              _RevokeRequest={handleRevokeRequest}
            />
          </View>
        </ScrollView>
        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          index={-1}
          backdropComponent={renderBackDrop}
          enablePanDownToClose={true}
        >
          <BottomSheetScrollView
            style={{ flex: 1, paddingBottom: 30, paddingHorizontal: 10 }}
          >
            <Text style={{ fontSize: 20, fontWeight: "500", textAlign: "center" }}>Yêu cầu tham gia</Text>
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
            {/* <Pressable onPress={handleJoinRequest}>
              <Text>Gửi yêu cầu</Text>
            </Pressable> */}
            <View style={styles.loginButtonContainer}>
                            <Pressable
                              onPress={handleJoinRequest}
                              // android_ripple={{ color: "gray" }}
                            >
                              <View
                                style={[
                                  styles.innerLoginButtonContainer,
                                ]}
                              >
                                {isLoading ? (
                                  <ActivityIndicator color="#fff" size={28} />
                                ) : (
                                  <Text
                                    style={[
                                      styles.loginButtonText,
                                    ]}
                                  >
                                    Gửi yêu cầu
                                  </Text>
                                )}
                              </View>
                            </Pressable>
                          </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
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
    top: 100,
    left: 20,
  },
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "93%",
    marginTop: 180,
    bottom: 20,

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
    color: "#fff",
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
    marginTop: 20,
    fontSize: 28,
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

import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  Dimensions,
  Pressable,
  Alert,
} from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import {
  Stack,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import axios from "axios";
import get_user_by_id from "@/services/user/getUserById";
import { useAuth } from "@/app/(auth)/AuthContext";
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useScrollViewOffset,
  useSharedValue,
  clamp,
  interpolateColor,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import StarRailChar2 from "@/components/Others/StarRailChar2";

type UserProps = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  avatar: string | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: boolean | null;
};

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 200;

const game = {
  name: "Mean Nhat",
  banner: require("@/assets/images/others/bannerTest.webp"),
  avatar: require("@/assets/images/others/avatar.jpg"),
  posts: 181,
  friends: 153,
  trips: 64,
  description:
    "Honkai: Star Rail is a turn-based space fantasy RPG developed and published by HoYoverse for PC, PS5, and iOS/Android platforms. Come aboard with us on the Astral Express, TrailblazerssThis wiki is an English resource for information about the Global version of the game. There are unmarked spoilers on this wiki.",
};

const User = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { session } = useAuth();
  const navigation = useNavigation();
  const [user, setUser] = useState<UserProps>({
    id: "",
    userName: "",
    email: "",
    phoneNumber: null,
    avatar: null,
    dateOfBirth: null,
    address: null,
    gender: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const avatarUri = user.avatar == null ? tempAvatar : user.avatar;
  //   useEffect(() => {

  //     const fetchChar = async () => {
  //       try {
  //         const response = await axios.get(
  //           `https://hsr-api.vercel.app/api/v1/characters/${id}`
  //         );
  //         setCharacter(response.data[0]);
  //         console.log(response.data[0]);
  //       } catch (err: any) {
  //         if (err.response && err.response.status === 404) {
  //           setError('Character not found. Please check the ID and try again.');
  //         } else {
  //           setError(err.message);
  //         }
  //         console.log(err);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchChar();
  //   }, [id]);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);


  const imageAnimatedStyle = useAnimatedStyle(() => {
    const clampedScroll = clamp(scrollOffset.value, 0, IMG_HEIGHT); // Clamp scrollOffset value
    return {
      transform: [
        {
          translateY: interpolate(
            clampedScroll,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [-IMG_HEIGHT / 2, 0, IMG_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            clampedScroll,
            [-IMG_HEIGHT, 0, IMG_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const clampedScroll = clamp(scrollOffset.value, 0, IMG_HEIGHT);
    return {
      opacity: interpolate(clampedScroll, [0, IMG_HEIGHT / 1.5], [0, 1]),
      
    };
  });

  const avatarAnimatedStyle = useAnimatedStyle(() => {
    const clampedScroll = clamp(scrollOffset.value, 0, IMG_HEIGHT);
    return {
      opacity: interpolate(clampedScroll, [0, IMG_HEIGHT / 2], [1, 0]),
      transform: [
        {
          translateY: interpolate(clampedScroll, [0, IMG_HEIGHT / 2], [0, -50]),
        },
      ],
    };
  });

  const headerAvatarAnimatedStyle = useAnimatedStyle(() => {
    const clampedScroll = clamp(scrollOffset.value, 0, IMG_HEIGHT);
    return {
      opacity: interpolate(clampedScroll, [0, IMG_HEIGHT / 2], [0, 1]),
    };
  });

  const iconColorAnimatedStyle = useAnimatedStyle(() => {
    const clampedScroll = clamp(scrollOffset.value, 0, IMG_HEIGHT);
    const color = interpolateColor(
      clampedScroll,
      [0, IMG_HEIGHT],
      ["#fff", "#000"]
    );
    return {
      color,
    };
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await get_user_by_id(
        session.userToken.accessToken,
        id.toString()
      );
      if (response) {
        console.log(response.data.user);
        setUser(response.data.user);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };
  useLayoutEffect(() => {
    navigation.setOptions({ title: user.userName });
  }, [user.userName]);

  //   if (loading) {
  //     return (
  //       <View style={styles.container}>
  //         <Text style={styles.loadingText}>Loading...</Text>
  //       </View>
  //     );
  //   }

  // if (error) {
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.errorText}>Error: {error}</Text>
  //     </View>
  //   );
  // }

  return (

    <View style={styles.profileContainer}>
      {/* {session?.name && <Text style={styles.name}>Hello, {session.name}</Text>} */}
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShadowVisible: true,
          headerShown: true,
          // headerStyle: { backgroundColor: "#fff" },
          headerLeft: () => {
            return (
              <>
                <View style={styles.backBtnWrapper}>
                  <Pressable onPress={() => router.back()}>
                         <Animated.Text style={iconColorAnimatedStyle}>

                    <Ionicons
                      name="arrow-back-outline"
                      size={25}
                    />
                    </Animated.Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.headerAvatarNameConatainer}
                  onLongPress={() =>
                    scrollRef.current?.scrollTo({ y: 0, animated: true })
                  }
                >
                  <Animated.Image
                    source={{ uri: avatarUri }}
                    style={[styles.headerAvatar, headerAvatarAnimatedStyle]}
                  />
                  <Animated.Text
                    style={[styles.headerName, headerAnimatedStyle]}
                  >
                    {user.userName}
                  </Animated.Text>
                </Pressable>
              </>
            );
          },
          headerBackground: () => (
            <Animated.View style={[styles.header, headerAnimatedStyle]} />
          ),
          // headerRight: () => {
          //   return (
          //     <Pressable
          //       // onPress={() => setIsModalOpen(true)}
          //       style={styles.settingButton}
          //     >
          //       <Animated.Text style={iconColorAnimatedStyle}>
          //         <Ionicons name="settings-outline" size={20} />
          //       </Animated.Text>
          //     </Pressable>
          //   );
          // },
        }}
      />
      <Animated.ScrollView
        ref={scrollRef}
        scrollEventThrottle={16}
        overScrollMode={"auto"}
        onScroll={useAnimatedScrollHandler((event) => {
          scrollOffset.value = event.contentOffset.y;
        })}
      >
        <View style={styles.imageContainer}>
          <Animated.Image
            source={game.banner}
            style={[styles.image, imageAnimatedStyle]}
          />
          <LinearGradient
            colors={["rgba(0,0,0,0.75)", "transparent"]}
            style={styles.gradient}
          />
        </View>
        <View id="content" style={styles.mainContainer}>
          <View style={styles.mainInnerContainer}>
            <View style={styles.mainTopContainer}>
              <View>
                <Pressable
                  onPress={() => Alert.alert("Avatar")}
                  style={styles.outerAvatarContainer}
                >
                  <Animated.View
                    style={[avatarAnimatedStyle, styles.mainAvatarContainer]}
                  >
                    <Image source={{uri:tempAvatar}} style={styles.mainAvatar} />
                  </Animated.View>
                </Pressable>

                <Text style={styles.text}>
                  {session.userInfo == null ? game.name : user.userName}
                </Text>
                <View
                  style={[
                    styles.text,
                    {
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      marginTop: 10,
                      gap: 5,
                    },
                  ]}
                >
                  <Ionicons name="chatbox-ellipses" size={16} color="#bfbfbf" />
                  <Text style={{ marginLeft: 5, color: "#bfbfbf" }}>
                    {session.userInfo == null ? game.name : user.phoneNumber}
                  </Text>
                </View>
              </View>
              <View style={styles.outerEditContainer}>
                <View style={styles.editContainer}>
                  <Pressable
                    // onPress={() => router.push("/(update)/update-profile")}
                    style={styles.innerEditContainer}
                  >
                    {/* <FontAwesome6
                      name="pen-to-square"
                      size={13}
                      color={"#13c892"}
                    /> */}
                    <Ionicons
                      name="person-add-outline"
                      size={15}
                      color={"#13c892"}
                    />
                    <Text style={styles.editText}>Thêm bạn bè</Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View style={styles.dataContainer}>
              <View style={styles.dataSingleContainer}>
                <Text style={styles.dataNumber}>{game.posts}</Text>
                <Text>Bài Viết</Text>
              </View>
              <View style={styles.dataSingleContainer}>
                <Text style={styles.dataNumber}>
                  {session.userInfo == null ? 100 : 200}
                </Text>
                <Text>Bạn Bè</Text>
              </View>
              <View style={styles.dataSingleContainer}>
                <Text style={styles.dataNumber}>{game.trips}</Text>
                <Text>Chuyến Đi</Text>
              </View>
            </View>
            <View>
              <Text
                style={{ marginVertical: 10, fontSize: 18, fontWeight: "700" }}
              >
                Bài Viết
              </Text>
              <StarRailChar2 />
            </View>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

// const styles = StyleSheet.create({
// outerContainer: {
//   flex: 1,
//   backgroundColor: "#fff",
// },
// container: {
//   flex: 1,
//   padding: 20,
//   alignItems: "center",
//   justifyContent: "center",
//   gap: 20,
//   backgroundColor: "#fff",
// },
// title: {
//   fontSize: 24,
//   fontWeight: "bold",
// },
// image: {
//   width: 200,
//   height: 200,
//   // borderRadius: 100,
//   marginVertical: 20,
// },
// text: {
//   fontSize: 20,
// },
// loadingText: {
//   fontSize: 24,
//   fontWeight: "bold",
//   textAlign: "center",
// },
// errorText: {
//   fontSize: 24,
//   fontWeight: "bold",
//   textAlign: "center",
//   color: "red",
// },
const styles = StyleSheet.create({
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "red",
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  name: {
    paddingTop: 20,
    fontSize: 36,
    lineHeight: 40,
  },

  goodbyeLine: {
    paddingTop: 50,
    fontSize: 36,
    lineHeight: 40,
  },
  logoutButton: {
    marginTop: 100,
  },
  imageContainer: {
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
  text: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 5,
    marginLeft: 10,
  },
  content: {
    marginTop: 20,
  },
  header: {
    backgroundColor: "white",
    height: 80,
  },
  headerAvatarNameConatainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 20,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerName: {
    color: "#000",
    marginLeft: 10,
    fontSize: 20,
  },
  settingButton: {
    marginRight: 20,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    transform: [{ translateY: -50 }],
    paddingHorizontal: 5,
  },
  mainInnerContainer: {
    marginHorizontal: 10,
    transform: [{ translateY: -40 }],
    flex: 1,
  },
  mainTopContainer: {
    flexDirection: "row",
  },
  outerAvatarContainer: {
    width: 90,
  },
  mainAvatarContainer: {
    borderWidth: 10,
    borderColor: "#fff",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  mainAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  outerEditContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
    marginRight: 15,
    marginTop: -15,
  },
  editContainer: {
    borderRadius: 30,
    borderColor: "#13c892",
    borderWidth: 1,
  },
  innerEditContainer: {
    flexDirection: "row",
    gap: 7,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  editText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#13c892",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 16,
    transform: [{ translateX: -10 }],
  },
  modalOptionContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
    gap: 20,
  },
  modalText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dataContainer: {
    opacity: 0.8,
    paddingTop: 10,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    paddingBottom: 35,
    borderBottomColor: "#bfbfbf",
    borderBottomWidth: 0.2,
  },
  dataSingleContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  dataNumber: {
    fontSize: 17,
    fontWeight: "bold",
  },
  backBtnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 0,
  },
});

export default User;

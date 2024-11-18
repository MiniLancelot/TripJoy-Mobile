import {
  View,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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
import React, { useEffect, useState } from "react";
import ColorList from "@/components/Others/ColorList";
// import { user_logout } from '@/utils/user_api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/app/(auth)/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import MyProfileModal from "@/components/Modals/MyProfileModal";
import StarRailChar2 from "@/components/Others/StarRailChar2";

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


const profile = () => {
  const router = useRouter();
  const { session, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const scrollY = useSharedValue(0);

  // useEffect(() => {
  //     AsyncStorage.getItem("info").then((value) => {
  //         if (value) {
  //             const infoObject = JSON.parse(value);
  //             setUser(infoObject.name);
  //         }
  //     });
  // }, []);
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const avatarUri = session.userInfo.user.profile.avatar == null ? tempAvatar : session.userInfo.user.profile.avatar;

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
      // backgroundColor: interpolateColor(clampedScroll, [0, IMG_HEIGHT / 1.5], ['transparent', 'white']),
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

  const LogoutHandler = async () => {
    if (session.userToken.accessToken && session.userToken.refreshToken) {
      await logout!({
        refreshToken: session.userToken.refreshToken.trim(),
        accessToken: session.userToken.accessToken.trim(),
      });
      router.replace("/login");
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có muốn đăng xuất không?",
      [
        {
          text: "Huỷ",
          style: "cancel",
        },
        {
          text: "Đăng xuất",
          onPress: LogoutHandler,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.profileContainer}>
      {/* {session?.name && <Text style={styles.name}>Hello, {session.name}</Text>} */}
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShadowVisible: true,
          headerShown: true,
          headerLeft: () => {
            return (
              <>
                <Pressable style={styles.headerAvatarNameConatainer} onLongPress={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}>
                  <Animated.Image
                    source={{uri: avatarUri}}
                    style={[styles.headerAvatar, headerAvatarAnimatedStyle]}
                  />
                  <Animated.Text
                    style={[styles.headerName, headerAnimatedStyle]}
                  >
                    {session.userInfo == null ? game.name : session.userInfo.user.profile.userName}
                  </Animated.Text>
                </Pressable>
              </>
            );
          },
          headerBackground: () => (
            <Animated.View style={[styles.header, headerAnimatedStyle]} />
          ),
          headerRight: () => {
            return (
              <Pressable
                onPress={() => setIsModalOpen(true)}
                style={styles.settingButton}
              >
                <Animated.Text style={iconColorAnimatedStyle}>
                  <Ionicons name="settings-outline" size={20} />
                </Animated.Text>
              </Pressable>
            );
          },
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
                    <Image source={{uri: avatarUri}} style={styles.mainAvatar} />
                  </Animated.View>
                </Pressable>

                <Text style={styles.text}>{session.userInfo == null ? game.name : session.userInfo.user.profile.userName}</Text>
                <View style={[styles.text, {flexDirection: "row", justifyContent:"flex-start", alignItems: "center", marginTop: 10, gap: 5}]}>
                <Ionicons name="chatbox-ellipses" size={16} color="#bfbfbf" />
                <Text style={{marginLeft: 5, color: "#bfbfbf"}}>{session.userInfo == null ? game.name : session.userInfo.user.profile.phoneNumber}</Text>
                </View>
              </View>
              <View style={styles.outerEditContainer}>
                <View style={styles.editContainer}>
                  <Pressable
                    onPress={() => router.push("/(update)/update-profile")}
                    style={styles.innerEditContainer}
                  >
                    <FontAwesome6
                      name="pen-to-square"
                      size={13}
                      color={"#13c892"}
                    />
                    <Text style={styles.editText}>Chỉnh Sửa</Text>
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
                <Text style={styles.dataNumber}>{session.userInfo == null ? 100 : session.userInfo.user.friends.length}</Text>
                <Text>Bạn Bè</Text>
              </View>
              <View style={styles.dataSingleContainer}>
                <Text style={styles.dataNumber}>{game.trips}</Text>
                <Text>Chuyến Đi</Text>
              </View>
            </View>
            <View>
              <Text style={{ marginVertical: 10, fontSize: 18, fontWeight:"700" }}>Bài Viết</Text>
              <StarRailChar2 />              
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      {/* <Pressable onPress={confirmLogout} style={styles.logoutButton}>
        <Text style={{ fontSize: 20, lineHeight: 28 }}>Logout</Text>
      </Pressable> */}

      <MyProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            onPress={() => Alert.alert("Đổi mật khẩu")}
            style={styles.modalOptionContainer}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              style={{ transform: [{ translateX: -3 }] }}
            />
            <Text style={styles.modalText}>Quên mật khẩu?</Text>
          </Pressable>
          <Pressable
            onPress={confirmLogout}
            style={[styles.modalOptionContainer, { marginTop: 20 }]}
          >
            <Ionicons name="log-out-outline" size={20} />
            <Text style={styles.modalText}>Đăng xuất</Text>
          </Pressable>
        </View>
      </MyProfileModal>
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: "#fff",
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
  dataSingleContainer:{
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  dataNumber:{
    fontSize: 17,
    fontWeight: "bold",
  }
  
});
export default profile;

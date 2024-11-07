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
import { useAuth } from "@/app/AuthContext";
import { LinearGradient } from "expo-linear-gradient";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const { width } = Dimensions.get("window");
const IMG_HEIGHT = 200;

const game = {
  name: "Rakkoon",
  banner: require("@/assets/images/others/hsr25.webp"),
  avatar: require("@/assets/images/others/avatar.jpg"),
  description: "Honkai: Star Rail is a turn-based space fantasy RPG developed and published by HoYoverse for PC, PS5, and iOS/Android platforms. Come aboard with us on the Astral Express, TrailblazerssThis wiki is an English resource for information about the Global version of the game. There are unmarked spoilers on this wiki."
};

const profile = () => {
  const router = useRouter();
  const { session, logout } = useAuth();

  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);
  const scrollY = useSharedValue(0);

  // useEffect(() => {
  //     AsyncStorage.getItem("info").then((value) => {
  //         if (value) {
  //             const infoObject = JSON.parse(value);
  //             setUser(infoObject);
  //         }
  //     });
  // }, []);

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
    const color = interpolateColor(clampedScroll, [0, IMG_HEIGHT], ["#fff", "#000"]);
    return {
      color,
    };
  });

  
  const LogoutHandler = async () => {
    if (session.accessToken && session.refreshToken) {
      await logout!({
        refreshToken: session.refreshToken.trim(),
        accessToken: session.accessToken.trim(),
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

      {session?.name && <Text style={styles.name}>Hello, {session.name}</Text>}
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerShadowVisible: true,
          headerShown: true,
          headerLeft: () => {
            return (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    flex: 1,
                    marginLeft: 20,
                  }}
                >
                  <Animated.Image
                    source={game.avatar}
                    style={[
                      { width: 40, height: 40, borderRadius: 20 },
                      headerAvatarAnimatedStyle,
                    ]}
                  />
                  <Animated.Text
                    style={[
                      { color: "black", marginLeft: 10, fontSize: 20 },
                      headerAnimatedStyle,
                    ]}
                  >
                    {game.name}
                  </Animated.Text>
                </View>
              </>
            );
          },
          headerBackground: () => (
            <Animated.View style={[styles.header, headerAnimatedStyle]} />
          ),
          headerRight: () => {
            return (
              <Pressable onPress={() => Alert.alert("Options")} style={{marginRight: 20}}>
                <Animated.Text style={iconColorAnimatedStyle}>
                  <Ionicons name="settings-outline" size={20} />
                </Animated.Text>
              </Pressable>
            );
          }
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
        <View
          id="content"
          style={{
            flex: 1,
            backgroundColor: "white",
            borderTopRightRadius: 15,
            borderTopLeftRadius: 15,
            transform: [{ translateY: -50 }],
            paddingHorizontal: 5,
          }}
        >
          <View
            style={{
              marginHorizontal: 10,
              transform: [{ translateY: -40 }],
              flex: 1,
            }}
          >
            <Pressable
              onPress={() => Alert.alert("Avatar")}
              style={{ width: 90 }}
            >
              <Animated.View style={[avatarAnimatedStyle, {borderWidth: 10, borderColor: "#fff", width: 90, height: 90, borderRadius: 45,backgroundColor: "#fff", alignItems: "center", justifyContent: "center"}]}>
                <Image
                  source={game.avatar}
                  style={{ width: 80, height: 80, borderRadius: 40, }}
                />
              </Animated.View>
            </Pressable>

            <Text style={styles.text}>{game.name}</Text>
            <View>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
              <Text style={{ marginVertical: 10 }}>{game.description}</Text>
            </View>
          </View>
        </View>
      </Animated.ScrollView>
      {/* <Pressable onPress={confirmLogout} style={styles.logoutButton}>
        <Text style={{ fontSize: 20, lineHeight: 28 }}>Logout</Text>
      </Pressable> */}
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
    height: 100, // Adjust the height as needed
  },
  text: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 5,
    marginLeft: 10,
  },
  content:{
    marginTop: 20,
  },
  header: {
    backgroundColor: "white",
    height: 80,
  },
});

export default profile;

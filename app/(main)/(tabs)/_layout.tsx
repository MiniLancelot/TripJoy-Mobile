import { View, Text, StyleSheet, Pressable, Alert, Button } from "react-native";
import React, { useState, useRef, useMemo, useCallback } from "react";
import { Tabs, Link, useRouter } from "expo-router";
// import TabBar from "@/components/Others/TabBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome6 } from "@expo/vector-icons";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";

const CreateTabIcon = ({
  color,
  size,
  focused,
}: {
  color: string;
  size: number;
  focused: boolean;
}) => {
  return (
    <View style={styles.createIconContainer}>
      <Ionicons
        // name={focused ? "home" : "home-outline"}
        name={focused ? "add" : "add-outline"}
        size={size}
        color={color}
      />
    </View>
  );
};

const Layout = () => {
  const router = useRouter();
  const nullHrefScreens = [
    "(HomeTabs)/FriendScreen",
    "(HomeTabs)/NewsfeedScreen",
    "(HomeTabs)/PersonalScreen",
    "(HomeTabs)/(FriendTabs)/FriendList",
    "(HomeTabs)/(FriendTabs)/FriendInvitation",
    // "(NotificationTabs)/PlanInvitationScreen",
    // "(NotificationTabs)/PlanJoinRequestScreen",
    // "(HomeTabs)/(FriendTabs)/[id]",
    // "(HomeTabs)/(FriendTabs)/TripInvitationResponse",
    // "(CreateTabs)",
  ];

  //   const snapPoints = useMemo(() => ["25%", "50%"], []);
  const snapPoints = useMemo(() => ["25%", "50%"], []);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  // const handleExpandModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.snapToIndex(0);
  // }, []);
  const handleOpen = () => bottomSheetRef.current?.expand();

  // const handlePresentModalPress = useCallback(() => {
  //   bottomSheetModalRef.current?.present();
  // }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <Tabs
              screenOptions={{
                headerTitleAlign: "center",
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: "#13c892",
                tabBarInactiveTintColor: "#737373",
                tabBarStyle: {
                  paddingBottom: 2,
                  height: 60,
                  shadowColor: "blue",
                },
              }}
              // tabBar={(props) => <TabBar {...props} />}
            >
              <Tabs.Screen
                name="home"
                options={{
                  title: "Home",
                  tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                      name={focused ? "home" : "home-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="trip"
                options={{
                  title: "Trip",
                  tabBarIcon: ({ color, size, focused }) => (
                    // <FontAwesome6 name="route" size={size} color={color}/>
                    <Ionicons
                      name={focused ? "navigate" : "navigate-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />
              <Tabs.Screen
                name="create"
                options={{
                  title: "Create Trip",
                  tabBarActiveTintColor: "grey",
                  tabBarIcon: ({ color, size, focused }) => (
                    // <FontAwesome6 name="route" size={size} color={color}/>
                    <CreateTabIcon
                      color={color}
                      size={size}
                      focused={focused}
                    />
                  ),
                  tabBarButton: (props) => (
                    <Pressable {...props} onPress={handleOpen} />
                  ),
                }}
              />
              <Tabs.Screen
                name="notification"
                options={{
                  title: "Notification",
                  tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                      name={focused ? "mail" : "mail-outline"}
                      size={size}
                      color={color}
                    />
                    // <FontAwesome name="dollar" size={24} color={greyColor} {...props} />
                  ),
                }}
              />
              <Tabs.Screen
                name="profile"
                options={{
                  title: "",
                  tabBarIcon: ({ color, size, focused }) => (
                    <Ionicons
                      name={focused ? "person" : "person-outline"}
                      size={size}
                      color={color}
                    />
                  ),
                }}
              />

              {nullHrefScreens.map((name) => (
                <Tabs.Screen key={name} name={name} options={{ href: null }} />
              ))}
            </Tabs>

            {/* <BottomSheetModal
              ref={bottomSheetModalRef}
              onChange={handleSheetChanges}
              // snapPoints={snapPoints}
              snapPoints={["25%"]}
              index={0}
              enablePanDownToClose={true}
              enableOverDrag={false}
              enableContentPanningGesture={false} // Restrict content pannin
              backdropComponent={renderBackDrop}
              // backgroundStyle={{ backgroundColor: "rgba(0,0,0,0.5)" }}
              backgroundStyle={{ backgroundColor: "#fff" }}
            >
              <BottomSheetView style={[styles.contentContainer]}>
                <Text>Awesome 🎉</Text>
              </BottomSheetView>
            </BottomSheetModal> */}

            <BottomSheet
              ref={bottomSheetRef}
              onChange={handleSheetChanges}
              snapPoints={["30%"]}
              index={-1}
              backdropComponent={renderBackDrop}
              enablePanDownToClose={true}
            >
              <BottomSheetView style={styles.contentContainer}>
                <Text style={{ fontSize: 20, fontWeight: "500" }}>
                  Tạo chuyến đi của bạn 🎉
                </Text>
                {/* <View style={{ flexDirection: "row", gap: 35, marginTop: 35 }}>
                  <Pressable onPress={() => router.push("/Trip1")}>
                    <Text>Tạo chuyến đi thủ công</Text>
                  </Pressable>
                  <Pressable onPress={() => router.push("/Trip2")}>
                    <Text>Tạo chuyến đi bằng AI</Text>
                  </Pressable>
                </View> */}
                <View style={{ flexDirection: "row", gap: 35, marginTop: 35 }}>
                  <View style={styles.buttonOuterContainer}>
                    <Pressable
                      onPress={() => router.push("/Trip3")}
                      style={{
                        alignItems: "center",
                        padding: 30,
                        backgroundColor: "#fff5e1",
                        borderRadius: 100,
                      }}
                    >
                      <FontAwesome6
                        name="map-location-dot"
                        size={35}
                        color="#fbb05a"
                      />
                    </Pressable>
                    <Text style={styles.buttonUnderText}>
                      Tạo chuyến đi thủ công
                    </Text>
                  </View>

                  {/* <Pressable onPress={() => router.push("/CreatePost")}>
                    <Text style={styles.buttonUnderText}>Tạo bài đăng</Text>
                  </Pressable> */}
                  <View style={styles.buttonOuterContainer}>
                    <Pressable
                      onPress={() => router.push("/(create-ai-plan)/AiStep1")}
                      style={{
                        alignItems: "center",
                        padding: 30,
                        backgroundColor: "#def9ee",
                        borderRadius: 100,
                      }}
                    >
                      <FontAwesome6 name="android" size={35} color="#34d9b8" />
                    </Pressable>
                    <Text style={styles.buttonUnderText}>
                      Tạo chuyến đi bằng AI
                    </Text>
                  </View>
                  <View style={styles.buttonOuterContainer}>
                    <Pressable
                      onPress={() => router.push("/CreatePost")}
                      style={{
                        alignItems: "center",
                        padding: 30,
                        backgroundColor: "#e0f3ff",
                        borderRadius: 100,
                      }}
                    >
                      <FontAwesome6
                        name="pen-to-square"
                        size={35}
                        color="#55d4ff"
                      />
                    </Pressable>
                    <Text style={styles.buttonUnderText}>Tạo bài đăng</Text>
                  </View>

                  {/* <Pressable
                    onPress={() => router.push("/(create-ai-plan)/AiStep1")}
                  >
                    <Text style={styles.buttonUnderText}>
                      Tạo chuyến đi bằng AI
                    </Text>
                  </Pressable> */}
                </View>
              </BottomSheetView>
            </BottomSheet>
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  createIconContainer: {
    backgroundColor: "#dad9d9",
    padding: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  buttonUnderText: {
    maxWidth: 100,
    lineHeight: 20,
    textAlign: "center",
  },
  buttonOuterContainer: {
    flexDirection: "column",
    gap: 5,
  },
});

export default Layout;

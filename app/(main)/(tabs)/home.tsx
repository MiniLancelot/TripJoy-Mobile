import React from "react";
import { Text, View } from "react-native";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

import FriendScreen from "@/app/(main)/(tabs)/(HomeTabs)/FriendScreen";
import NewsfeedScreen from "@/app/(main)/(tabs)/(HomeTabs)/NewsfeedScreen";
import PersonalScreen from "@/app/(main)/(tabs)/(HomeTabs)/PersonalScreen";
import Ionicons from "@expo/vector-icons/Ionicons";

const MaterialTopTabs = createMaterialTopTabNavigator();

const Home = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <Text>Hello</Text>
      <MaterialTopTabs.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 10, color: "black" },
          tabBarStyle: {
            backgroundColor: "white",
            marginHorizontal: 20,
            borderRadius: 10,
            overflow: "hidden",
          },
          tabBarItemStyle: {
            marginHorizontal: 30,
            padding: 0,
          },

          tabBarPressColor: "transparent",
          lazy: true,
        }}
      >
        <MaterialTopTabs.Screen
          name="Mạng xã hội"
          component={NewsfeedScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#17a1fa", height: 3 },
            tabBarLabel: ({ color, focused }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="newspaper-outline"
                    color={focused ? "#17a1fa" : color}
                    size={20}
                  />
                  <Text style={{ color, textTransform: "none", marginLeft: 5 }}>
                    Tripfeed
                  </Text>
                </View>
              ),
          }}
        />
        <MaterialTopTabs.Screen
          name="Bạn bè"
          component={FriendScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#ff8170", height: 3 },
            tabBarLabel: ({ color, focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="people-outline"
                  color={focused ? "#ff8170" : color}
                  size={20}
                />
                <Text style={{ color, textTransform: "none", marginLeft: 5 }}>
                  Bạn bè
                </Text>
              </View>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="Trang cá nhân"
          component={PersonalScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#46e8a5", height: 3 },
            tabBarLabel: ({ color, focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="person-circle-outline"
                  color={focused ? "#46e8a5" : color}
                  size={20}
                />
                <Text style={{ color, textTransform: "none", marginLeft: 5 }}>
                  Cá Nhân
                </Text>
              </View>
            ),
          }}
        />
      </MaterialTopTabs.Navigator>
    </View>
  );
};

export default Home;

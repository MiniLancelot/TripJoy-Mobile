import React from "react";
import { SafeAreaView, Text, View } from "react-native";
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
    <View style={{ flex: 1, backgroundColor: "white", paddingTop:25}}>
      {/* <Text>Search Bar Coming Soon</Text> */}
      <MaterialTopTabs.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 10, color: "black", fontWeight: "bold", textTransform: "capitalize" },
          tabBarStyle: {
            backgroundColor: "white",
            // marginHorizontal: 20,
            // borderRadius: 10,
            overflow: "hidden",
          },
          tabBarItemStyle: {
            marginHorizontal: 30,
            padding: 0,
          },
          tabBarIndicatorStyle: { width: '20%' },

          tabBarPressColor: "transparent",
          lazy: true,
        }}
      >
        <MaterialTopTabs.Screen
          name="Tripfeed"
          component={NewsfeedScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#17a1fa", height: 3},
            tabBarLabel: ({ color, focused }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons
                    name="newspaper-outline"
                    color={focused ? "#17a1fa" : color}
                    size={20}
                  />
                  <Text style={{ color,  marginLeft: 5, fontWeight: "600" }}>
                    Tripfeed
                  </Text>
                </View>
              ),
          }}
        />
        <MaterialTopTabs.Screen
          name="Friends"
          component={FriendScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#ff8170", height: 3},
            tabBarLabel: ({ color, focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons
                  name="people-outline"
                  color={focused ? "#ff8170" : color}
                  size={20}
                />
                <Text style={{ color,  marginLeft: 5, fontWeight: "600" }}>
                  Bạn bè
                </Text>
              </View>
            ),
          }}
        />
        {/* <MaterialTopTabs.Screen
          name="Profile"
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
                <Text style={{ color, marginLeft: 5, fontWeight: "600" }}>
                  Cá Nhân
                </Text>
              </View>
            ),
          }}
        /> */}
      </MaterialTopTabs.Navigator>
    </View>
  );
};

export default Home;
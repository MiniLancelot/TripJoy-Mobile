import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ColorList from "@/components/Others/ColorList";
import PlanInvitation from "../(ids)/members/InvitationResponses";
import Ionicons from "@expo/vector-icons/Ionicons";


import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import PlanInvitationScreen from "./(NotificationTabs)/PlanInvitationScreen";
import PlanJoinRequestScreen from "./(NotificationTabs)/PlanJoinRequestScreen";

const MaterialTopTabs = createMaterialTopTabNavigator();

const Notification = () => {
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
          component={PlanInvitationScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#17a1fa", height: 3},
            tabBarLabel: ({ color, focused }) => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {/* <Ionicons
                    name="newspaper-outline"
                    color={focused ? "#17a1fa" : color}
                    size={20}
                  /> */}
                  <Text style={{ color,  marginLeft: 5, fontWeight: "600" }}>
                    Lời mời tham dự trip
                  </Text>
                </View>
              ),
          }}
        />
        <MaterialTopTabs.Screen
          name="Friends"
          component={PlanJoinRequestScreen}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#ff8170", height: 3},
            tabBarLabel: ({ color, focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Ionicons
                  name="people-outline"
                  color={focused ? "#ff8170" : color}
                  size={20}
                /> */}
                <Text style={{ color,  marginLeft: 5, fontWeight: "600" }}>
                  Yêu cầu tham gia
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 25,
  },
});

export default Notification;

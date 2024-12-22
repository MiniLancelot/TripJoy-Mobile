import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

const _layout = () => {
  const nullHrefScreens = ["trip/updatePlanLocation"];
  return (
    <Tabs
      screenOptions={{
        headerTitleAlign: "center",
        headerShown: false,
        tabBarActiveTintColor: "#13c892",
        tabBarInactiveTintColor: "#737373",
        tabBarStyle: {
          paddingBottom: 2,
          height: 60,
          shadowColor: "blue",
        },
      }}
    >
      <Tabs.Screen
        name="[id]"
        options={{
          title: "Bản đồ",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "map" : "map-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="planLocations"
        options={{
          title: "Lộ trình",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "analytics" : "analytics-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="trip-budget"
        options={{
          title: "Chi tiêu",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "cash" : "cash-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="members"
        options={{
          title: "Thành viên",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="update-plan"
        options={{
          title: "Cập nhật",
          headerShown: true,
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;

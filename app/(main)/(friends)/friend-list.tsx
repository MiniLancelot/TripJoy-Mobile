import { View, Text } from "react-native";
import React from "react";

import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";
import FriendInvitation from "@/app/(main)/(tabs)/(HomeTabs)/(FriendTabs)/FriendInvitation";
import FriendList from "@/app/(main)/(tabs)/(HomeTabs)/(FriendTabs)/FriendList";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const MaterialTopTabs = createMaterialTopTabNavigator();

const friendList = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <Text>FriendScreen</Text> */}
      <MaterialTopTabs.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 10, color: "black" },
          tabBarStyle: {
            backgroundColor: "white",
            // marginHorizontal: 20,
            // marginTop: 20,
            // borderRadius: 10,
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
          name="FriendListScreen"
          component={FriendList}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#17a1fa", height: 3 },
            tabBarLabel: ({ color, focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Ionicons
                    name="newspaper-outline"
                    color={focused ? "#17a1fa" : color}
                    size={20}
                  /> */}
                <Text style={{ color, textTransform: "none", marginLeft: 5 }}>
                  Danh sách bạn bè
                </Text>
              </View>
            ),
          }}
        />
        <MaterialTopTabs.Screen
          name="FriendInvitationScreen"
          component={FriendInvitation}
          options={{
            tabBarIndicatorStyle: { backgroundColor: "#ff8170", height: 3 },
            tabBarLabel: ({ color, focused }) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* <Ionicons
                  name="people-outline"
                  color={focused ? "#ff8170" : color}
                  size={20}
                /> */}
                <Text style={{ color, textTransform: "none", marginLeft: 5 }}>
                  Lời mời kết bạn
                </Text>
              </View>
            ),
          }}
        />
      </MaterialTopTabs.Navigator>
    </GestureHandlerRootView>
  );
};

export default friendList;

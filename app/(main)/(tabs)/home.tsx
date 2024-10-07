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

const MaterialTopTabs = createMaterialTopTabNavigator();

const Home = () => {
    return (
        <View style={{flex: 1, backgroundColor:'white'}}>
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
                }}
            >
                <MaterialTopTabs.Screen
                    name="Mạng xã hội"
                    component={NewsfeedScreen}
                    options={{
                        tabBarIndicatorStyle: { backgroundColor: "#17a1fa", height: 3 },
                        tabBarLabel: ({ color }) => (
                            <Text style={{ color, textTransform: 'none' }}>Tripsfeed</Text>
                        ),
                    }}
                />
                <MaterialTopTabs.Screen
                    name="Bạn bè"
                    component={FriendScreen}
                    options={{
                        tabBarIndicatorStyle: { backgroundColor: "#ff8170", height: 3 },
                        tabBarLabel: ({ color }) => (
                            <Text style={{ color, textTransform: 'none' }}>Bạn bè</Text>
                        ),
                    }}
                />
                <MaterialTopTabs.Screen
                    name="Trang cá nhân"
                    component={PersonalScreen}
                    options={{
                        tabBarIndicatorStyle: { backgroundColor: "#46e8a5", height: 3 },
                        tabBarLabel: ({ color }) => (
                            <Text style={{ color, textTransform: 'none' }}>Cá nhân</Text>
                        ),
                    }}
                />
            </MaterialTopTabs.Navigator>
        </View>
    );
};

export default Home;

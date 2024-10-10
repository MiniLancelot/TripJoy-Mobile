import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import TabBar from "@/components/Others/TabBar";
import "@/global.css";

const Layout = () => {
    return (
        <Tabs
            screenOptions={{ headerTitleAlign: "center", headerShown: false,  }}
            tabBar={(props) => <TabBar {...props} />}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="trip"
                options={{
                    title: "Trip",
                }}
            />
            <Tabs.Screen
                name="budget"
                options={{
                    title: "Budget",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />
        </Tabs>
    );
};

export default Layout;

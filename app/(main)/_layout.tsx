import {
    View,
    Text,
    Image,
    Pressable,
    ToastAndroid,
    Alert,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/app/AuthContext";

const _layout = () => {
    const tempAvatar = require("@/assets/images/others/avatar.jpg");
    // const { session } = useAuth();
    // if (session === null) {
    //     return (
    //         <Stack
    //             screenOptions={{
    //                 headerShown: false,
    //             }}
    //         >
    //             <Stack.Screen name="login" />
    //             <Stack.Screen name="register" />
    //             <Stack.Screen name="forgot-password" />
    //         </Stack>
    //     );

    // }
    return (
        <Stack
            screenOptions={{
                headerTitleAlign: "center",
                headerStyle: { backgroundColor: "#defff6" },
                headerShadowVisible: false,
            }}
        >
            <Stack.Screen
                name="(tabs)"
                options={{
                    headerLeft: () => (
                        <>
                            <Text className="font-[LeckerliOne] text-[#13c892] text-[30px]">
                                Trip
                                <Text className="text-[#ff7224]">Joy</Text>
                            </Text>
                        </>
                    ),

                    headerRight: () => (
                        <>
                            <Pressable
                                onPress={() => {
                                    Alert.alert("Notification", "Clicked");
                                }}
                            >
                                <Ionicons
                                    name="notifications-outline"
                                    size={24}
                                    color="#737373"
                                    className="mr-[20px]"
                                />
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    Alert.alert("Messages", "Clicked");
                                }}
                            >
                                <Ionicons
                                    name="mail"
                                    size={24}
                                    color="#737373"
                                    className="mr-[20px]"
                                />
                            </Pressable>
                            <Image
                                source={tempAvatar}
                                className="w-[30px] h-[30px] rounded-2xl"
                                resizeMode="cover"
                            />
                        </>
                    ),

                    headerTitle: "",
                }}
            />

            <Stack.Screen name="details" options={{headerTitle: "Details"}} />
        </Stack>
    );
};

export default _layout;

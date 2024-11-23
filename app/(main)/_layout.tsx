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
import { useAuth } from "@/app/(auth)/AuthContext";
import "@/global.css";
import { SafeAreaView } from 'react-native-safe-area-context';

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
                headerStyle: { backgroundColor: "#fff" },
                headerShadowVisible: false,
                // headerShown: false,
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
                                    style={{ marginRight: 20 }} 
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
                                    style={{ marginRight: 20 }} 
                                />
                            </Pressable>
                            <Image
                                source={tempAvatar}
                                // className="w-[0.5rem] h-[0.5rem] rounded-2xl"
                                resizeMode="cover"
                                style={{ width: 30, height: 30 , borderRadius: 15}}
                            />
                        </>
                    ),

                    headerTitle: "",
                    headerShown: false,
                }}
            />

            <Stack.Screen name="details" options={{headerTitle: "Details"}} />
            <Stack.Screen name="(ids)" options={{headerShown: false}} />
            <Stack.Screen name="(create)" options={{headerShown: false}} />
            <Stack.Screen name="(search)" options={{headerShown: false}} />
            <Stack.Screen name="(friends)" options={{headerTitle: "Bạn Bè"}} />
            
        </Stack>
    );
};

export default _layout;

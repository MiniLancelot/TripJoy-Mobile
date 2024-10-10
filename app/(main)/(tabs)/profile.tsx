import { View, Text, Pressable, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import ColorList from "@/components/Others/ColorList";
// import { user_logout } from '@/utils/user_api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/app/AuthContext";

import "@/global.css";

const profile = () => {
    const router = useRouter();
    const { session, logout } = useAuth();

    // useEffect(() => {
    //     AsyncStorage.getItem("info").then((value) => {
    //         if (value) {
    //             const infoObject = JSON.parse(value);
    //             setUser(infoObject);
    //         }
    //     });
    // }, []);

    const LogoutHandler = async () => {
        if (session.accessToken && session.refreshToken) {
            await logout!({
                refreshToken: session.refreshToken.trim(),
                accessToken: session.accessToken.trim(),
            });
            router.replace("/login");
        }
    };

    const confirmLogout = () => {
        Alert.alert(
            "Xác nhận đăng xuất",
            "Bạn có muốn đăng xuất không?",
            [
                {
                    text: "Huỷ",
                    style: "cancel",
                },
                {
                    text: "Đăng xuất",
                    onPress: LogoutHandler,
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View
            className="flex-1 items-center justify-center bg-[#fff]"
        >
            <Text className="pt-[50px] text-5xl">Goodbye</Text>
            {/* <Link href={'/(main)/details'}>Details</Link> */}
            <Pressable onPress={confirmLogout} className="mt-[100px]">
                <Text>Logout</Text>
            </Pressable>
        </View>
    );
};

export default profile;

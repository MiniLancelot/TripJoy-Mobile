import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { user_logout } from "@/utils/user_api";
// import { jwtDecode } from "jwt-decode";

const home = () => {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        AsyncStorage.getItem("info").then((value) => {
            if (value) {
                const infoObject = JSON.parse(value);
                setUser(infoObject);
            }
        });
    }, []);

    const LogoutHandler = () => {
        
        user_logout(
            {
                refreshToken: user.refreshToken.trim(),
            },
            {
                Authorization: `Bearer ${user.accessToken.trim()}`,
            }
        )
            .then((res) => {
                console.info(res.data);
                AsyncStorage.clear();
                router.replace("/login");
            })
            .catch((err) => {
                console.info(err.message);
                console.error("Response Data:", err.response.data);
                console.error("Response Status:", err.response.status);
                console.error("Response Headers:", err.response.headers);
                AsyncStorage.clear();
                router.replace("/login");
            });
    };

    return (
        <View className="flex-1 items-center justify-center">
            <Text className="pt-[50px] text-5xl">Hello</Text>
            <Pressable onPress={LogoutHandler} className="mt-[100px]">
                <Text>Logout</Text>
            </Pressable>
        </View>
    );
};

export default home;

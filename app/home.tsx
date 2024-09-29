import { View, Text, Pressable } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
// import { jwtDecode } from "jwt-decode";

const home = () => {
    const [user, setUser] = useState<string | null>("");
    const router = useRouter();

    // useEffect(() => {
    //     AsyncStorage.getItem("info").then((value) => {
    //         if (value) {
    //             const infoObject : any = JSON.parse(value);
    //             setUser(infoObject.refreshToken);
    //             const decodedToken = jwtDecode(infoObject.accessToken);
    //             console.log(decodedToken);
    //         }
    //     });
    // }, []);

    const LogoutHandler = () => {
        AsyncStorage.clear();
        router.replace("/login");
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
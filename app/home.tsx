import { View, Text, Pressable } from "react-native";
import {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const home = () => {
    const [user, setUser] = useState<string | null>("");
    const router = useRouter();
    useEffect(() => {
        AsyncStorage.getItem("AccessToken").then((stringtifiedValue) => {
            return JSON.parse(stringtifiedValue!);
        }).then((value) => {
            setUser(value.user.name);
        });
    }, []);

    const  LogoutHandler = () => {
        AsyncStorage.clear();
        router.replace("/login");

    }
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="pt-[50px] text-5xl text-">Hello</Text>
            <Pressable onPress={LogoutHandler} className="mt-[100px]">
                <Text>Logout</Text>
            </Pressable>
        </View>
    );
};

export default home;

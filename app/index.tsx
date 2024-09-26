import { ActivityIndicator, View, Text } from "react-native";
import "@/global.css";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();
const Index = () => {
    const router = useRouter();
    const [loaded] = useFonts({
        LeckerliOne: require("@/assets/fonts/LeckerliOne-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
            SplashScreen.preventAutoHideAsync();
            handleToken();
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    const handleToken = async () => {
        const dataToken = await AsyncStorage.getItem("AccessToken");
        if (dataToken) {
            router.replace("/home");
        } else {
            router.replace("/login");
        }
    }
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#CECCCC" />
        </View>
    );
};

export default Index;
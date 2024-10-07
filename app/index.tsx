import { ActivityIndicator, View, Text } from "react-native";
import "@/global.css";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { useAuth } from "@/app/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

SplashScreen.preventAutoHideAsync();
const Index = () => {
    const router = useRouter();
    const { session } = useAuth();
    const [loaded] = useFonts({
        LeckerliOne: require("@/assets/fonts/LeckerliOne-Regular.ttf"),
    });

    useEffect(() => {
        const loading = async () => {
            if (loaded) {
                SplashScreen.preventAutoHideAsync();
                await handleToken();
                SplashScreen.hideAsync();
            }
        }
        loading();
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    const handleToken = async () => {
        if (session) {
            router.replace("/home");
        } else {
            router.replace("/onboarding");
        }
    }
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#CECCCC" />
        </View>
    );
};

export default Index;
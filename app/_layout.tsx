import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider } from "@/app/AuthContext";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    return (
        <AuthProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                }}
            ></Stack>
        </AuthProvider>
    );
};

export default RootLayout;

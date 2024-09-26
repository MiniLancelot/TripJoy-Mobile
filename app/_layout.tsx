import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        ></Stack>
    );
};

export default RootLayout;

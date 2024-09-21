import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const router = useRouter();
    const [loaded] = useFonts({
        LeckerliOne: require("@/assets/fonts/LeckerliOne-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded) {
          SplashScreen.preventAutoHideAsync();
          router.replace("/onboarding");
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        ></Stack>
    );
};

export default RootLayout;

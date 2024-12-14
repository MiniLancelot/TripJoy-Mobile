import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import get_health from "@/services/user/health";
import refreshingToken from "@/services/identity/refresh";

SplashScreen.preventAutoHideAsync();
const Index = () => {
  const router = useRouter();
  const { session } = useAuth();
  const [currentToken, setCurrentToken] = useState<any>(null);
  const [loaded] = useFonts({
    LeckerliOne: require("@/assets/fonts/LeckerliOne-Regular.ttf"),
  });

  useEffect(() => {
    const loading = async () => {
      if (loaded) {
        SplashScreen.preventAutoHideAsync();
        await getHealthStatus();
        await handleToken();
        SplashScreen.hideAsync();
      }
    };
    loading();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const getHealthStatus = async () => {
    if (session.userToken !== null) {
      const health = await get_health(session.userToken.accessToken);
      if (health) {
        console.log("Health: ",health.data.status);
      } else {
        try {
          const result = await refreshingToken({
            refreshToken: session.userToken.refreshToken,
          });
          if (result) {
            console.log("RefeshToken result: ",result);
            setCurrentToken({
                accessToken: result.data.accessToken,
                refreshToken: result.data.refreshToken,
            })
            AsyncStorage.clear();
            AsyncStorage.setItem(
                "user",
                JSON.stringify({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                })
            );
          }
        } catch {
          console.log("error refreshing token");
        }
      }
    }
  };

  const handleToken = async () => {
    if (session.userInfo && session.userToken) {
    //   console.log("Có userToken: ", session.userToken.accessToken);
      console.log("Có userInfo: ", session.userInfo.user.profile.userName);
      console.log("Có userToken: ", session.userToken.accessToken);
      router.replace("/home");
    } else {
      console.log("No userToken: ", session.userToken);
      console.log("No userInfo: ", session.userInfo);
      router.replace("/login");
    }
  };
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#CECCCC" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Index;
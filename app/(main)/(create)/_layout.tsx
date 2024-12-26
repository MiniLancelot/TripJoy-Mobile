import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import { useFormStore } from "@/utils/useFormStore";
import { Ionicons } from "@expo/vector-icons";

const Layout = () => {
  const { resetForm } = useFormStore();

  return (
    <Stack
      screenOptions={{
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerLargeTitle: true,
        headerShown: true,
      }}
    >
      <Stack.Screen name="Trip1" />
      <Stack.Screen name="Trip2" />
      <Stack.Screen name="Trip3" options={{ headerShown: true }} />
      <Stack.Screen
        name="(create-ai-plan)"
        options={{
          headerShown: true,
          title: "Tạo chuyến đi AI",
          headerStyle: {
            backgroundColor: "#defff6",
            
          },
          headerLeft: () => {
            return (
              <>
                <View style={styles.backBtnWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      resetForm();
                      console.log;
                      router.replace("/home")
                    }}
                  >
                    <Text>
                      <Ionicons
                        name="arrow-back-outline"
                        size={25}
                        color={"#000"}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          },
        }}
      />
    </Stack>
  );
};
const styles = StyleSheet.create({
  backBtnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 0,
  },
});
export default Layout;

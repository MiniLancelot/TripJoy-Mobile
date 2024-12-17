import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TripBudget = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <Pressable
                style={styles.settingButton}
                onPress={() => {
                  router.push("update-plan");
                }}
              >
                <Text>
                  <Ionicons name="settings-outline" size={20} />
                </Text>
              </Pressable>
            );
          },
        }}
      />
      <Text>trip-budget</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  settingButton: {
    marginRight: 20,
  },
});

export default TripBudget;

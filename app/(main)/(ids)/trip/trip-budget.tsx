import { View, Text, Pressable, StyleSheet } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { BarChart, LineChart, PieChart, PopulationPyramid } from "react-native-gifted-charts";


const TripBudget = () => {
  const data = [
    {value: 54, color: '#177AD5'},
    {value: 40, color: '#79D2DE'},
    {value: 20, color: '#ED6665', shiftX: 28, shiftY: -18}
];
  return (
    <View style={{ flex: 1, }}>
      <Stack.Screen
        options={{
          headerRight: () => {
            return (
              <Pressable
                style={styles.settingButton}
                onPress={() => {
                  router.push("/(update)/update-plan");
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
      <PieChart
    data={data}
    showText
    textColor="black"
    radius={150}
    textSize={20}
    focusOnPress
    showValuesAsLabels
    showTextBackground
    textBackgroundRadius={26}
  />
    </View>
  );
};

const styles = StyleSheet.create({
  settingButton: {
    marginRight: 20,
  },
});

export default TripBudget;

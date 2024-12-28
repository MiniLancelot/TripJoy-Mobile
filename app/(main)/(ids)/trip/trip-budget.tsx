import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ProgressChart } from "react-native-chart-kit";
import ExpenseMembers from "@/components/Expenses/ExpenseMembers";
import ExpenseLocations from "@/components/Expenses/ExpenseLocation";
import SeparateLine from "@/components/Others/SeparateLine";

const TripBudget = () => {
  const chartData = {
    labels: ["Đã chi"], // optional
    data: [0.8],
  };

  return (
    <View style={{ flex: 1 }}>
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
      <Text style={styles.title}>Trip Budget</Text>
      <View>
        <ProgressChart
          data={chartData}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          strokeWidth={16}
          radius={80}
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
          hideLegend={true} // Hide default legend
        />
        
      </View>
      
      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        <Text style={styles.legendText}>Đã chi</Text>
        <Text style={styles.legendText}>Legend value: 80%</Text>
      </View>
      <ExpenseLocations />
      <SeparateLine text=""/>
      <ExpenseMembers />
    </View>
  );
};

const styles = StyleSheet.create({
  settingButton: {
    marginRight: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  legendText: {
    fontSize: 18, // Set the font size here
    marginHorizontal: 10,
    color: "black",
  },
});

export default TripBudget;

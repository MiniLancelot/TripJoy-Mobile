import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ColorList from "@/components/Others/ColorList";
import PlanInvitation from "../(ids)/members/PlanInvitation";
import Ionicons from "@expo/vector-icons/Ionicons";


import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";

const MaterialTopTabs = createMaterialTopTabNavigator();

const Notification = () => {
  return (
    <View style={styles.container}>
      {/* <ColorList color="#787169" /> */}
      <PlanInvitation/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: 25,
  },
});
export default Notification;

import { View, Text, StyleSheet } from "react-native";
import React from "react";
import ColorList from "@/components/Others/ColorList";
import PlanInvitation from "../(ids)/members/InvitationResponses";

const budget = () => {

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

export default budget;

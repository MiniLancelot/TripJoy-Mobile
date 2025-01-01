import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

interface PlanInvitation {
  planId: string;
  inviterId: string;
  title: string;
  startDate: string;
  endDate: string;
  inviterName: string;
  inviterAvatar: string;
  _onClick: any;
}

const InvitationResponse = ({
  planId,
  inviterId,
  title,
  startDate,
  endDate,
  inviterName,
  inviterAvatar,
  _onClick,
}: PlanInvitation) => {
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const avatarUri = inviterAvatar == null ? tempAvatar : inviterAvatar;

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.itemContainer}
        onPress={() => router.push(`/user/${inviterId}`)}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.invitationText}>
            <Text style={{ fontWeight: "500" }}>{inviterName}</Text> đã mời bạn
            tham gia
          </Text>
          <Text style={{ fontWeight: "500" }}>{title}</Text>
          <Text style={styles.dateText}>
            {startDate.split("-").reverse().join("-")} - {endDate.split("-")
                                  .reverse()
                                  .join("-")}
          </Text>
        </View>
      </Pressable>
      <View style={styles.invitationContainer}>
        <Pressable
          onPress={() => _onClick(planId, true)}
          style={styles.actionButton}
        >
          <Ionicons name="checkmark-outline" size={20} color={"#13c892"} />
        </Pressable>
        <Pressable
          onPress={() => _onClick(planId, false)}
          style={styles.actionButton}
        >
          <Ionicons name="close-outline" size={20} color={"#13c892"} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: "#fff", // Optional: Set a background color
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: {
    flex: 1,
  },
  invitationText: {
    fontSize: 14,
    color: "#000",
    flexWrap: "wrap",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginTop: 5,
  },
  invitationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  actionButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#bfbfbf",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default InvitationResponse;

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

const InvitationResponse = ({ planId, inviterId, title, startDate, endDate, inviterName, inviterAvatar, _onClick }: PlanInvitation) => {
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
        <View>
          <Text>{inviterName} muốn mời bạn vào {title}</Text>
          <Text>{startDate} đến {endDate}</Text>
        </View>
      </Pressable>
      <View style={styles.invitationContainer}>
        <View style={styles.invitationOuterEditContainer}>
          <View style={styles.editContainer}>
            <Pressable
              onPress={() => _onClick(planId, true)}
              style={styles.innerEditContainer}
            >
              {/* <Ionicons
                                name="person-add-outline"
                                size={15}
                                color={"#13c892"}
                              /> */}
              {/* <Text style={styles.editText}>Xác nhận</Text> */}
              <Ionicons name="checkmark-outline" size={20}  color={"#13c892"}/>
            </Pressable>
          </View>
        </View>
        <View style={styles.invitationOuterEditContainer}>
          <View style={styles.editContainer}>
            <Pressable
              onPress={() => _onClick(planId, false)}
              style={styles.innerEditContainer}
            >
              {/* <Ionicons
                                name="person-add-outline"
                                size={15}
                                color={"#13c892"}
                              /> */}
              {/* <Text style={styles.editText}>Từ chối</Text> */}
              <Ionicons name="close-outline" size={20}  color={"#13c892"}/>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 10,
    // marginTop: 10,
    marginHorizontal: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 100,
    marginTop: 10,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // borderWidth: 1,
    // borderColor: "black",
  },
  outerEditContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
    flex: 1,
    marginRight: 30,
    // marginTop: -15,
  },
  editContainer: {
    borderRadius: 30,
    borderColor: "#bfbfbf",
    borderWidth: 1,
  },
  innerEditContainer: {
    flexDirection: "row",
    gap: 7,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  editText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#bfbfbf",
  },

  invitationOuterEditContainer: {
    // alignItems: "flex-end",
    // justifyContent: "center",
    // flex: 1,
    marginRight: 15,
    // marginTop: 50,
  },
  invitationContainer: {
    flexDirection: "row",
    marginLeft: -40,
  },
});

export default InvitationResponse;
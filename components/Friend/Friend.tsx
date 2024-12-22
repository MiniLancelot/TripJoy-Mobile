import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
interface FriendProps {
  id: string;
  name: string;
  avatar: string;
  _status: boolean;
  _onClick: any;
  _onOpenChat: any;
}

const Friend = ({
  id,
  name,
  _onClick,
  avatar,
  _status,
  _onOpenChat,
}: FriendProps) => {
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const avatarUri = avatar == null ? tempAvatar : avatar;
  const [currentAvatar, setCurrentAvatar] = useState(avatar || tempAvatar);
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.itemContainer}
        onPress={() => router.push(`/user/${id}`)}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} onError={() => {
                      console.log("Error loading image");
                      setCurrentAvatar(tempAvatar);
                    }} />
        </View>
        <View>
          <Text>{name}</Text>
        </View>
        {/* {_status ? <Text>Online</Text> : <Text>Offline</Text>} */}
        <View
          style={_status ? styles.onlineStatus : styles.offlineStatus}
        ></View>
      </Pressable>
      {/* <Pressable onPress={() => _onClick(id)} style={{}}>
        <Text>Bạn bè</Text>
      </Pressable> */}
      {/* <View style={styles.outerEditContainer}>
        <View style={styles.editContainer}>
          <Pressable
            onPress={() => _onOpenChat(id)}
            style={styles.innerEditContainer}
          >
            <Text style={styles.editText}>Nhắn tin</Text>
          </Pressable>
        </View>
      </View> */}
      <View style={[styles.outerEditContainer, { flexDirection: "row" }]}>
        <View>
          <Pressable
            onPress={() => _onOpenChat(id)}
            style={[
              styles.innerEditContainer,
              { transform: [{ translateY: 5 }] },
            ]}
          >
            <Ionicons name="chatbubbles-outline" size={26} color={"#57e2e5"} />
            {/* <Text style={styles.editText}>Nhắn tin</Text> */}
          </Pressable>
        </View>
        <View style={styles.editContainer}>
          <Pressable
            onPress={() => _onClick(id)}
            style={styles.innerEditContainer}
          >
            <Text style={styles.editText}>Bạn bè</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    transform: [{ translateX: -30 }],
    // marginTop: -15,
  },
  editContainer: {
    borderRadius: 30,
    borderColor: "#bfbfbf",
    borderWidth: 1,
    width: 100,
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
  onlineStatus: {
    backgroundColor: "#13c892",
    width: 15,
    height: 15,
    borderRadius: 15,
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    bottom: 0,
    left: 35,
  },
  offlineStatus: {
    backgroundColor: "#72767e",
    width: 15,
    height: 15,
    borderRadius: 15,
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
    bottom: 0,
    left: 35,
  },
});

export default Friend;

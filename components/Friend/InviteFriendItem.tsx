import { View, Text, Pressable, StyleSheet, Image } from "react-native";
import React from "react";
import { router } from "expo-router";
interface FriendProps {
  id: string;
  name: string;
  avatar: string;
  _status: number;
  _onClick: any;
}

enum InviteStatus {
  INVITED = 0,
  SELF = 1,
  JOINED = 2,
  NOT_INVITED = 3,
}

const InviteFriend = ({ id, name, _onClick, avatar, _status }: FriendProps) => {
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const avatarUri = avatar == null ? tempAvatar : avatar;
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.itemContainer}
        // onPress={() => router.push(`/user/${id}`)}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </View>
        <View>
          <Text>{name}</Text>
        </View>
        {(() => {
          switch (_status) {
            case InviteStatus.INVITED:
              return (
                <View style={styles.outerEditContainer}>
                  <View style={styles.editContainer}>
                    <Pressable
                      onPress={() => _onClick(id, InviteStatus.INVITED)}
                      style={styles.innerEditContainer}
                    >
                      <Text style={styles.editText}>Đã mời</Text>
                    </Pressable>
                  </View>
                </View>
              );
            case InviteStatus.SELF:
              return (
                <View style={styles.outerEditContainer}>
                  <View style={styles.editContainer}>
                    <Pressable
                      // onPress={() => _onClick(id, InviteStatus.INVITED)}
                      style={styles.innerEditContainer}
                    >
                      <Text style={styles.editText}>Bạn</Text>
                    </Pressable>
                  </View>
                </View>
              );
            case InviteStatus.JOINED:
              return (
                <View style={styles.outerEditContainer}>
                  <View style={styles.editContainer}>
                    <Pressable
                      onPress={() => _onClick(id, InviteStatus.JOINED)}
                      style={styles.innerEditContainer}
                    >
                      <Text style={styles.editText}>Đã tham gia</Text>
                    </Pressable>
                  </View>
                </View>
              );
            case InviteStatus.NOT_INVITED:
              return (
                <View style={styles.outerEditContainer}>
                  <View style={styles.editContainer}>
                    <Pressable
                      onPress={() => _onClick(id, InviteStatus.NOT_INVITED)}
                      style={styles.innerEditContainer}
                    >
                      <Text style={styles.editText}>Chưa mời</Text>
                    </Pressable>
                  </View>
                </View>
              );
            default:
              return null;
          }
        })()}
      </Pressable>
      {/* <View style={styles.outerEditContainer}>
        <View style={styles.editContainer}>
          <Pressable
            onPress={() => _onClick(id)}
            style={styles.innerEditContainer}
          >
            <Text style={styles.editText}>Bạn bè</Text>
          </Pressable>
        </View>
      </View> */}
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
});

export default InviteFriend;

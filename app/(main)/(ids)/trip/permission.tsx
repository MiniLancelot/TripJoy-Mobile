import {
  View,
  Text,
  TextInput,
  Image,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import { useTabStore } from "@/utils/store";
import { Member } from "@/utils/Member";
import getMembers from "@/services/plan/member";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import {
  changePermission,
  memberLeave,
  removeMember,
} from "@/services/plan/invitePeople";
import { router } from "expo-router";

const PAGE_SIZE = 10;

interface _Members extends Member {
  avatar: any;
  role: number;
}

enum Role {
  OWNER = 0,
  VICE_OWNER = 1,
  MEMBER = 2,
}

const permission = () => {
  const { session } = useAuth();
  const sharedId = useTabStore((state) => state.sharedId);

  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";

  const [_members, setMembers] = useState<_Members[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  // const [content, setContent] = useState("");

  const fetchMembers = async (isLoadMore = false) => {
    try {
      if (loading || (isLoadMore && !hasNextPage)) return;

      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getMembers(
        session.userToken.accessToken,
        sharedId!,
        {
          pageIndex: pageIndex,
          pageSize: PAGE_SIZE,
        }
      );

      const newComments = response.data.members.data.map(
        (_item: any): _Members => ({
          userId: _item.userId,
          name: _item.name,
          avatar: _item.avatar,
          role: _item.role,
        })
      );

      setMembers((prev) =>
        isLoadMore ? [...prev, ...newComments] : newComments
      );
      setHasNextPage(newComments.length === PAGE_SIZE);
      if (isLoadMore) {
        setPageIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.log("Fetching comment error: " + error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const _changePermission = async (userId: string) => {
    try {
      const response = await changePermission(
        sharedId,
        userId,
        session.userToken.accessToken
      );
      if (response.status === 200) {
        setPageIndex(0); // Reset to reload comments from page 1
        fetchMembers(false);
      }
    } catch (error) {
      console.log("Change permission error: " + error);
      Alert.alert("Lỗi", "Bạn không có quyền thay đổi quyền thành viên");
    }
  };

  const leaveGroup = async () => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn muốn rời nhóm?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            const response = await memberLeave(
              sharedId,
              session.userToken.accessToken
            );
            if (response.status === 200) {
              // navigation.goBack();
              console.log("Rời nhóm thành công");
              router.replace("/home");
            }
          } catch (error) {
            console.log("Leave group error: " + error);
            Alert.alert(
              "Lỗi",
              "Bạn không thể rời nhóm vì bạn có thể có tham gia chi tiêu"
            );
          }
        },
      },
    ]);
  };

  const _removeMember = async (userId: string) => {
    Alert.alert("Xác nhận", "Bạn có chắc chắn loại người này?", [
      {
        text: "Hủy",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Đồng ý",
        onPress: async () => {
          try {
            const response = await removeMember(
              sharedId,
              userId,
              session.userToken.accessToken
            );
            if (response.status === 200) {
              // navigation.goBack();
              console.log("Rời nhóm thành công");
              router.replace("/home");
            }
          } catch (error) {
            console.log("Leave group error: " + error);
            Alert.alert(
              "Lỗi",
              "Bạn không thể loại người này vì người này có thể có tham gia chi tiêu"
            );
          }
        },
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "white" }}>
      {loading && pageIndex === 0 ? (
        <Text>Đang tải...</Text>
      ) : (
        <FlashList
          data={_members}
          renderItem={({ item }) => (
            // <CommentCard item={item} responseType={"comment"} />
            <View>
              <View style={styles.container}>
                <Pressable
                  style={styles.itemContainer}
                  // onPress={() => router.push(`/user/${id}`)}
                >
                  <View style={styles.avatarContainer}>
                    <Image
                      source={{ uri: item.avatar ?? tempAvatar }}
                      style={styles.avatar}
                    />
                  </View>
                  <View>
                    <Text>{item.name}</Text>
                  </View>
                </Pressable>
                <View style={styles.invitationContainer}>
                  <View style={styles.invitationOuterEditContainer}>
                    {(() => {
                      let role = "";
                      let color = "";
                      switch (item.role) {
                        case Role.OWNER:
                          role = "trưởng đoàn";
                          color = "#ff6188";
                          break;
                        case Role.VICE_OWNER:
                          role = "Phó chủ nhóm";
                          color = "green";
                          break;
                        case Role.MEMBER:
                          role = "Thành viên";
                          color = "#71d7c7";
                          break;
                        default:
                          return null;
                      }
                      return (
                        <View style={[styles.editContainer, { borderColor: color }]} >
                          <Pressable
                            onPress={() => _changePermission(item.userId)}
                            disabled={item.role != Role.OWNER}
                            style={[styles.innerEditContainer]}
                          >
                            <Text style={{ color: color }}>{role}</Text>
                          </Pressable>
                        </View>
                      );
                    })()}
                  </View>
                  <View style={styles.invitationOuterEditContainer}>
                    <View style={styles.editContainer}>
                      {item.role == Role.OWNER ? (
                        <Pressable
                          onPress={() => _removeMember(item.userId)}
                          style={styles.innerEditContainer}
                        >
                          <Text>Loại</Text>
                        </Pressable>
                      ) : item.userId == session.userInfo.user.profile.id ? (
                        <Pressable
                          onPress={() => leaveGroup()}
                          style={styles.innerEditContainer}
                        >
                          <Text>Rời nhóm</Text>
                        </Pressable>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>

              {/* <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Image
                    source={{ uri: item.avatar ?? tempAvatar }}
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />
                  <Text style={{ marginLeft: 10, fontSize: 25 }}>
                    {item.name}
                  </Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {(() => {
                    let role = "";
                    let color = "";
                    switch (item.role) {
                      case Role.OWNER:
                        role = "trưởng đoàn";
                        color = "red";
                        break;
                      case Role.VICE_OWNER:
                        role = "Phó chủ nhóm";
                        color = "green";
                        break;
                      case Role.MEMBER:
                        role = "Thành viên";
                        color = "grey";
                        break;
                      default:
                        return null;
                    }
                    return (
                      <Pressable
                        onPress={() => _changePermission(item.userId)}
                        disabled={item.role != Role.OWNER}
                        style={{
                          backgroundColor: color,
                          width: 100,
                          height: 50,
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: 10,
                        }}
                      >
                        <Text style={{ color: "white", fontSize: 25 }}>
                          {role}
                        </Text>
                      </Pressable>
                    );
                  })()}
                  {item.role == Role.OWNER ? (
                    <Pressable onPress={() => _removeMember(item.userId)}>
                      <Text>Loại</Text>
                    </Pressable>
                  ) : item.userId == session.userInfo.user.profile.id ? (
                    <Pressable onPress={() => leaveGroup()}>
                      <Text>Rời nhóm</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View> */}
            </View>
          )}
          estimatedItemSize={100}
          onEndReached={() => fetchMembers(true)}
          onEndReachedThreshold={0.5}
          keyExtractor={(member) => member.userId}
          ListFooterComponent={
            isFetchingMore ? <Text>Đang tải thêm...</Text> : null
          }
        />
      )}
      {/* <TextInput
        placeholder="Nhập bình luận"
        onChangeText={(text) => setContent(text)}
        value={content}
      /> */}
      {/* <Pressable
        onPress={() => {
          if (content.trim()) {
            _postComment(content);
            setContent("");
          }
        }}
      >
        <Text>Đăng</Text>
      </Pressable> */}
    </GestureHandlerRootView>
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

export default permission;

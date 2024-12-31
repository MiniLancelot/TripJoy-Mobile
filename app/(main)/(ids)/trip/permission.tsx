import { View, Text, TextInput, Image, Pressable, Alert } from "react-native";
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
import { it } from "date-fns/locale";
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
              router.replace("/home")
            }
          } catch (error) {
            console.log("Leave group error: " + error);
            Alert.alert("Lỗi", "Bạn không thể rời nhóm");
          }
          //       const response = await memberLeave(sharedId, session.userToken.accessToken);
          // if (response.status === 200) {
          //   setPageIndex(0); // Reset to reload comments from page 1
          //   fetchMembers(false);
          // }
        },
      },
    ]);
  };

  return (
    <GestureHandlerRootView>
      {loading && pageIndex === 0 ? (
        <Text>Đang tải...</Text>
      ) : (
        <FlashList
          data={_members}
          renderItem={({ item }) => (
            // <CommentCard item={item} responseType={"comment"} />
            <View>
              <Image
                source={{ uri: item.avatar ?? tempAvatar }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{item.name}</Text>
              {(() => {
                let role = "";
                switch (item.role) {
                  case Role.OWNER:
                    role = "Chủ nhóm";
                    break;
                  case Role.VICE_OWNER:
                    role = "Phó chủ nhóm";
                    break;
                  case Role.MEMBER:
                    role = "Thành viên";
                    break;
                  default:
                    return null;
                }
                return item.role == Role.OWNER ? (
                  <Pressable onPress={() => _changePermission(item.userId)}>
                    <Text>{role}</Text>
                  </Pressable>
                ) : null;
              })()}
              {item.userId == session.userInfo.user.profile.id ? (
                <Pressable onPress={() => leaveGroup()}>
                  <Text>Rời nhóm</Text>
                </Pressable>
              ) : null}
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

export default permission;

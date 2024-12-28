import { View, Text, TextInput, Image, Pressable, FlatList, } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import { useTabStore } from "@/utils/store";
import { Member } from "@/constants/Member";
import getMembers from "@/services/plan/member";
import {  GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { changePermission } from "@/services/plan/invitePeople";
import { it } from "date-fns/locale";
import { getPlanExpenseMembersByPlanId } from "@/services/plan/plan";

const PAGE_SIZE = 10;

interface _Members extends Member {
  avatar: any;
  excess: number;
}

enum Role {
  OWNER = 0,
  VICE_OWNER = 1,
  MEMBER = 2,
}

const ExpenseMembers = () => {
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

      const response = await getPlanExpenseMembersByPlanId(
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
          name: _item.userName,
          avatar: _item.url,
          excess: _item.excess,
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

  // const _changePermission = async (userId: string) => {
  //   const response = await changePermission(sharedId, userId, session.userToken.accessToken);
  //   if (response.status === 200) {
  //     setPageIndex(0); // Reset to reload comments from page 1
  //     fetchMembers(false);
  //   }
  // };

  return (
    <View>
      {loading && pageIndex === 0 ? (
        <Text>Đang tải...</Text>
      ) : (
        <FlatList
          data={_members}
          renderItem={({ item }) => (
            // <CommentCard item={item} responseType={"comment"} />
            <View>
              <Image
                source={{ uri: item.avatar ?? tempAvatar }}
                style={{ width: 50, height: 50 }}
              />
              <Text>{item.name}</Text>
              <Text>{item.excess}</Text>
            </View>
          )}
          // estimatedItemSize={50}
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
    </View>
  );
};

export default ExpenseMembers;

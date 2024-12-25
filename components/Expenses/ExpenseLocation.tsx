import { View, Text, TextInput, Image, Pressable, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import { useTabStore } from "@/utils/store";
import { Member } from "@/constants/Member";
import getMembers from "@/services/plan/member";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import { changePermission } from "@/services/plan/invitePeople";
import { it } from "date-fns/locale";
import {
  getExpensesByPlanId,
  getPlanExpenseMembersByPlanId,
} from "@/services/plan/plan";

const PAGE_SIZE = 10;

interface PlanExpenses {
  order: number;
  name: string;
  address: string;
  amount: number;
}

enum Role {
  OWNER = 0,
  VICE_OWNER = 1,
  MEMBER = 2,
}

const ExpenseLocations = () => {
  const { session } = useAuth();
  const sharedId = useTabStore((state) => state.sharedId);

  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";

  const [_expenses, setExpenses] = useState<PlanExpenses[]>([]);
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

      const response = await getExpensesByPlanId(
        session.userToken.accessToken,
        sharedId!,
        {
          pageIndex: pageIndex,
          pageSize: PAGE_SIZE,
        }
      );

      const newComments = response.data.detailExpense.data.map(
        (_item: any): PlanExpenses => ({
          order: _item.order,
          name: _item.name,
          address: _item.address,
          amount: _item.amount,
        })
      );

      setExpenses((prev) =>
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
          data={_expenses}
          renderItem={({ item }) => (
            // <CommentCard item={item} responseType={"comment"} />
            <View>
              <Text>{item.name}</Text>
              <Text>{item.address}</Text>
              <Text>{item.amount}</Text>
            </View>
          )}
          // estimatedItemSize={50}
          onEndReached={() => fetchMembers(true)}
          onEndReachedThreshold={0.5}
          keyExtractor={(member) => member.order.toString()}
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

export default ExpenseLocations;

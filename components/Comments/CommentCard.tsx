import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TextInput
} from "react-native";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Comment } from "@/constants/Comment";
import { getRepliesByCommentId } from "@/services/comment/comment";
import { useAuth } from "@/app/(auth)/AuthContext";
// import { TextInput } from "react-native-gesture-handler";

interface CommentCardProps {
  item: Comment;
  responseToComment?: boolean;
  onRespond?: (
    data: any,
    responseToComment?: boolean,
    commentId?: string
  ) => any;
  onDelete?: (commentId: string, responseToComment?: boolean) => any;
  layer?: number;
  _setReplies?: (comments: any) => any;
}

const PAGE_SIZE = 10;

const CommentCard = ({
  item,
  responseToComment,
  onRespond,
  onDelete,
  layer = 0,
  _setReplies,
}: CommentCardProps) => {
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const avatarUri = item.avatar == null ? tempAvatar : item.avatar;

  const { session } = useAuth();
  const [replies, setReplies] = useState<Comment[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [content, setContent] = useState("");
  const [openReplies, setOpenReplies] = useState(false);

  const fetchReplies = async (isLoadMore = false) => {
    try {
      if (loading || (isLoadMore && !hasNextPage)) return;

      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getRepliesByCommentId(
        item.commentId,
        session.userToken.accessToken,
        {
          pageIndex: pageIndex,
          pageSize: 10,
        }
      );
      const newReplies = response.data.comments.data.map(
        (comment: any): Comment => ({
          commentId: comment.commentId,
          userId: comment.userId,
          userName: comment.userName,
          avatar: comment.url,
          content: comment.content,
          likeCount: comment.likeCount,
          replyCount: comment.replyCount,
          createdAt: comment.createdAt,
          emotionByMe: comment.emotionByMe,
          commentReactionsDistinct: comment.commentReactionsDistinct,
        })
      );
      setReplies((prev) => (isLoadMore ? [...prev, ...newReplies] : newReplies));
      setHasNextPage(newReplies.length === PAGE_SIZE);
      if (isLoadMore) {
        setPageIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.log(
        "Fetching reply error: " +
          error +
          " at commentId: " +
          item.commentId +
          " in layer: " +
          layer
      );
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const saveData = async () => {
    try {
      const response = await onRespond!(content, responseToComment, item.commentId);
      if (response.status === 200) {
        setContent(""); // Clear input
        setPageIndex(0); // Reset to reload comments from page 1
        fetchReplies(false);
      }
      console.log(response);
    } catch (error) {
      console.log("Posting comment error: " + error);
    }
  };

  const deleteComment = async () => {
    try {
      const response = await onDelete!(item.commentId, responseToComment);
      if (response.status === 200) {
        setOpenReplies(false);
        _setReplies!((prev: any) => prev.filter((reply: any) => reply.commentId !== item.commentId));
      }
      // console.log(response);
    } catch (error) {
      console.log("Deleting comment error: " + error);
    }
  };

  useEffect(() => {
    if (openReplies) {
      fetchReplies();
    } else {
      setReplies([]);
    }
  }, [openReplies]);

  return (
    <View>
      <Image source={{ uri: item.avatar ?? tempAvatar }} style={styles.avatar} />
      <Text>{item.userName}</Text>
      <Text>{item.content}</Text>
      <Text>{item.likeCount} lượt thích</Text>
      <Text>{replies.length} phản hồi</Text>
      {item.userId === session.userInfo.user.profile.id && (<Pressable onPress={deleteComment}>
        <Text>Xóa</Text>
      </Pressable>)}
      <Text>{item.createdAt}</Text>
      <View>
        <Pressable
          onPress={() => {
            setOpenReplies(!openReplies);
          }}
        >
          <Text>
            {openReplies ? "Ẩn" : "Xem"} {replies.length} phản hồi
          </Text>
        </Pressable>
        {layer! <= 2 && openReplies && (
          <View style={{ marginLeft: 20 }}>
            <FlatList
              data={replies}
              keyExtractor={(reply) => reply.commentId}
              renderItem={({ item }) => (
                <CommentCard
                  item={item}
                  responseToComment={true}
                  onRespond={onRespond}
                  layer={layer + 1}
                  onDelete={onDelete}
                  _setReplies={setReplies}
                />
              )}
              nestedScrollEnabled
              ListFooterComponent={
                isFetchingMore ? (
                  <Text>Đang tải...</Text>
                ) : (
                  hasNextPage ? (
                    <Pressable onPress={() => fetchReplies(true)}>
                      <Text>Xem thêm</Text>
                    </Pressable>
                  ) : null
                )
              }
            />
            <TextInput
              placeholder="Viết phản hồi..."
              value={content}
              onChangeText={setContent}
            />
            <Pressable
              onPress={saveData}
            >
              <Text>Trả lời</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

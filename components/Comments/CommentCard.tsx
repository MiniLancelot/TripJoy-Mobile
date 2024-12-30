import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Comment } from "@/utils/Comment";
import { getRepliesByCommentId } from "@/services/comment/comment";
import { useAuth } from "@/app/(auth)/AuthContext";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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
      setReplies((prev) =>
        isLoadMore ? [...prev, ...newReplies] : newReplies
      );
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
      const response = await onRespond!(
        content,
        responseToComment,
        item.commentId
      );
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
        _setReplies!((prev: any) =>
          prev.filter((reply: any) => reply.commentId !== item.commentId)
        );
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}-${month}`;
  };

  return (
    <View style={styles.container}>
      {item.userId === session.userInfo.user.profile.id && (
        <Pressable onPress={deleteComment} style={styles.delete}>
          <Ionicons name="trash-bin-outline" size={layer == 0 ? 20 : 16} color={"#ff6188"} />
        </Pressable>
      )}
      <Image
        source={{ uri: item.avatar ?? tempAvatar }}
        style={styles.avatar}
      />
      <View style={styles.innerContainer}>
        <Text style={styles.name}>{item.userName}</Text>
        <Text style={styles.time}>{formatDate(item.createdAt)}</Text>
        <Text style={styles.content}>{item.content}</Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            marginTop: 10,
            width: "100%",
          }}
        >
          {/* <Text>{replies.length} phản hồi</Text> */}
          <View style={{ width: "90%" }}>
            {layer <= 0 && (
              <Pressable
                onPress={() => {
                  setOpenReplies(!openReplies);
                }}
              >
                <Text>
                  {openReplies ? "Ẩn" : "Xem"} {replies.length} phản hồi
                </Text>
              </Pressable>
            )}
            {layer! <= 0 && openReplies && (
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
                    ) : hasNextPage ? (
                      <Pressable onPress={() => fetchReplies(true)}>
                        <Text>Xem thêm</Text>
                      </Pressable>
                    ) : null
                  }
                />
                <TextInput
                  placeholder="Viết phản hồi..."
                  value={content}
                  onChangeText={setContent}
                  style={{
                    borderWidth: 1,
                    borderColor: "#e7e8ee",
                    borderRadius: 40,
                    backgroundColor: "#f5f7fa",
                    padding: 10,
                    paddingLeft: 20,
                    margin: 10,
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    if (content.trim()) {
                      saveData();
                      setContent("");
                    }
                  }}
                  style={styles.sendBtn}
                >
                  <FontAwesome
                    name="paper-plane"
                    size={20}
                    color={content.length === 0 ? "#808080" : "#26d7fe"}
                  />
                </TouchableOpacity>
                {/* <Pressable onPress={saveData}>
                  <Text>Trả lời</Text>
                </Pressable> */}
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default CommentCard;

const styles = StyleSheet.create({
  sendBtn: {
    position: "absolute",
    right: 30,
    bottom: 25,
  },
  container: {
    margin: 10,
    padding: 20,
    borderWidth: 1,
    borderColor: "#f6f6f6",
    borderRadius: 10,
    gap: 10,
    flexDirection: "row",
  },
  innerContainer: {
    gap: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  time: {
    fontSize: 12,
    color: "gray",
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
  },
  content: {
    fontSize: 15,
    color: "#323232",
  },
  delete: {
    color: "red",
    position: "absolute",
    right: 15,
    top: 15,
  },
});

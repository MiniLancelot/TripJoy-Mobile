import { View, Text, Pressable, FlatList, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { Comment } from "@/utils/Comment";
import { useAuth } from "@/app/(auth)/AuthContext";
import {
  deleteComment,
  getCommentsByPostId,
  postComment,
  postReply,
} from "@/services/comment/comment";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import CommentCard from "@/components/Comments/CommentCard";
import { useLocalSearchParams } from "expo-router";

const PAGE_SIZE = 10;

const CommentList = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [content, setContent] = useState("");

  const fetchComments = async (isLoadMore = false) => {
    try {
      if (loading || (isLoadMore && !hasNextPage)) return;

      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      const response = await getCommentsByPostId(
        id,
        { pageIndex: pageIndex, pageSize: PAGE_SIZE },
        session.userToken.accessToken
      );

      const newComments = response.data.comments.data.map(
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

      setComments((prev) =>
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

  const _postComment = async (
    content: string,
    responseToComment?: boolean,
    commentId?: string
  ) => {
    if (commentId) {
      const data = {
        Comment: {
          Content: content,
        },
      };
      const response = await postReply(
        data,
        session.userToken.accessToken,
        commentId
      );
      return response;
    }
    const data = {
      Comment: {
        Content: content,
      },
    };
    const response = await postComment(data, session.userToken.accessToken, id);
    return response;
  };

  const _deleteComment = async (
    commentId: string,
    responseToComment?: boolean
  ) => {
    const response = await deleteComment(
      commentId,
      session.userToken.accessToken
    );
    return response;
  };

  const saveData = async () => {
    try {
      const response = await _postComment(content);
      if (response.status === 200) {
        setPageIndex(0); // Reset to reload comments from page 1
        fetchComments(false);
      }
      console.log(response);
    } catch (error) {
      console.log("Posting comment error: " + error);
    }
  };

  // const deleteData = async (commentId: string) => {
  //   try {
  //     const response = await _deleteComment(commentId);
  //     if (response.status === 200) {
  //       setPageIndex(0); // Reset to reload comments from page 1
  //       fetchComments(false);
  //     }
  //     console.log(response);
  //   } catch (error) {
  //     console.log("Deleting comment error: " + error);
  //   }
  // };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <View>
      {loading && pageIndex === 0 ? (
        <Text>Đang tải...</Text>
      ) : (
        <View>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <CommentCard
                item={item}
                responseToComment={false}
                onRespond={_postComment}
                onDelete={_deleteComment}
                _setReplies={setComments}
              />
            )}
            nestedScrollEnabled
            // estimatedItemSize={100}
            keyExtractor={(comment) => comment.commentId}
            ListFooterComponent={
              isFetchingMore ? <Text>Đang tải thêm...</Text> : null
            }
          />
          <Pressable onPress={() => fetchComments(true)}>
            <Text>Xem thêm</Text>
          </Pressable>
        </View>
      )}
      <TextInput
        placeholder="Nhập bình luận"
        onChangeText={(text) => setContent(text)}
        value={content}
      />
      <Pressable
        onPress={() => {
          if (content.trim()) {
            saveData();
            setContent("");
          }
        }}
      >
        <Text>Đăng</Text>
      </Pressable>
    </View>
  );
};

export default CommentList;

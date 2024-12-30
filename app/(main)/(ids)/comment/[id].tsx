import {
  View,
  Text,
  Pressable,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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
import { Stack, useLocalSearchParams } from "expo-router";
import React from "react";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const PAGE_SIZE = 10;
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const CommentList = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [content, setContent] = useState("");
  const nameBorderColor = useSharedValue("#e7e8ee");

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

  const handleFocus = (borderColor: { value: string }) => {
    borderColor.value = withTiming("#657ef8", { duration: 250 });
  };
  const handleBlur = (borderColor: { value: string }) => {
    borderColor.value = withTiming("#e7e8ee", { duration: 250 });
  };
  const animatedBorderStyle = (borderColor: { value: any }) =>
    useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        padding: 10,
        paddingTop: 0,
        backgroundColor: "#fff",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-200}
    >
      <Stack.Screen
        options={{
          title: "Bình luận",
          headerRight: () => {
            return (
              <>
                <View style={styles.backBtnWrapper}>
                  <TouchableOpacity onPress={() => fetchComments(true)}>
                    <Text>
                      <Ionicons
                        name="refresh-outline"
                        size={25}
                        color={"#b3b3b3"}
                      />
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          },
        }}
      />
      {loading && pageIndex === 0 ? (
        <Text>Đang tải...</Text>
      ) : (
        <View style = {{flex: 1}}>  
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
        </View>
      )}
      {/* <TextInput
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
      </Pressable> */}
      <View style={{ bottom: 0 }}> 
        <AnimatedTextInput
          placeholder="Nhắn tin"
          value={content}
          onChangeText={(text) => setContent(text)}
          style={[
            animatedBorderStyle(nameBorderColor),
            {
              borderWidth: 1,
              // borderColor: "#b3b3b3",
              borderRadius: 40,
              backgroundColor: "#f5f7fa",
              padding: 10,
              paddingLeft: 20,
              margin: 10,
            },
          ]}
          onFocus={() => handleFocus(nameBorderColor)}
          onBlur={() => handleBlur(nameBorderColor)}
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
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  backBtnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 0,
  },
  sendBtn: {
    position: "absolute",
    right: 30,
    bottom: 25
  },
});

export default CommentList;

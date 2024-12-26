// import { View, Text, Pressable, ActivityIndicator } from "react-native";
// import { useEffect, useState } from "react";
// import { FlashList } from "@shopify/flash-list";
// import { Comment } from "@/constants/Comment";
// import { useAuth } from "@/app/(auth)/AuthContext";
// import { getCommentsByPostId, postComment, postReply } from "@/services/comment/comment";
// import { GestureHandlerRootView, TextInput } from "react-native-gesture-handler";
// import CommentCard from "./CommentCard";

// const CommentList = ({ postId }: { postId: string }) => {
//   const { session } = useAuth();
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pageIndex, setPageIndex] = useState(0);
//   const [content, setContent] = useState("");
//   const [hasMore, setHasMore] = useState(true); // Kiểm tra còn dữ liệu để tải không

//   const fetchComments = async () => {
//     if (loading || !hasMore) return; // Ngăn tải dữ liệu khi đang tải hoặc không còn dữ liệu
//     try {
//       setLoading(true);
//       const response = await getCommentsByPostId(
//         postId,
//         { pageIndex: pageIndex, pageSize: 10 },
//         session.userToken.accessToken
//       );

//       const newComments = response.data.comments.data.map((comment: any): Comment => ({
//         commentId: comment.commentId,
//         userId: comment.userId,
//         userName: comment.userName,
//         avatar: comment.avatar,
//         content: comment.content,
//         likeCount: comment.likeCount,
//         replyCount: comment.replyCount,
//         createdAt: comment.createdAt,
//         emotionByMe: comment.emotionByMe,
//         commentReactionsDistinct: comment.commentReactionsDistinct,
//       }));

//       if (newComments.length === 0) {
//         setHasMore(false); // Đánh dấu là không còn dữ liệu để tải
//       } else {
//         setComments((prevComments) => [...prevComments, ...newComments]);
//         setPageIndex((prevPageIndex) => prevPageIndex + 1);
//       }
//     } catch (error) {
//       console.log("Fetching comment error: " + error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchComments();
//   }, []);

//   const _postComment = async (content: string, responseType?: boolean, commentId?: string) => {
//     try {
//       if (responseType) {
//         const data = {
//           Comment: {
//             Content: content,
//           },
//         };
//         const response = await postReply(data, session.userToken.accessToken, );
//         return response;
//       }
//       const data = {
//         Comment: {
//           Content: content,
//         },
//       };
//       const response = await postComment(data, session.userToken.accessToken, postId);
//       return response;
//     } catch (error) {
//       console.log("Posting comment error: " + error);
//     }
//   };

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <FlashList
//         data={comments}
//         renderItem={({ item }) => (
//           <CommentCard item={item} />
//         )}
//         estimatedItemSize={100}
//         onEndReached={fetchComments}
//         onEndReachedThreshold={0.5}
//         keyExtractor={(comment) => comment.commentId}
//         ListFooterComponent={
//           loading && hasMore ? (
//             <ActivityIndicator size="small" color="#0000ff" />
//           ) : null
//         }
//       />
//       <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
//         <TextInput
//           style={{
//             flex: 1,
//             borderWidth: 1,
//             borderColor: "#ccc",
//             borderRadius: 5,
//             paddingHorizontal: 10,
//           }}
//           placeholder="Nhập bình luận"
//           value={content}
//           onChangeText={(text) => setContent(text)}
//         />
//         <Pressable
//           style={{
//             marginLeft: 10,
//             backgroundColor: "#007bff",
//             paddingVertical: 10,
//             paddingHorizontal: 15,
//             borderRadius: 5,
//           }}
//           onPress={() => {
//             if (content.trim()) {
//               _postComment(content);
//             }
//           }}
//         >
//           <Text style={{ color: "#fff" }}>Đăng</Text>
//         </Pressable>
//       </View>
//     </GestureHandlerRootView>
//   );
// };

// export default CommentList;

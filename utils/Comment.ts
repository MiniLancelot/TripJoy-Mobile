export type Comment = {
  commentId: string;
  userId: string;
  userName: string;
  avatar: string | null;
  content: string;
  likeCount: number;
  replyCount: number;
  createdAt: string;
  emotionByMe: any;
  commentReactionsDistinct: any;
}
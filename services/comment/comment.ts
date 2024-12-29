import { Params } from "@/utils/QueryParams";
import { post } from "@/utils/request";
import showError from "@/utils/showError";

const postComment = async (data: any, accessToken: string, postId: string) => {
  try {
    const response = await post(`/posts/${postId}/comments`, {
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const getCommentsByPostId = async (
  postId: string,
  params: Params,
  accessToken: string
) => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Chuyển mọi giá trị sang string
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const response = await post(`/posts/${postId}/comments?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const postReply = async (data: any, accessToken: string, commentId: string) => {
  try {
    const response = await post(`/comments/${commentId}/reply`, {
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const getRepliesByCommentId = async (commentId: string, accessToken: string, params: Params) => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Chuyển mọi giá trị sang string
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await post(`/comments/${commentId}/reply?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const deleteComment = async (commentId: string, accessToken: string) => {
  try {
    const response = await post(`/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

export { postComment, getCommentsByPostId, postReply, getRepliesByCommentId, deleteComment };

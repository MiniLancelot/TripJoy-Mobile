import { post } from "@/utils/request";
import showError from "@/utils/showError";
import { Params } from "@/constants/QueryParams2";

// interface _Params extends Params {
//   userId?: string;
// }

const createPost = async (data: any, accessToken: string) => {
  try {
    const response = await post("/posts", {
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const createPostPlan = async (data: any, accessToken: string) => {
  try {
    const response = await post("/posts/plan", {
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const getPostsHomeFeed = async (accessToken: string, params: Params) => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Chuyển mọi giá trị sang string
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await post(`/posts/homefeed?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    console.log("get post Error: ", error);
    showError(error);
    throw error;
  }
};

const getPostsByUserId = async (
  accessToken: string,
  userId: String,
  params: Params
) => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Chuyển mọi giá trị sang string
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const response = await post(`/posts/users/${userId}?${query}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error: any) {
    console.log("get post Error: ", error);
    showError(error);
    throw error;
  }
};

const deletePost = async (postId: string, accessToken: string) => {
  try {
    const response = await post(`/posts/${postId}`, {
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
};

const likePost = async (data: any, accessToken: string, postId: any) => {
  try {
    const response = await post(`/posts/${postId}/like`, {
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

const getPostById = async (accessToken: string, postId: any) => {
  try {
    const response = await post(`/posts/${postId}`, {
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

const unlikePost = async (accessToken: string, postId: any) => {
  try {
    const response = await post(`/posts/${postId}/revokeLike`, {
      method: "POST",
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

export {
  createPost,
  createPostPlan,
  getPostsHomeFeed,
  getPostsByUserId,
  deletePost,
  likePost,
  unlikePost,
  getPostById,
};

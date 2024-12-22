import { post } from "@/utils/request";
import showError from "@/utils/showError";

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

const getPostsHomeFeed = async (accessToken: string) => {
  try {
    const response = await post("/posts/homefeed", {
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

export { createPost, getPostsHomeFeed };

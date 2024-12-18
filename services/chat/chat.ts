import { chat } from "@/utils/request";
import showError from "@/utils/showError";

const openChat = async (userId: string, accessToken: any) => {
  try {
    const response = await chat(`/rooms/private`, {
      method: "POST",
      data: {
        UserId: userId,
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response;
  } catch (error) {
    showError(error);
    throw error;
  }
};

const getMessagesByRoomId = async (roomId: string, pageIndex: number, accessToken: any) => {
  try {
    const response = await chat(`/rooms/${roomId}/messages?pageIndex=${pageIndex}`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });
    return response;
  } catch (error) {
    console.log("Error getMessagesByRoomId: ", error);
    showError(error);
    throw error;
  }
};

const sendMessage = async (roomId: string, message: string, accessToken: any) => {
  try {
    const response = await chat(`/rooms/${roomId}/messages`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        Message: message,
      }
    });
    return response;
  } catch (error) {
    showError(error);
    throw error;
  }
};

export { openChat, getMessagesByRoomId, sendMessage };
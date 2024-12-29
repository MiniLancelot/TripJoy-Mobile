import { ai } from "@/utils/request";
import showError from "@/utils/showError";

const generateAIPlan = async (data: any) => {
  try {
    const response = await ai(`/trip-planner`, {
      method: "POST",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

export { generateAIPlan };

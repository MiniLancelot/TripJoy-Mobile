import { plan } from "@/utils/request";
import showError from "@/utils/showError";

const addPlan = async (data: FormData, accessToken: any) => {
  try {
    const result = await plan("/plans", {
      method: "POST",
      data: data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },

    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

export default addPlan;

import { plan } from "@/utils/request";
import showError from "@/utils/showError";
import { getAccessToken } from "@rnmapbox/maps";

const addPlan = async (data: any, accessToken: any) => {
  try {
    const result = await plan("/plans", {
      method: "POST",
      data: data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${accessToken}`
      },

    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const getAllPlan = async (accessToken: any) => {
  try {
    const result = await plan("/plans", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const getPlanLocationById = async(accessToken: any, id: any) => {
  try {
    const result = await plan(`/plans/${id}/planLocations`,{
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    })
    return result;
  }catch (error: any) {
    showError(error);
    throw error;
  }
}

export { addPlan, getAllPlan, getPlanLocationById };

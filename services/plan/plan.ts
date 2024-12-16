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
const getPlanById = async(accessToken: any, id: any) => {
  try {
    const result = await plan(`/plans/${id}`,{
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

const addPlanLocation = async (data: any, accessToken: any, id: any) => {
  try {
    const result = await plan(`/plans/${id}/planLocations`, {
      method: "POST",
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },

    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const getPlanLocationsByPlanId = async (accessToken: any, id: any) => {
  try {
    const result = await plan(`/plans/${id}/planLocations`, {
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

const changeOrderPlanLocations = async (data: any, accessToken: any, id: any) => {
  try {
    const result = await plan(`/plans/${id}/planLocations/changeOrder`, {
      method: "PATCH",
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },

    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const addPlanLocationImage = async (data: any, accessToken: any, id: any) => {
  try {
    const result = await plan(`/planLocations/${id}/images/add`, {
      method: "PATCH",
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
}

const deletePlanLocationImage = async (data: any, accessToken: any, id: any) => {
  try {
    const result = await plan(`/planLocations/${id}/images/remove`, {
      method: "PATCH",
      data: data,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      },

    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const deletePlanLocationByPlanLocationId = async (accessToken: any, id: any) => {
  try {
    const result = await plan(`/planLocations/${id}`, {
      method: "DELETE",
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

export { addPlan, getAllPlan, getPlanLocationById, getPlanById, addPlanLocation, getPlanLocationsByPlanId, changeOrderPlanLocations, addPlanLocationImage, deletePlanLocationImage, deletePlanLocationByPlanLocationId };

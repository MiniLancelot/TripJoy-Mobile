import { Params } from "@/constants/QueryParams";
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

const updatePlan = async (data: any, planId: any, accessToken: any) => {
  try {
    const result = await plan(`/plans/${planId}`, {
      method: "PUT",
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

const getPlanInvitations = async (accessToken: any) => {
  try {
    const result = await plan(`/planInvitations`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`
      },  
    });
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const putExpense = async (data: any, accessToken: any, id: any) => {
  try {
    const result = await plan(`/planLocations/${id}/expense`, {
      method: "PUT",
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

const patchNote = async (data: any, accessToken: any, id: any) => {
  try {
    const result = await plan(`/planLocations/${id}/note`, {
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

const getExpensesByPlanId = async (accessToken: any, planId: any, params: Params) => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const result = await plan(`/plans/${planId}/expense?${query}`, {
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

const getPlanExpenseMembersByPlanId = async (accessToken: any, planId: any, params: Params) => {
  try {
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    const result = await plan(`/plans/${planId}/expense/members?${query}`, {
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

const getPlanExpenseMemberByPlanId = async (accessToken: any, planId: any, userId: any) => {
  try {
    const result = await plan(`/plans/${planId}/expense/members/${userId}`, {
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

export { addPlan, getAllPlan, getPlanLocationById, getPlanById, addPlanLocation, 
  getPlanLocationsByPlanId, changeOrderPlanLocations, addPlanLocationImage, deletePlanLocationImage, deletePlanLocationByPlanLocationId, 
  getPlanInvitations, putExpense, patchNote, updatePlan, getExpensesByPlanId,
  getPlanExpenseMembersByPlanId, getPlanExpenseMemberByPlanId };

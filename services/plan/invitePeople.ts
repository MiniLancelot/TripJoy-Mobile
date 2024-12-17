import { plan } from "@/utils/request";
import showError from "@/utils/showError";

const inviteMember = async (userId: any, planId: any, accessToken: any) => {
  try {
    const result = await plan(`/plans/${planId}/members/invite/${userId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
};

const revokeMember = async (userId: any, planId: any, accessToken: any) => {
  try {
    const result = await plan(`/plans/${planId}/members/invite/${userId}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const acceptInvitation = async (planId: any, accessToken: any) => {
  try {
    const result = await plan(`/plans/${planId}/members/accept`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const declineInvitation = async (planId: any, accessToken: any) => {
  try {
    const result = await plan(`/plans/${planId}/members/decline`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const getMembersByPlanId = async (planId: any, accessToken: any) => {
  try{
    const result = await plan(`/plans/${planId}/members`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;  
  }
}

const changePermission = async (planId: any, userId: any, accessToken: any) => {
  try {
    const result = await plan(`/plans/${planId}/members/${userId}/permission`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

const removeMember = async (planId: any, userId: any, accessToken: any) => {
  try{
    const result = await plan(`/plans/${planId}/members/${userId}/remove`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return result;
  } catch (error: any) {
    showError(error);
    throw error;
  }
}

export { inviteMember, revokeMember, acceptInvitation, declineInvitation, getMembersByPlanId, changePermission, removeMember };
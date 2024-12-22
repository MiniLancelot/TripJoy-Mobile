import { plan } from "@/utils/request";

type Params = {
  pageIndex?: number;
  pageSize?: number;
  // planId?: string;
}

const getMembers = async (bearer: string, planId: string, params: Params) => {
  try {
    // Chuyển đổi params thành string nếu cần thiết
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Chuyển mọi giá trị sang string
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const result = await plan(`/plans/${planId}/members?${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${bearer}`,
      },
    });

    return result;
  } catch (error: any) {
    throw error;
  }
};

// const getMembersByPlanId = async (bearer: string, planId: string) => {

export default getMembers;
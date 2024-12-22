import { Params } from "@/constants/QueryParams";
import { plan } from "@/utils/request";

// type Params = {
//   pageIndex?: number;
//   pageSize?: number;
//   name?: string;
// }

const getPronvinces = async (bearer: string, params: Params) => {
  try {
    // Chuyển đổi params thành string nếu cần thiết
    const query = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value); // Chuyển mọi giá trị sang string
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const result = await plan(`/provinces?${query}`, {
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

export default getPronvinces;
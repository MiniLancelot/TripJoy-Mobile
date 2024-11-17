import { identity } from "@/utils/request";
import showError from "@/utils/showError";

const refreshingToken = async (data: any) => {
    try {
        const result = await identity("/refresh", {
            method: "POST",
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        showError(error);
        throw error;
    }
};

export default refreshingToken;
import { user } from "@/utils/request";
import showError from "@/utils/showError";

const get_health = async (token: any) => {
    try {
        const result = await user("/health", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return result;
    } catch (error: any) {
        showError(error);
    }
}

export default get_health;
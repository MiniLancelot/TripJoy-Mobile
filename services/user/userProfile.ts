import { user } from "@/utils/request";
import showError from "@/utils/showError";

const get_user_profile = async (token: any) => {
    try {
        const result = await user("/users/info", {
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

export default get_user_profile;
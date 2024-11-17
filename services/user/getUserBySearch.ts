import { user } from "@/utils/request";
import showError from "@/utils/showError";

const get_user_search = async (token: any, name: string) => {
    try {
        const result = await user(`/users/search?name=${name}`, {
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

export default get_user_search;
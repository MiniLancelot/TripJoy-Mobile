import { user } from "@/utils/request";
import showError from "@/utils/showError";

const get_user_by_id = async (token: any, id: string) => {
    try {
        const result = await user(`/users/${id}`, {
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

export default get_user_by_id;
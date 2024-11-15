import { identity } from "@/utils/request";
import showError from "@/utils/showError";

const login = async (data: any) => {
    try {
        const result = await identity("/login", {
            method: "POST",
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        showError(error);
    }
};

export default login;
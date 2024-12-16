import { identity } from "@/utils/request";
import showError from "@/utils/showError";

const logout = async (token: any, data: any) => {
    try {
        const result = await identity("/logout",{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        console.log("logout error: ");
        showError(error);
        throw error;
    }
}

export default logout;
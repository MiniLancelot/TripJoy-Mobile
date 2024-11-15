import { identity } from "@/utils/request";
import showError from "@/utils/showError";

const send_otp_verify_email = async (data: any) => {
    try {
        const result = await identity("/send-otp-verify-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        showError(error);
        throw error;
    }
};

const register = async (data: any) => {
    try {
        const result = await identity("/register-with-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),  // Chuyển đổi data thành chuỗi JSON
        });
        return result;
    } catch (error: any) {
        showError(error);
        throw error;
    }
};

const _register = {
    send_otp_verify_email,
    register,
}

export default _register;
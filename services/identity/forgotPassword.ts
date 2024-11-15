import { identity } from "@/utils/request";
import showError from "@/utils/showError";

const send_otp_forget_password = async (data: any) => {
    try {
        const result = await identity("/forget-password", {
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
}

const verify_otp_forget_password = async (url:any, data: any) => {
    try {
        const result = await identity(url, {
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
}

const change_password = async (url: any, data: any) => {
    try {
        const result = await identity(url, {
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
}

const _forgotPassword = {
    send_otp_forget_password,
    verify_otp_forget_password,
    change_password,
}

export default _forgotPassword;
import instance from "@/utils/instance";

export const user_login = async (data: any) => {
    try {
        const result = await instance("/Account/login", {
            method: "POST",
            data: data,
        });
        return result;
    } catch (error: any) {
        console.info(error.response.data);
        return error.response.data;
    }
};

export const user_register = async (data: any) => {
    try {
        const result = await instance("/Account/register-with-otp", {
            method: "POST",
            data: data,
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
};

export const send_otp_verify_email = async (data: any) => {
    try {
        const result = await instance("/Account/send-otp-verify-email", {
            method: "POST",
            data: data,
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
};



import * as api from "@/utils/request";

export const user_login = async (data: any) => {
    try {
        const result = await api.identity("/login", {
            method: "POST",
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        console.info(error.response.data);
        // return error.response.data;
        throw error.response.data;
    }
};

export const user_logout = async (data: any, headers: any) => {
    try {
        const result = await api.identity("/logout",{
            method: "POST",
            headers: headers,
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        throw error;
    }
};

export const user_register = async (data: any) => {
    try {
        const result = await api.identity("/register-with-otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),  // Chuyển đổi data thành chuỗi JSON
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
};


export const send_otp_verify_email = async (data: any) => {
    try {
        const result = await api.identity("/send-otp-verify-email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify(data),
        });
        return result;
    } catch (error: any) {
        console.error('Error details:', error);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);
        } else if (error.request) {
            console.error('Request data:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        return error.message;
    }
};



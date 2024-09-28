import * as api from "@/utils/instance";


export const user_login = async (data: any) => {
    try {
        const result = await api.instance("/Account/login", {
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
        const result = await api.instance("/Account/register-with-otp", {
            method: "POST",
            data: data,
        });
        return result;
    } catch (error: any) {
        return error.response.data;
    }
};

// export const send_otp_verify_email = async (data: any) => {
//     try {
//         const result = await api.instance("/Account/send-otp-verify-email", {
//             method: "POST",
//             data: data,
//         });
//         return result;
//     } catch (error: any) {
//         return error.message;;
//     }
// };

export const send_otp_verify_email = async (data: any) => {
    try {
        const result = await api.instance("/Account/send-otp-verify-email", {
            method: "POST",
            data: data,
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



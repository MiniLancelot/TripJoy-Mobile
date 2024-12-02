// import identity from "@/utils/request";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import register from "@/app/(auth)/register";
import login from "@/services/identity/login";
import logout from "@/services/identity/logout";
import _register from "@/services/identity/register";
import _forgotPassword from "@/services/identity/forgotPassword";
import Toast from "react-native-toast-message";
import get_user_profile from "@/services/user/userProfile";

interface AuthProps {
    session: {
        userToken: any | null;
        userInfo: any | null;
    };
    // forget_password_url?: string;
    login?: (data: any) => Promise<any>;
    logout?: (data: any) => Promise<any>;
    register?: (data: any) => Promise<any>;
    send_otp_verify_email?: (data: any) => Promise<any>;
    send_otp_forget_password?: (data: any) => Promise<any>;
    verify_otp_forget_password?: (data: any) => Promise<any>;
    change_password?: (data: any) => Promise<any>;
}

const AuthContext = createContext<AuthProps | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }: any) => {
    const [userToken, setUserToken] = useState<any>(null);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        const loadUser = async () => {
            // AsyncStorage.clear();
            const storedUser = await AsyncStorage.getItem("user");
            const storedUserInfo = await AsyncStorage.getItem("user_info");
            // console.log("User access token: ", storedUser);
            if (storedUser && storedUserInfo) {
                setUserToken(JSON.parse(storedUser));
                setUserInfo(JSON.parse(storedUserInfo));
            } else {setUserToken(null); setUserInfo(null);}
        };
        loadUser();
    }, []);

    const user_login = async (data: any) => {
        try {
            const result = await login(data);
            if (result && result.status == 200) {
                setUserToken({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                });
                AsyncStorage.setItem(
                    "user",
                    JSON.stringify({
                        accessToken: result.data.accessToken,
                        refreshToken: result.data.refreshToken,
                    })
                );
                get_user_profile(result.data.accessToken).then((result) => {
                    if (result && result.status == 200) {
                        setUserInfo(result.data);
                        AsyncStorage.setItem("user_info", JSON.stringify(result.data));
                    }
                });
            }
        } catch (error: any) {
            throw error;
        }
    };

    const send_otp_verify_email = async (data: any) => {
        try {
            const result = await _register.send_otp_verify_email(data);
            if (result && result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Gửi mã OTP thành công",
                    text2: "Mã OTP đã được gửi đến email của bạn",
                });
            }
        } catch (error: any) {
            throw error;
        }
    };

    const user_register = async (data: any) => {
        // _register.register(data).then((result) => {
        //     if (result && result.status == 200) {
        //         return;
        //     } else throw "Register failed";
        // });
        try {
            const result = await _register.register(data);
            if (result && result.status == 200) {
                return;
            }
        } catch (error: any) {
            throw error;
        }
    };

    const user_logout = async (data: any) => {
        logout(userToken.accessToken, data).then((result) => {
            if (result && result.status == 200) {
                setUserToken(null);
                setUserInfo(null);
                AsyncStorage.removeItem("user");
            }
        });
    };

    const send_otp_forget_password = async (data: any) => {
        // _forgotPassword.send_otp_forget_password(data).then((result) => {
        //     if (result && result.status == 200) {
        //         Toast.show({
        //             type: "success",
        //             text1: "Gửi mã OTP thành công",
        //             text2: result.data.message,
        //         });
        //         setUrl(result.data.url);
        //     }
        //     else {
                // Toast.show({
                //     type: "error",
                //     text1: "Gửi mã OTP thất bại",
                //     text2: "Có lỗi xảy ra khi gửi mã OTP",
                // });
        //     }
        // });
        try {
            const result = await _forgotPassword.send_otp_forget_password(data);
            if (result && result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Gửi mã OTP thành công",
                    text2: result.data.message,
                });
                setUrl(result.data.url);
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Gửi mã OTP thất bại",
                text2: "Có lỗi xảy ra khi gửi mã OTP",
            });
            throw error;
        }
    };

    const verify_otp_forget_password = async (data: any) => {
        // _forgotPassword.verify_otp_forget_password(url, data).then((result) => {
        //     if (result && result.status == 200) {
        //         Toast.show({
        //             type: "success",
        //             text1: "Xác thực mã OTP thành công",
        //             text2: result.data.message,
        //         });
        //         console.log("Result data: ", result.data);
        //         setUrl(result.data.url);
        //     }
        // });
        try {
            const result = await _forgotPassword.verify_otp_forget_password(url, data);
            if (result && result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Xác thực mã OTP thành công",
                    text2: result.data.message,
                });
                console.log("Result data: ", result.data);
                setUrl(result.data.url);
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Xác thực lỗi OTP thất bại",
                text2: "Có lỗi xảy ra khi xác thực OTP",
            });
            throw error;
        }
    };

    const change_password = async (data: any) => {
        try {
            const result = await _forgotPassword.change_password(url, data);
            if (result && result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Thay đổi mật khẩu thành công",
                    text2: result.data.message,
                });
                console.log("Result data: ", result.data);
                setUrl("");
            }
        } catch (error: any) {
            Toast.show({
                type: "error",
                text1: "Thay đổi mật khẩu thất bại",
                text2: "Có lỗi xảy ra khi thay đổi mật khẩu",
            });
            throw error;
        }
    };

    // const get_user_info = async() => {
    //     const user_info = await get_user_profile(userToken.accessToken);
    //     if (user_info && user_info.status == 200) {
    //         setUserInfo(user_info.data);
    //     }
    // }

    const value = {
        login: user_login,
        send_otp_verify_email: send_otp_verify_email,
        register: user_register,
        logout: user_logout,
        send_otp_forget_password: send_otp_forget_password,
        verify_otp_forget_password: verify_otp_forget_password,
        change_password: change_password,
        session: {userToken, userInfo},
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export default AuthProvider;
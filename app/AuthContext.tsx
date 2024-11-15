import * as api from "@/utils/request";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import register from "@/app/register";
import Toast from "react-native-toast-message";

interface AuthProps {
    session: { accessToken: string | null; refreshToken: string | null; name: string | null };
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
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        const loadUser = async () => {
            // AsyncStorage.clear();
          const storedUser = await AsyncStorage.getItem('user');
          console.log("User access token: ", storedUser);
          if (storedUser) {
            setUserToken(JSON.parse(storedUser));
          }
          else setUserToken(null);
        };
        loadUser();
      }, []);

    const user_login = async (data: any) => {
        try {
            const result = await api.identity("/login", {
                method: "POST",
                data: JSON.stringify(data),
            });
            if (result.status == 200) {
                setUserToken({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                    name: result.data.user.name,
                });
                await AsyncStorage.setItem("user", JSON.stringify({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
                    name: result.data.user.name,
                }));
            }
        } catch (error: any) {
            console.info(error);
            // return error.response.data;
            throw error;
        }
    };

    const send_otp_verify_email = async (data: any) => {
        try {
            const result = await api.identity("/send-otp-verify-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),
            });
            if (result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Gửi mã OTP thành công",
                    text2: "Hooray! Mã OTP đã được gửi đến email của bạn",
                  });
            }
        } catch (error: any) {
            console.error("Error details:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            throw error.message;
        }
    };

    // const user_register = async (data: any) => {
    //     try {
    //         const result = await api.identity("/register-with-otp", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //             },
    //             data: JSON.stringify(data),  // Chuyển đổi data thành chuỗi JSON
    //         });
    //         if (result.status == 200) {
    //             setUserToken({
    //                 accessToken: result.data.accessToken,
    //                 refreshToken: result.data.refreshToken,
    //             });
    //             await AsyncStorage.setItem("user", JSON.stringify({
    //                 accessToken: result.data.accessToken,
    //                 refreshToken: result.data.refreshToken,
    //             }));
    //         }
    //     } catch (error: any) {
    //         return error.response.data;
    //     }
    // };

    const user_register = async (data: any) => {
        try {
            const result = await api.identity("/register-with-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),  // Chuyển đổi data thành chuỗi JSON
            });
            if (result.status == 200) {
                return;
            }
            else throw "Register failed";
        } catch (error: any) {
            return error.response.data;
        }
    };

    const user_logout = async (data: any) => {
        try {
            const result = await api.identity("/logout",{
                method: "POST",
                data: JSON.stringify(data),
            });
            if (result.status == 200) {
                setUserToken(null);
                await AsyncStorage.removeItem("user");
            }
        } catch (error: any) {
            throw error;
        }
    }

    const send_otp_forget_password = async (data: any) => {
        try {
            const result = await api.identity("/forget-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),
            });
            if (result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Gửi mã OTP thành công",
                    text2: result.data.message,
                });
                setUrl(result.data.url);
            }
        } catch (error: any) {
            console.error("Error details:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            throw error.message;
        }
    }

    const verify_otp_forget_password = async (data: any) => {
        try {
            const result = await api.identity(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),
            });
            if (result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Xác thực mã OTP thành công",
                    text2: result.data.message,
                });
                console.log("Result data: ", result.data);
                setUrl(result.data.url);
            }
        } catch (error: any) {
            console.error("Error details:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            throw error.message;
        }
    }

    const change_password = async (data: any) => {
        try {
            const result = await api.identity(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(data),
            });
            if (result.status == 200) {
                Toast.show({
                    type: "success",
                    text1: "Thay đổi mật khẩu thành công",
                    text2: result.data.message,
                });
                console.log("Result data: ", result.data);
                setUrl("");
            }
        } catch (error: any) {
            console.error("Error details:", error);
            if (error.response) {
                console.error("Response data:", error.response.data);
                console.error("Response status:", error.response.status);
                console.error("Response headers:", error.response.headers);
            } else if (error.request) {
                console.error("Request data:", error.request);
            } else {
                console.error("Error message:", error.message);
            }
            throw error.message;
        }
    }

    const value = {
        login: user_login,
        send_otp_verify_email: send_otp_verify_email,
        register: user_register,
        logout: user_logout,
        send_otp_forget_password: send_otp_forget_password,
        verify_otp_forget_password: verify_otp_forget_password,
        change_password: change_password,
        session: userToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};


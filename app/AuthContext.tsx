import * as api from "@/utils/request";
import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import register from "@/app/register";

interface AuthProps {
    session: { accessToken: string | null; refreshToken: string | null };   
    login?: (data: any) => Promise<any>;
    logout?: (data: any) => Promise<any>;
    register?: (data: any) => Promise<any>;
    send_otp_verify_email?: (data: any) => Promise<any>;
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

    useEffect(() => {
        const loadUser = async () => {
          const storedUser = await AsyncStorage.getItem('user');
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
                });
                await AsyncStorage.setItem("user", JSON.stringify({
                    accessToken: result.data.accessToken,
                    refreshToken: result.data.refreshToken,
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
                alert("Send OTP verify email successfully");
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

    const value = {
        login: user_login,
        send_otp_verify_email: send_otp_verify_email,
        register: user_register,
        logout: user_logout,
        session: userToken,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

// export const user_logout = async (data: any, headers: any) => {
//     try {
//         const result = await api.identity("/logout", {
//             method: "POST",
//             headers: headers,
//             data: JSON.stringify(data),
//         });
//         return result;
//     } catch (error: any) {
//         throw error;
//     }
// };

// export const user_register = async (data: any) => {
//     try {
//         const result = await api.identity("/register-with-otp", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             data: JSON.stringify(data), // Chuyển đổi data thành chuỗi JSON
//         });
//         return result;
//     } catch (error: any) {
//         return error.response.data;
//     }
// };

// export const send_otp_verify_email = async (data: any) => {
//     try {
//         const result = await api.identity("/send-otp-verify-email", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             data: JSON.stringify(data),
//         });
//         return result;
//     } catch (error: any) {
//         console.error("Error details:", error);
//         if (error.response) {
//             console.error("Response data:", error.response.data);
//             console.error("Response status:", error.response.status);
//             console.error("Response headers:", error.response.headers);
//         } else if (error.request) {
//             console.error("Request data:", error.request);
//         } else {
//             console.error("Error message:", error.message);
//         }
//         return error.message;
//     }
// };

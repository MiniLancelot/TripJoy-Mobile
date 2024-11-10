import {
    View,
    Text,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    StyleSheet,
    Alert,
} from "react-native";
import "@/global.css";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import Title from "@/components/Onboarding/Title";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import SeparateLine from "@/components/Others/SeparateLine";
// import { send_otp_verify_email, user_register } from "@/utils/user_api";
import { useAuth } from "./AuthContext";
import FloatingLabelTextInput from "@/components/Others/FloatingLabelTextInput";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const forgot_password = () => {
    const router = useRouter();
    const facebookIcon = require("@/assets/icons/facebook.png");
    const googleIcon = require("@/assets/icons/google.png");
    const { send_otp_forget_password, verify_otp_forget_password, register } = useAuth();

    // const [enteredName, setEnteredName] = useState("");
    // const [enteredEmail, setEnteredEmail] = useState("");
    // const [enteredOtp, setEnteredOtp] = useState("");
    // const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
    // const [enteredPassword, setEnteredPassword] = useState("");
    // const [enteredValPassword, setEnteredValPassword] = useState("");

    const [registerData, setRegisterData] = useState({
        enteredEmail: "",
        enteredOtp: "",
    });
    const {
        enteredEmail,
        enteredOtp,
    } = registerData;

    const handleChangeRegisterState = (field: any, value: any) => {
        setRegisterData(
            (prev) =>
                (prev = {
                    ...prev,
                    [field]: value,
                })
        );
    };
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isValPasswordVisible, setIsValPasswordVisible] = useState(false);


    const nameBorderColor = useSharedValue("#e7e8ee");
    const passwordBorderColor = useSharedValue("#e7e8ee");
    const otpBorderColor = useSharedValue("#e7e8ee");
    const phoneNumberBorderColor = useSharedValue("#e7e8ee");
    const emailBorderColor = useSharedValue("#e7e8ee");
    const valPasswordBorderColor = useSharedValue("#e7e8ee");
    const emailValidate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const otpValidate = /^[0-9]{6}$/;

    const isRegisterDisabled =
        !enteredEmail ||
        !enteredOtp ||
        !emailValidate.test(enteredEmail) || !otpValidate.test(enteredOtp)
        ;

    // const validateEmail = (email: string) => {
    //     if (email.length === 0) {
    //         console.log("Email không được để trống");
    //         return true;
    //     }
    //     if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
    //         console.log("Email sai cú pháp");
    //         return true;
    //     }
    //     return false;
    // };

    // const validateOtp = (otp: string) => {
    //     if (otp.length === 0) {
    //         console.log("OTP không được để trống");
    //         return true;
    //     }
    //     if (!/^[0-9]{6}$/.test(otp)) {
    //         console.log("OTP phải là 6 số");
    //         return true;
    //     }
    // };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleValPasswordVisibility = () => {
        setIsValPasswordVisible(!isValPasswordVisible);
    };

    const handleFocus = (borderColor: { value: string }) => {
        borderColor.value = withTiming("#657ef8", { duration: 250 });
    };

    const handleBlur = (
        borderColor: { value: string },
        isHavingProblem?: boolean
    ) => {
        borderColor.value = withTiming(
            isHavingProblem ? "#ff0000" : "#e7e8ee",
            {
                duration: 250,
            }
        );
    };

    const animatedBorderStyle = (borderColor: { value: any }) =>
        useAnimatedStyle(() => ({
            borderColor: borderColor.value,
        }));

    const handleSendOtpEmail = async () => {
        if (!emailValidate.test(enteredEmail)) {
            alert("Email không hợp lệ");
            return;
        }
        await send_otp_forget_password!({
            email: enteredEmail.trim(),
        });
    };

    const handleVerifyOtpEmail = async () => {
        await verify_otp_forget_password!({
            otp: enteredOtp.trim(),
        }).then(() => {
            router.push("/new_password");
        });
    }

    const handleRegister = async () => {
        // if (enteredPassword !== enteredValPassword) {
        //     alert("Mật khẩu không khớp");
        //     return;
        // }
        // try {
        //     await register!({
        //         name: enteredName.trim(),
        //         email: enteredEmail.trim(),
        //         otp: enteredOtp.trim(),
        //         phoneNumber: enteredPhoneNumber.trim(),
        //         password: enteredPassword.trim(),
        //         confirmPassword: enteredValPassword.trim(),
        //     });
        //     Alert.alert(
        //         "Alert",
        //         "Register successfully",
        //         [{ text: "OK", onPress: () => router.replace("/login") }],
        //         { cancelable: false }
        //     );
        // } catch (error: any) {
        //     console.error(error.response);
        // }
    };

    const testHandleRegister = () => {
        console.log(registerData);
        handleRegister();
    };
    return (
        <ScrollView className="flex-1 bg-[#fff]">
            <StatusBar style="dark" />
            <View className="flex-1 px-[15px] pt-[25px] min-h-screen">
                <View className="width-full items-center">
                    <View className="rounded-[100px]  overflow-hidden self-start ">
                        <Pressable
                            className="p-[7px]"
                            android_ripple={{ color: "gray" }}
                            onPress={() => router.back()}
                        >
                            <Ionicons
                                name="chevron-back-outline"
                                size={25}
                                color="#4a4d52"
                                className="translate-x-[-2px]"
                            />
                        </Pressable>
                    </View>
                    <View className="flex-1 self-center translate-y-[-20px]">
                        <Title />
                    </View>
                </View>
                
                <SeparateLine text="Quên mật khẩu"/>
                <View className="flex-1 items-center translate-x-[-10px]">
                    <View className="w-4/5">
                        <View className="flex-row">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-xl pr-[100px]"
                                style={animatedBorderStyle(emailBorderColor)}
                                placeholder="Email"
                                maxLength={30}
                                value={enteredEmail}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredEmail",
                                        text
                                    )
                                }
                                onFocus={() => handleFocus(emailBorderColor)}
                                onBlur={() =>
                                    handleBlur(
                                        emailBorderColor,
                                        !emailValidate.test(enteredEmail)
                                    )
                                }
                                selectionColor="#657ef8"
                            />
                            {enteredEmail.length > 0 && (
                                <Pressable
                                    className="right-[11px] top-[29px] absolute"
                                    onPress={() =>
                                        handleChangeRegisterState(
                                            "enteredEmail",
                                            ""
                                        )
                                    }
                                >
                                    <Ionicons
                                        name="close-circle-outline"
                                        size={24}
                                        color="#9FB7B9"
                                    />
                                </Pressable>
                            )}
                        </View>
                        <View className="flex-row items-center justify-around">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-4/6 h-[60px] text-xl"
                                style={animatedBorderStyle(otpBorderColor)}
                                placeholder="OTP"
                                maxLength={6}
                                value={enteredOtp}
                                keyboardType={"phone-pad"}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredOtp",
                                        text
                                    )
                                }
                                onFocus={() => handleFocus(otpBorderColor)}
                                onBlur={() =>
                                    handleBlur(
                                        otpBorderColor,
                                        enteredOtp.length === 0
                                    )
                                }
                                selectionColor="#657ef8"
                            />
                            {/* {enteredOtp.length > 0 && (
                                <Pressable
                                    className="right-[11px] top-[29px] absolute"
                                    onPress={() =>
                                        clearText(setEnteredOtp)
                                    }
                                >
                                    <Ionicons
                                        name="close-circle-outline"
                                        size={24}
                                        color="#9FB7B9"
                                    />
                                </Pressable>
                            )} */}
                            <View
                                className=" bg-[#13c892] rounded-lg overflow-hidden w-1/4"
                                // style={styles.shadow}
                            >
                                <Pressable
                                    onPress={handleSendOtpEmail}
                                    disabled={!emailValidate.test(enteredEmail)}
                                    android_ripple={
                                        !emailValidate.test(enteredEmail) ? null : { color: "gray" }
                                    }
                                >
                                    <View
                                        className="justify-center items-center py-[15px] px-[15px]"
                                        style={
                                            !emailValidate.test(enteredEmail) &&
                                            styles.registerButtonDisabled
                                        }
                                    >
                                        <Text className="text-[#fff] text-xl">
                                            Gửi
                                        </Text>
                                    </View>
                                </Pressable>
                            </View>
                        </View>

                    </View>
                    <View
                        className="bg-[#13c892] rounded-lg overflow-hidden m-[10px] mt[20px] w-4/5 translate-x-[10px]"
                        style={styles.shadow}
                    >
                        <Pressable
                            onPress={handleVerifyOtpEmail}
                            disabled={isRegisterDisabled}
                            android_ripple={
                                isRegisterDisabled ? null : { color: "gray" }
                            }
                        >
                            <View
                                className="p-[10px] justify-center items-center"
                                style={
                                    isRegisterDisabled &&
                                    styles.registerButtonDisabled
                                }
                            >
                                <Text className="ml-[10px] text-[#fff] text-2xl">
                                    Xác nhận
                                </Text>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    registerButtonDisabled: {
        backgroundColor: "gray",
    },
});

export default forgot_password;

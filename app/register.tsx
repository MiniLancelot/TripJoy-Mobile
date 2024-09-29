import {
    View,
    Text,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    StyleSheet,
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
import { send_otp_verify_email, user_register } from "@/utils/user_api";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const register = () => {
    const router = useRouter();
    const facebookIcon = require("@/assets/icons/facebook.png");
    const googleIcon = require("@/assets/icons/google.png");

    // const [enteredName, setEnteredName] = useState("");
    // const [enteredEmail, setEnteredEmail] = useState("");
    // const [enteredOtp, setEnteredOtp] = useState("");
    // const [enteredPhoneNumber, setEnteredPhoneNumber] = useState("");
    // const [enteredPassword, setEnteredPassword] = useState("");
    // const [enteredValPassword, setEnteredValPassword] = useState("");

    const [registerData, setRegisterData] = useState({
        enteredName: "",
        enteredEmail: "",
        enteredOtp: "",
        enteredPhoneNumber: "",
        enteredPassword: "",
        enteredValPassword: "",
    });
    const {
        enteredName,
        enteredEmail,
        enteredOtp,
        enteredPhoneNumber,
        enteredPassword,
        enteredValPassword,
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

    const isRegisterDisabled =
        !enteredName ||
        !enteredEmail ||
        !enteredOtp ||
        !enteredPhoneNumber ||
        !enteredPassword ||
        !enteredValPassword;

    const isOtpDisabled = !enteredEmail;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleValPasswordVisibility = () => {
        setIsValPasswordVisible(!isValPasswordVisible);
    };

    // const clearText = (setText: (text: string) => void) => {
    //     setText("");
    // };

    const handleFocus = (borderColor: { value: string }) => {
        borderColor.value = withTiming("#657ef8", { duration: 250 });
    };

    const handleBlur = (borderColor: { value: string }) => {
        borderColor.value = withTiming("#e7e8ee", { duration: 250 });
    };

    const animatedBorderStyle = (borderColor: { value: any }) =>
        useAnimatedStyle(() => ({
            borderColor: borderColor.value,
        }));





        const handleVerifyOtpEmail = () => {
            const data = {
                email: enteredEmail,
            };
        
            send_otp_verify_email(data)
                .then((response) => {
                    //console.log('Response:', response);
                    if (response && response.status === 200) {
                        alert("Gửi OTP thành công");
                    } else {
                        console.error('Unexpected response structure:', response);
                        alert("Failed to send OTP");
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    alert("An error occurred while sending OTP");
                });
        };

    const handleRegister = () => {
        if (enteredPassword !== enteredValPassword) {
            alert("Mật khẩu không khớp");
            return;
        }
        user_register({
            name: enteredName.trim(),
            email: enteredEmail.trim(),
            otp: enteredOtp.trim(),
            phoneNumber: enteredPhoneNumber.trim(),
            password: enteredPassword.trim(),
            confirmPassword: enteredValPassword.trim(),
        })
            .then((response) => {
                console.log(response);
                if (response.status === 200) {
                    alert("Đăng ký thành công");
                    router.replace("/login");
                }
            })
            .catch((error) => {
                console.log(error);
            });
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
                <View className="p-[10px] pt-[0px] w-full items-center">
                    <View
                        className="rounded-full overflow-hidden m-[10px] w-4/5"
                        style={styles.shadow}
                    >
                        <Pressable
                            className="flex-row bg-[#fff] p-[10px] justify-between items-center"
                            onPress={() => alert("Google")}
                            android_ripple={{ color: "gray" }}
                        >
                            <Image
                                source={googleIcon}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text className="ml-[10px] text-[#000] text-2xl">
                                Đăng ký với Google
                            </Text>
                            <View className="p-[5px]"></View>
                        </Pressable>
                    </View>
                    <View
                        className="rounded-full overflow-hidden m-[10px] w-4/5"
                        style={styles.shadow}
                    >
                        <Pressable
                            className="flex-row bg-[#fff] p-[10px] justify-between items-center"
                            onPress={() => alert("Facebook")}
                            android_ripple={{ color: "gray" }}
                        >
                            <Image
                                source={facebookIcon}
                                style={{ width: 30, height: 30 }}
                            />
                            <Text className="ml-[10px] text-[#000] text-2xl">
                                Đăng ký với Facebook
                            </Text>
                            <View className="p-[5px]"></View>
                        </Pressable>
                    </View>
                </View>
                <SeparateLine />
                <View className="flex-1 items-center translate-x-[-10px]">
                    <View className="w-4/5">
                        <View className="flex-row">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-xl pr-[100px]"
                                style={animatedBorderStyle(nameBorderColor)}
                                placeholder="Tên đăng nhập"
                                maxLength={30}
                                value={enteredName}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredName",
                                        text
                                    )
                                }
                                onFocus={() => handleFocus(nameBorderColor)}
                                onBlur={() => handleBlur(nameBorderColor)}
                                selectionColor="#657ef8"
                            />
                            {enteredName.length > 0 && (
                                <Pressable
                                    className="right-[11px] top-[29px] absolute"
                                    onPress={() =>
                                        handleChangeRegisterState(
                                            "enteredName",
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
                                onBlur={() => handleBlur(emailBorderColor)}
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
                                keyboardType={"number-pad"}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredOtp",
                                        text
                                    )
                                }
                                onFocus={() => handleFocus(otpBorderColor)}
                                onBlur={() => handleBlur(otpBorderColor)}
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
                                    onPress={handleVerifyOtpEmail}
                                    disabled={isOtpDisabled}
                                    android_ripple={
                                        isOtpDisabled ? null : { color: "gray" }
                                    }
                                >
                                    <View
                                        className="justify-center items-center py-[15px] px-[15px]"
                                        style={
                                            isOtpDisabled &&
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

                        <View className="flex-row">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-xl pr-[100px]"
                                style={animatedBorderStyle(
                                    phoneNumberBorderColor
                                )}
                                placeholder="Số điện thoại"
                                maxLength={15}
                                value={enteredPhoneNumber}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredPhoneNumber",
                                        text
                                    )
                                }
                                onFocus={() =>
                                    handleFocus(phoneNumberBorderColor)
                                }
                                onBlur={() =>
                                    handleBlur(phoneNumberBorderColor)
                                }
                                selectionColor="#657ef8"
                            />
                            {enteredPhoneNumber.length > 0 && (
                                <Pressable
                                    className="right-[11px] top-[29px] absolute"
                                    onPress={() =>
                                        handleChangeRegisterState(
                                            "enteredPhoneNumber",
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

                        <View className="flex-row items-center">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-xl pr-[100px]"
                                style={animatedBorderStyle(passwordBorderColor)}
                                placeholder="Mật khẩu"
                                maxLength={30}
                                secureTextEntry={!isPasswordVisible}
                                value={enteredPassword}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredPassword",
                                        text
                                    )
                                }
                                onFocus={() => handleFocus(passwordBorderColor)}
                                onBlur={() => handleBlur(passwordBorderColor)}
                                selectionColor="#657ef8"
                            />
                            {enteredPassword.length > 0 && (
                                <Pressable
                                    className="right-[48px] top-[29px] absolute"
                                    onPress={() =>
                                        handleChangeRegisterState(
                                            "enteredPassword",
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
                            <Pressable
                                className="absolute right-[10px] p-[0px]"
                                onPress={togglePasswordVisibility}
                            >
                                <Ionicons
                                    name={
                                        isPasswordVisible
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                    size={24}
                                    color="#9FB7B9"
                                />
                            </Pressable>
                        </View>
                        <View className="flex-row items-center">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-xl pr-[100px]"
                                style={animatedBorderStyle(
                                    valPasswordBorderColor
                                )}
                                placeholder="Xác nhận mật khẩu"
                                maxLength={30}
                                secureTextEntry={!isValPasswordVisible}
                                value={enteredValPassword}
                                onChangeText={(text) =>
                                    handleChangeRegisterState(
                                        "enteredValPassword",
                                        text
                                    )
                                }
                                onFocus={() =>
                                    handleFocus(valPasswordBorderColor)
                                }
                                onBlur={() =>
                                    handleBlur(valPasswordBorderColor)
                                }
                                selectionColor="#657ef8"
                            />
                            {enteredValPassword.length > 0 && (
                                <Pressable
                                    className="right-[48px] top-[29px] absolute"
                                    onPress={() =>
                                        handleChangeRegisterState(
                                            "enteredValPassword",
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
                            <Pressable
                                className="absolute right-[10px] p-[0px]"
                                onPress={toggleValPasswordVisibility}
                            >
                                <Ionicons
                                    name={
                                        isValPasswordVisible
                                            ? "eye-outline"
                                            : "eye-off-outline"
                                    }
                                    size={24}
                                    color="#9FB7B9"
                                />
                            </Pressable>
                        </View>
                    </View>
                    <View
                        className="bg-[#13c892] rounded-lg overflow-hidden m-[10px] mt[20px] w-4/5 translate-x-[10px]"
                        style={styles.shadow}
                    >
                        <Pressable
                            onPress={testHandleRegister}
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
                                    Đăng ký
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

export default register;

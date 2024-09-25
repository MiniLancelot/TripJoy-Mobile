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

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const register = () => {
    const rounter = useRouter();
    const facebookIcon = require("@/assets/icons/facebook.png");
    const googleIcon = require("@/assets/icons/google.png");

    const [enteredUserName, setEnteredUserName] = useState("");
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [enteredValPassword, setEnteredValPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [isValPasswordVisible, setIsValPasswordVisible] = useState(false);

    const userNameBorderColor = useSharedValue("#e7e8ee");
    const passwordBorderColor = useSharedValue("#e7e8ee");
    const otpBorderColor = useSharedValue("#e7e8ee");
    const emailBorderColor = useSharedValue("#e7e8ee");
    const valPasswordBorderColor = useSharedValue("#e7e8ee");

    const isRegisterDisabled = !enteredUserName || !enteredEmail || !enteredOtp || !enteredPassword || !enteredValPassword;

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const toggleValPasswordVisibility = () => {
        setIsValPasswordVisible(!isValPasswordVisible);
    };

    const clearText = (setText: (text: string) => void) => {
        setText("");
    };

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
    return (
        <ScrollView className="flex-1 bg-[#fff]">
            <StatusBar style="dark" />
            <View className="flex-1 px-[15px] pt-[30px]  min-h-screen">
                <View className="rounded-[100px]  overflow-hidden self-start">
                    <Pressable
                        className="p-[7px]"
                        android_ripple={{ color: "gray" }}
                        onPress={() => rounter.back()}
                    >
                        <Ionicons
                            name="chevron-back-outline"
                            size={25}
                            color="#4a4d52"
                            className="translate-x-[-2px]"
                        />
                    </Pressable>
                </View>
                <View className="width-full items-center">
                    <Title />
                </View>
                <View className="p-[10px] w-full items-center">
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
                                style={animatedBorderStyle(userNameBorderColor)}
                                placeholder="Tên đăng nhập"
                                maxLength={30}
                                value={enteredUserName}
                                onChangeText={(text) =>
                                    setEnteredUserName(text)
                                }
                                onFocus={() => handleFocus(userNameBorderColor)}
                                onBlur={() => handleBlur(userNameBorderColor)}
                                selectionColor="#657ef8"
                            />
                            {enteredUserName.length > 0 && (
                                <Pressable
                                    className="right-[11px] top-[29px] absolute"
                                    onPress={() =>
                                        clearText(setEnteredUserName)
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
                                onChangeText={(text) => setEnteredEmail(text)}
                                onFocus={() => handleFocus(emailBorderColor)}
                                onBlur={() => handleBlur(emailBorderColor)}
                                selectionColor="#657ef8"
                            />
                            {enteredEmail.length > 0 && (
                                <Pressable
                                    className="right-[11px] top-[29px] absolute"
                                    onPress={() => clearText(setEnteredEmail)}
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
                                onChangeText={(text) => setEnteredOtp(text)}
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
                                    className="justify-center items-center py-[15px] px-[15px]"
                                    onPress={() => alert("Gửi OTP")}
                                    android_ripple={{ color: "gray" }}
                                >
                                    <Text className="text-[#fff] text-xl">
                                        Gửi
                                    </Text>
                                </Pressable>
                            </View>
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
                                    setEnteredPassword(text)
                                }
                                onFocus={() => handleFocus(passwordBorderColor)}
                                onBlur={() => handleBlur(passwordBorderColor)}
                                selectionColor="#657ef8"
                            />
                            {enteredPassword.length > 0 && (
                                <Pressable
                                    className="right-[48px] top-[29px] absolute"
                                    onPress={() =>
                                        clearText(setEnteredPassword)
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
                                    setEnteredValPassword(text)
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
                                        clearText(setEnteredValPassword)
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
                            onPress={() => alert("Đăng ký")}
                            disabled={isRegisterDisabled}
                            android_ripple={
                              isRegisterDisabled ? null : { color: "gray" }
                            }
                        >
                            <View
                                className="p-[10px] justify-center items-center"
                                style={
                                  isRegisterDisabled && styles.registerButtonDisabled
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

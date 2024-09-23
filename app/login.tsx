import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
    TextInput,
    Alert,
} from "react-native";
import { useState } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import Title from "@/components/Onboarding/Title";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import request from "@/utils/request";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import FontAwesome from "@expo/vector-icons/FontAwesome";
import "@/global.css";

const { width, height } = Dimensions.get("window");
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Login = () => {
    const router = useRouter();
    const facebookIcon = require("@/assets/icons/facebook.png");
    const googleIcon = require("@/assets/icons/google.png");

    const [enteredUserName, setEnteredUserName] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const userNameBorderColor = useSharedValue("#e7e8ee");
    const passwordBorderColor = useSharedValue("#e7e8ee");

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
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

    const isLoginDisabled = !enteredUserName || !enteredPassword;

    const handleGoogleLogin = async () => {
        try {
            const result = await WebBrowser.openBrowserAsync(
                "http:/10.0.2.2:7100/api/v1/Account/login-google"
            );
            if (result.type === "opened") {
                console.log(result);
                Alert.alert(
                    "Login Successful",
                    "You have successfully logged in with Google."
                );
            } else {
                Alert.alert("Login Cancelled", "Google login was cancelled.");
            }
        } catch (error) {
            console.error(error);
            Alert.alert(
                "Login Failed",
                "An error occurred during Google login."
            );
        }
    };

    const handleLogin = async () => {
        await request
            .post("/Account/login", {
                email: enteredUserName,
                password: enteredPassword,
            })
            .then((response) => {
                console.log(response.data.user.name);
                AsyncStorage.setItem("info", JSON.stringify(response.data));
                router.push("/home");
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    const values = Object.values(error.response.data.errors); 
                    if (Array.isArray(values[0])) {
                        console.error(values[0][0]);
                    }
                }
                else if (error.request) {
                    console.error("No response received from the server.");
                }
                else {
                    console.error(error.message);
                }
            });
    };

    return (
        <View className="flex-1 pt-[75px] items-center bg-[#F2FDFF] min-h-screen">
            <View className="flex-[0.25] bg-[#F2FDFF] w-full items-center">
                <Title />
            </View>
            <View className="p-[10px] w-full items-center">
                <View
                    className="rounded-full overflow-hidden m-[10px] w-4/5"
                    style={styles.shadow}
                >
                    <Pressable
                        className="flex-row bg-[#fff] p-[10px] justify-center items-center"
                        onPress={handleGoogleLogin}
                        android_ripple={{ color: "gray" }}
                    >
                        <Image
                            source={googleIcon}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text className="ml-[10px] text-[#000] text-2xl">
                            Login with Google
                        </Text>
                    </Pressable>
                </View>
                <View
                    className="rounded-full overflow-hidden m-[10px] w-4/5"
                    style={styles.shadow}
                >
                    <Pressable
                        className="flex-row bg-[#fff] p-[10px] justify-center items-center"
                        onPress={() => alert("Facebook")}
                        android_ripple={{ color: "gray" }}
                    >
                        <Image
                            source={facebookIcon}
                            style={{ width: 30, height: 30 }}
                        />
                        <Text className="ml-[10px] text-[#000] text-2xl">
                            Login with Facebook
                        </Text>
                    </Pressable>
                </View>
            </View>
            <View className="flex-row items-center my-[20px] mx-[40px]">
                <View className="flex-1 h-[1px] bg-[#9FB7B9]" />
                <Text className="mx-[10px] text-2xl text-[#9FB7B9]">or</Text>
                <View className="flex-1 h-[1px] bg-[#9FB7B9]" />
            </View>
            <View className="items-center w-4/5">
                <View className="flex-row">
                    <AnimatedTextInput
                        className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl"
                        style={animatedBorderStyle(userNameBorderColor)}
                        placeholder="Tên đăng nhập"
                        maxLength={30}
                        value={enteredUserName}
                        onChangeText={(text) => setEnteredUserName(text)}
                        onFocus={() => handleFocus(userNameBorderColor)}
                        onBlur={() => handleBlur(userNameBorderColor)}
                        selectionColor="#657ef8"
                    />
                    {enteredUserName.length > 0 && (
                        <Pressable
                            className="right-[31px] top-[29px] absolute"
                            onPress={() => clearText(setEnteredUserName)}
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
                        className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl"
                        style={animatedBorderStyle(passwordBorderColor)}
                        placeholder="Mật khẩu"
                        maxLength={30}
                        secureTextEntry={!isPasswordVisible}
                        value={enteredPassword}
                        onChangeText={(text) => setEnteredPassword(text)}
                        onFocus={() => handleFocus(passwordBorderColor)}
                        onBlur={() => handleBlur(passwordBorderColor)}
                        selectionColor="#657ef8"
                    />
                    {enteredPassword.length > 0 && (
                        <Pressable
                            className="right-[73px] top-[29px] absolute"
                            onPress={() => clearText(setEnteredPassword)}
                        >
                            <Ionicons
                                name="close-circle-outline"
                                size={24}
                                color="#9FB7B9"
                            />
                        </Pressable>
                    )}
                    <Pressable
                        className="absolute right-[20px] p-[10px]"
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
            </View>

            <View
                className="bg-[#13c892] rounded-lg overflow-hidden m-[10px] mt[20px] w-4/5"
                style={styles.shadow}
            >
                <Pressable
                    onPress={handleLogin}
                    disabled={isLoginDisabled}
                    android_ripple={isLoginDisabled ? null : { color: "gray" }}
                    // android_ripple={{ color: "gray" }}
                >
                    <View
                        className="p-[10px] justify-center items-center"
                        style={isLoginDisabled && styles.loginButtonDisabled}
                    >
                        <Text className="ml-[10px] text-[#fff] text-2xl">
                            Đăng nhập
                        </Text>
                    </View>
                </Pressable>
            </View>

            <View className="mt-[3px] flex-row justify-between items-center pb-[45px] w-4/5">
                <Pressable onPress={() => alert("Forgot password")}>
                    <Text className="text-[#758bf9] text-lg font-semibold">
                        Quên mật khẩu?
                    </Text>
                </Pressable>
                <Pressable onPress={() => alert("Sign up")}>
                    <Text className="text-[#758bf9] text-lg font-semibold">
                        Đăng ký
                    </Text>
                </Pressable>
            </View>
        </View>
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
    loginButtonDisabled: {
        backgroundColor: "gray",
    },
});
export default Login;

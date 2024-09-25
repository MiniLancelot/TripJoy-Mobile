import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    Dimensions,
    TextInput,
    Alert,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import { useState, useRef } from "react";
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
import SeparateLine from "@/components/Others/SeparateLine";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Login = () => {
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
        useWindowDimensions();
    const router = useRouter();
    const facebookIcon = require("@/assets/icons/facebook.png");
    const googleIcon = require("@/assets/icons/google.png");

    const [enteredUserName, setEnteredUserName] = useState("");
    const [enteredPassword, setEnteredPassword] = useState("");
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const usernameRef = useRef<TextInput>(null);
    const passwordRef = useRef<TextInput>(null);

    const handleUsernameFocus = () => {
        usernameRef.current?.focus();
    }
    const handlePasswordFocus = () => {
        passwordRef.current?.focus();
    }

    const userNameBorderColor = useSharedValue("#e7e8ee");
    const passwordBorderColor = useSharedValue("#e7e8ee");

    const inputAnimation: { [key: string]: any } = {
        username: [
            useSharedValue(21),
            useSharedValue("#6b707b"),
            useSharedValue(-158),
            useSharedValue(26),
        ],
        password: [
            useSharedValue(21),
            useSharedValue("#6b707b"),
            useSharedValue(-183),
            useSharedValue(26),
        ],
    };

    // react-native-reanimated rất ngu khi xử lý font size với transition vậy nên khi làm phải tách chúng ra
    const animatedUsernameFontSize = useAnimatedStyle(() => ({
        fontSize: inputAnimation["username"][0].value,
        color: inputAnimation["username"][1].value,
    }));

    const animatedusernameTransform = useAnimatedStyle(() => ({
        transform: [
            { translateX: inputAnimation["username"][2].value },
            { translateY: inputAnimation["username"][3].value },
        ],
    }));

    const animatedPasswordFontSize = useAnimatedStyle(() => ({
        fontSize: inputAnimation["password"][0].value,
        color: inputAnimation["password"][1].value,
    }));

    const animatedPasswordTransform = useAnimatedStyle(() => ({
        transform: [
            { translateX: inputAnimation["password"][2].value },
            { translateY: inputAnimation["password"][3].value },
        ],
    }));

    const animateInput = (
        input: string,
        fontSize: number,
        color: string,
        translateX: number,
        translateY: number
    ) => {
        inputAnimation[input][0].value = withTiming(fontSize, {
            duration: 200,
        });
        inputAnimation[input][1].value = withTiming(color, { duration: 250 });
        inputAnimation[input][2].value = withTiming(translateX, {
            duration: 200,
        });
        inputAnimation[input][3].value = withTiming(translateY, {
            duration: 200,
        });
    };

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
                "http:/192.168.1.10:7100/api/v1/Account/login-google"
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
                } else if (error.request) {
                    console.error("No response received from the server.");
                } else {
                    console.error(error.message);
                }
            });
    };

    return (
        <ScrollView className="flex-1 bg-[#fff] ">
            <View className="flex-1 pt-[60px] items-center  min-h-screen">
                <View className="flex-[0.25] w-full items-center">
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
                <SeparateLine />
                <View className="items-center w-4/5">
                    <View className="items-center">
                        <Animated.Text
                            className="absolute z-10 bg-[#fff] color-[#9FB7B9] px-[2px] rounded-lg"
                            style={[
                                animatedUsernameFontSize,
                                animatedusernameTransform,
                            ]}
                        >
                            Tên đăng nhập
                        </Animated.Text>
                        <View className="flex-row">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl pr-[100px]"
                                style={animatedBorderStyle(userNameBorderColor)}
                                maxLength={30}
                                value={enteredUserName}
                                onChangeText={(text) =>
                                    setEnteredUserName(text)
                                }
                                onFocus={() => {
                                    handleFocus(userNameBorderColor);
                                    animateInput(
                                        "username",
                                        15,
                                        "#657ef8",
                                        -178,
                                        0
                                    );
                                }}
                                onBlur={() => {
                                    handleBlur(userNameBorderColor);
                                    if(enteredUserName.trim() === "") {
                                        animateInput(
                                            "username",
                                            21,
                                            "#6b707b",
                                            -158,
                                            26
                                        );
                                    }
                                    else {
                                        animateInput(
                                            "username",
                                            15,
                                            "#6b707b",
                                            -178,
                                            0
                                        );
                                    }
                                }}
                                selectionColor="#657ef8"
                            />
                            {enteredUserName.length > 0 && (
                                <Pressable
                                    className="right-[31px] top-[29px] absolute"
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
                    </View>
                    <View className="items-center">
                        <Animated.Text
                            className="absolute z-10 bg-[#fff] color-[#9FB7B9] px-[2px] rounded-lg"
                            style={[
                                animatedPasswordFontSize,
                                animatedPasswordTransform,
                            ]}
                        >
                            Mật khẩu
                        </Animated.Text>
                        <View className="flex-row items-center">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl pr-[100px]"
                                style={animatedBorderStyle(passwordBorderColor)}
                                maxLength={30}
                                secureTextEntry={!isPasswordVisible}
                                value={enteredPassword}
                                onChangeText={(text) =>
                                    setEnteredPassword(text)
                                }
                                onFocus={() => {
                                    handleFocus(passwordBorderColor);
                                    animateInput(
                                        "password",
                                        15,
                                        "#657ef8",
                                        -196,
                                        0
                                    );
                                }}
                                onBlur={() => {
                                    handleBlur(passwordBorderColor);
                                    if(enteredPassword.trim() === "") {
                                        animateInput(
                                            "password",
                                            21,
                                            "#6b707b",
                                            -183,
                                            26
                                        );
                                    }
                                    else {
                                        animateInput(
                                            "password",
                                            15,
                                            "#6b707b",
                                            -196,
                                            0
                                        );
                                    }
                                }}
                                selectionColor="#657ef8"
                            />
                            {enteredPassword.length > 0 && (
                                <Pressable
                                    className="right-[73px] top-[29px] absolute"
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
                </View>

                <View
                    className="bg-[#13c892] rounded-lg overflow-hidden m-[10px] mt[20px] w-4/5"
                    style={styles.shadow}
                >
                    <Pressable
                        // onPress={() => {console.log(enteredUserName, enteredPassword)}}
                        onPress={handleLogin}
                        disabled={isLoginDisabled}
                        android_ripple={
                            isLoginDisabled ? null : { color: "gray" }
                        }
                        // android_ripple={{ color: "gray" }}
                    >
                        <View
                            className="p-[10px] justify-center items-center"
                            style={
                                isLoginDisabled && styles.loginButtonDisabled
                            }
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
                    <Pressable onPress={() => router.push("/register")}>
                        <Text className="text-[#758bf9] text-lg font-semibold">
                            Đăng ký
                        </Text>
                    </Pressable>
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
    loginButtonDisabled: {
        backgroundColor: "gray",
    },
});
export default Login;

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    TextInput,
    Alert,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import { useState, useRef, useEffect } from "react";
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
import { user_login } from "@/utils/user_api";

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
    };
    const handlePasswordFocus = () => {
        passwordRef.current?.focus();
    };

    const [usernameHeight, setUsernameHeight] = useState(0);
    const [passwordHeight, setPasswordHeight] = useState(0);

    const onLayoutUsername = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setUsernameHeight(height);
    };

    const onLayoutPassword = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setPasswordHeight(height);
    };

    const userNameBorderColor = useSharedValue("#e7e8ee");
    const passwordBorderColor = useSharedValue("#e7e8ee");

    const inputAnimation: { [key: string]: any } = {
        username: [
            useSharedValue(0), //21
            useSharedValue("#6b707b"),
            useSharedValue(0), //26
        ],
        password: [
            useSharedValue(0),
            useSharedValue("#6b707b"),
            useSharedValue(0),
        ],
    };

    useEffect(() => {
        if (usernameHeight > 0) {
            inputAnimation["username"][0].value = usernameHeight * 0.35;
        }
    }, [passwordHeight]);

    useEffect(() => {
        if (passwordHeight > 0) {
            inputAnimation["password"][0].value = passwordHeight * 0.35;
        }
    }, [passwordHeight]);

    const animatedUsernameFontSize = useAnimatedStyle(() => ({
        fontSize: inputAnimation["username"][0].value,
        color: inputAnimation["username"][1].value,
    }));

    const animatedusernameTransform = useAnimatedStyle(() => ({
        transform: [{ translateY: inputAnimation["username"][2].value }],
    }));

    const animatedPasswordFontSize = useAnimatedStyle(() => ({
        fontSize: inputAnimation["password"][0].value,
        color: inputAnimation["password"][1].value,
    }));

    const animatedPasswordTransform = useAnimatedStyle(() => ({
        transform: [{ translateY: inputAnimation["password"][2].value }],
    }));

    const animateInput = (
        input: string,
        fontSize: number,
        color: string,
        translateY: number
    ) => {
        inputAnimation[input][0].value = withTiming(fontSize, {
            duration: 200,
        });
        inputAnimation[input][1].value = withTiming(color, { duration: 250 });
        inputAnimation[input][2].value = withTiming(translateY, {
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

    // const handleLogin = async () => {
    //     await request
    //         .post("/Account/login", {
    //             email: enteredUserName,
    //             password: enteredPassword,
    //         })
    //         .then((response) => {
    //             console.log(response.data.user.name);
    //             AsyncStorage.setItem("info", JSON.stringify(response.data));
    //             router.push("/home");
    //         })
    //         .catch((error) => {
    //             if (error.response && error.response.data) {
    //                 const values = Object.values(error.response.data.errors);
    //                 if (Array.isArray(values[0])) {
    //                     console.error(values[0][0]);
    //                 }
    //             } else if (error.request) {
    //                 console.error("No response received from the server.");
    //             } else {
    //                 console.error(error.message);
    //             }
    //         });
    // };

    const handleLoginTest = () => {
        user_login({
            email: enteredUserName,
            password: enteredPassword,
        })
            .then((response) => {
                console.log(response.data);
                if (response.status == 200) {
                    AsyncStorage.setItem(
                        "info",
                        JSON.stringify({
                            accessToken: response.data.userLogin.accessToken,
                            refreshToken: response.data.userLogin.refreshToken,
                        })
                    );
                    router.replace("/home");
                }
            })
            .catch((err) => {
                console.error(err.detail);
                // console.info(err.message);
            });
    };

    return (
        <ScrollView className="flex-1 bg-[#fff] ">
            <View className="flex-1 pt-[60px] items-center min-h-screen">
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
                        <Pressable
                            className="absolute z-10 bg-transparent self-start px-3 translate-y-[26]"
                            onPress={handleUsernameFocus}
                        >
                            <Animated.Text
                                className="bg-[#fff] color-[#9FB7B9] mx-[20px] rounded-lg px-[2px]"
                                style={[
                                    animatedUsernameFontSize,
                                    animatedusernameTransform,
                                ]}
                            >
                                Tên đăng nhập
                            </Animated.Text>
                        </Pressable>
                        <View className="flex-row">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl pr-[100px]"
                                style={animatedBorderStyle(userNameBorderColor)}
                                // placeholder={"Tên đăng nhập"}
                                ref={usernameRef}
                                maxLength={30}
                                value={enteredUserName}
                                onChangeText={(text) =>
                                    setEnteredUserName(text)
                                }
                                onFocus={() => {
                                    handleFocus(userNameBorderColor);
                                    animateInput(
                                        "username",
                                        usernameHeight * 0.21,
                                        "#657ef8",
                                        -26
                                    );
                                }}
                                onBlur={() => {
                                    handleBlur(userNameBorderColor);
                                    if (enteredUserName.trim() === "") {
                                        animateInput(
                                            "username",
                                            usernameHeight * 0.35,
                                            "#6b707b",
                                            0
                                        );
                                    } else {
                                        animateInput(
                                            "username",
                                            usernameHeight * 0.21,
                                            "#6b707b",
                                            -26
                                        );
                                    }
                                }}
                                onLayout={onLayoutUsername}
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
                        <Pressable
                            className="absolute z-10 bg-transparent self-start px-3 translate-y-[26]"
                            onPress={handlePasswordFocus}
                        >
                            <Animated.Text
                                className="bg-[#fff] color-[#9FB7B9] mx-[20px] rounded-lg px-[2px]"
                                style={[
                                    animatedPasswordFontSize,
                                    animatedPasswordTransform,
                                ]}
                            >
                                Mật khẩu
                            </Animated.Text>
                        </Pressable>
                        <View className="flex-row items-center">
                            <AnimatedTextInput
                                className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl pr-[100px]"
                                style={animatedBorderStyle(passwordBorderColor)}
                                ref={passwordRef}
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
                                        passwordHeight * 0.21,
                                        "#657ef8",
                                        -26
                                    );
                                }}
                                onBlur={() => {
                                    handleBlur(passwordBorderColor);
                                    if (enteredPassword.trim() === "") {
                                        animateInput(
                                            "password",
                                            passwordHeight * 0.35,
                                            "#6b707b",
                                            0
                                        );
                                    } else {
                                        animateInput(
                                            "password",
                                            passwordHeight * 0.21,
                                            "#6b707b",
                                            -26
                                        );
                                    }
                                }}
                                onLayout={onLayoutPassword}
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
                        // onPress={() => {
                        //     console.log(enteredUserName, enteredPassword);
                        // }}
                        onPress={handleLoginTest}
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

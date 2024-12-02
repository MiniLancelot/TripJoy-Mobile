import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  ActivityIndicator,
  TextInput,
  Alert,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { useState, useRef, useEffect, useContext } from "react";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Title from "@/components/Onboarding/Title";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SeparateLine from "@/components/Others/SeparateLine";
import { useAuth } from "@/app/(auth)/AuthContext";
import GoogleIcon from "@/components/Icons/GoogleIcon";
import FacebookIcon from "@/components/Icons/FacebookIcon";
import Toast from "react-native-toast-message";
import { InputOutline } from "react-native-input-outline";
import AnimationTextInput from "@/components/TextInput/MyTextInput";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [enteredUserName, setEnteredUserName] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const clearText = (setText: (text: string) => void) => {
    setText("");
  };



  const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isLoginDisabled =
    !enteredUserName ||
    !enteredPassword ||
    !emailValidate.test(enteredUserName);

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
      Alert.alert("Login Failed", "An error occurred during Google login.");
    }
  };

  const handleLoginTest = async () => {
    setIsLoading(true);
    try {
      await login!({
        email: enteredUserName,
        password: enteredPassword,
      });
      Toast.show({
        type: "success",
        text1: "Đăng nhập thành công",
        text2: "Welcome!",
      });
      // router.replace("/home");
      setTimeout(() => {
        router.replace("/home");
      }, 500);
    } catch (error: any) {
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.mainContainer}>
        <View style={styles.titleContainer}>
          <Title />

          <Text style={styles.loginTitle}>Đăng Nhập Tài Khoản</Text>
        </View>
        <View style={styles.inputsContainer}>
          <View style={styles.outerUsernameInput}>
            <AnimationTextInput
              placeholder="Email"
              style={styles.usernameInput}
              autoCapitalize={"none"}
              maxLength={30}
              value={enteredUserName}
              onChangeText={(text) => {
                setEnteredUserName(text);
              }}
            />
            {enteredUserName.length > 0 && (
              <Pressable
                style={styles.clearUserNameButton}
                onPress={() => clearText(setEnteredUserName)}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={21}
                  color="#9FB7B9"
                />
              </Pressable>
            )}
          </View>

          <View style={styles.outerPasswordInput}>
            <AnimationTextInput
              placeholder="Mật khẩu"
              style={styles.passwordInput}
              autoCapitalize={"none"}
              maxLength={30}
              secureTextEntry={!isPasswordVisible}
              value={enteredPassword}
              onChangeText={(text) => setEnteredPassword(text)}
            />
            {enteredPassword.length > 0 && (
                <Pressable
                  style={styles.clearPasswordButton}
                  onPress={() => clearText(setEnteredPassword)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={21}
                    color="#9FB7B9"
                  />
                </Pressable>
              )}
              <Pressable
                style={styles.passwordToggle}
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={21}
                  color="#9FB7B9"
                />
              </Pressable>
          </View>

          
        </View>

        <View style={styles.loginButtonContainer}>
          <Pressable
            onPress={handleLoginTest}
            disabled={isLoginDisabled || isLoading}
            android_ripple={isLoginDisabled ? null : { color: "#b9bcc6" }}
            // android_ripple={{ color: "gray" }}
          >
            <View
              style={[
                styles.innerLoginButtonContainer,
                isLoginDisabled && styles.loginButtonDisabled,
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size={28} />
              ) : (
                <Text
                  style={[
                    styles.loginButtonText,
                    { color: isLoginDisabled ? "#b9bcc6" : "#fff" },
                  ]}
                >
                  Đăng Nhập
                </Text>
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Pressable onPress={() => router.push("/forgot_password")}>
            <Text style={styles.actionText}>Quên mật khẩu?</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/register")}>
            <Text style={styles.actionText}>Đăng ký ngay</Text>
          </Pressable>
        </View>

        <SeparateLine text="Đăng nhập bằng phương thức khác" />
        <View
          style={styles.loginMethodContainer}
          // style={styles.shadow}
        >
          <Pressable onPress={handleGoogleLogin}>
            <View style={styles.googleButton}>
              {/* <Image source={googleIcon} style={{ width: 16, height: 16 }} /> */}
              <GoogleIcon width={25} height={25} />
            </View>
          </Pressable>
          <Pressable
            onPress={handleGoogleLogin}
            // android_ripple={{ color: "gray" }}
          >
            <View style={styles.facebookButton}>
              <FacebookIcon width={40} height={40} />
            </View>
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
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },

  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  mainContainer: {
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
    // minHeight: 100,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
  },
  loginTitle: {
    fontSize: 25,
    marginTop: 20,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputsContainer: {
    width: "85%",
    alignItems: "center",
  },
  inputContainer: {
    alignItems: "center",
  },
  inputLabel: {
    position: "absolute",
    zIndex: 10,
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    paddingHorizontal: 12, // p-3
    transform: [{ translateY: 24 }],
  },
  inputLabelText: {
    backgroundColor: "#fff",
    color: "#9FB7B9",
    marginHorizontal: 20,
    borderRadius: 8,
    padding: 2,
  },
  outerUsernameInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  // usernameInput: {
  //   backgroundColor: "#fff",
  //   borderRadius: 8,
  //   borderWidth: 1.2,
  //   margin: 10,
  //   padding: 10,
  //   paddingHorizontal: 20,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100%",
  //   height: 55,
  //   fontSize: 18,
  //   lineHeight: 28,
  //   paddingRight: 90,
  //   fontWeight: "500",
  // },
  usernameInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,

    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  clearUserNameButton: {
    position: "absolute",
    paddingRight: 10,
    right: 7,
  },
  outerPasswordInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    
    marginVertical: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  clearPasswordButton: {
    position: "absolute",
    right: 55,
  },
  passwordToggle: {
    position: "absolute",
    right: 7,
    paddingRight: 10,
  },
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "85%",
    marginTop: 20,
  },
  innerLoginButtonContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "semibold",
    lineHeight: 28,
  },
  actionButtonsContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 25,
    width: "85%",
  },
  actionText: {
    color: "#758bf9",
    fontSize: 17,
    lineHeight: 28,
    fontWeight: "normal",
  },
  loginMethodContainer: {
    borderRadius: 16,
    overflow: "hidden",
    margin: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 80,
    gap: 30,
    marginTop: 10,
  },
  googleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 0.1,
  },
  facebookButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1877f2",
    justifyContent: "center",
    alignItems: "center",
    // borderColor: '#000',
    // borderWidth: 0.1,
  },
});
export default Login;

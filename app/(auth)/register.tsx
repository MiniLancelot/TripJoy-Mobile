import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
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
import FacebookIcon from "@/components/Icons/FacebookIcon";
import GoogleIcon from "@/components/Icons/GoogleIcon";
// import Toast from "react-native-toast-message";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const register = () => {
  const router = useRouter();
  const { send_otp_verify_email, register } = useAuth();

  const [registerData, setRegisterData] = useState({
    enteredName: "",
    enteredEmail: "",
    enteredOtp: "",
    enteredPassword: "",
    enteredValPassword: "",
  });
  const {
    enteredName,
    enteredEmail,
    enteredOtp,
    enteredPassword,
    enteredValPassword,
  } = registerData;

  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

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
  const emailBorderColor = useSharedValue("#e7e8ee");
  const valPasswordBorderColor = useSharedValue("#e7e8ee");
  const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const isRegisterDisabled =
    !enteredName ||
    !enteredEmail ||
    !enteredOtp ||
    !enteredPassword ||
    !enteredValPassword;

  const validateEmail = (email: string) => {
    if (email.length === 0) {
      console.log("Email không được để trống");
      return true;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      console.log("Email sai cú pháp");
      return true;
    }
    return false;
  };

  const validateEmailWhenRegister = (email: string) => {
    if (email.length === 0) {
      alert("Email không được để trống");
      return true;
    }
    if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      alert("Email sai cú pháp");
      return true;
    }
    return false;
  };

  const validatePassword = (password: string) => {
    if (password.trim().length === 0) {
      alert("Password không được để trống");
      return true;
    }
    if (!hasSpecialCharacter(password)) {
      alert("Password phải chứa ít nhất một ký tự đặc biệt");
      return true;
    }
    return false;
  };

  const validateOtp = (otp: string) => {
    if (otp.length === 0) {
      console.log("OTP không được để trống");
      return true;
    }
    if (!/^[0-9]{6}$/.test(otp)) {
      console.log("OTP phải là 6 số");
      return true;
    }
  };

  const hasSpecialCharacter = (password: string): boolean => {
    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;
    return specialCharPattern.test(password);
  };

  var isOtpDisabled = !enteredEmail || !emailValidate.test(enteredEmail);

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
    borderColor.value = withTiming(isHavingProblem ? "#ff0000" : "#e7e8ee", {
      duration: 250,
    });
  };

  const animatedBorderStyle = (borderColor: { value: any }) =>
    useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

  const handleVerifyOtpEmail = async () => {
    if (validateEmail(enteredEmail)) {
      alert("Email không hợp lệ");
      return;
    }
    setIsOtpLoading(true);
    try {
      await send_otp_verify_email!({
        email: enteredEmail.trim(),
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleRegister = async () => {
    const trimmedName = enteredName.trim();
    const trimmedEmail = enteredEmail.trim();
    const trimmedOtp = enteredOtp.trim();
    const trimmedPassword = enteredPassword.trim();
    const trimmedValPassword = enteredValPassword.trim();

    if (
      !trimmedName ||
      !trimmedEmail ||
      !trimmedOtp ||
      !trimmedPassword ||
      !trimmedValPassword
    ) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (validatePassword(enteredPassword)) {
      return;
    }

    if (validateEmailWhenRegister(enteredEmail)) {
      return;
    }

    if (enteredPassword !== enteredValPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      await register!({
        name: enteredName.trim(),
        email: enteredEmail.trim(),
        otp: enteredOtp.trim(),
        password: enteredPassword.trim(),
        confirmPassword: enteredValPassword.trim(),
      });
      Alert.alert(
        "Alert",
        "Register successfully",
        [{ text: "OK", onPress: () => router.replace("/login") }],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error(error.response);
    }
  };

  const testHandleRegister = () => {
    console.log(registerData);
    handleRegister();
  };
  return (
    <ScrollView style={styles.outerContainer}>
      <StatusBar style="dark" />
      <View style={styles.mainContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.backBtnWrapper}>
            <Pressable
              style={{ padding: 7 }}
              android_ripple={{ color: "gray" }}
              onPress={() => router.replace("/login")}
            >
              <Ionicons name="chevron-back-outline" size={25} color="#4a4d52" />
            </Pressable>
          </View>
          <View style={styles.titleContainer}>
            <Title />
            <Text style={styles.signUpTitle}>Đăng Ký Tài Khoản</Text>
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.outerInput}>
              <AnimatedTextInput
                style={[animatedBorderStyle(nameBorderColor), styles.nameInput]}
                placeholder="Tên Người Dùng"
                maxLength={30}
                value={enteredName}
                onChangeText={(text) =>
                  handleChangeRegisterState("enteredName", text)
                }
                onFocus={() => handleFocus(nameBorderColor)}
                onBlur={() =>
                  handleBlur(nameBorderColor, enteredName.length === 0)
                }
                selectionColor="#657ef8"
              />
              {enteredName.length > 0 && (
                <Pressable
                  style={styles.clearNameButton}
                  onPress={() => handleChangeRegisterState("enteredName", "")}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={21}
                    color="#9FB7B9"
                  />
                </Pressable>
              )}
            </View>
          </View>

          <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[animatedBorderStyle(emailBorderColor), styles.nameInput]}
              placeholder="Email"
              maxLength={30}
              value={enteredEmail}
              onChangeText={(text) =>
                handleChangeRegisterState("enteredEmail", text)
              }
              onFocus={() => handleFocus(emailBorderColor)}
              onBlur={() =>
                handleBlur(emailBorderColor, validateEmail(enteredEmail))
              }
              selectionColor="#657ef8"
            />
            {enteredEmail.length > 0 && (
              <Pressable
                style={styles.clearNameButton}
                onPress={() => handleChangeRegisterState("enteredEmail", "")}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#9FB7B9"
                />
              </Pressable>
            )}
          </View>
          <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[animatedBorderStyle(otpBorderColor), styles.nameInput]}
              placeholder="Mã Xác Nhận"
              maxLength={6}
              value={enteredOtp}
              keyboardType={"phone-pad"}
              onChangeText={(text) =>
                handleChangeRegisterState("enteredOtp", text)
              }
              onFocus={() => handleFocus(otpBorderColor)}
              onBlur={() => handleBlur(otpBorderColor, enteredOtp.length === 0)}
              selectionColor="#657ef8"
            />

            <Pressable
              style={styles.sendOtpButton}
              onPress={handleVerifyOtpEmail}
              disabled={isOtpDisabled}
            >
              {isOtpLoading ? (
                <ActivityIndicator color="#e7e8ee" size={18} />
              ) : (
                <Text style={styles.otpButtonText}>Gửi</Text>
              )}
            </Pressable>

            {/* <View
              className=" bg-[#13c892] rounded-lg overflow-hidden w-1/3"
            >
              <Pressable
                onPress={handleVerifyOtpEmail}
                disabled={isOtpDisabled}
                android_ripple={isOtpDisabled ? null : { color: "gray" }}
              >
                <View
                  className="justify-center items-center py-[15px]"
                  style={isOtpDisabled && styles.registerButtonDisabled}
                >
                  <Text className="text-[#fff] text-xl">Gửi</Text>
                </View>
              </Pressable>
            </View> */}
          </View>

          {/* <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[
                animatedBorderStyle(phoneNumberBorderColor),
                styles.nameInput,
              ]}
              placeholder="Số Điện Thoại"
              maxLength={15}
              value={enteredPhoneNumber}
              keyboardType={"phone-pad"}
              onChangeText={(text) =>
                handleChangeRegisterState("enteredPhoneNumber", text)
              }
              onFocus={() => handleFocus(phoneNumberBorderColor)}
              onBlur={() =>
                handleBlur(
                  phoneNumberBorderColor,
                  enteredPhoneNumber.length === 0
                )
              }
              selectionColor="#657ef8"
            />
            {enteredPhoneNumber.length > 0 && (
              <Pressable
                style={styles.clearNameButton}
                onPress={() =>
                  handleChangeRegisterState("enteredPhoneNumber", "")
                }
              >
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#9FB7B9"
                />
              </Pressable>
            )}
          </View> */}

          <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[
                animatedBorderStyle(passwordBorderColor),
                styles.nameInput,
              ]}
              placeholder="Vui lòng nhập mật khẩu"
              maxLength={30}
              secureTextEntry={!isPasswordVisible}
              value={enteredPassword}
              onChangeText={(text) =>
                handleChangeRegisterState("enteredPassword", text)
              }
              onFocus={() => handleFocus(passwordBorderColor)}
              onBlur={() =>
                handleBlur(passwordBorderColor, enteredPassword.length === 0)
              }
              selectionColor="#657ef8"
            />
            {enteredPassword.length > 0 && (
              <Pressable
                style={styles.clearPasswordButton}
                onPress={() => handleChangeRegisterState("enteredPassword", "")}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={24}
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
                size={24}
                color="#9FB7B9"
              />
            </Pressable>
          </View>
          <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[
                animatedBorderStyle(valPasswordBorderColor),
                styles.nameInput,
              ]}
              placeholder="Vui lòng nhập lại mật khẩu"
              maxLength={30}
              secureTextEntry={!isValPasswordVisible}
              value={enteredValPassword}
              onChangeText={(text) =>
                handleChangeRegisterState("enteredValPassword", text)
              }
              onFocus={() => handleFocus(valPasswordBorderColor)}
              onBlur={() =>
                handleBlur(
                  valPasswordBorderColor,
                  enteredValPassword.length === 0
                )
              }
              selectionColor="#657ef8"
            />
            {enteredValPassword.length > 0 && (
              <Pressable
                style={styles.clearPasswordButton}
                onPress={() =>
                  handleChangeRegisterState("enteredValPassword", "")
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
              style={styles.passwordToggle}
              onPress={toggleValPasswordVisibility}
            >
              <Ionicons
                name={isValPasswordVisible ? "eye-outline" : "eye-off-outline"}
                size={24}
                color="#9FB7B9"
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.signUpButtonContainer}>
          <Pressable
            onPress={testHandleRegister}
            disabled={isRegisterDisabled || isRegisterLoading}
            android_ripple={isRegisterDisabled ? null : { color: "#b9bcc6" }}
          >
            <View
              style={[
                styles.innerSignUpButtonContainer,
                isRegisterDisabled && styles.registerButtonDisabled,
              ]}
            >
              {isRegisterLoading ? (
                <ActivityIndicator color="#fff" size={28} />
              ) : (
                <Text
                  style={[
                    styles.signUpButtonText,
                    { color: isRegisterDisabled ? "#b9bcc6" : "#fff" },
                  ]}
                >
                  Đăng Ký
                </Text>
              )}
            </View>
          </Pressable>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Text style={styles.actionText1}>
            Đã có tài khoản? </Text>
            <Pressable onPress={() => router.push("/login")}>
              <Text style={styles.actionText2}>Đăng Nhập</Text>
            </Pressable>
          
        </View>

        {/* <SeparateLine text="Đăng nhập bằng phương thức khác" />
        <View
          style={styles.loginMethodContainer}
        >
          <Pressable>
            <View style={styles.googleButton}>
              <GoogleIcon width={25} height={25} />
            </View>
          </Pressable>
          <Pressable
          >
            <View style={styles.facebookButton}>
              <FacebookIcon width={40} height={40} />
            </View>
          </Pressable>
        </View> */}
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
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
  },
  backBtnWrapper: {
    borderRadius: 100,
    overflow: "hidden",
    alignSelf: "flex-start",
    position: "absolute",
    marginTop: 15,
    marginLeft: 25,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
  },
  signUpTitle: {
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
  outerInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  nameInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1.2,
    margin: 10,
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  clearNameButton: {
    position: "absolute",
    paddingRight: 20,
    right: 7,
  },
  sendOtpButton: {
    position: "absolute",
    paddingRight: 20,
    paddingLeft: 10,
    right: 7,
    borderStartWidth: 1,
    borderColor: "#e7e8ee",
  },
  otpButtonText: {
    color: "#657ef8",
    fontSize: 16,
  },
  clearPasswordButton: {
    position: "absolute",
    right: 65,
  },
  passwordToggle: {
    position: "absolute",
    right: 7,
    paddingRight: 20,
  },
  signUpButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "85%",
    marginTop: 20,
  },
  innerSignUpButtonContainer: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  signUpButtonText: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "semibold",
    lineHeight: 28,
  },

  actionButtonsContainer: {
    marginTop: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 25,
    width: "85%",
  },
  actionText1: {
    color: "black",
    fontSize: 17,

    fontWeight: "normal",
  },
  actionText2: {
    color: "#758bf9",
    fontSize: 17,
 
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

export default register;
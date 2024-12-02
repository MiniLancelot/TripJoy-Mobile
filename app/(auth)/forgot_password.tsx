import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
import { useAuth } from "./AuthContext";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const forgot_password = () => {
  const router = useRouter();
  const { send_otp_forget_password, verify_otp_forget_password } =
    useAuth();

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
  const { enteredEmail, enteredOtp } = registerData;

  const handleChangeRegisterState = (field: any, value: any) => {
    setRegisterData(
      (prev) =>
        (prev = {
          ...prev,
          [field]: value,
        })
    );
  };
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isConfirmBtnLoading, setIsConfirmBtnLoading] = useState(false);

  const otpBorderColor = useSharedValue("#e7e8ee");
  const emailBorderColor = useSharedValue("#e7e8ee");
  const emailValidate = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const otpValidate = /^[0-9]{6}$/;

  const isRegisterDisabled =
    !enteredEmail ||
    !enteredOtp ||
    !emailValidate.test(enteredEmail) ||
    !otpValidate.test(enteredOtp);
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

  const handleSendOtpEmail = async () => {
    if (!emailValidate.test(enteredEmail)) {
      alert("Email không hợp lệ");
      return;
    }
    setIsOtpLoading(true);
    try {
      await send_otp_forget_password!({
        email: enteredEmail.trim(),
      });
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleVerifyOtpEmail = async () => {
    const trimmedOtp = enteredOtp.trim();
    try {
      await verify_otp_forget_password!({
        otp: trimmedOtp.trim(),
      }).then(() => {
        router.push("/new_password");
      });
    } catch (error: any) {

    }
  };
  var isOtpDisabled = !enteredEmail || !emailValidate.test(enteredEmail);

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
            <Text style={styles.firstTitle}>Quên Mật Khẩu</Text>
            <Text style={styles.secondTitle}>
              Vui lòng nhập tài khoản cần tìm lại mật khẩu
            </Text>
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.outerInput}>
              <AnimatedTextInput
                style={[
                  animatedBorderStyle(emailBorderColor),
                  styles.nameInput,
                ]}
                placeholder="Email"
                maxLength={30}
                value={enteredEmail}
                onChangeText={(text) =>
                  handleChangeRegisterState("enteredEmail", text)
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
          </View>

          <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[animatedBorderStyle(otpBorderColor), styles.nameInput]}
              placeholder="OTP"
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
              onPress={handleSendOtpEmail}
              disabled={isOtpDisabled}
            >
              {isOtpLoading ? (
                <ActivityIndicator color="#e7e8ee" size={18} />
              ) : (
                <Text style={styles.otpButtonText}>Gửi</Text>
              )}
            </Pressable>
            {/* 
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
                  <Text className="text-[#fff] text-xl">Gửi</Text>
                </View>
              </Pressable>
            </View> */}
          </View>
          <View style={styles.fwButtonContainer}>
            <Pressable
              onPress={handleVerifyOtpEmail}
              disabled={isRegisterDisabled || isConfirmBtnLoading}
              android_ripple={isRegisterDisabled ? null : { color: "#b9bcc6" }}
            >
              <View
                style={[
                  styles.innerSignUpButtonContainer,
                  isRegisterDisabled && styles.registerButtonDisabled,
                ]}
              >
                {isConfirmBtnLoading? (
                <ActivityIndicator color="#fff" size={28} />
              ) : (
                <Text
                  style={[
                    styles.signUpButtonText,
                    { color: isRegisterDisabled ? "#b9bcc6" : "#fff" },
                  ]}
                >
                  Tiếp
                </Text>
              )}
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
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },
  outerContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    width: "100%",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    paddingTop: 30,
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
  firstTitle: {
    fontSize: 25,
    marginTop: 20,
    fontWeight: "600",
  },
  secondTitle: {
    fontSize: 15,
    marginTop: 10,
    fontWeight: "400",
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
  fwButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "100%",
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
});

export default forgot_password;
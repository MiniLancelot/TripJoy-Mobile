import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
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
import { useAuth } from "./AuthContext";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const new_password = () => {
  const router = useRouter();
  const { change_password, register } = useAuth();

  const [registerData, setRegisterData] = useState({
    enteredPassword: "",
    enteredValPassword: "",
  });
  const { enteredPassword, enteredValPassword } = registerData;

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
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const [isConfirmBtnLoading, setIsConfirmBtnLoading] = useState(false);

  const passwordBorderColor = useSharedValue("#e7e8ee");
  const valPasswordBorderColor = useSharedValue("#e7e8ee");

  const isRegisterDisabled = !enteredPassword || !enteredValPassword;

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

  const handleChangePassword = async () => {
    if (enteredPassword !== enteredValPassword) {
      alert("Mật khẩu không khớp");
      return;
    }

    await change_password!({
      password: enteredPassword.trim(),
      confirmPassword: enteredValPassword.trim(),
    }).then((res) => {
      router.push("/login");
    });
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
            <Text style={styles.firstTitle}>Thiết Lập Mật Khẩu</Text>
            <Text style={styles.secondTitle}>
              Vui lòng thiết lập mật khẩu tương đối mạnh
            </Text>
          </View>
        </View>

        <View style={styles.inputsContainer}>
          <View style={styles.inputContainer}>
            <View style={styles.outerInput}>
              <AnimatedTextInput
                style={[
                  animatedBorderStyle(passwordBorderColor),
                  styles.nameInput,
                ]}
                placeholder="Mật khẩu"
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
                  onPress={() =>
                    handleChangeRegisterState("enteredPassword", "")
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
                onPress={togglePasswordVisibility}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                  size={24}
                  color="#9FB7B9"
                />
              </Pressable>
            </View>
          </View>
          <View style={styles.outerInput}>
            <AnimatedTextInput
              style={[
                animatedBorderStyle(valPasswordBorderColor),
                styles.nameInput,
              ]}
              placeholder="Xác nhận mật khẩu"
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

          <View style={styles.fwButtonContainer}>
            <Pressable
              onPress={handleChangePassword}
              disabled={isRegisterDisabled || isConfirmBtnLoading}
              android_ripple={isRegisterDisabled ? null : { color: "#b9bcc6" }}
            >
              <View
                style={[
                  isRegisterDisabled && styles.registerButtonDisabled,
                  styles.innerSignUpButtonContainer,
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
  titleContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 30,
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
  clearPasswordButton: {
    position: "absolute",
    right: 65,
  },
  passwordToggle: {
    position: "absolute",
    right: 7,
    paddingRight: 20,
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

export default new_password;

import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { useFormStore } from "@/utils/useFormStore";
import { Ionicons } from "@expo/vector-icons";
import AnimationTextInput from "@/components/TextInput/MyTextInput";
import MotorIcon from "@/components/Icons/MotorIcon";
import BoatIcon from "@/components/Icons/BoatIcon";
import CarIcon from "@/components/Icons/CarIcon";
import PlaneIcon from "@/components/Icons/PlaneIcon";
import TrainIcon from "@/components/Icons/TrainIcon";

export default function Step2() {
  const router = useRouter();
  const { vehicle, estimatedBudget, setFormData } = useFormStore();

  // const vehicleData = [
  //   { label: "Xe máy", value: 0 },
  //   { label: "Ô tô", value: 1 },
  //   { label: "Tàu hỏa", value: 2 },
  //   { label: "Tàu thuyền", value: 3 },
  //   { label: "Máy bay", value: 4 },
  // ];

  const nextBtnDisabled =
    !estimatedBudget ||
    estimatedBudget <= 0 ||
    estimatedBudget == null ||
    estimatedBudget == undefined ||
    isNaN(estimatedBudget) ||
    estimatedBudget.toString() == "" ||
    vehicle == "";

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Kinh phí dự tính</Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 40,
          marginVertical: 0,
          gap: 20,
          paddingHorizontal: 20,
        }}
      >
        <Ionicons name={"calendar-outline"} size={30} color={"#6b707b"} />
        <View style={styles.outerUsernameInput}>
          <AnimationTextInput
            placeholder="Kinh phí dự tính (đ)"
            style={styles.otherInput}
            autoCapitalize={"none"}
            maxLength={25}
            keyboardType={"phone-pad"}
            value={estimatedBudget.toString()}
            onChangeText={(text) => {
              const numericValue = text.replace(/[^0-9]/g, "");
              setFormData("estimatedBudget", numericValue);
            }}
          />
          {estimatedBudget.toString() != "" && (
            <Pressable
              style={styles.clearUserNameButton}
              onPress={() => setFormData("estimatedBudget", "")}
            >
              <Ionicons name="close-circle-outline" size={21} color="#9FB7B9" />
            </Pressable>
          )}
        </View>
      </View>

      <View style={[styles.titleContainer, { marginTop: 40 }]}>
        <Text style={styles.title}>Chọn phương tiện</Text>
      </View>

      <View style={styles.vehicleContainer}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            vehicle === "motor" && styles.selectedButton, // Highlight selected vehicle
          ]}
          onPress={() => {
            setFormData("vehicle", "motor");
            console.log("Vehicle: motor");
          }}
        >
          <MotorIcon width={40} height={40} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.iconButton,
            vehicle === "car" && styles.selectedButton, // Highlight selected vehicle
          ]}
          onPress={() => {
            setFormData("vehicle", "car");
            console.log("Vehicle: car");
          }}
        >
          <CarIcon width={40} height={40} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            vehicle === "train" && styles.selectedButton, // Highlight selected vehicle
          ]}
          onPress={() => {
            setFormData("vehicle", "train");
            console.log("Vehicle: train");
          }}
        >
          <TrainIcon width={40} height={40} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            vehicle === "boat" && styles.selectedButton, // Highlight selected vehicle
          ]}
          onPress={() => {
            setFormData("vehicle", "boat");
            console.log("Vehicle: boat");
          }}
        >
          <BoatIcon width={40} height={40} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.iconButton,
            vehicle === "plane" && styles.selectedButton, // Highlight selected vehicle
          ]}
          onPress={() => {
            setFormData("vehicle", "plane");
            console.log("Vehicle: plane");
          }}
        >
          <PlaneIcon width={40} height={40} />
        </TouchableOpacity>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.btnWrapper, { backgroundColor: "#ff7324" }]}
          // disabled={nextBtnDisabled}
        >
          <Text style={styles.btnText}>Trở về</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(create-ai-plan)/CreateAiPlan")}
          style={[
            styles.btnWrapper,
            nextBtnDisabled && { backgroundColor: "#ccc" },
          ]}
          disabled={nextBtnDisabled}
        >
          <Text style={styles.btnText}>Kế tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingTop: 40,
    flex: 1,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  clearUserNameButton: {
    position: "absolute",
    paddingRight: 10,
    right: 27,
    transform: [{ translateY: 3 }],
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  outerUsernameInput: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  otherInput: {
    backgroundColor: "#fff",
    borderRadius: 8,

    padding: 10,
    marginVertical: 10,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
    width: "92%",
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  birthdayInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    borderColor: "#e7e8ee",
    padding: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "87%",
    fontSize: 18,
    lineHeight: 28,
    fontWeight: "500",
  },
  dateText: {
    fontSize: 16,
    fontWeight: "700",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 55,
  },
  btnWrapper: {
    backgroundColor: "#13c892",
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
  },
  btnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  iconButton: {
    width: 55,
    height: 55,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 0.1,
  },
  vehicleContainer: {
    borderRadius: 16,
    overflow: "hidden",
    margin: 10,
    width: "90%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // marginHorizontal: 80,
    gap: 20,
    marginTop: 40,
  },
  selectedButton: {
    // backgroundColor: "#13c892", // Highlight color for the selected button
    borderWidth: 3,
    borderColor: "#ff7324", // Optional: Add a border for better visibility
  },
});

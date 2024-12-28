// pages/step1.tsx
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { useFormStore } from "@/utils/useFormStore";
import PlanImageCarousel from "@/components/PlanCarousel/PlanImageCarousel";
import { Trips } from "@/constants/Trip";
import ProvinceDropdown from "@/components/Dropdowns/ProvinceAiDropdown";
import { useAuth } from "@/app/(auth)/AuthContext";

const AiStep1 = () => {
  const router = useRouter();
  const { session } = useAuth();

  const { provinceStart, provinceEnd, setFormData } = useFormStore();

  const nextBtnDisabled = !provinceStart?.provinceName.trim() || !provinceEnd?.provinceName.trim();

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Chọn địa điểm bạn muốn đi</Text>
      </View>
      <View
        style={{
          // gap: 10,
          width: "100%",
          paddingHorizontal: 20,

          // marginVertical: 5,
        }}
      >
        <Text style={styles.sectionTitle}>Điểm bắt đầu</Text>
        <ProvinceDropdown
          _value={provinceStart}
          setValue={(value) => setFormData("provinceStart", value)}
          bearer={session.userToken.accessToken}
          placeholder="Điểm bắt đầu"
        />
        <Text style={[styles.sectionTitle]}>Điểm kết thúc</Text>

        <ProvinceDropdown
          _value={provinceEnd}
          setValue={(value) => setFormData("provinceEnd", value)}
          bearer={session.userToken.accessToken}
          placeholder="Điểm kết thúc"
        />
      </View>

      <View style={{ marginVertical: 20 }}>
        <PlanImageCarousel data={Trips} />
      </View>
      <View style={styles.buttonsContainer}>
        <Pressable>
          <Text style={{ color: "#fff" }}>What the hell?</Text>
        </Pressable>
        <TouchableOpacity
          onPress={() => router.push("/AiStep2")}
          style={[styles.btnWrapper, nextBtnDisabled && { backgroundColor: "#ccc" }]}
          disabled={nextBtnDisabled}
        >
          <Text style={styles.btnText}>Kế tiếp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

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
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
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
});

export default AiStep1;

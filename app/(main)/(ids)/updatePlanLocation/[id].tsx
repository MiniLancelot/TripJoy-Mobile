import { View, Text, Pressable, Image, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { addPlanLocationImage } from "@/services/plan/plan";
import { ca } from "date-fns/locale";
import { useAuth } from "@/app/(auth)/AuthContext";

const PlanDetails = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<string>();
  const { session } = useAuth();

  const tempAvatar =
    "https://icons-for-free.com/iff/png/512/mountains+photo+photos+placeholder+sun+icon-1320165661388177228.png";

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      // setImage(result.assets[0].uri);
      setData(result.assets[0].uri);
    }
  };

  const handleAddPlanLocationImage = () => {
    try {
      const _form = new FormData();
      const parts = data!.split("/"); // Chia đường dẫn theo dấu '/'
      const fileName = parts[parts.length - 1]; // Lấy phần tử cuối cùng trong mảng (tên tệp)
      const file: any = {
        uri: data!,
        name: fileName,
        type: "image/jpeg",
      }
      _form.append("image", file);
      const result = addPlanLocationImage(_form, session.userToken.accessToken, id);
      if (result) {
        console.log("Result: ", result);
        Alert.alert("Success", "Add image successfully");
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <View>
      <Text>Plan Details</Text>
      <Text>{id}</Text>
      <View>
        <Pressable onPress={pickImage}>
          <Image
            source={{
              uri: data == null ? tempAvatar : data,
            }}
            style={styles.image}
          />
        </Pressable>
        <Pressable onPress={handleAddPlanLocationImage}>
          <Text>Change Avatar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PlanDetails;

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    marginTop: 20,
  },
  image: {
    width: 280,
    height: 220,
    borderRadius: 30,
  },
});

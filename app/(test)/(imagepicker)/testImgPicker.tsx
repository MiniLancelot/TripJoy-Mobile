import { useRef, useState } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  TextInput,
  Keyboard,
  Text,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import CustomImagePicker from "@/components/ImagePicker/CustomImagePicker";

export default function ImagePickerExample() {
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const [editable, setEditable] = useState(true);
  const isPicking = useRef(false); // Tránh gọi song song nhiều lần

  // const pickImage = async () => {
  //   if (isPicking.current) return; // Ngăn chặn nếu đang chọn ảnh
  //   isPicking.current = true;

  //   try {
  //     // Ẩn bàn phím trước khi chọn ảnh
  //     Keyboard.dismiss();

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: 'images', // Sửa lại giá trị mediaTypes
  //       allowsEditing: true,
  //       aspect: [4, 3],
  //       quality: 1,
  //     });

  //     if (!result.canceled && result.assets?.length > 0) {
  //       setImage(result.assets[0].uri); // Cập nhật URI của ảnh
  //     }
  //   } catch (error) {
  //     console.error("ImagePicker error:", error);
  //   } finally {
  //     isPicking.current = false;
  //   }
  // };

  return (
    <View style={styles.container}>
      <CustomImagePicker image={image} setImage={setImage} />
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        caretHidden={!editable}
        onFocus={() => setEditable(true)}
        onBlur={() => setEditable(false)}
        value={name ?? ""}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        caretHidden={!editable}
        onFocus={() => setEditable(true)}
        onBlur={() => setEditable(false)}
        value={email ?? ""}
        onChangeText={(text) => setEmail(text)}
      />
      <Text>blur</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    width: "80%",
    padding: 10,
    marginVertical: 10,
  },
});

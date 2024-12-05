import { useRef, useState } from 'react';
import { Button, Image, View, StyleSheet, TextInput, Keyboard, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample({image, setImage}: any) {
  const isPicking = useRef(false); // Tránh gọi song song nhiều lần

  const pickImage = async () => {
    if (isPicking.current) return; // Ngăn chặn nếu đang chọn ảnh
    isPicking.current = true;

    try {
      // Ẩn bàn phím trước khi chọn ảnh
      Keyboard.dismiss();

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All, // Sửa lại giá trị mediaTypes
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImage(result.assets[0].uri); // Cập nhật URI của ảnh
      }
    } catch (error) {
      console.error("ImagePicker error:", error);
    } finally {
      isPicking.current = false;
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '80%',
    padding: 10,
    marginVertical: 10,
  },
});
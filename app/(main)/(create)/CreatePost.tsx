import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import PostStatusDropdown from "@/components/Dropdowns/PostStatusDropdown";
import * as ImagePicker from "expo-image-picker";
import { FriendProps } from "@/constants/Friend";
import FriendDropdown from "@/components/Dropdowns/FriendDropdown";
import { createPost } from "@/services/post/post";
import { router, Stack } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

// interface CreatePostProps {
//   content: string,
//   shareStatus: string,
//   images: string[],
//   tagUsers: string[],
// }

const CreatePost = () => {
  const { session } = useAuth();
  const [content, setContent] = useState<string>("");
  // const [shareStatus, setShareStatus] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  // const [tagUsers, setTagUsers] = useState<FriendProps>({
  //   userId: "",
  //   name: "",
  // });

  const tempAvatar =
    "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE=";

  const pickImage = async (index: number) => {
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
      // handleChangeProfileState("avatar", result.assets[0].uri);
      setImages([
        ...images.slice(0, index),
        result.assets[0].uri,
        ...images.slice(index + 1),
      ]);
    }
  };
  const _createPost = async () => {
    const data = new FormData();
    data.append("Post.Content", content);
    // data.append("Post.ShareStatus", shareStatus);
    // data.append("Post.TagUsers[0]", tagUsers.userId);

    images.forEach((image, index) => {
      const parts = image.split("/");
      const fileName = parts[parts.length - 1];
      const file: any = {
        uri: image,
        name: fileName,
        type: "image/jpeg",
      };
      data.append(`Post.Images[${index}]`, file);
    });
    const response = await createPost(data, session.userToken.accessToken);
    if (response) {
      console.log("Create post success");
      router.replace("/home");
    } else {
      console.log("Create post failed");
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Tạo bài viết",
          headerStyle: {
            backgroundColor: "#defff6",
          },
        }}
      />
      <Text style={{ fontSize: 20, fontWeight: "500" }}>Nội dung</Text>
      <TextInput
        placeholder="Nội dung"
        value={content}
        multiline
        numberOfLines={5}
        maxLength={300}
        onChangeText={setContent}
        style={{
          borderWidth: 1,
          borderColor: "#e6e6e6",
          padding: 10,
          borderRadius: 10,
          marginTop: 10,
          textAlignVertical: "top",
          maxHeight: 200,
        }}
      />

      <TouchableOpacity onPress={() => {}}>
        <Ionicons
          name="image-outline"
          size={30}
          color="black"
          style={{ marginTop: 20 }}
        />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
        <Pressable onPress={() => pickImage(0)}>
          <Image
            source={{
              uri: images[0] == null ? tempAvatar : images[0],
            }}
            style={styles.image}
          />
        </Pressable>
      </View>
      <View style={styles.avatarContainer}>
        <Pressable onPress={() => pickImage(1)}>
          <Image
            source={{
              uri: images[1] == null ? tempAvatar : images[1],
            }}
            style={styles.image}
          />
        </Pressable>
      </View>
      {/* <FriendDropdown
        _value={tagUsers}
        setValue={setTagUsers}
        bearer={session.userToken.accessToken}
        placeholder="Tag bạn bè"
      /> */}
      <Pressable onPress={_createPost}>
        <Text>Post</Text>
      </Pressable>
    </View>
  );
};

export default CreatePost;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#000",
  },
  image: {
    width: 280,
    height: 220,
    borderRadius: 30,
  },
});

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
  Touchable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import PostStatusDropdown from "@/components/Dropdowns/PostStatusDropdown";
import * as ImagePicker from "expo-image-picker";
import { FriendProps } from "@/utils/Friend";
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
  const [isLoading, setIsLoading] = useState(false);

  // const [tagUsers, setTagUsers] = useState<FriendProps>({
  //   userId: "",
  //   name: "",
  // });

  const isButtonDisabled = !content;

  const tempAvatar =
    "https://media.istockphoto.com/id/1324356458/vector/picture-icon-photo-frame-symbol-landscape-sign-photograph-gallery-logo-web-interface-and.jpg?s=612x612&w=0&k=20&c=ZmXO4mSgNDPzDRX-F8OKCfmMqqHpqMV6jiNi00Ye7rE=";

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
      // handleChangeProfileState("avatar", result.assets[0].uri);
      setImages([...images, result.assets[0].uri]);
    }
  };

  const getImageWidth = (numImages: number) => {
    if (numImages === 1) return "100%";
    if (numImages === 2) return "100%";
    if (numImages === 3) return "32.5%";
    return "32.5%";
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

      <TouchableOpacity onPress={pickImage} disabled={images.length >= 2}>
        <Ionicons
          name="image-outline"
          size={30}
          color="black"
          style={{ marginTop: 20 }}
        />
      </TouchableOpacity>

      <View style={styles.avatarContainer}>
      {images.map((image, index) => (
        <View style={{ width: "48.5%" }}>
          <Pressable
            onPress={() =>
              setImages((prev) => prev.filter((_, i) => i !== index))
            }
            style={styles.deleteButton}
          >
            <Ionicons name="close-circle-outline" size={23} color="#ff6188" />
          </Pressable>
          <Image
            source={{
              uri: image == null ? tempAvatar : image,
            }}
            style={[styles.image, { width: getImageWidth(images.length) }]}
          />
        </View>
      ))}
      </View>
      {images.length == 0 && (
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: tempAvatar,
            }}
            style={[styles.image, { width: getImageWidth(1) }]}
          />
        </View>
      )}

      {/* <Pressable onPress={_createPost}>
        <Text>Post</Text>
      </Pressable> */}
              <View style={styles.loginButtonContainer}>
                <Pressable
                  onPress={_createPost}
                  disabled={isButtonDisabled || isLoading}
                  android_ripple={isButtonDisabled ? null : { color: "#b9bcc6" }}
                  // android_ripple={{ color: "gray" }}
                >
                  <View
                    style={[
                      styles.innerLoginButtonContainer,
                      isButtonDisabled && styles.loginButtonDisabled,
                    ]}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" size={28} />
                    ) : (
                      <Text
                        style={[
                          styles.loginButtonText,
                          { color: isButtonDisabled ? "#b9bcc6" : "#fff" },
                        ]}
                      >
                        Tạo bài viết
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>
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
  loginButtonDisabled: {
    backgroundColor: "#e7e8ee",
    color: "#b9bcc6",
  },
  // itemOuterContainer: {
  //   padding: 15,
  //   flex: 1,
  //   flexDirection: "row",
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#e7e8ee",
  // },
  avatarContainer: {
    alignItems: "center",
    marginTop: 5,
    width: "100%",
    gap: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  image: {
    // width: "100%",
    height: 250,
    borderRadius: 6,
  },
  deleteButton: {
    position: "absolute",
    top: -5,
    right: 0,
    backgroundColor: "#ffffff",
    borderRadius: 50,
    zIndex: 4,
  },
  loginButtonContainer: {
    backgroundColor: "#13c892",
    borderRadius: 12,
    overflow: "hidden",
    margin: 10,
    width: "93%",
    marginTop: 280,
    bottom: 20,

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
});

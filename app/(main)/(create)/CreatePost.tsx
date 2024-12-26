import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import { useState } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import PostStatusDropdown from "@/components/Dropdowns/PostStatusDropdown";
import * as ImagePicker from "expo-image-picker";
import { FriendProps } from "@/constants/Friend";
import FriendDropdown from "@/components/Dropdowns/FriendDropdown";
import { createPost } from "@/services/post/post";
import { router } from "expo-router";

// interface CreatePostProps {
//   content: string,
//   shareStatus: string,
//   images: string[],
//   tagUsers: string[],
// }

const CreatePost = () => {
  const { session } = useAuth();
  const [content, setContent] = useState<string>("");
  const [shareStatus, setShareStatus] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [tagUsers, setTagUsers] = useState<FriendProps>({
    userId: "",
    name: "",
  });

  const tempAvatar =
    "https://icons-for-free.com/iff/png/512/mountains+photo+photos+placeholder+sun+icon-1320165661388177228.png";

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
    data.append("Post.ShareStatus", shareStatus);
    data.append("Post.TagUsers[0]", tagUsers.userId);
    images.forEach((image, index) => {
      // data.append("images", {
      //   name: `image${index}`,
      //   type: "image/jpeg",
      //   uri: image,
      // });
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
      router.replace("/home")
    } else {
      console.log("Create post failed");
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>CreatePost</Text> */}
      <TextInput
        placeholder="Nội dung"
        value={content}
        onChangeText={setContent}
      />
      <PostStatusDropdown
        value={shareStatus}
        setValue={setShareStatus}
        placeholder="Chế độ chia sẻ"
      />
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
      <FriendDropdown
        _value={tagUsers}
        setValue={setTagUsers}
        bearer={session.userToken.accessToken}
        placeholder="Tag bạn bè"
      />
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
    // padding: 16,
    backgroundColor: "white",
  },
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

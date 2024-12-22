import {
  View,
  Text,
  FlatList,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import {
  router,
  Stack,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  getMessagesByRoomId,
  openChat,
  sendMessage,
} from "@/services/chat/chat";
import { useAuth } from "@/app/(auth)/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import getUserById from "@/services/user/getUserById";
import User from "../user/[id]";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { FontAwesome } from "@expo/vector-icons";

interface UserProps {
  userId: string;
  userName: string;
  avatarUrl: string;
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const chat = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session, _connection, receiveMessage } = useAuth();
  const [_roomId, setRoomId] = useState<string>("");
  const [messages, setMessages] = useState<any>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [reloading, setReloading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps>({
    userId: "",
    userName: "",
    avatarUrl: "",
  });

  const [pageIndex, setPageIndex] = useState<number>(0);
  const navigation = useNavigation();
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const nameBorderColor = useSharedValue("#e7e8ee");

  const [currentAvatar, setCurrentAvatar] = useState(
    user.avatarUrl || tempAvatar
  );

  const _createRoom = async () => {
    try {
      setLoading(true);
      const response = await openChat(id, session.userToken.accessToken);
      if (response) {
        setRoomId(response.data.room.roomId);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserByUserId = async () => {
    try {
      const response = await getUserById(session.userToken.accessToken, id);
      if (response) {
        console.log(response.data);
        setUser({
          userId: response.data.user.id,
          userName: response.data.user.userName,
          avatarUrl:
            response.data.user.avatar == null
              ? tempAvatar
              : response.data.user.avatar.url,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: user.userName });
  }, [user.userName]);

  useEffect(() => {
    if (_roomId != "") {
      fetchMessages();
    }
  }, [_roomId, receiveMessage]);

  // useEffect(() => {
  //   fetchMessages();
  // }, [receiveMessage]);
  useEffect(() => {
    console.log("receive message" + receiveMessage);
    // fetchMessages();
  }, [receiveMessage]);

  useEffect(() => {
    fetchUserByUserId();
    _createRoom();
  }, []);

  // useEffect(() => {
  //   if (!loading) {
  //     fetchMessages();
  //     setLoading(!false);
  //   }
  // }, [loading]);

  useEffect(() => {
    if (reloading) {
      fetchMessages();
      setReloading(false);
    }
  }, [reloading]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (pageIndex > 0) {
        fetchMessages();
      }
    }, 1000);
    return () => {
      clearTimeout(timeout);
    };
  }, [pageIndex]);

  const fetchMessages = async () => {
    try {
      const response = await getMessagesByRoomId(
        _roomId,
        pageIndex,
        session.userToken.accessToken
      );
      console.log(response.data.messages.data);
      if (pageIndex == 0) {
        setMessages(response.data.messages.data);
      } else {
        setMessages((prevState: any) => [
          ...prevState,
          ...response.data.messages.data,
        ]);
      }
    } catch (error) {
      console.info("Fetch message err:" + error);
    }
  };
  const _sendMessage = async () => {
    try {
      if (message == "") {
        return;
      }
      const response = await sendMessage(
        _roomId,
        message,
        session.userToken.accessToken
      );
      if (response) {
        console.log(response.data);
        // await _connection?.invoke("SendMessage", {UserId: user.userId, Message: message, UserName: user.userName, Avatar: user.avatarUrl});
        await _connection?.invoke(
          "SendMessage",
          user.userId,
          message,
          user.userName,
          user.avatarUrl
        );
        setMessage("");
        setPageIndex(0);
        setReloading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFocus = (borderColor: { value: string }) => {
    borderColor.value = withTiming("#657ef8", { duration: 250 });
  };
  const handleBlur = (borderColor: { value: string }) => {
    borderColor.value = withTiming("#e7e8ee", { duration: 250 });
  };
  const animatedBorderStyle = (borderColor: { value: any }) =>
    useAnimatedStyle(() => ({
      borderColor: borderColor.value,
    }));

  return (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        padding: 10,
        paddingTop: 0,
        backgroundColor: "#fff",
      }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={-200} // Adjust this value as needed
    >
      <Stack.Screen
        options={{
          // headerTransparent: true,
          headerShadowVisible: true,
          headerShown: true,
          headerLeft: () => {
            return (
              <>
                <View style={styles.backBtnWrapper}>
                  <Pressable onPress={() => router.back()}>
                    <Text>
                      <Ionicons
                        name="arrow-back-outline"
                        size={25}
                        color={"#b3b3b3"}
                      />
                    </Text>
                  </Pressable>
                </View>
                <View style={styles.headerAvatarNameConatainer}>
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.headerAvatar}
                    onError={() => {
                      console.log("Error loading image");
                      setCurrentAvatar(tempAvatar);
                    }}
                  />
                  <Text style={styles.headerName}>{user.userName}</Text>
                </View>
              </>
            );
          },
          headerBackground: () => (
            <View
              style={{
                height: 90,
                backgroundColor: "#defff6",
                // borderRadius: 30,
              }}
            />
          ),
        }}
      />
      <FlatList
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: any }) => {
          if (item.postedByUser == user.userId)
            return (
              <View style={{ alignItems: "flex-start" }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.chatAvatar}
                    onError={() => {
                      console.log("Error loading image");
                      setCurrentAvatar(tempAvatar);
                    }}
                  />
                  {/* <Text>{user.userName + ": "}</Text> */}
                  <View style={{ flexDirection: "column", maxWidth: "70%" }}>
                    <Text style={styles.chatName}>{user.userName}</Text>
                    <>
                      <Text style={styles.selfMessage}>{item.message}</Text>
                    </>
                  </View>
                </View>
              </View>
            );
          else
            return (
              <View style={{ alignItems: "flex-end" }}>
                {/* <Text>{"Tôi: "}</Text> */}
                <Text style={styles.otherMessage}>{item.message}</Text>
              </View>
            );
        }}
        // estimatedItemSize={20}
        inverted={true}
        onEndReached={() => setPageIndex((prev) => prev + 1)}
        onEndReachedThreshold={0.1}
      />

      <View>
        <AnimatedTextInput
          placeholder="Nhắn tin"
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={[
            animatedBorderStyle(nameBorderColor),
            {
              borderWidth: 1,
              // borderColor: "#b3b3b3",
              borderRadius: 40,
              backgroundColor: "#f5f7fa",
              padding: 10,
              paddingLeft: 20,
              margin: 10,
            },
          ]}
          onFocus={() => handleFocus(nameBorderColor)}
          onBlur={() => handleBlur(nameBorderColor)}
        />
        <TouchableOpacity onPress={_sendMessage} style={styles.sendBtn}>
          <FontAwesome
            name="paper-plane"
            size={20}
            color={message.length === 0 ? "#808080" : "#26d7fe"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  sendBtn: {
    position: "absolute",
    right: 30,
    bottom: 25
  },
  backBtnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 0,
  },
  headerAvatarNameConatainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 20,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerName: {
    color: "#000",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "700",
  },
  chatName: {
    color: "#ccd0d5",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "500",
    width: "100%",
  },
  otherMessage: {
    backgroundColor: "#ff8b4a",
    borderRadius: 12,
    padding: 15,
    margin: 5,
    fontSize: 16,
    fontWeight: "500",
    maxWidth: "70%",
    color: "#fff",
  },
  selfMessage: {
    backgroundColor: "#ffd666",
    borderRadius: 12,
    padding: 15,
    margin: 5,
    fontSize: 16,
    fontWeight: "500",
    color: "#575656",
    // maxWidth: "70%",
  },
});

export default chat;

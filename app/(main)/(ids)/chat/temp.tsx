import { View, Text, FlatList, Pressable, TextInput, StyleSheet } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { router, Stack, useLocalSearchParams, useNavigation } from "expo-router";
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


interface UserProps {
  userId: string;
  userName: string;
  avatarUrl: string;
}



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

  const [currentAvatar, setCurrentAvatar] = useState(user.avatarUrl || tempAvatar);

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
      const response = await getUserById(session.userToken.accessToken, id,);
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
        setMessages((prevState: any) => [...prevState, ...response.data.messages.data]);
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
        await _connection?.invoke("SendMessage", user.userId, message, user.userName, user.avatarUrl);
        setMessage("");
        setPageIndex(0);
        setReloading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, width: "100%", height: "100%", padding: 10, backgroundColor: "#fff" }}>
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
                      <Ionicons name="arrow-back-outline" size={25} color={"#b3b3b3"} />
                    </Text>
                  </Pressable>
                </View>
                <View
                  style={styles.headerAvatarNameConatainer}>
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={styles.headerAvatar}
                    onError={() => {
                      console.log("Error loading image");
                      setCurrentAvatar(tempAvatar);
                    }}
                    
                  />
                  <Text
                    style={styles.headerName}
                  >
                    {user.userName}
                  </Text>
                </View>
              </>
            );
          },
          headerBackground: () => (
            <View style={{height: 90, backgroundColor: "#defff6", borderRadius: 30}} />
          ),
        }}
      />
      <FlashList
        data={messages}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }: { item: any }) => {
          if (item.postedByUser == user.userId)
            return (
              <View style={{ alignItems: "flex-start",}}>
                {/* <Text>{user.userName + ": "}</Text> */}
                <Text style={{ backgroundColor: "#14bdeb", borderRadius: 10, padding: 15, margin: 15, fontSize: 30, maxWidth: "70%"}}>{item.message}</Text>
              </View>
            );
          else
            return (
              <View style={{ alignItems: "flex-end", }}>
                {/* <Text>{"Tôi: "}</Text> */}
                <Text style={{backgroundColor: "#C1DFF0", borderRadius: 10, padding: 15, margin: 15, fontSize: 30,  maxWidth: "70%"}}>{item.message}</Text>
              </View>
            );
        }}
        estimatedItemSize={20}
        inverted={true}
        onEndReached={() => setPageIndex((prev) => prev + 1)}
        onEndReachedThreshold={0.1}
      />
      <TextInput
        placeholder="Type your message"
        value={message}
        onChangeText={(text) => setMessage(text)}
      />
      <Pressable onPress={_sendMessage}>
        <Text>Send</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
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
  headerName: {
    color: "#000",
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "700",
  },
})

export default chat;

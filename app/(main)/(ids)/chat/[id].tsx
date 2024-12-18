import { View, Text, FlatList, Pressable, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  getMessagesByRoomId,
  openChat,
  sendMessage,
} from "@/services/chat/chat";
import { useAuth } from "@/app/(auth)/AuthContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { FlashList } from "@shopify/flash-list";
import getUserById from "@/services/user/getUserById";

interface UserProps {
  userId: string;
  userName: string;
  avatarUrl: string;
}

const chat = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
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
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";

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

  useEffect(() => {
    if (_roomId != "") {
      fetchMessages();
    }
  }, [_roomId]);

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
        setMessage("");
        setPageIndex(0);
        setReloading(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{ flex: 1, width: "100%", height: "100%" }}>
      <FlashList
        data={messages}
        renderItem={({ item }: { item: any }) => {
          if (item.postedByUser == user.userId)
            return (
              <View>
                <Text>{user.userName + ": "}</Text>
                <Text>{item.message}</Text>
              </View>
            );
          else
            return (
              <View style={{ alignItems: "flex-end" }}>
                <Text>{"Tôi: "}</Text>
                <Text>{item.message}</Text>
              </View>
            );
        }}
        estimatedItemSize={20}
        inverted={true}
        onEndReached={() => console.log("end reached")}
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

export default chat;

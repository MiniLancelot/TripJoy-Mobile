import { View, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import {
  accept_friend_request,
  decline_friend_request,
  get_friends_request,
} from "@/services/user/friend_request";
import { FlatList } from "react-native-gesture-handler";
import FriendItem from "@/components/Friend/AddFriendItem";
import { FlashList } from "@shopify/flash-list";

const FriendInvitation = () => {
  const { session } = useAuth();
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFriendRequest = async (id: string, accept: boolean) => {
    try {
      if (accept) {
        // accept friend request
        const response = await accept_friend_request(
          session.userToken.accessToken,
          id
        );
        setIsSuccess(response.data.isSuccess);
      } else {
        // reject friend request
        // const response = await decline_friend_request(
        //   session.userToken.accessToken,
        //   id
        // );
        // setIsSuccess(response.data.isSuccess);
        Alert.alert(
          "Thông báo", // Tiêu đề của alert
          "Bạn có muốn tiếp tục không?", // Nội dung của alert
          [
            {
              text: "Cancel", // Nút hủy
              onPress: () => {},
              style: "cancel", // Style cho nút hủy
            },
            {
              text: "OK", // Nút đồng ý
              onPress: async () => {
                const response = await decline_friend_request(
                  session.userToken.accessToken,
                  id
                );
                if (response) {
                  console.log(response.data);
                  setIsSuccess(response.data.isSuccess);
                }
              }, // In ra "Hello" khi nhấn OK
            },
          ],
          { cancelable: true } // Có thể đóng alert bằng cách nhấn ngoài không
        );
      }
    } catch (e) {
      Alert.alert("Thông báo", "Lời mời kết bạn đã bị thu hồi.", [
        {
          text: "OK",
          onPress: () => {
            setIsSuccess(true);
          },
        },
      ]);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await get_friends_request(session.userToken.accessToken);
      if (res && res.status == 200) {
        setUsers(res.data.users == null ? [] : res.data.users);
        console.log(
          "Friend request: ",
          res.data.users == null ? [] : res.data.users
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const refreshHandler = () => {
    setUsers([]);
    fetchData();
  };

  useEffect(() => {
    // fetch
    fetchData();
  }, []);

  useEffect(() => {
    if (isSuccess) {
      fetchData();
      setIsSuccess(false);
    }
  }, [isSuccess]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <Text>FriendInvitation</Text> */}
      {users != null && users.data != null ? (
        <FlashList
          data={users.data}
          refreshing={loading}
          onRefresh={refreshHandler}
          estimatedItemSize={65}
          renderItem={({ item }: { item: { id: string; userName: string; avatar: string } }) => (
            <FriendItem
              id={item.id}
              name={item.userName}
              avatar = {item.avatar}
              _onClick={handleFriendRequest}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>Không có lời mời kết bạn nào</Text>
      )}
    </View>
  );
};

export default FriendInvitation;
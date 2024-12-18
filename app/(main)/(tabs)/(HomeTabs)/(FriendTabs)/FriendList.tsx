import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { useState, useEffect } from "react";
import Friend from "@/components/Friend/Friend";
import { useAuth } from "@/app/(auth)/AuthContext";
import { get_friends, remove_friend } from "@/services/user/friend_request";
import { FlashList } from "@shopify/flash-list";
import { set } from "date-fns";

interface FriendProps {
  userId: string;
  name: string;
  avatar: any;
  status: boolean;
}

const FriendList = () => {
  const { session, _onlineFriends } = useAuth();
  const [users, setUsers] = useState<FriendProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleRemoveFriend = async (id: string) => {
    try {
      Alert.alert(
        "Thông báo", // Tiêu đề của alert
        "Bạn có muốn huỷ kết bạn không?", // Nội dung của alert
        [
          {
            text: "Cancel", // Nút hủy
            onPress: () => {},
            style: "cancel", // Style cho nút hủy
          },
          {
            text: "OK", // Nút đồng ý
            onPress: async () => {
              const response = await remove_friend(
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
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await get_friends(session.userToken.accessToken);
      if (res && res.status == 200) {
        setUsers(res.data.users == null ? [] : res.data.users.data.map((item: any): FriendProps => {
          return {
            userId: item.id,
            name: item.userName,
            avatar: item.avatar,
            status: _onlineFriends.includes(item.id),
          };
        }));
        console.log(
          "Friend request: ",
          res.data.users == null ? [] : res.data.users.data.map((item: any) => item.id)
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // fetch
    fetchData();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchData();
    }, 1000);
    return () => {clearTimeout(handler)};
  }, [_onlineFriends])

  useEffect(() => {
    if (isSuccess) {
      fetchData();
      setIsSuccess(false);
    }
  }, [isSuccess]);

  const refreshHandler = () => {
    setUsers([]);
    fetchData();
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "white",
        }}
      >
        <ActivityIndicator size="large" color="gray" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <Text>FriendInvitation</Text> */}
      {users != null && users.length != 0 ? (
        <FlashList
          data={users}
          refreshing={loading}
          onRefresh={refreshHandler}
          estimatedItemSize={65}
          renderItem={({ item }: { item: FriendProps }) => (
            <Friend
              avatar={item.avatar == null ? null : item.avatar.url}
              id={item.userId}
              name={item.name}
              _onClick={handleRemoveFriend}
              _status={item.status}
            />
          )}
          keyExtractor={(item) => item.userId}
        />
      ) : (
        <Text>No Friends ?</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default FriendList;
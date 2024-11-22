import { View, Text, FlatList, Alert } from 'react-native'
import React from 'react'
import Friend from '@/components/Friend/Friend';
import { useAuth } from '@/app/(auth)/AuthContext';
import { get_friends, remove_friend } from '@/services/user/friend_request';

const FriendList = () => {
  const { session } = useAuth();
  const [users, setUsers] = React.useState<any>(null);
  const [isSuccess, setIsSuccess] = React.useState<boolean>(false);

  // const handleFriendRequest = async (id: string, accept: boolean) => {
  //   try {
  //     if (accept) {
  //       // accept friend request
  //       const response = await accept_friend_request(
  //         session.userToken.accessToken,
  //         id
  //       );
  //       setIsSuccess(response.data.isSuccess);
  //     } else {
  //       // reject friend request
  //       // const response = await decline_friend_request(
  //       //   session.userToken.accessToken,
  //       //   id
  //       // );
  //       // setIsSuccess(response.data.isSuccess);
  //       Alert.alert(
  //         "Thông báo", // Tiêu đề của alert
  //         "Bạn có muốn tiếp tục không?", // Nội dung của alert
  //         [
  //           {
  //             text: "Cancel", // Nút hủy
  //             onPress: () => {},
  //             style: "cancel", // Style cho nút hủy
  //           },
  //           {
  //             text: "OK", // Nút đồng ý
  //             onPress: async () => {
  //               const response = await decline_friend_request(
  //                 session.userToken.accessToken,
  //                 id
  //               );
  //               if (response) {
  //                 console.log(response.data);
  //                 setIsSuccess(response.data.isSuccess);
  //               }
  //             }, // In ra "Hello" khi nhấn OK
  //           },
  //         ],
  //         { cancelable: true } // Có thể đóng alert bằng cách nhấn ngoài không
  //       );
  //     }
  //   } catch (e) {
  //     Alert.alert("Thông báo", "Lời mời kết bạn đã bị thu hồi.", [
  //       {
  //         text: "OK",
  //         onPress: () => {
  //           setIsSuccess(true);
  //         },
  //       },
  //     ]);
  //   }
  // };

  const handleRemoveFriend = async (id: string) => {
    try {
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
      const res = await get_friends(session.userToken.accessToken);
      if (res && res.status == 200) {
        setUsers(res.data.users == null ? [] : res.data.users);
        console.log(
          "Friend request: ",
          res.data.users == null ? [] : res.data.users
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    // fetch
    fetchData();
  }, []);

  React.useEffect(() => {
    if (isSuccess) {
      fetchData();
      setIsSuccess(false);
    }
  }, [isSuccess]);

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text>FriendInvitation</Text>
      {users != null && users.data != null ? (
        <FlatList
          data={users.data}
          onRefresh={fetchData}
          renderItem={({ item }) => (
            <Friend
              id={item.id}
              name={item.userName}
              _onClick={handleRemoveFriend}
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

export default FriendList
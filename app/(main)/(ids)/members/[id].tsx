import {
  View,
  Text,
  FlatList,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect } from "react";
import Friend from "@/components/Friend/Friend";
import { useAuth } from "@/app/(auth)/AuthContext";
import { get_friends, remove_friend } from "@/services/user/friend_request";
import { FlashList } from "@shopify/flash-list";
import { set } from "date-fns";
import { useLocalSearchParams } from "expo-router";
import {
  getPlanInvitaitonsAvailable,
  inviteMember,
  removeMember,
  revokeMember,
} from "@/services/plan/invitePeople";
import InviteFriend from "@/components/Friend/InviteFriendItem";

interface FriendProps {
  userId: string;
  name: string;
  avatar: any;
  status: number;
}

enum InviteStatus {
  INVITED = 0,
  SELF = 2,
  JOINED = 1,
  NOT_INVITED = 3,
}

const InviteFriends = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const [users, setUsers] = useState<FriendProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [_pageIndex, setPageIndex] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const fetchPlanInvitationsAvailable = async (page: number) => {
    try {
      setLoading(true);
      const res = await getPlanInvitaitonsAvailable(
        id,
        page,
        session.userToken.accessToken
      );
      if (res && res.status == 200) {
        if (res.data.users.data.length == 0) {
          setIsEnd(true);
          return;
        };
        setUsers(
          res.data.users == null
            ? []
            : res.data.users.data.map((item: any): FriendProps => {
                return {
                  userId: item.userId,
                  name: item.userName,
                  avatar: item.avatar,
                  status: item.status,
                };
              })
        );
        console.log(
          "Invite friend request: ",
          res.data.users == null
            ? []
            : res.data.users.data.map((item: any) => item.userId)
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnd) {
      setPageIndex((prevPage) => prevPage - 1);
      console.log("End of list");
    }
  }, [isEnd]);

  const handleRefreshPrevious = () => {
    if (_pageIndex > 0 && !loading) {
      if (isEnd) setIsEnd(false);
      setPageIndex((prevPage) => prevPage - 1); // Chuyển về trang trước
    }
  };

  const handleLoadNext = () => {
    if (!isEnd && !loading) {
      setPageIndex((prevPage) => prevPage + 1); // Chuyển sang trang tiếp theo
    }
  };

  useEffect(() => {
    fetchPlanInvitationsAvailable(0);
  }, []);

  useEffect(() => {
    if (isSuccess) {
      fetchPlanInvitationsAvailable(_pageIndex);
      setIsSuccess(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (_pageIndex >= 0) {
      fetchPlanInvitationsAvailable(_pageIndex);
    }
  }, [_pageIndex]);


// const handleEndReached = () => {
//   if (!loading) {
//     setPageIndex((prevPage) => prevPage + 1);
//   }
// };

  const handleInvitationRequest = async (userId: string, status: number) => {
    switch (status) {
      case InviteStatus.JOINED:
        Alert.alert(
          "Thông báo",
          "Bạn có muốn khiến người này rời khỏi không?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const response = await removeMember(
                  id,
                  userId,
                  session.userToken.accessToken
                );
                if (response) {
                  console.log(response.data);
                  setIsSuccess(response.data.isSuccess);
                }
              },
            },
          ],
          { cancelable: true }
        );
        break;

      case InviteStatus.NOT_INVITED:
        Alert.alert(
          "Thông báo",
          "Bạn có muốn mời người này tham dự không?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const response = await inviteMember(
                  userId,
                  id,
                  session.userToken.accessToken
                );
                if (response) {
                  console.log(response.data);
                  setIsSuccess(response.data.isSuccess);
                }
              },
            },
          ],
          { cancelable: true }
        );
        break;

      case InviteStatus.INVITED:
        Alert.alert(
          "Thông báo",
          "Bạn có muốn huỷ lời mời không?",
          [
            {
              text: "Cancel",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "OK",
              onPress: async () => {
                const response = await revokeMember(
                  userId,
                  id,
                  session.userToken.accessToken
                );
                if (response) {
                  console.log(response.data);
                  setIsSuccess(response.data.isSuccess);
                }
              },
            },
          ],
          { cancelable: true }
        );
        break;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* <Text>FriendInvitation</Text> */}
      {users != null && users.length != 0 ? (
        <FlashList
          data={users}
          refreshing={loading}
          // onRefresh={()=> {setPageIndex((prev) => {if (prev == 0) return 0; return prev - 1})}}
          estimatedItemSize={100}
          renderItem={({ item }: { item: FriendProps }) => (
            <InviteFriend
              avatar={item.avatar == null ? null : item.avatar}
              id={item.userId}
              name={item.name}
              _onClick={handleInvitationRequest}
              _status={item.status}
            />
          )}
          keyExtractor={(item) => item.userId}
          // onEndReached={handleEndReached}
        />
      ) : (
        <Text>No Friends ?</Text>
      )}
      <Pressable
        onPress={() => {
          handleRefreshPrevious();
        }}
      >
        <Text>Previous</Text>
      </Pressable>
      <Pressable
        onPress={() => {
          handleLoadNext();
        }}
      >
        <Text>Next</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },
});

export default InviteFriends;
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
import { useTabStore } from "@/utils/store";
import { is } from "date-fns/locale";

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
  const sharedId = useTabStore((state) => state.sharedId);
  const { session } = useAuth();
  const [users, setUsers] = useState<FriendProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [_pageIndex, setPageIndex] = useState<number>(0);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const fetchPlanInvitationsAvailable = async (page: number) => {
    try {
      setLoading(true);
      if (isEnd) return;
      const res = await getPlanInvitaitonsAvailable(
        sharedId,
        page,
        session.userToken.accessToken
      );
      if (res && res.status == 200) {
        if (res.data.users.count < 10) {
          setIsEnd(true);
          // return;
        };
        if(res.data.users.data.length == 0) return;
        console.log(res.data.users.data);
        if(_pageIndex == 0 )setUsers(res.data.users == null
          ? []
          : res.data.users.data.map((item: any): FriendProps => {
              return {
                userId: item.userId,
                name: item.userName,
                avatar: item.avatar,
                status: item.status,
              };
            }));
        else setUsers((prev) => [...prev,
           ...res.data.users.data.map((item: any): FriendProps => {
                return {
                  userId: item.userId,
                  name: item.userName,
                  avatar: item.avatar,
                  status: item.status,
                };
              })
            ]);

        console.log(
          "Invite friend request: ",
          res.data.users == null
            ? []
            : res.data.users.data.map((item: any) => item.userId)
        );
      }
    } catch (e) {
      console.info(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEnd) {
      setPageIndex((prevPage) => prevPage - 1);
      console.log("End of list");
    }
  }, [isEnd])

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     fetchPlanInvitationsAvailable(_pageIndex);
  //   }, 1500);
  //   return () => clearTimeout(timer);
  // }, [name]);

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
      if (_pageIndex == 0) {
        setUsers([]);
        fetchPlanInvitationsAvailable(0);
      } else setPageIndex(0);
      setIsSuccess(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (_pageIndex >= 0) {
      fetchPlanInvitationsAvailable(_pageIndex);
    }
  }, [_pageIndex]);


  const handleInvitationRequest = async (userId: string, status: number) => {
    switch (status) {
      case InviteStatus.JOINED:
        Alert.alert(
          "Thông báo",
          "Bạn có muốn khiến người này rời khỏi không?",
          [
            {
              text: "Hủy",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Tiếp tục",
              onPress: async () => {
                const response = await removeMember(
                  sharedId,
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
              text: "Hủy",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Tiếp tục",
              onPress: async () => {
                const response = await inviteMember(
                  userId,
                  sharedId,
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
              text: "Hủy",
              onPress: () => {},
              style: "cancel",
            },
            {
              text: "Tiếp tục",
              onPress: async () => {
                const response = await revokeMember(
                  userId,
                  sharedId,
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
          onEndReached={handleLoadNext}
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

export default InviteFriends;
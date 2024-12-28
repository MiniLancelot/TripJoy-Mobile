import { View, Text, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/(auth)/AuthContext";
import { FlashList } from "@shopify/flash-list";
import {
  acceptInvitation,
  declineInvitation,
  planInvitations,
} from "@/services/plan/invitePeople";
import InvitationResponse from "@/components/InvitationResponse/InvitationResponseItem";
import {
  acceptJoinPlanRequest,
  getJoinPlanRequests,
  rejectJoinPlanRequest,
} from "@/services/plan/plan";
import { useTabStore } from "@/utils/store";
import JoinPlanResponse from "@/components/InvitationResponse/JoinPlanResponse";

interface PlanInvitation {
  userId: string;
  userName: string;
  avatar: string;
  appliedAt: string;
  introduction: string;
}

const PlanJoinRequestScreen = () => {
  const sharedId = useTabStore((state) => state.sharedId);
  const { session } = useAuth();
  const [_planInvitations, setPlanInvitations] = useState<PlanInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFriendRequest = async (id: string, accept: boolean) => {
    try {
      if (accept) {
        // accept friend request
        const response = await acceptJoinPlanRequest(
          session.userToken.accessToken,
          sharedId!,
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
                const response = await rejectJoinPlanRequest(
                  session.userToken.accessToken,
                  sharedId!,
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
      Alert.alert("Thông báo", "Lời mời tham gia đã bị thu hồi.", [
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
      const res = await getJoinPlanRequests(
        session.userToken.accessToken,
        sharedId!
      );
      if (res && res.status == 200) {
        setPlanInvitations(
          res.data.joinPlanRequests.data == null
            ? []
            : res.data.joinPlanRequests.data.map(
                (item: any): PlanInvitation => ({
                  userId: item.userId,
                  userName: item.userName,
                  avatar: item.avatar,
                  appliedAt: item.appliedAt,
                  introduction: item.introduction,
                })
              )
        );
        console.log(
          "Plan request: ",
          res.data.planInvitations.data == null
            ? []
            : res.data.planInvitations.data
        );
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const refreshHandler = () => {
    setPlanInvitations([]);
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
      {_planInvitations != null ? (
        <FlashList
          data={_planInvitations}
          refreshing={loading}
          onRefresh={refreshHandler}
          estimatedItemSize={65}
          renderItem={({ item }) => (
            <JoinPlanResponse
              item={item}
              _onClick={handleFriendRequest}
            />
          )}
          keyExtractor={(item) => item.userId}
        />
      ) : (
        <Text>Không có yêu cầu tham dự nào</Text>
      )}
    </View>
  );
};

export default PlanJoinRequestScreen;

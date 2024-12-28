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

interface PlanInvitation {
  planId: string;
  inviterId: string;
  title: string;
  startDate: string;
  endDate: string;
  inviterName: string;
  inviterAvatar: string;
}

const PlanInvitation = () => {
  const { session } = useAuth();
  const [_planInvitations, setPlanInvitations] = useState<PlanInvitation[]>([]);
  const [loading, setLoading] = useState(false);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleFriendRequest = async (id: string, accept: boolean) => {
    try {
      if (accept) {
        // accept friend request
        const response = await acceptInvitation(
          id,
          session.userToken.accessToken
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
                const response = await declineInvitation(
                  id,
                  session.userToken.accessToken
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
      const res = await planInvitations(session.userToken.accessToken);
      if (res && res.status == 200) {
        setPlanInvitations(
          res.data.planInvitations.data == null
            ? []
            : res.data.planInvitations.data.map((item: any): PlanInvitation => ({
                planId: item.planId,
                inviterId: item.inviterId,
                title: item.title,
                startDate: item.startDate.split("T")[0],  
                endDate: item.endDate.split("T")[0],
                inviterName: item.inviterName,
                inviterAvatar: item.inviterAvatar,
              }))
        );
        console.log(
          "Plan request: ",
          res.data.planInvitations.data == null ? [] : res.data.planInvitations.data
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
          renderItem={({item}) => (
            <InvitationResponse
              planId={item.planId}
              inviterId={item.inviterId}
              inviterName={item.inviterName}
              title={item.title}
              startDate={item.startDate}
              endDate={item.endDate}
              inviterAvatar={item.inviterAvatar}
              _onClick={handleFriendRequest}
            />
          )}
          keyExtractor={(item) => item.planId}
        />
      ) : (
        <Text>Không có lời mời tham dự nào</Text>
      )}
    </View>
  );
};

export default PlanInvitation;

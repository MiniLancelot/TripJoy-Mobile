import { View, Text, Pressable } from "react-native";
import React from "react";
interface FriendItemProps {
    id: string,
    name: string,
    _onClick: any,
}

const FriendItem = ({id, name, _onClick}: FriendItemProps) => {

    return (
        <View>
            <Text>{name} muốn gửi cho bạn lời mời kết bạn.</Text>
            <Pressable
                onPress={() => _onClick(id, true)}
            >   
                <Text>Chấp nhận</Text>
            </Pressable>
            <Pressable
                onPress={() => _onClick(id, false)}
            >
                <Text>Từ chối</Text>
            </Pressable>
        </View>
    );
};

export default FriendItem;

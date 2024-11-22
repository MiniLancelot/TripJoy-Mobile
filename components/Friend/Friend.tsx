import { View, Text, Pressable } from "react-native";
import React from "react";
interface FriendProps {
  id: string;
  name: string;
  _onClick: any;
}

const Friend = ({ id, name, _onClick }: FriendProps) => {
  return (
    <View>
      <Text>{name}</Text>
      <Pressable onPress={() => _onClick(id)}>
        <Text>Hủy kết bạn</Text>
      </Pressable>
    </View>
  );
};

export default Friend;

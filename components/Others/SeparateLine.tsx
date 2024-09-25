import { View, Text } from "react-native";
import React from "react";

const SeparateLine = () => {
    return (
        <View className="flex-row items-center my-[10px] mx-[40px]">
            <View className="flex-1 h-[1px] bg-[#9FB7B9]" />
            <Text className="mx-[10px] text-2xl text-[#9FB7B9]">or</Text>
            <View className="flex-1 h-[1px] bg-[#9FB7B9]" />
        </View>
    );
};

export default SeparateLine;

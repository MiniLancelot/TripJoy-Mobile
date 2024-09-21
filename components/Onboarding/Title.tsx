import { Text, View } from "react-native";
import "@/global.css";

const Title = () => {
    const blackCharacter = "⠀";

    return (
        <View className="flex-1 justify-center items-center">
            <Text className="font-[LeckerliOne] text-[#13c892] text-[50px]">
                {blackCharacter}Trip
                <Text className="text-[#ff7224]">Joy {blackCharacter}</Text>
            </Text>
        </View>
    );
};

export default Title;

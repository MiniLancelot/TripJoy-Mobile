import { ActivityIndicator, View, Text } from "react-native";
import "@/global.css";

const Index = () => {
    
    return (
        <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#CECCCC" />
        </View>
    );
};

export default Index;
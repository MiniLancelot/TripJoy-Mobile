import { View, Text } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const home = () => {
    const [user, setUser] = React.useState<string | null>("");
    React.useEffect(() => {
        AsyncStorage.getItem("info").then((stringtifiedValue) => {
            return JSON.parse(stringtifiedValue!);
        }).then((value) => {
            setUser(value.user.name);
        });
    }, []);
    return (
        <View >
            <Text className="pt-[50px]">Congratualtions, you have log in as {user}</Text>
        </View>
    );
};

export default home;

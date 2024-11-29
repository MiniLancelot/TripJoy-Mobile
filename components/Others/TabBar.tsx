import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";


import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import FriendScreen from "@/app/(main)/(tabs)/(HomeTabs)/FriendScreen";

const TabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const primaryColor = "#13c892";
    const greyColor = "#737373";

    const icons = {
        home: (props: any) => (
            <FontAwesome6 name="house" size={24} color={greyColor} {...props} />
        ),
        trip: (props: any) => (
            <FontAwesome6 name="route" size={24} color={greyColor} {...props} />
        ),
        budget: (props: any) => (
            <FontAwesome name="dollar" size={24} color={greyColor} {...props} />
        ),
        profile: (props: any) => (
            <Ionicons name="person" size={24} color={greyColor} {...props} />
        ),
    };

    return (
        // <View className="flex-row justify-between items-center bg-white py-[15px]">
        <View  style={styles.tabBar}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label =
                    options.tabBarLabel === "string"
                        ? options.tabBarLabel
                        : options.title !== undefined
                        ? options.title
                        : route.name;

               

                if (
                    [
                        "(HomeTabs)/FriendScreen",
                        "(HomeTabs)/NewsfeedScreen",
                        "(HomeTabs)/PersonalScreen",
                        "(HomeTabs)/(FriendTabs)/FriendList",
                        "(HomeTabs)/(FriendTabs)/FriendInvitation",
                    ].includes(route.name)
                )
                    return null;

                const isFocused = state.index === index;

                const onPress = () => {
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: "tabLongPress",
                        target: route.key,
                    });
                };

                return (
                    <TouchableOpacity
                        key={route.name}
                        className="flex-1 items-center justify-center gap-4"
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}
                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 4,
                        }}
                    >
                        {icons[
                            route.name as "home" | "trip" | "budget" | "profile"
                        ]({
                            color: isFocused ? primaryColor : greyColor,
                        })}

                        <Text
                            style={{
                                color: isFocused ? primaryColor : greyColor,
                                fontWeight: "bold",
                            }}
                        >
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 30,
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white',
      marginHorizontal: 20,
      paddingVertical: 15,
      borderRadius: 30,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  });

export default TabBar;
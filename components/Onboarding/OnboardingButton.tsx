import { Pressable, View } from "react-native";
import React from "react";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    withSpring,
    withTiming,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import "@/global.css";

type OnboardingButtonProps = {
    flatListRef: any;
    flatListIndex: any;
    dataLength: number;
    x: any;
    screenWidth: number;
};

const OnboardingButton = ({
    flatListRef,
    flatListIndex,
    dataLength,
    x,
    screenWidth,
}: OnboardingButtonProps) => {
    const arrowImage = require("@/assets/images/onboarding/arrowIcon.png");
    const router = useRouter();

    const btnAnimationStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            x.value,
            Array.from({ length: dataLength }, (_, i) => i * screenWidth),
            ["#13c892", "#ff8f51", "#ff9191"]
        );
        return {
            width:
                flatListIndex.value === dataLength - 1
                    ? withSpring(300)
                    : withSpring(60),
            height: 60,
            backgroundColor: backgroundColor,
        };
    });

    const arrowAnimationStyle = useAnimatedStyle(() => {
        return {
            width: 30,
            height: 30,
            opacity:
                flatListIndex.value === dataLength - 1
                    ? withTiming(0)
                    : withTiming(1),
            transform: [
                {
                    translateX:
                        flatListIndex.value === dataLength - 1
                            ? withTiming(100)
                            : withSpring(0),
                },
            ],
        };
    });

    const textAnimationStyle = useAnimatedStyle(() => {
        return {
            opacity:
                flatListIndex.value === dataLength - 1
                    ? withTiming(1)
                    : withTiming(0),
            transform: [
                {
                    translateX:
                        flatListIndex.value === dataLength - 1
                            ? withTiming(0)
                            : withSpring(-100),
                },
            ],
        };
    });

    return (
        <View className="rounded-[30px] overflow-hidden">
            <Pressable
                onPress={() => {
                    if (flatListIndex.value < dataLength - 1) {
                        flatListRef.current.scrollToIndex({
                            index: flatListIndex.value + 1,
                        });
                    } else {
                        router.push("/login");
                    }
                }}
            >
                <Animated.View
                    className="bg-[#13c892] p-[10px] justify-center items-center"
                    style={btnAnimationStyle}
                >
                    <Animated.Text
                        className="text-[#fff] text-[24px] absolute"
                        style={textAnimationStyle}
                    >
                        Bắt đầu hành trình
                    </Animated.Text>
                    <Animated.Image
                        source={arrowImage}
                        className="absolute"
                        style={arrowAnimationStyle}
                    />
                </Animated.View>
            </Pressable>
        </View>
    );
};

export default OnboardingButton;
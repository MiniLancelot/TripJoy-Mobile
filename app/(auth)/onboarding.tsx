import React from "react";
import { FlatList, useWindowDimensions, View, Text } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    useAnimatedRef,
    useAnimatedStyle,
    interpolate,
    Extrapolation,
    interpolateColor,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { OnboardingData } from "@/constants/OnboardingData";
import Pagination from "@/components/Onboarding/Pagination";
import OnboardingButton from "@/components/Onboarding/OnboardingButton";
import Title from "@/components/Onboarding/Title";
import "@/global.css";
import { StatusBar } from "expo-status-bar";

const onboarding = () => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const flatListRef = useAnimatedRef<FlatList>();
    const flatListIndex = useSharedValue(0);
    const x = useSharedValue(0);

    const onViewableItemsChanged = ({ viewableItems }: any) => {
        flatListIndex.value = viewableItems[0].index;
    };

    const onStroll = useAnimatedScrollHandler({
        onScroll: (e) => {
            x.value = e.contentOffset.x;
        },
    });

    const backgroundColorStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            x.value,
            OnboardingData.map((_, index) => index * SCREEN_WIDTH),
            OnboardingData.map((item) => item.shapeColor)
        );
        return {
            backgroundColor,
        };
    });

    const RenderItem = ({ item, index }: any) => {
        const lottieAnimationStyle = useAnimatedStyle(() => {
            const opacityAnimation = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [0, 1, 0],
                Extrapolation.CLAMP
            );
            const translateYAnimation = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [100, 1, 100],
                Extrapolation.CLAMP
            );
            return {
                opacity: opacityAnimation,
                width: SCREEN_WIDTH * 0.8,
                height: SCREEN_WIDTH * 0.8,
                transform: [{ translateY: translateYAnimation }],
            };
        });

        const textAnimationStyle = useAnimatedStyle(() => {
            const opacityAnimation = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [0, 1, 0],
                Extrapolation.CLAMP
            );
            const translateYAnimation = interpolate(
                x.value,
                [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH,
                ],
                [100, 1, 100],
                Extrapolation.CLAMP
            );
            return {
                opacity: opacityAnimation,
                transform: [{ translateY: translateYAnimation }],
            };
        });

        return (
            <View
                className="flex-1 justify-center items-center"
                style={{ width: SCREEN_WIDTH }}
            >
                <StatusBar style="dark" />
                <Animated.View style={lottieAnimationStyle}>
                    <LottieView
                        source={item.lottie}
                        autoPlay
                        loop
                        style={{
                            width: SCREEN_WIDTH * 0.8,
                            height: SCREEN_WIDTH * 0.8,
                        }}
                    />
                </Animated.View>
                <Animated.View
                    className="pt-[20px]"
                    style={[textAnimationStyle]}
                >
                    <Text className="text-[#000] text-[30px] font-extrabold text-center mb-[10px]">
                        {item.title}
                    </Text>
                    <Text className="text-[#000] text-center text-[22px] leading-[30px] mx-[65px]">
                        {item.text}
                    </Text>
                </Animated.View>
            </View>
        );
    };

    return (
        <Animated.View
            className="flex-1 pt-[25px]"
            style={backgroundColorStyle}
        >
            <Title />

            <Animated.FlatList
                data={OnboardingData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <RenderItem item={item} index={index} />
                )}
                ref={flatListRef}
                scrollEventThrottle={16}
                horizontal={true}
                bounces={false}
                pagingEnabled={true}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                onScroll={onStroll}
                onViewableItemsChanged={onViewableItemsChanged}
            />
            <View className="flex-1 justify-center items-center pb-[45px]">
                <Pagination
                    data={OnboardingData}
                    x={x}
                    screenWidth={SCREEN_WIDTH}
                />
                <OnboardingButton
                    flatListRef={flatListRef}
                    flatListIndex={flatListIndex}
                    dataLength={OnboardingData.length}
                    x={x}
                    screenWidth={SCREEN_WIDTH}
                />
            </View>
        </Animated.View>
    );
};

export default onboarding;

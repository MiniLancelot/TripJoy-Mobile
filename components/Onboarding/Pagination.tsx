import {View } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    Extrapolation,
    interpolateColor,
} from "react-native-reanimated";
import "@/global.css";

type PaginationProps = {
    data: any;
    x: any;
    screenWidth: number;
};

const Pagination = ({ data, x, screenWidth }: PaginationProps) => {
    const PaginationComp = ({ index }: any) => {
        const dotsAnimationStyle = useAnimatedStyle(() => {
            const widthAnimation = interpolate(
                x.value,
                [
                    (index - 1) * screenWidth,
                    index * screenWidth,
                    (index + 1) * screenWidth,
                ],
                [10, 50, 10],
                Extrapolation.CLAMP
            );
            const opacityAnimation = interpolate(
                x.value,
                [
                    (index - 1) * screenWidth,
                    index * screenWidth,
                    (index + 1) * screenWidth,
                ],
                [0.5, 1, 0.5],
                Extrapolation.CLAMP
            );
            const dotColor = interpolateColor(
                x.value,
                data.map((_: any, index: number) => index * screenWidth),
                data.map((item: { btnColor: string }) => item.btnColor)
            );

            return {
                width: widthAnimation,
                opacity: opacityAnimation,
                backgroundColor: dotColor,
            };
        });
        return (
            <Animated.View
                className="w-[10px] h-[10px] mx-[10px] rounded-md"
                style={dotsAnimationStyle}
            ></Animated.View>
        );
    };
    return (
        <View className="flex-row h-[10px] justify-center items-center my-[10px] pb-[30px]">
            {data.map((_: any, index: number) => {
                return <PaginationComp index={index} key={index} />;
            })}
        </View>
    );
};

export default Pagination;
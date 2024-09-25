import { useWindowDimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

const hp = (percentage: any) => {
    return (percentage * SCREEN_HEIGHT) / 100;
};

const wp = (percentage: any) => {
    return (percentage * SCREEN_WIDTH) / 100;
};
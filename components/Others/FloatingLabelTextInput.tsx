import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Image,
    TextInput,
    Alert,
    useWindowDimensions,
    ScrollView,
} from "react-native";
import { useState, useRef, useEffect, useContext, ReactNode } from "react";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
} from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import "@/global.css";

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

interface FloatingLabelTextInputProps {
    className?: string;
    keyboardType?: "default" | "number-pad" | "decimal-pad" | "numeric" | "email-address" | "phone-pad";
    placeholder: string;
    value: string;
    handleOnchangeValue: (...args: any[]) => void;
    children?: ReactNode;
}

const FloatingLabelTextInput = ({
    keyboardType = "default",
    placeholder,
    value,
    handleOnchangeValue,
    children
}: FloatingLabelTextInputProps) => {
    const labelRef = useRef<TextInput>(null);
    const [labelHeight, setlabelHeight] = useState(0);
    const labelAnimation: any = [
        useSharedValue(0), //21
        useSharedValue("#6b707b"),
        useSharedValue(0), //26
    ];
    const labelBorderColor = useSharedValue("#e7e8ee");
    const handleLabelFocus = () => {
        labelRef.current?.focus();
    };
    const animatedLabelFontSize = useAnimatedStyle(() => ({
        fontSize: labelAnimation[0].value,
        color: labelAnimation[1].value,
    }));

    const animatedLabelTransform = useAnimatedStyle(() => ({
        transform: [{ translateY: labelAnimation[2].value }],
    }));

    const animatedBorderStyle = (borderColor: { value: any }) =>
        useAnimatedStyle(() => ({
            borderColor: borderColor.value,
        }));
    const handleFocus = (borderColor: { value: string }) => {
        borderColor.value = withTiming("#657ef8", { duration: 250 });
    };
    const animateInput = (
        fontSize: number,
        color: string,
        translateY: number
    ) => {
        labelAnimation[0].value = withTiming(fontSize, {
            duration: 200,
        });
        labelAnimation[1].value = withTiming(color, { duration: 250 });
        labelAnimation[2].value = withTiming(translateY, {
            duration: 200,
        });
    };
    const handleBlur = (borderColor: { value: string }) => {
        borderColor.value = withTiming("#e7e8ee", { duration: 250 });
    };
    const onLayoutlabel = (event: any) => {
        const { height } = event.nativeEvent.layout;
        setlabelHeight(height);
    };
    // const clearText = (setText: (text: string) => void) => {
    //     setText("");
    // };
    return (
        <View className="items-center">
            <Pressable
                className="absolute z-10 bg-transparent self-start px-3 translate-y-[26]"
                onPress={handleLabelFocus}
            >
                <Animated.Text
                    className="bg-[#fff] color-[#9FB7B9] mx-[20px] rounded-lg px-[2px]"
                    style={[animatedLabelFontSize, animatedLabelTransform]}
                >
                    {placeholder}
                </Animated.Text>
            </Pressable>
            <View className="flex-row">
                <AnimatedTextInput
                    className="bg-[#fff] rounded-lg border-2 m-[10px] p-[10px] px-[20px] justify-center items-center w-full h-[60px] text-2xl pr-[100px]"
                    style={animatedBorderStyle(labelBorderColor)}
                    // placeholder={"Tên đăng nhập"}
                    keyboardType={keyboardType}
                    ref={labelRef}
                    maxLength={30}
                    value={value}
                    onChangeText={handleOnchangeValue}
                    onFocus={() => {
                        handleFocus(labelBorderColor);
                        animateInput(labelHeight * 0.21, "#657ef8", -26);
                    }}
                    onBlur={() => {
                        handleBlur(labelBorderColor);
                        if (value.trim() === "") {
                            animateInput(labelHeight * 0.35, "#6b707b", 0);
                        } else {
                            animateInput(labelHeight * 0.21, "#6b707b", -26);
                        }
                    }}
                    onLayout={onLayoutlabel}
                    selectionColor="#657ef8"
                />
                {/* {value.length > 0 && (
                    <Pressable
                        className="right-[31px] top-[29px] absolute"
                        onPress={() => clearText(setValue)}
                    >
                        <Ionicons
                            name="close-circle-outline"
                            size={24}
                            color="#9FB7B9"
                        />
                    </Pressable>
                )} */}
                {children}
            </View>
        </View>
    );
};

export default FloatingLabelTextInput;

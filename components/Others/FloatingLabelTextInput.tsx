// import {
//   View,
//   Text,
//   TextInput,
//   StyleSheet,
//   TouchableWithoutFeedback,
// } from "react-native";
// import { forwardRef, useRef, useState } from "react";
// import Animated, {
//   interpolateColor,
//   useAnimatedStyle,
//   useSharedValue,
// } from "react-native-reanimated";
// import Colors from "@/constants/Colors";

// const FloatingLabelTextInput = forwardRef<FloatingLabelTextInputMethods, a>((props, ref) => {
//   const {
//     intactiveColor = Colors.grey,
//     activeColor = Colors.primary,
//     errorColor = Colors.red,
//     backgroundColor = Colors.transparent,
//     style,
//     value: providedValue = "",
//     onChangeText,
//     ...inputProps
//   } = props;

//   const [value, setValue] = useState(providedValue);
//   const placeholderAnimated = useSharedValue(providedValue ? 1 : 0);
//   const placeHolderSize = useSharedValue(0);
//   const colorAnimated = useSharedValue(0);

//   const inputRef = useRef<TextInput>(null);
//   const animatedContainerStyle = useAnimatedStyle(() => ({
//     borderColor:
//       placeHolderSize.value > 0
//         ? interpolateColor(
//             colorAnimated.value,
//             [0, 1, 2],
//             [intactiveColor, activeColor, errorColor]
//           )
//         : "#000",
//   }));
//   return (
//     <Animated.View style={[styles.container, style]}>
//       <TouchableWithoutFeedback onPress={() => ref.current.focus()}>
//         <View>
//           <TextInput
//             ref={inputRef}
//             style={styles.input}
//             value={value}
//             onChangeText={(text) => {
//               setValue(text);
//               onChangeText?.(text);
//             }}
//             {...inputProps}
//           />
//         </View>
//       </TouchableWithoutFeedback>
//     </Animated.View>
//   );
// });

// FloatingLabelTextInput.displayName = "FloatingLabelTextInput";

// const styles = StyleSheet.create({
//   container: {
//     flexDirection: "row",
//     alignSelf: "stretch",
//   },
//   label: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "black",
//   },
// });

// export default FloatingLabelTextInput;

// import React, { useRef, useState } from 'react';
// import {
//   Text,
//   TextInput,
//   StyleSheet,
//   View,
//   TouchableWithoutFeedback,
// } from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   withTiming,
//   Easing,
// } from 'react-native-reanimated';

// type Props = React.ComponentProps<typeof TextInput> & {
//   label: string;
//   errorText?: string | null;
// };

// const TextField: React.FC<Props> = (props) => {
//   const {
//     label,
//     errorText,
//     value,
//     style,
//     onBlur,
//     onFocus,
//     ...restOfProps
//   } = props;
//   const [isFocused, setIsFocused] = useState(false);

//   const inputRef = useRef<TextInput>(null);
//   const focusAnim = useSharedValue(0);

//   const animatedLabelStyle = useAnimatedStyle(() => ({
//     transform: [
//       {
//         scale: withTiming(isFocused || !!value ? 0.75 : 1, {
//           duration: 150,
//           easing: Easing.bezier(0.4, 0, 0.2, 1),
//         }),
//       },
//       {
//         translateY: withTiming(isFocused || !!value ? -12 : 24, {
//           duration: 150,
//           easing: Easing.bezier(0.4, 0, 0.2, 1),
//         }),
//       },
//       {
//         translateX: withTiming(isFocused || !!value ? 0 : 16, {
//           duration: 150,
//           easing: Easing.bezier(0.4, 0, 0.2, 1),
//         }),
//       },
//     ],
//   }));

//   let color = isFocused ? '#080F9C' : '#B9C4CA';
//   if (errorText) {
//     color = '#B00020';
//   }

//   return (
//     <View>
//       <TextInput
//         style={[
//           styles.input,
//           {
//             borderColor: color,
//           },
//         ]}
//         ref={inputRef}
//         {...restOfProps}
//         value={value}
//         onBlur={(event) => {
//           setIsFocused(false);
//           focusAnim.value = 0;
//           onBlur?.(event);
//         }}
//         onFocus={(event) => {
//           setIsFocused(true);
//           focusAnim.value = 1;
//           onFocus?.(event);
//         }}
//       />
//       <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
//         <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
//           <Text
//             style={[
//               styles.label,
//               {
//                 color,
//               },
//             ]}
//           >
//             {label}
//             {errorText ? '*' : ''}
//           </Text>
//         </Animated.View>
//       </TouchableWithoutFeedback>
//       {!!errorText && <Text style={styles.error}>{errorText}</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   input: {
//     padding: 24,
//     borderWidth: 1,
//     borderRadius: 4,
//     fontFamily: 'Avenir-Medium',
//     fontSize: 16,
//     width: "90%"
//   },
//   labelContainer: {
//     position: 'absolute',
//     paddingHorizontal: 8,
//     backgroundColor: 'white',
//   },
//   label: {
//     fontFamily: 'Avenir-Heavy',
//     fontSize: 16,
//   },
//   error: {
//     marginTop: 4,
//     marginLeft: 12,
//     fontSize: 12,
//     color: '#B00020',
//     fontFamily: 'Avenir-Medium',
//   },
// });

// export default TextField;
import React, {
  useRef,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  Platform,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
  Text,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  interpolateColor,
} from 'react-native-reanimated';
import {textScale} from './utils';
import {colors} from './theme';
import {
  AnimationTextInputMethods,
  AnimationTextInputProps,
  variantEnum,
} from './types';

const AnimationTextInput = forwardRef<
  AnimationTextInputMethods,
  AnimationTextInputProps
>((props, ref) => {
  const {
    inactiveColor = colors.grey,
    activeColor = colors.primary,
    errorColor = colors.red,
    backgroundColor = colors.transparent,
    fontSize = textScale(10),
    fontColor = colors.black,
    fontFamily,
    error,
    errorFontSize = textScale(10),
    errorStyle,
    assistiveText,
    assistiveTextFontSize = textScale(10),
    assistiveTextColor = inactiveColor,
    assistiveTextStyle,
    characterCount,
    characterCountColor = inactiveColor,
    characterCountFontSize = textScale(10),
    counterTextStyle,
    paddingHorizontal = 12,
    paddingVertical = 12,
    style,
    placeholder = 'Input',
    trailingIcon,
    value: providedValue = '',
    variant = variantEnum.outlined,
    onChangeText,
    ...inputProps
  } = props;
  const [value, setValue] = useState(providedValue);

  const inputRef = useRef<TextInput>(null);
  const placeholderAnimated = useSharedValue(providedValue ? 1 : 0);
  const placeholderSize = useSharedValue(0);
  const colorAnimated = useSharedValue(0);

  const focus = () => inputRef.current?.focus();
  const blur = () => inputRef.current?.blur();
  const isFocused = () => Boolean(inputRef.current?.isFocused());
  const clear = () => {
    Boolean(inputRef.current?.clear());
    setValue('');
  };

  const errorState = useCallback(
    () => error !== null && error !== undefined,
    [error],
  );

  const handleFocus = () => {
    placeholderAnimated.value = withTiming(1);
    if (!errorState()) colorAnimated.value = withTiming(1);
    focus();
  };

  const handleBlur = () => {
    if (!value) placeholderAnimated.value = withTiming(0);
    if (!errorState()) colorAnimated.value = withTiming(0);
    blur();
  };

  const handleChangeText = (text: string) => {
    onChangeText && onChangeText(text);
    setValue(text);
  };

  const handlePlaceholderLayout = useCallback(
    ({nativeEvent}: {nativeEvent: {layout: {width: number}}}) => {
      const {width} = nativeEvent.layout;
      placeholderSize.value = width;
    },
    [placeholderSize],
  );

  const renderTrailingIcon = () => {
    if (trailingIcon) return trailingIcon;
    return <React.Fragment></React.Fragment>;
  };

  useEffect(() => {
    if (providedValue.length) placeholderAnimated.value = withTiming(1);
    setValue(providedValue);
  }, [providedValue, placeholderAnimated]);

  useEffect(() => {
    if (errorState()) {
      colorAnimated.value = 2;
    } else {
      colorAnimated.value = isFocused() ? 1 : 0;
    }
  }, [error, colorAnimated, errorState]);

  const animatedPlaceholderStyles = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          placeholderAnimated.value,
          [0, 1],
          [0, -(paddingVertical + fontSize * 1.25)],
        ),
      },
      {
        scale: interpolate(placeholderAnimated.value, [0, 1], [1, 0.7]),
      },
      {
        translateX: interpolate(
          placeholderAnimated.value,
          [0, 1],
          [0, -placeholderSize.value * 0.2],
        ),
      },
    ],
  }));

  const animatedPlaceholderTextStyles = useAnimatedStyle(() => ({
    color: interpolateColor(
      colorAnimated.value,
      [0, 1, 2],
      [inactiveColor, activeColor, errorColor],
    ),
  }));

  const animatedPlaceholderSpacerStyles = useAnimatedStyle(() => ({
    width: interpolate(
      placeholderAnimated.value,
      [0, 1],
      [0, placeholderSize.value * 0.7 + 7],
      Extrapolation.CLAMP,
    ),
  }));

  const animatedContainerStyle = useAnimatedStyle(() => ({
    borderColor:
      placeholderSize.value > 0
        ? interpolateColor(
            colorAnimated.value,
            [0, 1, 2],
            [inactiveColor, activeColor, errorColor],
          )
        : inactiveColor,
  }));

  useImperativeHandle(ref, () => ({
    focus: handleFocus,
    blur: handleBlur,
    isFocused: isFocused(),
    clear: clear,
  }));

  const styles = StyleSheet.create({
    container: {
      ...(variant === variantEnum.standard
        ? {borderBottomWidth: 1}
        : {borderWidth: 1, borderRadius: 5}),
      alignSelf: 'stretch',
      flexDirection: 'row',
      backgroundColor,
    },
    inputContainer: {
      flex: 1,
      ...(variant === variantEnum.standard
        ? {paddingRight: paddingHorizontal}
        : {paddingHorizontal}),
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical:
        Platform.OS !== 'android' ? paddingVertical : paddingVertical - 8,
    },
    input: {
      flex: 1,
      fontSize: textScale(fontSize),
      fontFamily,
      color: fontColor,
    },
    placeholder: {
      position: 'absolute',
      top: paddingVertical,
      ...(variant === variantEnum.standard
        ? {left: 0}
        : {left: paddingHorizontal}),
    },
    placeholderText: {
      fontSize: textScale(fontSize),
      fontFamily,
      borderRadius: 8,
    },
    placeholderSpacer: {
      position: 'absolute',
      top: -1,
      left: paddingHorizontal - 3,
      backgroundColor: colors.white,
      height: 1,
    },
    errorText: {
      position: 'absolute',
      color: errorColor,
      fontSize: textScale(errorFontSize),
      bottom: -textScale(errorFontSize) - 7,
      ...(variant === variantEnum.standard
        ? {left: 0}
        : {left: paddingHorizontal}),
    },
    trailingIcon: {
      position: 'absolute',
      right: paddingHorizontal,
      alignSelf: 'center',
    },
    counterText: {
      position: 'absolute',
      color: errorState() ? errorColor : characterCountColor,
      fontSize: textScale(characterCountFontSize),
      bottom: -textScale(characterCountFontSize) - 7,
      right: paddingHorizontal,
    },
    assistiveText: {
      position: 'absolute',
      color: assistiveTextColor,
      fontSize: textScale(assistiveTextFontSize),
      bottom: -textScale(assistiveTextFontSize) - 7,
      left: paddingHorizontal,
    },
  });

  const placeholderStyle = useMemo(() => {
    return [styles.placeholder, animatedPlaceholderStyles];
  }, [styles.placeholder, animatedPlaceholderStyles]);

  return (
    <Animated.View style={[styles.container, animatedContainerStyle, style as ViewStyle]}>
      <TouchableWithoutFeedback onPress={handleFocus}>
        <View style={styles.inputContainer}>
          <TextInput
            {...inputProps}
            ref={inputRef}
            style={styles.input}
            pointerEvents={isFocused() ? 'auto' : 'none'}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChangeText={handleChangeText}
            maxLength={characterCount ? characterCount : undefined}
            selectionColor={errorState() ? errorColor : activeColor}
            placeholder=""
            value={value}
          />
        </View>
      </TouchableWithoutFeedback>
      {trailingIcon && (
        <View style={styles.trailingIcon}>{renderTrailingIcon()}</View>
      )}
      <Animated.View
        style={[styles.placeholderSpacer, animatedPlaceholderSpacerStyles]}
      />
      <Animated.View
        style={placeholderStyle}
        onLayout={handlePlaceholderLayout}
        pointerEvents="none">
        <Animated.Text
          style={[styles.placeholderText, animatedPlaceholderTextStyles]}>
          {placeholder}
        </Animated.Text>
      </Animated.View>
      {characterCount && (
        <Text
          style={[
            styles.counterText,
            counterTextStyle,
          ]}>{`${value.length} / ${characterCount}`}</Text>
      )}
      {errorState() ? (
        <Text style={[styles.errorText, errorStyle]}>{error}</Text>
      ) : (
        assistiveText && (
          <Text style={[styles.assistiveText, assistiveTextStyle]}>
            {assistiveText}
          </Text>
        )
      )}
    </Animated.View>
  );
});

export default AnimationTextInput;
AnimationTextInput.displayName = 'AnimationTextInput';
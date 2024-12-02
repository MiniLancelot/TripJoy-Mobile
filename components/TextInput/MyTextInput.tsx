import React, { useRef, useState } from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = React.ComponentProps<typeof TextInput> & {
  label: string;
  errorText?: string | null;
};

const TextField: React.FC<Props> = (props) => {
  const {
    label,
    errorText,
    value,
    style,
    onBlur,
    onFocus,
    ...restOfProps
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const focusAnim = useSharedValue(0);

  const animatedLabelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(isFocused || !!value ? 0.75 : 1, {
          duration: 150,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      },
      {
        translateY: withTiming(isFocused || !!value ? -12 : 24, {
          duration: 150,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      },
      {
        translateX: withTiming(isFocused || !!value ? 0 : 16, {
          duration: 150,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
      },
    ],
  }));

  let color = isFocused ? '#080F9C' : '#B9C4CA';
  if (errorText) {
    color = '#B00020';
  }

  return (
    <View>
      <TextInput
        style={[
          styles.input,
          {
            borderColor: color,
          },
        ]}
        ref={inputRef}
        {...restOfProps}
        value={value}
        onBlur={(event) => {
          setIsFocused(false);
          focusAnim.value = 0;
          onBlur?.(event);
        }}
        onFocus={(event) => {
          setIsFocused(true);
          focusAnim.value = 1;
          onFocus?.(event);
        }}
      />
      <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
        <Animated.View style={[styles.labelContainer, animatedLabelStyle]}>
          <Text
            style={[
              styles.label,
              {
                color,
              },
            ]}
          >
            {label}
            {errorText ? '*' : ''}
          </Text>
        </Animated.View>
      </TouchableWithoutFeedback>
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    padding: 24,
    borderWidth: 1,
    borderRadius: 4,
    fontFamily: 'Avenir-Medium',
    fontSize: 16,
    width: "90%"
  },
  labelContainer: {
    position: 'absolute',
    paddingHorizontal: 8,
    backgroundColor: 'white',
  },
  label: {
    fontFamily: 'Avenir-Heavy',
    fontSize: 16,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    fontSize: 12,
    color: '#B00020',
    fontFamily: 'Avenir-Medium',
  },
});

export default TextField;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from 'react-native-reanimated';

const texts = ["Tìm kiếm", "Nhập tên để tìm kiếm", "Tìm kiếm bạn bè", "Kết nối với mọi người"];

type TextCarouselProps = {
    texts: string[];
    speed: number;
    duration: number;
    heightValue: number;
};

export default function TextCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const transition = useSharedValue(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      transition.value = 0; // Reset animation

      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length);

      // Start the animation for both exiting and entering
      transition.value = withTiming(1, { duration: 500 }); // Duration for both exit and enter
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Style for the disappearing text
  const animatedExitStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(transition.value, [0, 1], [0, -10]) },
    ],
    opacity: interpolate(transition.value, [0, 1], [1, 0]),
  }));

  // Style for the appearing text
  const animatedEnterStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(transition.value, [0, 1], [10, 0]) },
    ],
    opacity: interpolate(transition.value, [0, 1], [0, 1]),
  }));

  return (
    <View style={styles.container}>
      {/* Exiting text */}
      <Animated.View style={[styles.textContainer, animatedExitStyle]}>
        <Text style={styles.text}>{texts[(currentIndex - 1 + texts.length) % texts.length]}</Text>
      </Animated.View>
      {/* Entering text */}
      <Animated.View style={[styles.textContainer, animatedEnterStyle]}>
        <Text style={styles.text}>{texts[currentIndex]}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 25,
  },
  textContainer: {
    position: 'absolute',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color:"#bfbfbf"
  },
});

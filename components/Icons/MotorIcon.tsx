import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, G, Path, Polyline, Rect } from "react-native-svg";

type IconProps = {
  width?: number;
  height?: number;
};

export default function MotorIcon({ width = 64, height = 64 }: IconProps) {
  return (
    <View style={styles.container}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
        
      >
        <Circle cx="32" cy="32" r="32" fill="#76C2AF" />
        <Path
          d="M17,31c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S13.7,31,17,31 M17,28c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S22,28,17,28 L17,28z"
          fill="#4F5D73"
        />
        <Path
          d="M47,31c3.3,0,6,2.7,6,6s-2.7,6-6,6s-6-2.7-6-6S43.7,31,47,31 M47,28c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S52,28,47,28 L47,28z"
          fill="#4F5D73"
        />
        <Polyline
          points="18,36.5 33,36.5 35,35"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M26,25.5h-4.6c8.8,10.3,15.6,4,15.6,4C37,26.6,32,25.5,26,25.5z"
          fill="#E0995E"
        />
        <Path
          d="M9,27c0,0,2-1.5,5-1.5h12c6,0,11,1.1,11,4c0,0-5,6.5-14-3.5"
          fill="none"
          stroke="#C75C5C"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Polyline
          points="32,18.5 37,18.5 47,37"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
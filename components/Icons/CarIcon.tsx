import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from "react-native-svg";

type IconProps = {
  width?: number;
  height?: number;
};

export default function CarIcon({ width = 64, height = 64 }: IconProps) {
  return (
    <View style={styles.container}>
      <Svg
        height={height}
        width={width}
        viewBox="0 0 64 64"
      >
        {/* Background Circle */}
        <Circle cx="32" cy="32" r="32" fill="#E0E0D1" />
        
        {/* Other paths and shapes */}
        <Path
          d="M48 29c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4l2-10c0.5-2 1.8-4 4-4h20c2.2 0 3.5 2 4 4L48 29z"
          stroke="#C75C5C"
          strokeWidth="4"
          fill="none"
        />
        <Path
          d="M52 40c0 2.2-1.8 4-4 4H16c-2.2 0-4-1.8-4-4v-5c0-2.2 1.8-4 4-4h32c2.2 0 4 1.8 4 4V40z"
          fill="#C75C5C"
          stroke="#C75C5C"
          strokeWidth="4"
        />
        <Path
          d="M21 38c0 2.2-1.8 4-4 4 0 0-4 0-4-4s1.8-4 4-4 4 1.8 4 4z"
          fill="#F5CF87"
          stroke="#C75C5C"
          strokeWidth="2"
        />
        <Path
          d="M51 38c0 2.2-1.8 4-4 4 0 0-4 0-4-4s1.8-4 4-4 4 1.8 4 4z"
          fill="#F5CF87"
          stroke="#C75C5C"
          strokeWidth="2"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
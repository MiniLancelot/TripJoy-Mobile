import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Path, G, Rect } from 'react-native-svg';

type IconProps = {
  width?: number;
  height?: number;
};

export default function TrainIcon({ width = 64, height = 64 }: IconProps) {
  return (
    <View style={styles.container}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 64 64"
      >
        <Circle cx="32" cy="32" r="32" fill="#C75C5C" />
        <Path
          d="M48,42c0,2.2-1.8,4-4,4H20c-2.2,0-4-1.8-4-4V18c0-2.2,1.8-4,4-4h24c2.2,0,4,1.8,4,4V42z"
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeWidth={4}
          strokeMiterlimit={10}
        />
        <Path
          d="M48,30c0,2.2-1.8,4-4,4H20c-2.2,0-4-1.8-4-4V18c0-2.2,1.8-4,4-4h24c2.2,0,4,1.8,4,4V30z"
          fill="#4F5D73"
          stroke="#FFFFFF"
          strokeWidth={4}
          strokeMiterlimit={10}
        />
        <G>
          <Path
            d="M20,46h24c2.2,0,4-1.8,4-4v-4H16v4C16,44.2,17.8,46,20,46z"
            fill="#E0E0D1"
            stroke="#E0E0D1"
            strokeWidth={4}
            strokeMiterlimit={10}
          />
        </G>
        <Path
          d="M24,42c0,2.2-1.8,4-4,4l0,0c-2.2,0-4-1.8-4-4l0,0c0-2.2,1.8-4,4-4l0,0C22.2,38,24,39.8,24,42L24,42z"
          fill="#E0995E"
          stroke="#E0E0D1"
          strokeWidth={4}
          strokeMiterlimit={10}
        />
        <Path
          d="M48,42c0,2.2-1.8,4-4,4l0,0c-2.2,0-4-1.8-4-4l0,0c0-2.2,1.8-4,4-4l0,0C46.2,38,48,39.8,48,42L48,42z"
          fill="#E0995E"
          stroke="#E0E0D1"
          strokeWidth={4}
          strokeMiterlimit={10}
        />
        <Path
          d="M44,52c0,1.1-0.9,2-2,2H22c-1.1,0-2-0.9-2-2l0,0c0-1.1,0.9-2,2-2h20C43.1,50,44,50.9,44,52L44,52z"
          fill="#F5CF87"
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

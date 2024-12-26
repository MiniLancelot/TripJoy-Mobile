import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Circle, G } from "react-native-svg";

type IconProps = {
  width?: number;
  height?: number;
};

export default function PlaneIcon({ width = 64, height = 64 }: IconProps) {
  return (
    <View style={styles.container}>
      <Svg
        height={height}
        width={width}
        viewBox="0 0 64 64"
      >
        <G>
          <Circle cx="32" cy="32" r="32" fill="#4F5D73" />
          <Path d="M16,36c0,1.1-0.9,2-2,2h0c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2V36z" fill="#C75C5C" />
          <Path d="M24,28c0,1.1-0.9,2-2,2h0c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2V28z" fill="#F5CF87" />
          <Path d="M44,28c0,1.1-0.9,2-2,2h0c-1.1,0-2-0.9-2-2v-2c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2V28z" fill="#F5CF87" />
          <Path d="M48,36c0,1.1,0.9,2,2,2h0c1.1,0,2-0.9,2-2v-2c0-1.1-0.9-2-2-2h0c-1.1,0-2,0.9-2,2V36z" fill="#76C2AF" />
          <Path d="M32,30.6l17,4.8c2.9,0.9,3-0.4,3-2.4v1.2c0-2,0.1-3.4-1.8-4.5L32,21L13.8,29.7c-1.8,1.1-1.8,2.5-1.8,4.5V33c0,2,0.1,3.3,3,2.4L32,30.6z" fill="#E0E0D1" />
          <Path d="M35,43.6c0,1.6-0.3,2.9-2,2.9h-2c-1.7,0-2-1.3-2-2.9l-1-26.9c0-1.6,2.3-6.8,4-6.8h0c1.7,0,4,5.2,4,6.8L35,43.6z" fill="#E0E0D1" />
          <Path d="M43,46.8L32,40l-11,6.8c-1.2,0.9-1,2.3-1,3.9c0,0,0.2,1.8,2,1.1L32,48l10,3.9c1.8,0.7,2-1.1,2-1.1C44,49.1,44.1,47.8,43,46.8z" fill="#E0E0D1" />
          <Path d="M34,49c0,1.1-0.9,2-2,2h0c-1.1,0-2-0.9-2-2v-5c0-1.1,0.9-2,2-2h0c1.1,0,2,0.9,2,2V49z" fill="#E0E0D1" />
          <Path d="M32,16c1.2,0,2.2-1.2,2.7-3c-0.8-1.6-1.9-3-2.7-3s-1.9,1.4-2.7,3C29.8,14.8,30.8,16,32,16z" fill="#77B3D4" />
        </G>
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

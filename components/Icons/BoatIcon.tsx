import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Circle, Path, Rect, G } from "react-native-svg";

type IconProps = {
  width?: number;
  height?: number;
};

export default function BoatIcon({ width = 80, height = 80 }: IconProps) {
  return (
    <View style={styles.container}>
      <Svg width={width} height={height} viewBox="0 0 64 64">
        <Circle fill="#77B3D4" cx="32" cy="32" r="32" />
        <Path
          fill="#FFFFFF"
          stroke="#FFFFFF"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M43,49c0,0-10.2,2-18.9,2s-13.2-7.1-13.2-7.1h41.9C52.8,43.9,51.2,48,43,49z"
        />
        <Path
          fill="#F5CF87"
          stroke="#F5CF87"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M29,16c0,0-5.8,20.6-15,24h15V16z"
        />
        <Path
          fill="#C75C5C"
          stroke="#C75C5C"
          strokeLinejoin="round"
          strokeMiterlimit="10"
          d="M29,40c0,0,8-18-1-30c0,0,21,3.6,21,30H29z"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";

type CharProps = {
  id: number;
  name: string;
  rarity: number;
  path: string;
  element: string;
  introduction: string;
  img: string;
};

const Character = () => {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Details of user {id} </Text>
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
export default Character;

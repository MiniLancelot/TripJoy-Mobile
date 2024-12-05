// import { View, Text } from 'react-native'
// import React from 'react'
// import "@/global.css";

// const NewsfeedScreen = () => {
//   return (
//     <View className='flex-1 bg-[#fff]'>
//       <Text>NewsfeedScreen</Text>
//     </View>
//   )
// }

// export default NewsfeedScreen

import StarRailChar from "@/components/Others/StarRailChar";
import StarRailChar2 from "@/components/Others/StarRailChar2";
import TextCarousel from "@/components/Others/TextCarousel";
import { Style } from "@rnmapbox/maps";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// const DATA = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`); // Simulated data

const NewsfeedScreen = () => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.searchBoxContainer}>
        <Pressable style={styles.searchBoxInnerContainer} onPress={() => router.push(`/(search)/search`)}>
          <View style={{marginLeft: 20, marginTop: 2}}>
            <Ionicons name="search" size={18} color="#c3c5c7" />
          </View>
          <TextCarousel />
        </Pressable>
      </View>

      <StarRailChar2 />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchBoxContainer: {
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 6,
    paddingBottom: 1,
    backgroundColor: "white",
    height: 38,
    // borderBottomColor: "#E0E2DB",
    // borderBottomWidth: 0.3,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2,
  },
  searchBoxInnerContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 19,
    padding: 2,
    paddingTop: 7,
    backgroundColor: "#f5f7fa",
    flexDirection: "row",
  },
});

export default NewsfeedScreen;

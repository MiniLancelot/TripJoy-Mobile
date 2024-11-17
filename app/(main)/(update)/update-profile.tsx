import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const UpdateProfile = () => {
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=large";
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Thông tin cá nhân",
        }}
      />
      <View style={styles.avatarContainer}>
        <Image source={{ uri: tempAvatar }} style={styles.image} />
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});

export default UpdateProfile;

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import ColorList from "@/components/Others/ColorList";
import Map from "@/components/Maps/Map";
import { Stack } from "expo-router";
import axios from "axios";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";

type UserProps = {
  id: number;
  name: string;
  rarity: number;
  path: string;
  element: string;
  intro: string;
  img: string;
  isLiked: boolean; //test like
  liked: number;
  location: string;
};

const Trip = () => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchChars();
  }, []);

  const fetchChars = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://hsr-api.vercel.app/api/v1/characters"
        // "https://hsr-api.vercel.app/api/v1/characters"
      );
      setUsers(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // const filteredUsers = users.filter(user =>
  //   user.name.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  const filteredUsers = searchQuery
    ? users.filter(user =>
        user.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : [];

    const renderItem = ({ item }: { item: UserProps }) => {
      const startIndex = item.name.toLowerCase().indexOf(searchQuery.toLowerCase());
      const endIndex = startIndex + searchQuery.length;
  
      return (
        <Text>
          {item.name.substring(0, startIndex)}
          <Text style={styles.highlightText}>
            {item.name.substring(startIndex, endIndex)}
          </Text>
          {item.name.substring(endIndex)}
        </Text>
      );
    };

  return (
    <View style={styles.container}>
      <View style={styles.searchBoxContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <View style={styles.innerContainer}>
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="gray" />
          </View>
        ) : (
          <FlashList
            renderItem={renderItem}
            data={filteredUsers}
            estimatedItemSize={50}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    paddingTop: 25,
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  innerContainer: {
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#E0E2DB",
    flex: 1,
  },
  searchBar: {
    backgroundColor: "#f5f7fa",
    // borderColor: "#E0E2DB",
    // borderWidth: 1.2,
    borderRadius: 100,

    margin: 10,
    padding: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 55,
    fontSize: 18,
    lineHeight: 28,
    paddingRight: 90,
    fontWeight: "500",
  },
  searchBoxContainer: {
    marginTop: 25,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  highlightText: {
    color: "#1AC8ED",
  },
});

export default Trip;
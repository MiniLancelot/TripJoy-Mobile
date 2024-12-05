import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Pressable,
  Image,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import get_user_search from "@/services/user/getUserBySearch";
import { useAuth } from "@/app/(auth)/AuthContext";
import { FlashList } from "@shopify/flash-list";
import { router, Stack } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

type UserProps = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  avatar: any | null;
  dateOfBirth: string | null;
  address: string | null;
  gender: boolean | null;
};

const search = () => {
  const { session } = useAuth();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const tempAvatar =
    "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    fetchName();
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchName = async () => {
    try {
      const result = await get_user_search(session.userToken.accessToken, "");
      if (result) {
        // console.log(result.data.users.data);
        setUsers(result.data.users.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = searchQuery
    ? users.filter((user) =>
        user.userName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : // : [];
      users;

  const renderItem = ({ item }: { item: UserProps }) => {
    const startIndex = item.userName
      .toLowerCase()
      .indexOf(searchQuery.toLowerCase());
    const endIndex = startIndex + searchQuery.length;
    const avatarUri = item.avatar ? item.avatar.url : tempAvatar;

    return (
      <Pressable style={styles.itemContainer} onPress={() => router.push(`/user/${item.id}`)}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
        </View>
        <View>
          <Text>
            {item.userName.substring(0, startIndex)}
            <Text style={styles.highlightText}>
              {item.userName.substring(startIndex, endIndex)}
            </Text>
            {item.userName.substring(endIndex)}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={styles.backBtnWrapper}>
          <Pressable onPress={() => router.replace("/home")}>
            <Ionicons name="arrow-back-outline" size={25} color="#4a4d52" />
          </Pressable>
        </View>
        <View style={styles.searchBoxContainer}>
          <TextInput
            autoFocus
            style={styles.searchBar}
            ref={searchInputRef}
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </View>
      </View>

      <View style={styles.innerContainer}>
        {loading ? (
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <ActivityIndicator size="large" color="gray" />
          </View>
        ) : error ? (
          <Text>Error: {error}</Text>
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
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  innerContainer: {
    borderRadius: 10,
    padding: 10,
    // backgroundColor: "#E0E2DB",
    flex: 1,
  },
  searchBar: {
    backgroundColor: "#fff",
    // borderColor: "#E0E2DB",
    // borderWidth: 1.2,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#e7e8ee",
    margin: 10,
    padding: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "92%",
    height: 37,
    fontSize: 16,
    lineHeight: 24,
    paddingRight: 90,
    fontWeight: "400",
  },
  searchBoxContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  highlightText: {
    color: "#1AC8ED",
  },
  backBtnWrapper: {
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 0,
  },
  avatarContainer: {
    marginRight: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    // borderWidth: 1,
    // borderColor: "black",
  },
  nameContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});

export default search;

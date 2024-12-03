import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button } from "react-native";
import React, { useEffect, useState } from "react";
import TextCarousel from "@/components/Others/TextCarousel";
import get_user_search from "@/services/user/getUserBySearch";
import { useAuth } from "@/app/(auth)/AuthContext";
import { FlashList } from "@shopify/flash-list";
import TextField from "@/components/TextInput/MyTextInput";


type UserProps = {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  avatar: string | null;
  birthday: string | null;
  address: string | null;
  gender: boolean | null;
};

const Trip2 = () => {
  const { session } = useAuth();
  const [users, setUsers] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [value, setValue] = useState('')
  useEffect(() => {
    fetchName();
  }, []);

  const fetchName = async () => {
    try {
      const result = await get_user_search(session.userToken.accessToken, "");
      if (result) {
        setUsers(result.data.users.data);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = searchQuery
  ? users.filter(user =>
      user.userName.toLowerCase().startsWith(searchQuery.toLowerCase())
    )
  : [];

  const renderItem = ({ item }: { item: UserProps }) => {
    const startIndex = item.userName.toLowerCase().indexOf(searchQuery.toLowerCase());
    const endIndex = startIndex + searchQuery.length;

    return (
      <Text>
        {item.userName.substring(0, startIndex)}
        <Text style={styles.highlightText}>
          {item.userName.substring(startIndex, endIndex)}
        </Text>
        {item.userName.substring(endIndex)}
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
      <View>
        <TextField value={value}
        // label="Cardholder name"
        // errorText={error}
        onChangeText={(text) => setValue(text)}/>
      </View>
      <Button
        title="Set error"
        onPress={() => setError('This field is required.')}
      />
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

export default Trip2;
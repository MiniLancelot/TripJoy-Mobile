import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { useRouter } from "expo-router";

type CharProps = {
  id: number;
  name: string;
  rarity: number;
  path: string;
  element: string;
  intro: string;
  img: string;
};

// const DATA = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

const StarRailChar = () => {
  const [chars, setChars] = useState<CharProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchChars();
  }, []);

  const fetchChars = async () => {
    try {
      const response = await axios.get(
        "https://hsr-api.vercel.app/api/v1/characters"
      );

      const newData = response.data.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
      );

      setChars((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);

      // setChars(response.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = () => {
    if (!loading) {
      fetchChars();
    }
  };

  if (loading && page === 1) {
    return (
      <View>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const ListItem = memo(({ item }: { item: CharProps }) => {
    return (
      // <Pressable onPress={() => router.push(`/(one)/${item.id}`)}>
      <Pressable>
        <View style={styles.itemContainer}>
          <Image source={{ uri: item.img }} style={styles.avatar} />
          <View style={styles.infoContainer}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.path}>{item.path}</Text>
          </View>
        </View>
      </Pressable>
    );
  });

  const listFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>You've reached the end</Text>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={chars}
        // renderItem={renderItem}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item: any) => item.id}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListFooterComponent={listFooter}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },

  infoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "bold",
  },

  path: {
    fontSize: 14,
    color: "#666",
  },

  loadingText: {
    textAlign: "center",
    marginTop: 20,
  },

  errorText: {
    textAlign: "center",
    marginTop: 20,
    color: "red",
  },
  footerContainer: {
    padding: 100,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#666",
  },
});

export default StarRailChar;

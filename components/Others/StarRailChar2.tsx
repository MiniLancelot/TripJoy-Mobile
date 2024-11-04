import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReadMoreText from "./ReadMoreText";

type CharProps = {
  id: number;
  name: string;
  rarity: number;
  path: string;
  element: string;
  intro: string;
  img: string;
  isLiked: boolean; //test like
  liked: number;
};

const StarRailChar2 = () => {
  const [chars, setChars] = useState<CharProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const tempTextContent =
    "Đà Nẵng, với vẻ đẹp thiên nhiên tuyệt vời và sự phát triển vượt bậc, xứng đáng là một trong những điểm đến hấp dẫn nhất Việt Nam. Thành phố này không chỉ sở hữu đường bờ biển dài với cát trắng mịn màng, làn nước trong xanh mà còn có những hòn đảo hoang sơ, những ngọn núi hùng vĩ và các khu rừng nguyên sinh đa dạng.\n Bà Nà Hills, Cầu Rồng, bãi biển Mỹ Khê chỉ là một vài trong số những điểm đến nổi tiếng mà Đà Nẵng mang đến cho du khách.\n Với sự phát triển mạnh mẽ của ngành du lịch, Đà Nẵng đã và đang trở thành một điểm đến không thể bỏ qua cho những ai yêu thích khám phá và trải nghiệm. Du lịch Đà Nẵng tự túc thì nên chuẩn bị những gì? Có địa điểm du lịch Đà Nẵng nào đang được hội cuồng chân săn đón? Cùng tìm hiểu nhé!";
  const tempTitle = "2 ngày 1 đêm ở Bà Nà";

  useEffect(() => {
    fetchChars();
  }, []);

  const fetchChars = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://hsr-api.vercel.app/api/v1/characters"
      );
      const newData = response.data.map((item: CharProps) => ({...item, isLiked: false, liked: 99})); // Initialize liked property
      // setChars(response.data);
      setChars(newData);
      // console.log(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="gray" />
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

  // const renderItem = ({ item }: { item: CharProps }) => {
  //   return (
  //     <Pressable onPress={() => router.push(`/post/${item.id}`)}>
  //       <View style={styles.itemContainer2}>
  //         <Image source={{ uri: item.img }} style={styles.avatar2} />
  //         <View style={styles.infoContainer}>
  //           <Text style={styles.name}>{item.name}</Text>
  //           <Text style={styles.path}>{item.path}</Text>
  //         </View>
  //       </View>
  //     </Pressable>
  //   );
  // };

  const RenderItem = ({ item }: { item: CharProps }) => {
    const [itemIsLiked, setItemIsLiked] = useState(item.isLiked);
    const [likeQuantity, setLikeQuantity] = useState(item.liked);

    const toggleLike = () => {
      if (!itemIsLiked) {
        setItemIsLiked(!itemIsLiked);
        setLikeQuantity(likeQuantity + 1);
        console.log(itemIsLiked);
        console.log("Like clicked");
      } else {
        setItemIsLiked(!itemIsLiked);
        setLikeQuantity(likeQuantity - 1);
        console.log(itemIsLiked);
        console.log("Unlike clicked");
      }

      // console.log(itemIsLiked);
      // console.log("Like clicked");
    };

    return (
      <Pressable>
        <View style={styles.itemOuterContainer}>
          
          <Pressable style={styles.itemContainer} onPress={() => router.push(`/post/${item.id}`)}>
            <Image source={{ uri: item.img }} style={styles.avatar} />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.path}>12 tiếng trước</Text>
            </View>
          </Pressable>
          <View style={styles.textContainer}>
          <Text style={[styles.title, {paddingBottom: 5}]}>{tempTitle}</Text>
            <ReadMoreText text={tempTextContent} numberOfLines={3} />
            {/* <ReadMoreText
              text={tempTextContent}
              numberOfLines={3}
              isExpanded={expandedItems[item.id] || false} // Get expanded state from parent
              toggleExpand={() => toggleExpand(item.id)} // Pass toggle function to child
            /> */}
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/images/tripfeed/da-nang.jpg")}
              style={styles.postImage}
            />
          </View>
          <View style={styles.interactionBar}>
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={toggleLike}>
                <Ionicons
                  name={itemIsLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={itemIsLiked ? "#E85D75" : "#000"}
                />
              </TouchableOpacity>

              <Text style={styles.like}>{likeQuantity}</Text>
            </View>
            <Pressable style={styles.likeContainer} onPress={() => router.push(`/comment/${item.id}`)}>
              <Ionicons name="chatbubble-outline" size={24} color="black" />
              <Text style={styles.like}>12</Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  
  const listFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Đã đến cuối</Text>
      </View>
    );
  };

  const refreshHandler = () => {
    setChars([]);
    fetchChars();
  };

  return (
    <View style={styles.container}>
      <FlashList
        data={chars}
        // renderItem={renderItem}
        renderItem={({ item }) => <RenderItem item={item} />}
        keyExtractor={(item: any) => item.id}
        //   contentContainerStyle={{ paddingBottom:  80 }}
        ListFooterComponent={listFooter}
        estimatedItemSize={500}
        onEndReachedThreshold={0.5}
        refreshing={loading}
        onRefresh={refreshHandler}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  itemContainer: {
    flexDirection: "row",
    padding: 10,
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#ddd",
    alignItems: "center",
  },
  itemContainer2: {
    padding: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatar2: {
    width: 250,
    height: 250,
    // borderRadius: 100,
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
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 16,
    color: "#666",
  },
  itemOuterContainer: {
    padding: 15,
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e8ee",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    // paddingLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 10,
    width: "100%",
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  textContainer: {
    marginTop: 10,
    width: "98%",
  },
  interactionBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    marginTop: 15,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  like: {
    marginLeft: 5,
    fontSize: 16,
  },
});

export default StarRailChar2;

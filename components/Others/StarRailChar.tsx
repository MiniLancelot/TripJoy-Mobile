import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect, memo } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import ReadMoreText from "./ReadMoreText";
import Ionicons from "@expo/vector-icons/Ionicons";

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

// const DATA = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`);

const StarRailChar = () => {
  const [chars, setChars] = useState<CharProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  const tempTextContent =
    "Đà Nẵng, với vẻ đẹp thiên nhiên tuyệt vời và sự phát triển vượt bậc, xứng đáng là một trong những điểm đến hấp dẫn nhất Việt Nam. Thành phố này không chỉ sở hữu đường bờ biển dài với cát trắng mịn màng, làn nước trong xanh mà còn có những hòn đảo hoang sơ, những ngọn núi hùng vĩ và các khu rừng nguyên sinh đa dạng.\n Bà Nà Hills, Cầu Rồng, bãi biển Mỹ Khê chỉ là một vài trong số những điểm đến nổi tiếng mà Đà Nẵng mang đến cho du khách.\n Với sự phát triển mạnh mẽ của ngành du lịch, Đà Nẵng đã và đang trở thành một điểm đến không thể bỏ qua cho những ai yêu thích khám phá và trải nghiệm. Du lịch Đà Nẵng tự túc thì nên chuẩn bị những gì? Có địa điểm du lịch Đà Nẵng nào đang được hội cuồng chân săn đón? Cùng tìm hiểu nhé!";
  const tempTitle = "2 ngày 1 đêm ở Bà Nà";

  useEffect(() => {
    fetchChars();
  }, []);

  const fetchChars = async () => {
    if (allItemsLoaded) return;

    try {
      const response = await axios.get(
        "https://hsr-api.vercel.app/api/v1/characters"
      );

      // const newData = response.data.slice(
      //   (page - 1) * ITEMS_PER_PAGE,
      //   page * ITEMS_PER_PAGE
      // );

      const newData = response.data
        .slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)
        .map((item: CharProps) => ({ ...item, isLiked: false, liked: 99 })); // Initialize liked property

      if (newData.length < ITEMS_PER_PAGE) {
        setAllItemsLoaded(true);
      }

      setChars((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);

      // setChars(response.data);
      console.log("Loading more items");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) {
      fetchChars();
    }
  };

  if (loading && page === 1) {
    return (
      <View style={styles.footerContainer}>
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

  const listFooter = () => {
    return (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>You've reached the end</Text>
      </View>
    );
  };

  const ListItem = memo(({ item }: { item: CharProps }) => {
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
        <View
          // className="p-5 flex flex-col border-b-[5px] border-gray-300"
          style={styles.itemOuterContainer}
        >
          <Text
            // className="text-2xl font-bold"
            style={styles.title}
          >
            {tempTitle}
          </Text>
          <View
            // className="flex-row items-center"
            style={styles.itemContainer}
          >
            <Image
              source={{ uri: item.img }}
              style={styles.avatar}
              // className="w-[50px] h-[50px] rounded-full mr-[10px] border border-black"
            />
            <View
              // className="flex-1"
              style={styles.infoContainer}
            >
              <Text
                // className="text-xl font-bold"
                style={styles.name}
              >
                {item.name}
              </Text>
              <Text
                // className="text-base mt-[5px]"
                style={styles.path}
              >
                12 tiếng trước
              </Text>
            </View>
          </View>
          <View
            // className="mt-[10px] w-full"
            style={styles.textContainer}
          >
            <ReadMoreText text={tempTextContent} numberOfLines={3} />
            {/* <ReadMoreText
              text={tempTextContent}
              numberOfLines={3}
              isExpanded={expandedItems[item.id] || false} // Get expanded state from parent
              toggleExpand={() => toggleExpand(item.id)} // Pass toggle function to child
            /> */}
          </View>
          <View
            // className="items-center mt-[10px] w-full"
            style={styles.imageContainer}
          >
            <Image
              source={require("../../assets/images/tripfeed/da-nang.jpg")}
              style={styles.postImage}
              // className="w-full h-[200px] rounded-lg"
            />
          </View>
          <View
            // className="px-[50px] mt-[15px] flex-row justify-between w-full"
            style={styles.interactionBar}
          >
            <View
              // className="LikeSession flex-row items-center"
              style={styles.likeContainer}
            >
              <TouchableOpacity onPress={toggleLike}>
                <Ionicons
                  name={itemIsLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={itemIsLiked ? "#E85D75" : "#000"}
                />
              </TouchableOpacity>

              <Text
                // className="ml-[5px] text-lg"
                style={styles.like}
              >
                {likeQuantity}
              </Text>
            </View>
            <View
              // className="LikeSession flex-row items-center"
              style={styles.likeContainer}
            >
              <Ionicons name="chatbubble-outline" size={24} color="black" />
              <Text
                // className="ml-[5px] text-lg"
                style={styles.like}
              >
                12
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  });

  return (
    <View>
      <FlatList
        data={chars}
        // renderItem={renderItem}
        renderItem={({ item }) => <ListItem item={item} />}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        ListFooterComponent={allItemsLoaded ? listFooter : null}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  itemOuterContainer: {
    padding: 15,
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 5,
    borderBottomColor: "#ddd",
  },
  itemContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "black",
  },

  infoContainer: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: "500",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    // paddingLeft: 10,
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

export default StarRailChar;

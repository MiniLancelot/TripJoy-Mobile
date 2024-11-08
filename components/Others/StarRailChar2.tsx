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
import CharacterData from "@/assets/characters.json";
import AntDesign from '@expo/vector-icons/AntDesign';
// import { FontAwesome } from "@expo/vector-icons";
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
  location: string;
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
      // const testRes = CharacterData;
      // console.log(`${testRes[0].name}:` , testRes[0] );

      const response = await axios.get(
        "https://hsr-api.vercel.app/api/v1/characters"
      );
      const newData = response.data
        .map((item: CharProps) => ({
          ...item,
          isLiked: false,
          liked: 99, // Initialize liked property
          location: "Đà Nẵng",
        }))
        .slice(2);
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

    const getImageWidth = (numImages: number) => {
      if (numImages === 1) return "100%";
      if (numImages === 2) return "49.2%";
      if (numImages === 3) return "32.5%";
      return "32.5%";
    };

    const displayImages = chars.slice(0, 2);
    // console.log(displayImages.map(char => char.name));

    return (
      <Pressable>
        <View style={styles.itemOuterContainer}>
          <View style={styles.itemContainer}>
            <Pressable onPress={() => router.push(`/post/${item.id}`)}>
              <Image source={{ uri: item.img }} style={styles.avatar} />
            </Pressable>

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.path}>23h trước • {item.location}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{tempTitle}</Text>
            <ReadMoreText text={tempTextContent} numberOfLines={3} />
            {/* <ReadMoreText
              text={tempTextContent}
              numberOfLines={3}
              isExpanded={expandedItems[item.id] || false} // Get expanded state from parent
              toggleExpand={() => toggleExpand(item.id)} // Pass toggle function to child
            /> */}
          </View>
          <View style={styles.imageContainer}>
            {displayImages.map((char, index) => (
              <Image
                key={index}
                source={require("../../assets/images/tripfeed/da-nang.jpg")}
                style={[
                  styles.postImage,
                  { width: getImageWidth(displayImages.length) },
                ]}
              />
            ))}
          </View>
          <View style={styles.interactionBar}>
            <TouchableOpacity
              style={styles.likeContainer}
              onPress={() => router.push(`/comment/${item.id}`)}
            >
              <Ionicons name="chatbubble-outline" size={22} color="#626262" />
              <Text style={styles.like}>12</Text>
            </TouchableOpacity>
            <View style={styles.likeContainer}>
              <TouchableOpacity onPress={toggleLike} style={{alignItems: "center", justifyContent: "center"}}>
                {/* <Ionicons
                  name={itemIsLiked ? "heart" : "heart-outline"}
                  size={24}
                  color={itemIsLiked ? "#E85D75" : "#626262"}
                /> */}
                <AntDesign
                  name={itemIsLiked ? "like1" : "like2"}
                  size={22}
                  color={itemIsLiked ? "#E85D75" : "#626262"}
                />
              </TouchableOpacity>

              <Text style={styles.like}>{likeQuantity}</Text>
            </View>
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
  itemOuterContainer: {
    padding: 15,
    flex: 1,
    flexDirection: "column",
    borderBottomWidth: 1,
    borderBottomColor: "#e7e8ee",
  },
  itemContainer: {
    flexDirection: "row",
    // borderBottomWidth: 0.5,
    // borderBottomColor: "#ddd",
    // alignItems: "center",
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
    justifyContent: "center",
    gap: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
  },

  path: {
    fontSize: 11,
    color: "#8F91A2",
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

  title: {
    fontSize: 17,
    fontWeight: "500",
    paddingVertical: 5,
    // paddingLeft: 10,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  postImage: {
    width: "32%",
    height: 190,
    borderRadius: 6,
  },
  textContainer: {
    // marginTop: 10,
  },
  interactionBar: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    marginTop: 15,
    gap: 40,
  },
  likeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5
  },
  like: {
    marginLeft: 5,
    fontSize: 13,
    color: "#626262",
  },
});

export default StarRailChar2;

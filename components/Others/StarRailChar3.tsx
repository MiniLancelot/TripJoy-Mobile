import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Image } from "expo-image";
import { useState, useEffect, memo, useRef, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReadMoreText from "./ReadMoreText";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  deletePost,
  getPostsByUserId,
  getPostsHomeFeed,
} from "@/services/post/post";
import { useAuth } from "@/app/(auth)/AuthContext";
import { post, user } from "@/utils/request";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
// import CommentList from "../Comments/CommentList";
import { set } from "date-fns";
import ReactionBox from "../Reactions";
import { ca } from "date-fns/locale";
// import FacebookReaction from "../Reactions/Reaction";
// import ReactionBox from "../Reactions";
// import { FontAwesome } from "@expo/vector-icons";
// type CharProps = {
//   id: number;
//   name: string;
//   rarity: number;
//   path: string;
//   element: string;
//   intro: string;
//   img: string;
//   isLiked: boolean; //test like
//   liked: number;
//   location: string;
// };

type PostProps = {
  postId: string;
  userId: string;
  username: string;
  avatar: string;
  content: string;
  images: string[];
  // location: string;
  createdAt: string;
  isLiked: any; //test like
  liked: number;
  commnentCount: number;
};

interface Params {
  userId?: string;
}

const PAGE_SIZE = 10;

const StarRailChar2 = ({ userId }: Params) => {
  const { session } = useAuth();
  const [chars, setChars] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  // const [chosenPost, setChosenPost] = useState<PostProps | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["30%", "50%"], []);

  const tempTextContent =
    "Đà Nẵng, với vẻ đẹp thiên nhiên tuyệt vời và sự phát triển vượt bậc, xứng đáng là một trong những điểm đến hấp dẫn nhất Việt Nam. Thành phố này không chỉ sở hữu đường bờ biển dài với cát trắng mịn màng, làn nước trong xanh mà còn có những hòn đảo hoang sơ, những ngọn núi hùng vĩ và các khu rừng nguyên sinh đa dạng.\n Bà Nà Hills, Cầu Rồng, bãi biển Mỹ Khê chỉ là một vài trong số những điểm đến nổi tiếng mà Đà Nẵng mang đến cho du khách.\n Với sự phát triển mạnh mẽ của ngành du lịch, Đà Nẵng đã và đang trở thành một điểm đến không thể bỏ qua cho những ai yêu thích khám phá và trải nghiệm. Du lịch Đà Nẵng tự túc thì nên chuẩn bị những gì? Có địa điểm du lịch Đà Nẵng nào đang được hội cuồng chân săn đón? Cùng tìm hiểu nhé!";
  const tempTitle = "2 ngày 1 đêm ở Bà Nà";

  useEffect(() => {
    fetchChars();
  }, []);

  const fetchChars = async (isLoadMore = false) => {
    try {
      if (loading || (isLoadMore && !hasNextPage)) return;

      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
      }

      // const testRes = CharacterData;
      // console.log(`${testRes[0].name}:` , testRes[0] );

      const _response =
        userId == undefined
          ? await getPostsHomeFeed(session.userToken.accessToken, {
              pageIndex: pageIndex,
              pageSize: PAGE_SIZE,
            })
          : await getPostsByUserId(session.userToken.accessToken, userId, {
              pageIndex: pageIndex,
              pageSize: PAGE_SIZE,
            });
      const newData = _response.data.posts.data.map(
        (_item: any): PostProps => ({
          postId: _item.postId,
          userId: _item.userPosted.userId,
          content: _item.content,
          images: _item.postImages.map((image: any) => image.url),
          createdAt: _item.createdAt.split("T")[0],
          isLiked: _item.emotionByMe ?? false,
          liked: _item.likeCount, // Initialize liked property
          username: _item.userPosted.userName,
          avatar: _item.userPosted.avatar,
          commnentCount: _item.commentCount,
        })
      );
      setChars((prev) => (isLoadMore ? [...prev, ...newData] : newData));
      setHasNextPage(newData.length === PAGE_SIZE);
      if (isLoadMore) {
        setPageIndex((prev) => prev + 1);
      }
      // console.log(JSON.stringify(response.data, null, 2));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const _deletePost = async (postId: string) => {
    try {
      const response = await deletePost(postId, session.userToken.accessToken);
      if (response.status === 200) {
        setChars((prev) => prev.filter((item) => item.postId !== postId));
      }
    } catch (error) {
      console.log("Delete post error: " + error);
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

  const RenderItem = ({
    item,
    _onDelete,
  }: {
    item: PostProps;
    _onDelete?: any;
  }) => {
    const [itemIsLiked, setItemIsLiked] = useState(item.isLiked);
    const [likeQuantity, setLikeQuantity] = useState(item.liked);

    const tempAvatar =
      "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
    const avatarUri = item.avatar == null ? tempAvatar : item.avatar;

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

    const displayImages = chars.slice(0, 3);
    // console.log(displayImages.map(char => char.name));

    return (
      <Pressable>
        <View style={styles.itemOuterContainer}>
          <View style={styles.itemContainer}>
            <Pressable onPress={() => console.log("Avatar clicked")}>
              {/* <Image source={{ uri: item.img }} style={styles.avatar} /> */}
              <Image source={avatarUri} style={styles.avatar} />
            </Pressable>

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.path}>{item.createdAt}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.content}</Text>
            <ReadMoreText text={item.content} numberOfLines={1} />
            {/* <ReadMoreText
              text={tempTextContent}
              numberOfLines={3}
              isExpanded={expandedItems[item.id] || false} // Get expanded state from parent
              toggleExpand={() => toggleExpand(item.id)} // Pass toggle function to child
            /> */}
          </View>
          {userId != undefined && (
            <TouchableOpacity
              onPress={() => {
                console.log("Delete clicked: " + item.postId);
                _onDelete(item.postId);
              }}
            >
              <Text>Xóa bài viết</Text>
            </TouchableOpacity>
          )}
          <View style={styles.imageContainer}>
            {item.images.map((char, index) => (
              <Image
                key={index}
                source={{ uri: char }}
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
              onPress={() => {
                console.log("Comment clicked: " + item.postId);
                // handleOpen(item);
                router.push(`/comment/${item.postId}`);
              }}
            >
              <Ionicons name="chatbubble-outline" size={22} color="#626262" />
              <Text style={styles.like}>{item.commnentCount}</Text>
            </TouchableOpacity>
            <View style={styles.likeContainer}>
              <TouchableOpacity
                onPress={toggleLike}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <AntDesign
                  name={itemIsLiked ? "like1" : "like2"}
                  size={22}
                  color={itemIsLiked ? "#E85D75" : "#626262"}
                />
              </TouchableOpacity>
              {/* <FacebookReaction /> */}
              {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ReactionBox />
              </View> */}

              <Text style={styles.like}>{likeQuantity}</Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const listFooter = () => {
    return hasNextPage ? (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Đã đến cuối</Text>
      </View>
    ) : isFetchingMore ? (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Đang tải...</Text>
      </View>
    ) : null;
  };

  const refreshHandler = () => {
    fetchChars(false);
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <FlashList
            data={chars}
            // renderItem={renderItem}
            renderItem={({ item }: { item: PostProps }) => (
              <RenderItem item={item} _onDelete={_deletePost} />
            )}
            keyExtractor={(item) => item.postId}
            //   contentContainerStyle={{ paddingBottom:  80 }}
            onEndReached={() => fetchChars(true)}
            ListFooterComponent={listFooter}
            estimatedItemSize={500}
            onEndReachedThreshold={0.5}
            refreshing={loading}
            onRefresh={refreshHandler}
            showsVerticalScrollIndicator={false}
          />
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
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
    gap: 5,
  },
  like: {
    marginLeft: 5,
    fontSize: 13,
    color: "#626262",
  },
});

export default StarRailChar2;

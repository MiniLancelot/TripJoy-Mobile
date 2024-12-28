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
// import AntDesign from "@expo/vector-icons/AntDesign";
import {
  deletePost,
  getPostById,
  getPostsByUserId,
  getPostsHomeFeed,
  likePost,
  unlikePost,
} from "@/services/post/post";
import { useAuth } from "@/app/(auth)/AuthContext";
import { plan, post, user } from "@/utils/request";
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
  planPost: any;
  createdAt: string;
  isLiked: any; //test like
  liked: number;
  commnentCount: number;
};

interface Params {
  _userId?: string;
}

enum Vehicle {
  MOTORBIKE = 0,
  CAR = 1,
  TRAIN = 2,
  BOAT = 3,
  AIRPLANE = 4,
}

const PAGE_SIZE = 10;

const StarRailChar2 = ({ _userId }: Params) => {
  const { session } = useAuth();
  const [chars, setChars] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  // const [chosenPost, setChosenPost] = useState<PostProps | null>(null);

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
        _userId == undefined
          ? await getPostsHomeFeed(session.userToken.accessToken, {
              pageIndex: pageIndex,
              pageSize: PAGE_SIZE,
            })
          : await getPostsByUserId(session.userToken.accessToken, _userId, {
              pageIndex: pageIndex,
              pageSize: PAGE_SIZE,
            });
      const newData = _response.data.posts.data.map(
        (_item: any): PostProps => ({
          postId: _item.postId,
          userId: _item.userPosted.userId,
          content: _item.content,
          images: _item.postImages.map((image: any) => image.url),
          planPost: _item.planPost,
          createdAt: _item.createdAt.split("T")[0],
          isLiked: _item.emotionByMe,
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

  const handleChangeItem = (item: PostProps, _index: number) => {
    setChars((prev) =>
      prev.map((char, i) => (i === _index ? { ...char, ...item } : char))
    );
  };

  if (error) {
    return (
      <View>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  const RenderItem = ({
    _key,
    item,
    _onDelete,
    _onChangeItem,
  }: {
    _key: number;
    item: PostProps;
    _onDelete?: any;
    _onChangeItem?: (item: PostProps, _index: number) => void;
  }) => {
    // const [itemIsLiked, setItemIsLiked] = useState(item.isLiked != null);
    const [currentReaction, setCurrentReaction] = useState<number | null>(
      item.isLiked
    );
    // const [likeQuantity, setLikeQuantity] = useState(item.liked);

    const tempAvatar =
      "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
    const avatarUri = item.avatar == null ? tempAvatar : item.avatar;

    const handleReaction = async (reaction: number | null) => {
      try {
        // Cập nhật ngay trên giao diện
        console.log("Reaction: ", reaction);
        setCurrentReaction(reaction);
        // setLikeQuantity(
        //   reaction === null ? likeQuantity - 1 : likeQuantity + 1
        // );
        let response = null;
        // Gọi API cập nhật trạng thái
        if (reaction === null) {
          response = await unlikePost(session.userToken.accessToken, item.postId);
        } else {
          response = await likePost(
            { LikePost: { Emotion: reaction } },
            session.userToken.accessToken,
            item.postId
          );
        }
        if (response.data.isSuccess){
          // Lấy dữ liệu mới nhất của post (nếu cần)
        const _newItem = await getPostById(
          session.userToken.accessToken,
          item.postId
        );
        _onChangeItem &&
          _onChangeItem(
            {
              postId: _newItem.data.post.postId,
              userId: _newItem.data.post.userPosted.userId,
              content: _newItem.data.post.content,
              images: _newItem.data.post.postImages.map(
                (image: any) => image.url
              ),
              planPost: _newItem.data.post.planPost,
              createdAt: _newItem.data.post.createdAt.split("T")[0],
              isLiked: _newItem.data.post.emotionByMe,
              liked: _newItem.data.post.likeCount,
              username: _newItem.data.post.userPosted.userName,
              avatar: _newItem.data.post.userPosted.avatar,
              commnentCount: _newItem.data.post.commentCount,
            },
            _key
          );
        }
        
      } catch (error) {
        console.error("Error updating reaction:", error);
      }
    };

    useEffect(() => {
      console.log("Current reaction: ", currentReaction);
    }, [currentReaction]);

    const getImageWidth = (numImages: number) => {
      if (numImages === 1) return "100%";
      if (numImages === 2) return "49.5%";
      if (numImages === 3) return "32.5%";
      return "32.5%";
    };

    const displayImages = item.images.slice(0, 2);
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
            {item.planPost != null && (
              <View>
                <Text style={styles.title}>
                  Ngày bắt đầu: {item.planPost.planStartDate.split("T")[0]}
                </Text>
                <Text style={styles.title}>
                  Ngày kết thúc: {item.planPost.planEndDate.split("T")[0]}
                </Text>
                <Text style={styles.title}>
                  Địa điểm: {item.planPost.provinceStart.provinceName} -{" "}
                  {item.planPost.provinceEnd.provinceName}
                </Text>
                <Text style={styles.title}>
                  Kinh phí: {item.planPost.budget}
                </Text>
                {(() => {
                  let vehicle = "";
                  switch (item.planPost.vehicle) {
                    case Vehicle.MOTORBIKE:
                      vehicle = "Xe máy";
                      break;
                    case Vehicle.CAR:
                      vehicle = "Ô tô";
                      break;
                    case Vehicle.TRAIN:
                      vehicle = "Tàu hỏa";
                      break;
                    case Vehicle.BOAT:
                      vehicle = "Tàu thuyền";
                      break;
                    case Vehicle.AIRPLANE:
                      vehicle = "Máy bay";
                      break;
                    default:
                      return null;
                  }
                  return (
                    <Text style={styles.title}>Phương tiện: {vehicle}</Text>
                  );
                })()}
                <Text style={styles.title}>Lộ trình</Text>
                <View style={{ marginLeft: 10 }}>
                  {item.planPost.postPlanLocations.map(
                    (location: any, index: any) => (
                      <View key={index}>
                        <Text>{location.name}</Text>
                        <Text>{location.address}</Text>
                        <Text>{location.estimatedStartDate.split("T")[0]}</Text>
                      </View>
                    )
                  )}
                </View>
              </View>
            )}
          </View>
          {_userId != null &&_userId == session.userInfo.user.profile.id && (
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
            {item.planPost != null && item.userId != session.userInfo.user.profile.id && (
              <Pressable
                onPress={() => {
                  console.log("Plan clicked: " + item.postId);
                }}
              >
                <Text>Xin gia nhập</Text>
              </Pressable>
            )}
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
              {/* <TouchableOpacity
                onPress={toggleLike}
                style={{ alignItems: "center", justifyContent: "center" }}
              >
                <AntDesign
                  name={itemIsLiked ? "like1" : "like2"}
                  size={22}
                  color={itemIsLiked ? "#E85D75" : "#626262"}
                />
              </TouchableOpacity> */}

              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ReactionBox
                  _current={currentReaction}
                  _setCurrent={(reaction) => handleReaction(reaction)}
                />
              </View>

              <Text style={styles.like}>{item.liked}</Text>
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
            renderItem={({ item, index }) => (
              <RenderItem
                _key={index}
                item={item}
                _onDelete={_deletePost}
                _onChangeItem={handleChangeItem}
              />
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
    justifyContent: "flex-start",
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

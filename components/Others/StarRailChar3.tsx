import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { useState, useEffect, memo, useRef, useCallback, useMemo } from "react";
import { useRouter } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import ReadMoreText from "./ReadMoreText";
// import AntDesign from "@expo/vector-icons/AntDesign";
import MotorIcon from "@/components/Icons/MotorIcon";
import BoatIcon from "@/components/Icons/BoatIcon";
import CarIcon from "@/components/Icons/CarIcon";
import PlaneIcon from "@/components/Icons/PlaneIcon";
import TrainIcon from "@/components/Icons/TrainIcon";
import { FontAwesome6 } from "@expo/vector-icons";
import React from "react";
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
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn xóa bài viết này?",
      [
        {
          text: "Hủy",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              const response = await deletePost(
                session.userToken.accessToken,
                postId
              );
              if (response.data.isSuccess) {
                setChars((prev) =>
                  prev.filter((char) => char.postId !== postId)
                );
              }
            } catch (error) {
              console.error("Error deleting post:", error);
            }
          },
        },
      ],
      { cancelable: true }
    );
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

  const DashLine = () => (
    <View
      style={{
        borderStyle: "dashed",
        borderWidth: 1,
        height: 1,
        width: 50,
        borderColor: "#ccc",
        marginVertical: 8,
        marginHorizontal: 20,
        borderRadius: 1,
      }}
    />
  );

  const VerticalDashLine = () => (
    <View
      style={{
        height: 30,
        width: 1,
        borderLeftWidth: 1,
        borderStyle: "dashed",
        borderColor: "#ccc",
        marginLeft: 12,
        marginVertical: 5,
      }}
    />
  );

  const getVehicleIcon = (vehicle: number) => {
    switch (vehicle) {
      case 0:
        return <MotorIcon width={40} height={40} />;
      case 1:
        return <CarIcon width={40} height={40} />;
      case 2:
        return <TrainIcon width={40} height={40} />;
      case 3:
        return <BoatIcon width={40} height={40} />;
      case 4:
        return <PlaneIcon width={40} height={40} />;
      default:
        return null; // Fallback if vehicle type is not recognized
    }
  };

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
    const [isLoaded, setIsLoaded] = useState(false);

    const tempAvatar =
      "https://pbs.twimg.com/media/GSNsL59WIAAxJrr?format=jpg&name=medium";
    const avatarUri = item.avatar == null ? tempAvatar : item.avatar;

    const handleReaction = async (reaction: number | null) => {
      try {
        setIsLoaded(true);
        // Cập nhật ngay trên giao diện
        console.log("Reaction: ", reaction);
        setCurrentReaction(reaction);
        // setLikeQuantity(
        //   reaction === null ? likeQuantity - 1 : likeQuantity + 1
        // );
        let response = null;
        // Gọi API cập nhật trạng thái
        if (reaction === null) {
          response = await unlikePost(
            session.userToken.accessToken,
            item.postId
          );
        } else {
          response = await likePost(
            { LikePost: { Emotion: reaction } },
            session.userToken.accessToken,
            item.postId
          );
        }
        if (response.data.isSuccess) {
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
          setIsLoaded(false);
        }
      } catch (error) {
        console.error("Error updating reaction:", error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi thực hiện hành động này");
        setIsLoaded(false);
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

    const formatBudget = (budget: number): string => {
      return budget.toLocaleString("en-US");
    };

    // console.log(displayImages.map(char => char.name));

    return (
      <Pressable>
        <View style={styles.itemOuterContainer}>
          <View style={styles.itemContainer}>
            <Pressable onPress={() => router.push(`/user/${item.userId}`)}>
              {/* <Image source={{ uri: item.img }} style={styles.avatar} /> */}
              <Image source={avatarUri} style={styles.avatar} />
            </Pressable>

            <View style={styles.infoContainer}>
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.path}>{item.createdAt.split("-").reverse().join("-")}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.content}</Text>
            {item.planPost != null && (
              <View
                style={{
                  marginVertical: 10,
                  borderWidth: 1,
                  borderColor: "#b2b2b2",
                  borderRadius: 10,
                  padding: 5,
                  backgroundColor: "#fff",
                  elevation: 1,
                  paddingVertical: 10,
                  paddingHorizontal: 10,
                  width: "100%",
                }}
              >
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Ionicons name="location" size={24} color="#17a1fa" />
                  <Text style={styles.summaryLocationText}>
                    {item.planPost.provinceStart.provinceName}
                  </Text>
                </View>
                <VerticalDashLine />
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                >
                  <Ionicons name="location" size={24} color="#ff6188" />
                  <Text style={styles.summaryLocationText}>
                    {" "}
                    {item.planPost.provinceEnd.provinceName}
                  </Text>
                </View>

                <View style={styles.summaryVehicleContainer}>
                  {getVehicleIcon(item.planPost.vehicle)}
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginTop: 20,
                  }}
                >
                  <Ionicons
                    name={"calendar-outline"}
                    size={30}
                    color={"#6b707b"}
                  />
                  <Text style={styles.summaryLocationText}>
                    {item.planPost.planStartDate.split("T")[0].split("-")[2]}-
                    {item.planPost.planStartDate.split("T")[0].split("-")[1]}-
                    {item.planPost.planStartDate.split("-")[0]}
                  </Text>
                  <DashLine />
                  <Text style={styles.summaryLocationText}>
                    {item.planPost.planEndDate.split("T")[0].split("-")[2]}-
                    {item.planPost.planEndDate.split("-")[1]}-
                    {item.planPost.planEndDate.split("-")[0]}
                  </Text>
                </View>
                {/* <Text style={styles.title}>
                  Ngày bắt đầu: {item.planPost.planStartDate.split("T")[0]}
                </Text>
                <Text style={styles.title}>
                  Ngày kết thúc: {item.planPost.planEndDate.split("T")[0]}
                </Text> */}
                {/* <Text style={styles.title}>
                  Địa điểm: {item.planPost.provinceStart.provinceName} -{" "}
                  {item.planPost.provinceEnd.provinceName}
                </Text> */}

                <View
                  style={{
                    flexDirection: "row",
                    gap: 10,
                    alignItems: "center",
                    marginTop: 20,
                    marginLeft: 5,
                  }}
                >
                  <FontAwesome6 name="money-bill" size={20} color={"#13c892"} />
                  <Text style={styles.summaryLocationText}>
                    Kinh phí dự tính: {formatBudget(item.planPost.budget)} đ
                  </Text>
                </View>

                {/* {(() => {
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
                })()} */}
                {item.planPost.postPlanLocations.length > 0 && (
                  <>
                    <Text style={styles.title}>Lộ trình:</Text>
                    <View style={{ marginLeft: 10 }}>
                      {item.planPost.postPlanLocations.map(
                        (location: any, index: any) => (
                          <View key={index}>
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "flex-start",
                              }}
                            >
                              <FontAwesome6
                                name="map-pin"
                                size={20}
                                color={"#ff6188"}
                              />
                              <Text style={{ fontSize: 16 }}>
                                {location.estimatedStartDate
                                  .split("T")[0]
                                  .split("-")
                                  .reverse()
                                  .join("-")}
                              </Text>

                              <Text
                                style={{
                                  flex: 1,
                                  flexWrap: "wrap",
                                  flexShrink: 1,
                                  fontSize: 16,
                                }}
                              >
                                {location.name}
                              </Text>
                              {/* <Text>{location.address}</Text> */}
                            </View>
                            {index <
                              item.planPost.postPlanLocations.length - 1 && (
                              <View style={{ transform: [{ translateX: -6 }] }}>
                                <VerticalDashLine />
                              </View>
                            )}
                          </View>
                        )
                      )}
                    </View>
                  </>
                )}
              </View>
            )}
          </View>
          {_userId != null && _userId == session.userInfo.user.profile.id && (
            // <TouchableOpacity
            //   onPress={() => {
            //     console.log("Delete clicked: " + item.postId);
            //     _onDelete(item.postId);
            //   }}
            // >
            //   <Text>Xóa bài viết</Text>
            // </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log("Delete clicked: " + item.postId);
                _onDelete(item.postId);
              }}
              style={styles.delete}
            >
              <Ionicons name="trash-bin-outline" size={20} color={"#ff6188"} />
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
            {/* {item.planPost != null &&
              item.userId != session.userInfo.user.profile.id && (
                <Pressable
                  onPress={() => {
                    console.log("Plan clicked: " + item.postId);
                  }}
                >
                  <Text>Xin gia nhập</Text>
                </Pressable>
              )} */}
            <View style={styles.likeContainer}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <ReactionBox
                  _current={currentReaction}
                  _setCurrent={(reaction) => handleReaction(reaction)}
                />
              </View>

              <Text style={styles.like}>{item.liked}</Text>
            </View>
            <TouchableOpacity
              style={styles.likeContainer}
              onPress={() => {
                console.log("Comment clicked: " + item.postId);
                router.push(`/comment/${item.postId}`);
              }}
            >
              <Ionicons name="chatbubble-outline" size={22} color="#626262" />
              <Text style={styles.cmtNumber}>{item.commnentCount}</Text>
            </TouchableOpacity>
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
    ) : (
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>Đã đến cuối</Text>
      </View>
    )
  };

  const refreshHandler = () => {
    fetchChars(false);
  };

  return (
    <View style={styles.container}>
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          <FlatList
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
            // estimatedItemSize={500}
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
  summaryLocationText: {
    fontSize: 16,
    fontWeight: "bold",
  },

  title: {
    fontSize: 17,
    fontWeight: "500",
    paddingVertical: 5,
    marginTop: 5,
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
  summaryVehicleContainer: {
    position: "absolute",
    right: 15,
    top: 15,
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
    marginLeft: -10,
    fontSize: 13,
    color: "#626262",
  },

  cmtNumber: {
    marginLeft: 5,
    fontSize: 13,
    color: "#626262",
  },
  delete: {
    color: "red",
    position: "absolute",
    right: 20,
    top: 15,
  },
});

export default StarRailChar2;

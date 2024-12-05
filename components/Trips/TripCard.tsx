import {
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get("window").width - OFFSET * 2;
const ITEM_HEIGHT = 200;
type TProps = {
  scrollX: SharedValue<number>;
  id: number;
  total: number;
  item: any;
};

const catImages = [
  "https://i.pinimg.com/736x/d1/7c/c7/d17cc7bf0e13fcdf975dd682d5df792f.jpg",
  "https://i.pinimg.com/originals/34/bf/b0/34bfb03034a7d7b89ab174c9b903b7a6.jpg",
  "https://w0.peakpx.com/wallpaper/440/401/HD-wallpaper-loadnig-cat-meme-loading-cat-meme-cat-thumbnail.jpg",
];

const TripCard = ({ item, scrollX, id, total }: TProps) => {
  const inputRange = [
    (id - 1) * ITEM_WIDTH,
    id * ITEM_WIDTH,
    (id + 1) * ITEM_WIDTH,
  ];
  const translateStyle = useAnimatedStyle(() => {
    const translate = interpolate(
      scrollX.value,
      inputRange,
      [0.97, 0.97, 0.97],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(scrollX.value, inputRange, [0.6, 1, 0.6],Extrapolation.CLAMP,);
    return { transform: [{ scale: translate }], opacity };
  });
  const translateImageStyle = useAnimatedStyle(() => {
    const translate = interpolate(scrollX.value, inputRange, [
      -ITEM_WIDTH * 0.2,
      0,
      ITEM_WIDTH * 0.4,
    ]);
    return { transform: [{ translateX: translate }] };
  });
  const translateTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scrollX.value, inputRange, [0, 1, 0],Extrapolation.CLAMP,);
    return { opacity };
  });
  return (
    <Animated.View
      style={[
        {
          width: ITEM_WIDTH,
          height: ITEM_HEIGHT,
          marginLeft: id === 0 ? OFFSET : undefined,
          marginRight: id === total - 1 ? OFFSET : undefined,
          overflow: "hidden",
          borderRadius: 14,
          elevation: 0,
        },
        translateStyle,
      ]}
    >
      <Animated.View style={[translateImageStyle]}>
        <ImageBackground
          source={{ uri: item.illustration }}
          style={style.imageBackgroundStyle}
        >
          <Animated.View
            style={[style.imageBackgroundView, translateTextStyle]}
          >
            <View style={style.userImageView}>
              {/* <Image source={item.icon} style={style.userImage} /> */}
              <View style={style.titleCardView}>
                <Text style={style.titleStyle}>{item?.title}</Text>
                <Text style={style.descriptionStyle}>
                  {item?.startTime} đến {item?.endTime}
                </Text>
              </View>
            </View>
            <View style={style.bottomContainer}>
              <View style={style.imagesContainer}>
                {catImages.map((catImage, index) => (
                  <Image
                    key={index}
                    source={{ uri: catImage }}
                    style={style.teammateImage}
                  />
                ))}
                <TouchableOpacity
                  onPress={() => console.log("Chi tiết")}
                  style={{ marginLeft: 120 }}
                >
                  <Text
                    style={{
                      color: "#ff7324",
                      fontWeight: "700",
                      fontSize: 20,
                    }}
                  >
                    Chi tiết
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </Animated.View>
  );
};

export default TripCard;
const style = StyleSheet.create({
  imageBackgroundStyle: {
    resizeMode: "cover",
    width: "100%",
    height: "100%",
    borderRadius: 14,
    overflow: "hidden",
  },
  imageBackgroundView: {
    paddingHorizontal: 15,
    paddingVertical: 25,
    flex: 1,
    justifyContent: "flex-end",
    gap: 4,
  },
  userImageView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  userImage: {
    height: 30,
    width: 30,
  },
  titleCardView: {
    gap: 2,
    transform: [{ translateY: -40 }],
  },
  titleStyle: {
    color: "white",
    fontSize: 30,
    fontWeight: "700",
  },
  descriptionStyle: {
    marginLeft: 0,
    color: "white",
    fontSize: 20,
    fontWeight: "400",
  },
  bottomContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "110.5%",
    height: "33%",
    bottom: 0,
    borderEndEndRadius: 14,
    borderStartEndRadius: 14,
    // borderColor: "black",
    borderWidth: 0.1,
    borderStartColor: "blue",
  },
  imagesContainer: {
    flexDirection: "row",
    position: "relative",
    paddingTop: 8,
    paddingLeft: 40,
    alignItems: "center",
  },
  teammateImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: -10,
  },
});

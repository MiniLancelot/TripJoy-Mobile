import {
  StyleSheet,
  Dimensions,
  Text,
  ImageBackground,
  View,

} from "react-native";
import React, { useState } from "react";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";


const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get("window").width - OFFSET * 2;
const ITEM_HEIGHT = 250;
type TProps = {
  scrollX: SharedValue<number>;
  id: number;
  total: number;
  item: any;
};

type Province = {
  provinceId: string;
  provinceName: string;
};


const tempImage =
  "https://farm7.staticflickr.com/6014/5904905173_7fc1c39880_o.jpg";
const PlanImageCard = ({ item, scrollX, id, total }: TProps) => {
  const [currentImage, setCurrentImage] = useState(item.illustration || tempImage);

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
      Extrapolation.CLAMP
    );
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.6, 1, 0.6],
      Extrapolation.CLAMP
    );
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
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0, 1, 0],
      Extrapolation.CLAMP
    );
    return { opacity };
  });

  const imageUrl = item.illustration ? item.illustration : tempImage;


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
    });
  };
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
          source={{ uri: currentImage }}
          style={style.imageBackgroundStyle}
          onError={() => {
            console.log("Error loading image");
            setCurrentImage(tempImage);
          }}
        >
          <Animated.View
            style={[style.imageBackgroundView, translateTextStyle]}
          >
            {/* <View style={style.userImageView}>
              <View style={style.titleCardView}>
                <View>
                  <Text style={style.titleStyle}>{item?.title}</Text>
                </View>

              </View>
            </View> */}

          </Animated.View>
        </ImageBackground>
      </Animated.View>
    </Animated.View>
  );
};

export default PlanImageCard;
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
    // transform: [{ translateY: -40 }],
    // marginTop: 50,
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

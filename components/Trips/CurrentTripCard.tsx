import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { Image } from "expo-image";

type CurrentTripCardProps = {
  name: string;
  image: string;
  startTime: string;
  endTime: string;
  isTravelling: boolean;
  count: number;
};

const catImages = [
  "https://i.pinimg.com/736x/d1/7c/c7/d17cc7bf0e13fcdf975dd682d5df792f.jpg",
  "https://i.pinimg.com/originals/34/bf/b0/34bfb03034a7d7b89ab174c9b903b7a6.jpg",
  "https://w0.peakpx.com/wallpaper/440/401/HD-wallpaper-loadnig-cat-meme-loading-cat-meme-cat-thumbnail.jpg",
];

const CurrentTripCard = ({
  name,
  startTime,
  endTime,
  isTravelling,
  count,
  image,
}: CurrentTripCardProps) => {
  return (
    <View style={styles.container}>
      <Image
        source={image}
        style={{ flex: 1, overflow: "hidden", borderRadius: 14 }}
      />
      <View style={styles.bannerInnerContainer}>
        <Text style={styles.bannerText2}>{name}</Text>

        <Text style={styles.bannerText1}>
          {startTime} đến {endTime}
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <Text style={{ color: "#02a876" }}>
          {isTravelling ? "Đang diễn ra" : "Đã kết thúc"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => Alert.alert(`${name}`)}
        style={styles.buttonContainer}
      >
        <Text style={styles.buttonText}>Chi tiết</Text>
      </TouchableOpacity>
      <View style={styles.bottomContainer}>
        <View style={styles.imagesContainer}>
          {catImages.map((catImage, index) => (
            <Image key={index} source={catImage} style={styles.teammateImage} />
          ))}
          <Text style={{ color: "#616161", fontSize: 15, marginLeft: 10 }}>
            {count} người đã tham gia
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 250,
    backgroundColor: "violet",
    height: 250,
    borderRadius: 14,
    elevation: 10,
  },
  bannerInnerContainer: {
    position: "absolute",
    top: 30,
    left: 20,
  },
  bannerText1: {
    marginTop: 5,
    fontSize: 16,
    color: "#fff",
    fontWeight: "400",
  },
  bannerText2: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "700",
  },
  statusContainer: {
    position: "absolute",
    top: 15,
    right: 10,
    backgroundColor: "#c8fce6",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    position: "absolute",
    top: 110,
    left: 20,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 10,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ff7324",
    fontWeight: "700",
  },
  bottomContainer: {
    position: "absolute",
    backgroundColor: "#fff",
    width: "100%",
    height: "21%",
    bottom: 0,
    borderBottomEndRadius: 14,
    borderBottomStartRadius: 14,
  },
  imagesContainer: {
    flexDirection: "row",
    position: "relative",
    paddingTop: 8,
    paddingLeft: 30,
    alignItems: "center",
  },
  teammateImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginLeft: -10,
  },
});

export default CurrentTripCard;

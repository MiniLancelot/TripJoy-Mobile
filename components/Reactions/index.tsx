import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { View as MotiView, AnimatePresence } from "moti";
import CustomButton from "./CustomButton";
import EmojiLike from "./svg-emoji/EmojiLike";
import EmojiLove from "./svg-emoji/EmojiLove";
import EmojiCare from "./svg-emoji/EmojiCare";
import EmojiAngry from "./svg-emoji/EmojiAngry";
import EmojiHaha from "./svg-emoji/EmojiHaha";
import EmojiWow from "./svg-emoji/EmojiWow";
import EmojiSad from "./svg-emoji/EmojiSad";
import Backdrop from "./Backdrop";
import EmojiItem from "./EmojiItem";
import Hint from "./Hint";
import { PanGestureHandler } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { set } from "date-fns";

const items = [
  {
    emoji: <EmojiLike width={22} height={22} />,
    title: "like",
    color: "rgb(32, 120, 244)",
  },
  {
    emoji: <EmojiLove width={22} height={22} />,
    title: "love",
    color: "rgb(243, 62, 88)",
  },
  {
    emoji: <EmojiHaha width={22} height={22} />,
    title: "haha",
    color: "rgb(247, 177, 37)",
  },
  {
    emoji: <EmojiWow width={22} height={22} />,
    title: "wow",
    color: "rgb(247, 177, 37)",
  },
  {
    emoji: <EmojiSad width={22} height={22} />,
    title: "sad",
    color: "rgb(247, 177, 37)",
  },
  {
    emoji: <EmojiAngry width={22} height={22} />,
    title: "angry",
    color: "rgb(233, 113, 15)",
  },
  {
    emoji: <AntDesign name={"like2"} size={22} color={"#626262"} />,
    title: "default",
    color: "transparent",
  },
];

interface ReactionBoxProps {
  _current: number | null;
  _setCurrent: (value: number | null) => void;
  // _isReacted: boolean;
  // _setIsReacted: (value: boolean) => void;
}

const ReactionBox = ({_current, _setCurrent}: ReactionBoxProps) => {
  // const [current, setCurrent] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isReacted, setIsReacted] = useState(_current !== null);

  const onGesture = (event: any) => {
    // when gesture gone outside the container
    if (
      event.nativeEvent.absoluteY >= 310 &&
      event.nativeEvent.absoluteY <= 490 &&
      event.nativeEvent.absoluteX >= 16 &&
      event.nativeEvent.absoluteX <= 367
    ) {
      setShowHint(false);
      // when move finger beside any of emoji should select
      const currentItem = Math.floor(event.nativeEvent.x / 50);
      if (currentItem >= 0 && currentItem < items.length) {
        _setCurrent(currentItem);
      } else {
        _setCurrent(null);
      }
    } else {
      _setCurrent(null);
      setShowHint(true);
    }
  };

  const gestureEnded = () => {
    // When gesture ended
    setShow(false);
    setShowHint(false);
  };

  const btnPressHandler = () => {
    // _setCurrent(null);
    setShow(true);
    setShowHint(false);
  };

  const onClose = () => {
    setShow(false);
    setShowHint(false);
    // _setCurrent(null);
  };

  const emojiPressHandler = (index: any) => {
    setShow(false);
    setShowHint(false);
    _setCurrent(index);
    setIsReacted(true);
  };

  const handleLike = () => {
    if (isReacted) {
      setIsReacted(false);
      _setCurrent(null);
    } else {
      setIsReacted(true);
      _setCurrent(0);
    }
  }

  return (
    <View style={styles.root}>
      <AnimatePresence>
        {show && (
          <PanGestureHandler onGestureEvent={onGesture} onEnded={gestureEnded}>
            <MotiView
              style={styles.container}
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <MotiView
                style={styles.floatBox}
                from={{ translateY: 40, opacity: 0 }}
                animate={{ translateY: 0, opacity: 1 }}
                exit={{ translateY: 40, opacity: 0 }}
                transition={{ duration: 800 }}
              >
                <View style={styles.emojiBox}>
                  {items.slice(0, 6).map((item, index) => (
                    <EmojiItem
                      onPress={() => emojiPressHandler(index)}
                      key={item.title}
                      data={item}
                      index={index}
                      scaled={_current === index}
                    />
                  ))}
                </View>
              </MotiView>
            </MotiView>
          </PanGestureHandler>
        )}
      </AnimatePresence>
      {show && <Hint hint={showHint} />}
      {show && <Backdrop onPress={onClose} />}
      <CustomButton
        onLongPress={btnPressHandler}
        onPress = {handleLike}
        color={_current === null ? "#000" : items[_current].color}
        emoji={items[_current === null ? 6 : _current].emoji}
        // text={items[current === null ? 0 : current].title}
      />
    </View>
  );
};

export default ReactionBox;

const styles = StyleSheet.create({
  root: {
    // width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // borderColor: "#000",
    // borderBottomWidth: 1,
    // borderTopWidth: 1,
  },
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 180,
    // backgroundColor: "red",
    justifyContent: "center",
    zIndex: 10,
  },
  floatBox: {
    alignItems: "center",
  },
  emojiBox: {
    flexDirection: "row",
    borderRadius: 33,
    backgroundColor: "#fff",
    // shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.24,
    shadowRadius: 1,
  },
});

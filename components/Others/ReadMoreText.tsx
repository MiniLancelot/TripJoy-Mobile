import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

type ReadMoreTextProps = {
  text: string;
  numberOfLines: number;
};

const ReadMoreText = ({ text, numberOfLines }: ReadMoreTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const textRef = useRef<Text>(null);

  useEffect(() => {
    // Measure the text to determine if truncation is necessary
    textRef.current?.measure((x, y, width, height) => {
      const lineHeight = styles.text.lineHeight || 22; // Use the defined line height
      const maxHeight = numberOfLines * lineHeight;

      if (height > maxHeight) {
        setShowReadMore(true);
      }
    });
  }, [text]);

  const handleTextPress = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  };
  return (
    <View>
      <Pressable onPress={handleTextPress}>
        <Text
          ref={textRef}
          style={styles.text}
          numberOfLines={isExpanded ? undefined : numberOfLines}
        >
          {text}
        </Text>
      </Pressable>

      {!isExpanded && (
        <TouchableOpacity onPress={() => setIsExpanded(true)}>
          <Text style={styles.readMoreText}>
            {/* {isExpanded ? null : "Read More"} */}
            Xem thêm
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
// type ReadMoreTextProps = {
//   text: string;
//   numberOfLines: number;
//   isExpanded: boolean;
//   toggleExpand: () => void;
// };

// const ReadMoreText = ({ text, numberOfLines, isExpanded, toggleExpand }: ReadMoreTextProps) => {
//   return (
//     <View>
//       <TouchableOpacity onPress={toggleExpand}>
//         <Text
//           // style={styles.text}
//           className="text-lg"
//           numberOfLines={isExpanded ? undefined : numberOfLines}
//         >
//           {text}
//         </Text>
//       </TouchableOpacity>

//       {!isExpanded && (
//         <TouchableOpacity onPress={toggleExpand}>
//           <Text
//           // style={styles.readMoreText}
//           className="text-gray-500 mt-[5px]"
//           >
//             Xem thêm
//           </Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    lineHeight: 22,
    color: "#666", // Line height to make it more readable
  },
  readMoreText: {
    color: "gray",
  },
});

export default ReadMoreText;

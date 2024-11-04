import React, { useState } from "react";
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

  const handleTextPress = () => {
    if (isExpanded) {
      setIsExpanded(false);
    }
  }
  return (
    <View>
      <Pressable onPress={handleTextPress}>
        <Text
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
    fontSize: 16,
    lineHeight: 22, // Line height to make it more readable
  },
  readMoreText: {
    color: "gray",
    marginTop: 5,
  },
});

export default ReadMoreText;

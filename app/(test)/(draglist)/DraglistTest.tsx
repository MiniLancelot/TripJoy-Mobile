import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  NestableDraggableFlatList,
  NestableScrollContainer,
} from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface ListItem {
  key: string;
  label: string;
}

const DraglistTest: React.FC = () => {
  const [lists, setLists] = useState({
    listA: Array.from({ length: 5 }, (_, index) => ({
      key: `A-${index}`,
      label: `A-Item ${index + 1}`,
    })),
    listB: Array.from({ length: 5 }, (_, index) => ({
      key: `B-${index}`,
      label: `B-Item ${index + 1}`,
    })),
  });

  const renderDraggableList = (listKey: keyof typeof lists) => (
    <View style={styles.listContainer}>
      <Text style={styles.listTitle}>{listKey}</Text>
      <NestableDraggableFlatList
        data={lists[listKey]}
        keyExtractor={(item) => item.key}
        renderItem={({ item, drag }) => (
          <View style={styles.item}>
            <Text style={styles.text} onLongPress={drag}>
              {item.label}
            </Text>
          </View>
        )}
        onDragEnd={({ data }) =>
          setLists((prev) => ({ ...prev, [listKey]: data }))
        }
      />
    </View>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "seashell" }}>
      <NestableScrollContainer style={styles.container}>
        <Text style={styles.header}>Draggable Within Lists</Text>
        <View style={styles.listsWrapper}>
          {renderDraggableList("listA")}
          {renderDraggableList("listB")}
        </View>
      </NestableScrollContainer>
    </GestureHandlerRootView>
  );
};

// const DraglistTest: React.FC = () => {
//   const [lists, setLists] = useState({
//     listA: Array.from({ length: 5 }, (_, index) => ({
//       key: `A-${index}`,
//       label: `A-Item ${index + 1}`,
//     })),
//     listB: Array.from({ length: 5 }, (_, index) => ({
//       key: `B-${index}`,
//       label: `B-Item ${index + 1}`,
//     })),
//   });

//   // Trạng thái lưu thông tin item đang được kéo
//   const [draggedItem, setDraggedItem] = useState<{
//     item: ListItem;
//     fromList: keyof typeof lists;
//   } | null>(null);

//   const handleDragBegin = (item: ListItem, fromList: keyof typeof lists) => {
//     setDraggedItem({ item, fromList });
//   };

//   const handleDrop = (toList: keyof typeof lists) => {
//     if (draggedItem) {
//       const { item, fromList } = draggedItem;

//       // Nếu kéo thả trong cùng một danh sách
//       if (fromList === toList) {
//         setDraggedItem(null); // Không cần xử lý thêm
//         return;
//       }

//       // Di chuyển item giữa hai danh sách
//       setLists((prev) => ({
//         ...prev,
//         [fromList]: prev[fromList].filter((i) => i.key !== item.key),
//         [toList]: [...prev[toList], item],
//       }));

//       setDraggedItem(null); // Reset trạng thái
//     }
//   };

//   const renderDraggableList = (listKey: keyof typeof lists) => (
//     <View style={styles.listContainer}>
//       <Text style={styles.listTitle}>{listKey}</Text>
//       <NestableDraggableFlatList
//         data={lists[listKey]}
//         keyExtractor={(item) => item.key}
//         renderItem={({ item, drag }) => (
//           <View style={styles.item}>
//             <Text
//               style={styles.text}
//               onLongPress={() => handleDragBegin(item, listKey)} // Bắt đầu kéo
//               onPressOut={() => handleDrop(listKey)} // Thả item
//             >
//               {item.label}
//             </Text>
//           </View>
//         )}
//         onDragEnd={({ data }) =>
//           setLists((prev) => ({ ...prev, [listKey]: data }))
//         } // Xử lý sắp xếp nội bộ
//       />
//     </View>
//   );

//   return (
//     <GestureHandlerRootView style={{ flex: 1, backgroundColor: "seashell" }}>
//       <NestableScrollContainer style={styles.container}>
//         <Text style={styles.header}>Draggable Between Lists</Text>
//         <View style={styles.listsWrapper}>
//           {renderDraggableList("listA")}
//           {renderDraggableList("listB")}
//         </View>
//       </NestableScrollContainer>
//     </GestureHandlerRootView>
//   );
// };


const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  listsWrapper: { flexDirection: "row", justifyContent: "space-between" },
  listContainer: { flex: 1, marginHorizontal: 10 },
  listTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  item: {
    padding: 15,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
    borderRadius: 5,
  },
  text: { fontSize: 16 },
});

export default DraglistTest;


import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import DraggableFlatList, { NestableDraggableFlatList, NestableScrollContainer } from "react-native-draggable-flatlist";
import { GestureHandlerRootView,  } from "react-native-gesture-handler";

export default function App() {
  const [parentList, setParentList] = useState([
    {
      id: "list1",
      title: "List 1",
      data: [
        { id: "1", label: "Item 1" },
        { id: "2", label: "Item 2" },
        { id: "3", label: "Item 3" },
      ],
    },
    {
      id: "list2",
      title: "List 2",
      data: [
        { id: "4", label: "Item 4" },
        { id: "5", label: "Item 5" },
        { id: "6", label: "Item 6" },
      ],
    },
  ]);

  const handleParentDragEnd = ({ data }:any) => {
    setParentList(data);
  };

  const handleChildDragEnd = (listId: string, result: { data: any[] }) => {
    const { data } = result;
    setParentList((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, data } : list
      )
    );
  };

  const renderChildList = ({ item, drag, isActive } :any) => (
    <View
      style={[
        styles.childContainer,
        { backgroundColor: isActive ? "lightblue" : "white" },
      ]}
    >
      <Text style={styles.heading} onLongPress={drag}>
        {item.title}
      </Text>
      <DraggableFlatList
        data={item.data}
        keyExtractor={(child : any) => child.id}
        renderItem={renderChildItem}
        onDragEnd={(result) => handleChildDragEnd(item.id, result)}
      />
    </View>
  );

  const renderChildItem = ({ item, drag, isActive }: any ) => (
    <View
      style={[
        styles.item,
        { backgroundColor: isActive ? "lightcoral" : "white" },
      ]}
    >
      <Text style={styles.text} onLongPress={drag}>
        {item.label}
      </Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView>
        <NestableScrollContainer>
      <NestableDraggableFlatList
        data={parentList}
        keyExtractor={(item) => item.id}
        renderItem={renderChildList}
        onDragEnd={handleParentDragEnd}
      />
      <NestableDraggableFlatList
        data={parentList}
        keyExtractor={(item) => item.id}
        renderItem={renderChildList}
        onDragEnd={handleParentDragEnd}
      />
      </NestableScrollContainer>
      </ScrollView>
      
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f8f8f8",
  },
  childContainer: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    elevation: 2,
  },
  heading: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "white",
    elevation: 1,
  },
  text: {
    fontSize: 16,
  },
});

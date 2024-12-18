import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";

type PlanLocationsProps = {
    planId: string;
    locationId: string;
    planLocationId: string;
    order: number;
    images: string;
    name: string;
    address: string;
    estimatedStartDate: string
  };

type PlanLocationItemProps = {
  item: PlanLocationsProps;
  drag: () => void;
  onDelete: (id: string) => void;
  onDeleteImage: (id: string, imageUrl: string) => void;
  onDetail: (id: string) => void;
  tempAvatar: string;
};

const PlanLocationItem = ({
  item,
  drag,
  onDelete,
  onDeleteImage,
  onDetail,
  tempAvatar,
}: PlanLocationItemProps) => {
  return (
    <View style={styles.container}>
      <Pressable onLongPress={drag}>
        <Text style={styles.title}>{item.name}</Text>
        <Text>{item.estimatedStartDate}</Text>
        <Text>{item.address}</Text>
        {item.images !== "" ? (
          <Pressable
            onLongPress={() => onDeleteImage(item.planLocationId, item.images)}
          >
            <Image
              source={{
                uri: item.images ?? tempAvatar,
              }}
              style={styles.image}
            />
          </Pressable>
        ) : null}
      </Pressable>
      <Pressable onPress={() => onDetail(item.planLocationId)}>
        <Text>Detail</Text>
      </Pressable>
      <Pressable onPress={() => onDelete(item.planLocationId)}>
        <Text>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: "#000",
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    paddingVertical: 5,
  },
  image: {
    width: 280,
    height: 220,
    borderRadius: 30,
  },
});

export default PlanLocationItem;

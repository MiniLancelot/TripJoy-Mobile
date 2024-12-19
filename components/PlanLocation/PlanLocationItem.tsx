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
  estimatedStartDate: string;
};

type PlanLocationItemProps = {
  index: number | undefined;
  item: PlanLocationsProps;
  drag: () => void;
  onDelete: (id: string) => void;
  onDeleteImage: (id: string, imageUrl: string) => void;
  onDetail: (id: string) => void;
  tempAvatar: string;
};
const DEFAULT_IMAGE =
  "https://eadn-wc04-920528.nxedge.io/wp-content/uploads/2023/02/placeholder-726.png";

const PlanLocationItem = ({
  index,
  item,
  drag,
  onDelete,
  onDeleteImage,
  onDetail,
  tempAvatar,
}: PlanLocationItemProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${day} tháng ${month} năm ${year}`;
  };
  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{formatDate(item.estimatedStartDate)}</Text>
      <View style={styles.cardOuterContainer}>
        <Text style={styles.indexText}>{index !== undefined ? ++index : index}</Text>
        <Pressable onLongPress={drag} style={styles.cardContainer}>
          <Text style={styles.title}>{item.name}</Text>

          <Text>{item.address}</Text>
          {item.images !== "" ? (
            <Pressable
              onLongPress={() =>
                onDeleteImage(item.planLocationId, item.images)
              }
            >
              <Image
                source={{
                  uri: item.images || DEFAULT_IMAGE,
                }}
                style={styles.image}
              />
            </Pressable>
          ) : (
            <Image
              source={{
                uri: DEFAULT_IMAGE,
              }}
              style={styles.image}
            />
          )}

          <Pressable onPress={() => onDetail(item.planLocationId)}>
            <Text>Detail</Text>
          </Pressable>
          <Pressable onPress={() => onDelete(item.planLocationId)}>
            <Text>Delete</Text>
          </Pressable>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  cardOuterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  indexText:{
    fontSize: 12,
    fontWeight: "500",
    padding: 10,
    color: "#ffffff",
    paddingHorizontal: 15,
    backgroundColor: "#ff7324",
    borderRadius: 50,
  },
  cardContainer: {
    borderWidth: 0.5,
    borderColor: "#000",
    marginVertical: 5,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#ffffff",
    elevation: 5,
    width: "80%",
  },
  dateText: {
    marginLeft: 0,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "500",
    paddingVertical: 5,
  },
  title: {
    fontSize: 17,
    fontWeight: "500",
    paddingVertical: 5,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
  },
});

export default PlanLocationItem;

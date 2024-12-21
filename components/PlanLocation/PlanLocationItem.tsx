import { Ionicons } from "@expo/vector-icons";
import React from "react";
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
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
  amount: number | null;
};

type PlanLocationItemProps = {
  index: number | undefined;
  item: PlanLocationsProps;
  drag: () => void;
  onDelete: (id: string) => void;
  onDeleteImage?: (id: string, imageUrl: string) => void;
  onDetail: (id: string) => void;
  _onDetail: (id: string) => void;
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
  _onDetail,
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
        <Text style={styles.indexText}>
          {index !== undefined ? ++index : index}
        </Text>
        <Pressable onLongPress={drag} style={styles.cardContainer}>
          {item.images !== "" ? (
            <Image
              source={{
                uri: item.images || DEFAULT_IMAGE,
              }}
              style={styles.image}
            />
          ) : (
            <Image
              source={{
                uri: DEFAULT_IMAGE,
              }}
              style={styles.image}
            />
          )}
          <View style={{ flex: 1, justifyContent: "flex-start" }}>
            <Text numberOfLines={1} style={styles.title}>{item.name}</Text>

            <Text style={{fontSize: 12}} numberOfLines={2} ellipsizeMode="tail" >{item.address}</Text>

            {/* <Pressable onPress={() => onDetail(item.planLocationId)} style={styles.detailButton}>
              <Text style={{color: "#fff"}}>Chi tiết</Text>
            </Pressable> */}
            <View style={{flexDirection: "row", justifyContent: "space-between", marginTop: 15}}>
              <View style={styles.outsidePriceTag}>
              <Ionicons name="pricetag" size={20} color="#17a1fa" />
                <Text style={{color: "#000", fontSize: 14}}>{item.amount == null ? 0 : item.amount}đ</Text>
              </View>
              <Pressable onPress={() => _onDetail(item.planLocationId)} style={styles.detailButton}>
                <Text style={{color: "#fff"}}>Chi tiết</Text>
              </Pressable>
            </View>
            
            <Pressable onPress={() => onDelete(item.planLocationId) } style={styles.deleteButton}>
              <Ionicons name="close-circle-outline" size={23} color="#ff6188" />
            </Pressable>
          </View>
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
    gap: 15,
  },
  indexText: {
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
    width: "85%",
    flexDirection: "row",
    
    gap: 10,
  },
  dateText: {
    marginLeft: 0,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "500",
    paddingVertical: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 5,
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 110,
    borderRadius: 15,
  },
  
  deleteButton: {
    position: "absolute",
    top: -20,
    right: 0,
    backgroundColor: "#ffffff",
  },

  detailButton: {
    backgroundColor: "#ff7324",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    // marginTop: 30,
  
    width: 70,
  },
  outsidePriceTag: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    // marginTop: 30,
    marginLeft: -10,
    gap: 10,
    alignItems: "center",
  }
});

export default PlanLocationItem;

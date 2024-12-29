import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
// import getPronvinces from "@/services/plan/getProvinces";
import { is } from "date-fns/locale";
import { Province } from "@/utils/Provinces";
import { Member } from "@/utils/Member";
import getMembers from "@/services/plan/member";
import { UserSpender } from "@/utils/UserSpender";
// import debounce from "@/services/debounce";

interface DataProps {
  label: string;
  value: string;
}

interface MemberMultiselectProps {
  planId: string;
  _data?: UserSpender[];
  _values: Member[];
  setValues: (value: Member[]) => void;
  bearer: string;
  placeholder?: string;
}

const MemberMultiselect = ({
  planId,
  _values,
  setValues,
  bearer,
  placeholder,
}: MemberMultiselectProps) => {
  // const [member, setMember] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [searchState, setSearchState] = useState(false);
  const [data, setData] = useState<DataProps[]>([]);
  // const [memberName, setMemberName] = useState<string>("");

  // Fetch provinces with pagination
  const fetchMoreData = async () => {
    if (loading || allItemsLoaded || searchState) return;

    setLoading(true);
    try {
      const response = await getMembers(bearer, planId, {
        pageIndex: page,
        pageSize: 10,
      });

      if (!response?.data?.members) throw new Error("Invalid data structure");

      const newData = response.data.members.data.map((item: any) => ({
        label: item.name,
        value: item.userId,
      }));

      if (newData.length < 10) {
        setAllItemsLoaded(true);
      }

      setData((prevData) => [...prevData, ...newData]);
      setPage((prevPage) => prevPage + 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search logic
  // const searchProvince = async (searchText: string) => {
  //   setLoading(true);
  //   setPage(0);
  //   setAllItemsLoaded(false);
  //   try {
  //     const response = await getPronvinces(bearer, {
  //       pageIndex: 0,
  //       pageSize: 10,
  //       name: searchText.replaceAll(" ", "+"),
  //     });

  //     if (response?.data?.provinces) {
  //       const searchedData = response.data.provinces.data.map((item: any) => ({
  //         label: item.name,
  //         value: item.id,
  //       }));
  //       setData(searchedData);
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Trigger initial load or fetch more on scroll
  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) fetchMoreData();
  };

  // Watch for search input changes
  // useEffect(() => {
  //   if (province) {
  //     setSearchState(true);
  //     searchProvince(province);
  //   } else {
  //     setSearchState(false);
  //     // setData([]);
  //     setPage(0);
  //     setAllItemsLoaded(false);
  //     fetchMoreData();
  //   }
  // }, [province]);

  // Initial fetch on mount
  useEffect(() => {
    if (page === 0 && !searchState) fetchMoreData();
  }, [page, searchState]);

  const renderLabel = () => {
    if (_values == null || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: "blue" }]}>
          {placeholder}
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <MultiSelect
        style={[styles.dropdown, isFocus && { borderColor: "#657ef8" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        // search
        maxHeight={300}
        // onChangeText={(text) => setMember(text)}
        flatListProps={{
          onEndReached: loadMoreItems,
          onEndReachedThreshold: 0.5,
        }}
        labelField="label"
        valueField="value"
        placeholder={
          // !isFocus ?
          //   memberName || "Tỉnh/thành phố"
          //   : "..."
          !isFocus ?
            placeholder
            : "..."
        }
        searchPlaceholder="Search..."
        selectedStyle={styles.selectedStyle}
        value={_values.map((item) => item.userId)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(items) => {
          const selectedItems = items.map((value: string) => {
            return data.find(item => item.value === value) as DataProps;
          });
          setValues(selectedItems.map((item): Member => ({ userId: item.value, name: item.label })));
          // console.info(item.label);
          // setProvinceName(item.label);
          setIsFocus(false);
          setSearchState(false);
          
        }}
        renderLeftIcon={() => (
          <AntDesign
            style={styles.icon}
            color={isFocus ? "#657ef8" : "black"}
            name="Safety"
            size={20}
          />
        )}
      />
    </View>
  );
};

export default MemberMultiselect;

const styles = StyleSheet.create({
  container: {
    width: "60%",
    backgroundColor: "white",
    // padding: 16,
    paddingHorizontal: 0,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: "absolute",
    backgroundColor: "white",
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    borderRadius: 8,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
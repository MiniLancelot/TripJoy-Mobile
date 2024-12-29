import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";
import getPronvinces from "@/services/plan/getProvinces";
import { is } from "date-fns/locale";
import { Province } from "@/utils/Provinces";
// import debounce from "@/services/debounce";

interface DataProps {
  label: string;
  value: string;
}

interface ProvinceDropdownProps {
  _value: Province;
  setValue: (value: Province) => void;
  bearer: string;
  placeholder?: string;
}

const ProvinceDropdown = ({
  _value,
  setValue,
  bearer,
  placeholder,
}: ProvinceDropdownProps) => {
  const [province, setProvince] = useState<string>("");
  const [isFocus, setIsFocus] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [allItemsLoaded, setAllItemsLoaded] = useState(false);
  const [searchState, setSearchState] = useState(false);
  const [data, setData] = useState<DataProps[]>([]);
  const [provinceName, setProvinceName] = useState<string>("");

  // Fetch provinces with pagination
  const fetchMoreData = async () => {
    if (loading || allItemsLoaded || searchState) return;

    setLoading(true);
    try {
      const response = await getPronvinces(bearer, {
        pageIndex: page,
        pageSize: 10,
      });

      if (!response?.data?.provinces) throw new Error("Invalid data structure");

      const newData = response.data.provinces.data.map((item: any) => ({
        label: item.name,
        value: item.id,
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
  const searchProvince = async (searchText: string) => {
    setLoading(true);
    setPage(0);
    setAllItemsLoaded(false);
    try {
      const response = await getPronvinces(bearer, {
        pageIndex: 0,
        pageSize: 10,
        name: searchText.replaceAll(" ", "+"),
      });

      if (response?.data?.provinces) {
        const searchedData = response.data.provinces.data.map((item: any) => ({
          label: item.name,
          value: item.id,
        }));
        setData(searchedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial load or fetch more on scroll
  const loadMoreItems = () => {
    if (!loading && !allItemsLoaded) fetchMoreData();
  };

  // Watch for search input changes
  useEffect(() => {
    if (province) {
      setSearchState(true);
      searchProvince(province);
    } else {
      setSearchState(false);
      // setData([]);
      setPage(0);
      setAllItemsLoaded(false);
      fetchMoreData();
    }
  }, [province]);

  // Initial fetch on mount
  useEffect(() => {
    if (page === 0 && !searchState) fetchMoreData();
  }, [page, searchState]);

  const renderLabel = () => {
    if (_value == null || isFocus) {
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
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "#657ef8" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        search
        maxHeight={300}
        onChangeText={(text) => setProvince(text)}
        flatListProps={{
          onEndReached: loadMoreItems,
          onEndReachedThreshold: 0.5,
        }}
        labelField="label"
        valueField="value"
        placeholder={
          !isFocus ?
            provinceName || "Tỉnh/thành phố"
            : "..."
        }
        searchPlaceholder="Search..."
        value={_value.provinceId}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          setValue({ provinceId: item.value, provinceName: item.label });
          console.info(item.label);
          setProvinceName(item.label);
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

export default ProvinceDropdown;

const styles = StyleSheet.create({
  container: {
    width: "49%",
    backgroundColor: "white",
    padding: 16,
    paddingHorizontal: 0,
  },
  dropdown: {
    height: 50,
    borderColor: "gray",
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
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
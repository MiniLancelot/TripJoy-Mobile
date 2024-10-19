// import { View, Text } from 'react-native'
// import React from 'react'
// import "@/global.css";

// const NewsfeedScreen = () => {
//   return (
//     <View className='flex-1 bg-[#fff]'>
//       <Text>NewsfeedScreen</Text>
//     </View>
//   )
// }

// export default NewsfeedScreen

import StarRailChar from "@/components/Others/StarRailChar";
import React, { useState, useEffect } from "react";
import { FlatList, Text, View } from "react-native";

const DATA = Array.from({ length: 100 }, (_, i) => `Item ${i + 1}`); // Simulated data

const NewsfeedScreen = () => {
  // const [data, setData] = useState<string[]>([]);
  // const [page, setPage] = useState(1);
  // const ITEMS_PER_PAGE = 5;

  // useEffect(() => {
  //   loadMoreItems(); // Load the initial data
  // }, []);

  // // Function to load more items
  // const loadMoreItems = () => {
  //   const newData = DATA.slice(
  //     (page - 1) * ITEMS_PER_PAGE,
  //     page * ITEMS_PER_PAGE
  //   );
  //   setData((prevData) => [...prevData, ...newData]);
  //   setPage((prevPage) => prevPage + 1);
  // };

  return (
    <View className="flex-1 bg-[#fff]">
      {/* <FlatList
      className="flex-1"
        data={data}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text>{item}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
        onEndReached={loadMoreItems}
        onEndReachedThreshold={0.5} // Trigger load more when the list is halfway scrolled
      /> */}
      <StarRailChar />
    </View>
  );
};

export default NewsfeedScreen;

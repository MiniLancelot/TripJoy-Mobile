// import { View, Text, ScrollView } from 'react-native'
// import React from 'react'

// const ColorList = ({color}: any) => {
//   return (
//     <ScrollView className='px-[20px] py-[10px] h-full'>
//         {
//             [1, 0.8, 0.5].map(opacity => (
//                 <View key={opacity} className={`w-full h-[150px] rounded-xl mb-[15px] bg-[${color}] opacity-[${opacity}]`} />
//             ))
//         }
//     </ScrollView>
//   )
// }

// export default ColorList

import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import React from "react";

const ColorList = ({ color }: any) => {
    return (
        <ScrollView style={styles.container}>
            {[1, 0.8, 0.5].map((opacity) => (
                <View
                    key={opacity}
                    style={[{ backgroundColor: color, opacity }, styles.color1]}
                    className={`w-full h-[150px] rounded-xl mb-[15px]`}
                />
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    color1: {
        width: "100%",
        height: 150,
        borderRadius: 25,
        borderCurve: "continuous",
        marginBottom: 15,
    },
    container: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        height: "100%",
    },
});

export default ColorList;

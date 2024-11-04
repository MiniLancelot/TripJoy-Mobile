import { View, Text, StyleSheet } from "react-native";
import React from "react";

type SeparateLineProps = {
    text: string;
};

const SeparateLine = ( {text} : SeparateLineProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.line}/>
            <Text style={styles.text}>{text}</Text>
            <View style={styles.line}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        marginHorizontal: 40,
    },
    line: {
        flex: 1,
        height: 0.8,
        backgroundColor: "#9FB7B9",
    },
    text: {
        marginHorizontal: 7,
        fontSize: 15,
        lineHeight: 24,
        color: "#9FB7B9",
    }
})

export default SeparateLine;

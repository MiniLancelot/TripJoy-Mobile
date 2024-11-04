import { Text, View, StyleSheet } from "react-native";
import "@/global.css";

const Title = () => {
    const blackCharacter = "⠀";

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {blackCharacter}Trip
                <Text style={styles.orangeText}>Joy{blackCharacter}</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontFamily: "LeckerliOne",
        color: "#13c892",
        fontSize: 40,
        marginBottom: 20,
    },
    orangeText: {
        color: "#ff7224",
    },
})

export default Title;

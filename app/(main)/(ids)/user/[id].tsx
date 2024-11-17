import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect, useLayoutEffect } from "react";
import { useLocalSearchParams, useNavigation } from "expo-router";
import axios from "axios";

type CharProps = {
  id: number;
  name: string;
  rarity: number;
  path: string;
  element: string;
  introduction: string;
  img: string;
};

type UserProps = {
    id: string;
    userName: string;
    email: string;
    phoneNumber: string | null;
    avatar: string | null;
    dateOfBirth: string | null;
    address: string | null;
    gender: boolean | null;
  };

const User = () => {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [user, setUser] = useState<UserProps>({
    id: "",
    userName: "",
    email: "",
    phoneNumber: null,
    avatar: null,
    dateOfBirth: null,
    address: null,
    gender: null
  });
//   const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchChar = async () => {
//       try {
//         const response = await axios.get(
//           `https://hsr-api.vercel.app/api/v1/characters/${id}`
//         );
//         setCharacter(response.data[0]);
//         console.log(response.data[0]);
//       } catch (err: any) {
//         if (err.response && err.response.status === 404) {
//           setError('Character not found. Please check the ID and try again.');
//         } else {
//           setError(err.message);
//         }
//         console.log(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchChar();
//   }, [id]);

//   useLayoutEffect(() => {
//     navigation.setOptions({ title: character.name });
//   }, [character.name]);

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.loadingText}>Loading...</Text>
//       </View>
//     );
//   }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.container}>
        {/* <Image source={{ uri: character.img }} style={styles.image} />
        <Text style={styles.title}>{character.name}</Text>
        <Text style={styles.text}>Rarity: {character.rarity}</Text>
        <Text style={styles.text}>Element: {character.element}</Text>
        <Text style={styles.text}>Path: {character.path}</Text>
        <Text style={styles.text}>{character.introduction}</Text> */}
        <Text>{id}</Text>

        
        
      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({
  outerContainer:{
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    // borderRadius: 100,
    marginVertical: 20,
  },
  text: {
    fontSize: 20,

  },
  loadingText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  errorText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "red",
  },
});

export default User;

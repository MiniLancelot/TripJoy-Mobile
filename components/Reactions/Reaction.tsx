// import React, { useState } from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
//   Animated,
// } from 'react-native';

// const reactions = [
//   { name: 'Like', icon: require('@/assets/icons/facebook-like-logo-svgrepo-com.svg') },
//   { name: 'Love', icon: require('@/assets/icons/facebook-love-logo-svgrepo-com.svg') },
//   { name: 'Haha', icon: require('@/assets/icons/facebook-haha-logo-svgrepo-com.svg') },
//   { name: 'Wow', icon: require('@/assets/icons/facebook-wow-logo-svgrepo-com.svg') },
//   { name: 'Sad', icon: require('@/assets/icons/sad-but-relieved-face-svgrepo-com.svg') },
//   { name: 'Angry', icon: require('@/assets/icons/facebook-angry-logo-svgrepo-com.svg') },
// ];

// const FacebookReaction = () => {
//   const [selectedReaction, setSelectedReaction] = useState<string | null>(null);
//   const [showReactions, setShowReactions] = useState(false);
//   const scaleAnimation = new Animated.Value(1);

//   const handleReactionPress = (reaction: string) => {
//     setSelectedReaction(reaction);
//     setShowReactions(false);
//   };

//   const handleLongPress = () => {
//     setShowReactions(true);
//     Animated.spring(scaleAnimation, {
//       toValue: 1.2,
//       useNativeDriver: true,
//     }).start();
//   };

//   const handleRelease = () => {
//     if (showReactions) {
//       setShowReactions(false);
//     }
//     Animated.spring(scaleAnimation, {
//       toValue: 1,
//       useNativeDriver: true,
//     }).start();
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         onPress={() => setSelectedReaction('Like')}
//         onLongPress={handleLongPress}
//         onBlur={handleRelease}
//         style={styles.button}
//       >
//         <Text style={styles.buttonText}>
//           {selectedReaction ? selectedReaction : 'React'}
//         </Text>
//       </TouchableOpacity>

//       {showReactions && (
//         <Animated.View
//           style={[styles.reactionContainer, { transform: [{ scale: scaleAnimation }] }]}
//         >
//           {reactions.map((reaction) => (
//             <TouchableOpacity
//               key={reaction.name}
//               onPress={() => handleReactionPress(reaction.name)}
//               style={styles.reaction}
//             >
//               <Image source={reaction.icon} style={styles.reactionIcon} />
//               <Text style={styles.reactionText}>{reaction.name}</Text>
//             </TouchableOpacity>
//           ))}
//         </Animated.View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     alignItems: 'center',
//     marginTop: 50,
//   },
//   button: {
//     backgroundColor: '#1877f2',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   reactionContainer: {
//     flexDirection: 'row',
//     backgroundColor: 'white',
//     borderRadius: 30,
//     padding: 10,
//     elevation: 5,
//     position: 'absolute',
//     bottom: 60,
//   },
//   reaction: {
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   reactionIcon: {
//     width: 40,
//     height: 40,
//     marginBottom: 5,
//   },
//   reactionText: {
//     fontSize: 12,
//     color: '#555',
//   },
// });

// export default FacebookReaction;

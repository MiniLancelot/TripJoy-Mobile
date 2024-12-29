// import React from 'react';
// import {Dimensions, StyleSheet, View} from 'react-native';
// import Animated, {useSharedValue} from 'react-native-reanimated';
// import PlanImageCard from './PlanImageCard';

// import CarouselPagination from '../Trips/CarouselPagination';
// import { Trips } from '@/constants/Trip';

// const OFFSET = 45;
// const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;

// const PlanImageCarousel = ({data} : any) => {
//   const scrollX = useSharedValue(0);

//   return (
//     <View style={styles.parallaxCarouselView}>
//       <Animated.ScrollView
//         horizontal={true}
//         decelerationRate={'fast'}
//         snapToInterval={ITEM_WIDTH}
//         showsHorizontalScrollIndicator={false}
//         bounces={false}
//         disableIntervalMomentum
//         onScroll={event => {
//           scrollX.value = event.nativeEvent.contentOffset.x;
//         }}
//         scrollEventThrottle={16}>
//         {data.slice(0,7).map((item : any, id : any) => (
//           <PlanImageCard
//             key={item.id}
//             item={item}
//             id = {id}
//             scrollX={scrollX}
//             total={data.length}
//           />
//         ))}
//       </Animated.ScrollView>
//       <CarouselPagination data={data} scrollX={scrollX} />
//     </View>
//   );
// };
// export default PlanImageCarousel;
// const styles = StyleSheet.create({
//   parallaxCarouselView: {
//     // paddingVertical: 50,
//   },
// });

import React, {useEffect} from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {useSharedValue, useAnimatedRef, withTiming} from 'react-native-reanimated';
import PlanImageCard from './PlanImageCard';

import CarouselPagination from '../Trips/CarouselPagination';
import { Trips } from '@/constants/Trip';

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;

const PlanImageCarousel = ({data}: any) => {
  const scrollX = useSharedValue(0);
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const currentIndex = useSharedValue(0);

  useEffect(() => {
    const interval = setInterval(() => {
      currentIndex.value = (currentIndex.value + 1) % data.slice(0, 7).length;

      const xOffset = currentIndex.value * ITEM_WIDTH;
      scrollX.value = withTiming(xOffset, {duration: 10000}); // Smooth scroll animation

      scrollViewRef.current?.scrollTo({x: xOffset, y: 0, animated: true});
    }, 3000);

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, [data, scrollViewRef, scrollX, currentIndex]);

  return (
    <View style={styles.parallaxCarouselView}>
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        decelerationRate="fast"
        snapToInterval={ITEM_WIDTH}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        disableIntervalMomentum
        onScroll={(event) => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}
      >
        {data.slice(0, 7).map((item: any, id: any) => (
          <PlanImageCard
            key={item.id}
            item={item}
            id={id}
            scrollX={scrollX}
            total={data.length}
          />
        ))}
      </Animated.ScrollView>
      <CarouselPagination data={data} scrollX={scrollX} />
    </View>
  );
};

export default PlanImageCarousel;

const styles = StyleSheet.create({
  parallaxCarouselView: {
    // paddingVertical: 50,
  },
});
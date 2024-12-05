import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {useSharedValue} from 'react-native-reanimated';
import TripCard from './TripCard';

import CarouselPagination from './CarouselPagination';
import { Trips } from '@/constants/Trip';

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;

const TripCarousel = () => {
  const scrollX = useSharedValue(0);

  return (
    <View style={styles.parallaxCarouselView}>
      <Animated.ScrollView
        horizontal={true}
        decelerationRate={'fast'}
        snapToInterval={ITEM_WIDTH}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        disableIntervalMomentum
        onScroll={event => {
          scrollX.value = event.nativeEvent.contentOffset.x;
        }}
        scrollEventThrottle={16}>
        {Trips.map((item, id) => (
          <TripCard
            key={id}
            item={item}
            id={id}
            scrollX={scrollX}
            total={Trips.length}
          />
        ))}
      </Animated.ScrollView>
      <CarouselPagination data={Trips} scrollX={scrollX} />
    </View>
  );
};
export default TripCarousel;
const styles = StyleSheet.create({
  parallaxCarouselView: {
    // paddingVertical: 50,
  },
});
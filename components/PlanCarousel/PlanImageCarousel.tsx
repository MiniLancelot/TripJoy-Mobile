import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import Animated, {useSharedValue} from 'react-native-reanimated';
import PlanImageCard from './PlanImageCard';

import CarouselPagination from '../Trips/CarouselPagination';
import { Trips } from '@/constants/Trip';

const OFFSET = 45;
const ITEM_WIDTH = Dimensions.get('window').width - OFFSET * 2;

const PlanImageCarousel = ({data} : any) => {
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
        {data.slice(0,7).map((item : any, id : any) => (
          <PlanImageCard
            key={item.id}
            item={item}
            id = {id}
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
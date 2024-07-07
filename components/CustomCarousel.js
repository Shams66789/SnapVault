import React, {useState, useRef} from 'react';
import {View, Image, ScrollView, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');
const imageWidth = width * 0.7;
const sideImageWidth = width * 0.6;

const CustomCarousel = ({images}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef(null);

  const handleScroll = event => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / imageWidth);
    setActiveIndex(index);
  };

  return (
    <View style={{height: '70%', width: '100%'}}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{paddingHorizontal: width * 0.15}}
        decelerationRate="fast"
        snapToInterval={imageWidth}>
        {images.map((image, index) => (
          <View
            key={index}
            style={{
              width: imageWidth,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={{uri: image}}
              style={{
                width: index === activeIndex ? imageWidth : sideImageWidth,
                height: index === activeIndex ? '80%' : '60%',
                borderRadius: 10,
                opacity: index === activeIndex ? 1 : 0.6,
                transform: [{scale: index === activeIndex ? 1 : 0.8}],
              }}
              resizeMode="cover"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default CustomCarousel;

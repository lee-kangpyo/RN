import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  ListRenderItemInfo,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
//import Color from '../../constants/color';
//import TYPOS from './typo';

const WheelPicker2 = ({ items, onItemChange, itemHeight, initValue, containerStyle, textStyle={}, idx, refresh}) => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const initValueIndex = initValue ? items.indexOf(initValue) : -1;
  const [selectedIndex, setSelectedIndex] = useState(
    initValueIndex >= 0 ? items[initValueIndex] : items[0]
  );

  const renderItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * itemHeight,
      (index - 1) * itemHeight,
      index * itemHeight,
    ];
    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
    });

    //
    return (
        <Animated.View
          style={[
            {
              height: itemHeight,
              transform: [{ scale }],
              alignItems: 'center',
              justifyContent: 'center',
            },
          ]}
        >
          <Text style={[style.text, {color: selectedIndex === item ? "#111" : "#ddd",}, textStyle]}>
            {item}
          </Text>
          
        </Animated.View>
    );
  };

  const modifiedItems = ['', ...items, ''];

  const momentumScrollEnd = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / itemHeight);
    setSelectedIndex(items[index]);
  };
  
  useEffect(() => {
    onItemChange(selectedIndex);
  }, [selectedIndex]);
  
  const ref = useRef();

  useEffect(()=>{
    console.log(initValueIndex, idx)
    //if(initValueIndex != idx){
      if(refresh > 1){
        ref.current?.scrollToIndex({animated: true, index: idx});
      }
      setSelectedIndex(items[idx])
    //}
  }, [refresh])

  

  return (
    <View style={[{height: itemHeight * 3, zIndex:50}, containerStyle]}>
      <Animated.FlatList
        ref={ref}
        data={modifiedItems}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        onMomentumScrollEnd={momentumScrollEnd}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        useNativeDriver={true}
        getItemLayout={(_, index) => ({
          length: itemHeight,
          offset: itemHeight * index,
          index,
        })}
        initialScrollIndex={initValueIndex}
        style={{width:"100%",}}
      />
    </View>
  );
};

const style = StyleSheet = ({
  text:{
    fontFamily: "SUIT-Bold",
    fontSize: 24,
  }
})

export default WheelPicker2;

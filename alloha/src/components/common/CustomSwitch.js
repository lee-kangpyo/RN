import React, { useEffect, useState } from 'react';
import { Animated, Easing, TouchableOpacity, StyleSheet, View } from 'react-native';
import { theme } from '../../util/color';

const colors = {
    main: theme.primary,
    backgroundGray: '#ddd',
};

const CustomSwitch = ({ onToggle, isOn }) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [5, 23],
  });

  const color = isOn ? colors.main : colors.backgroundGray;

  return (
    <TouchableOpacity onPress={onToggle} style={[styles.toggleContainer, { backgroundColor: color }]}>
      <Animated.View style={[styles.toggleWheel, { transform: [{ translateX }] }]} />
    </TouchableOpacity>
  );
};

export default CustomSwitch;

const styles = StyleSheet.create({
  toggleContainer: {
    width: 52,
    height: 32,
    borderRadius: 20,
    justifyContent: 'center',
  },
  toggleWheel: {
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderRadius: 99,
  },
});

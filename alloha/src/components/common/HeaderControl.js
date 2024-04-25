import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderControl({title, onLeftTap, onRightTap, }) {
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={onLeftTap}>
            <Ionicons name="caret-back-outline" size={28} color="#999999" />
        </TouchableOpacity>
        <Text style={fonts.title}>{title}</Text>
        <TouchableOpacity onPress={onRightTap}>
            <Ionicons name="caret-forward-outline" size={28} color="#999999" />
        </TouchableOpacity>
    </View>
  );
};
const fonts = StyleSheet.create({
  title:{
    fontFamily: "SUIT-Bold",
    fontSize: 14,
    fontWeight: "700",
    fontStyle: "normal",
    color: "#111111"
  }
})
const styles = StyleSheet.create({
    container: {
      flexDirection:"row",
      justifyContent: 'space-around',
      alignItems: 'center',
    },
  });
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HeaderControl({title, onLeftTap, onRightTap, }) {
  return (
    <View style={{flexDirection:"row"}}>
        <TouchableOpacity onPress={onLeftTap}>
            <Ionicons name="caret-back-outline" size={28} color="black" />
        </TouchableOpacity>
        <Text style={{fontSize:20}}>{title}</Text>
        <TouchableOpacity onPress={onRightTap}>
            <Ionicons name="caret-forward-outline" size={28} color="black" />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
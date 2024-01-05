import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export default function Notion({text}) {
    return (
        <View style={{flexDirection:"row"}}>
            <Text style={{color:"grey"}}> • </Text>
            <Text style={{color:"grey"}}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
});
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StoreSelectBox from './StoreSelectBox';

export default function StoreSelectBoxWithTitle({titleflex, selectBoxFlex, titleText}) {
   
    return (
        <View style={styles.comp}>
            <Text style={[styles.text, {flex:titleflex}]}>{titleText}</Text>
            <StoreSelectBox flex={selectBoxFlex} />
        </View>
    );
};

const styles = StyleSheet.create({
    comp: { flexDirection:"row", paddingVertical:5},
    text: { alignSelf:"center", fontSize:24, paddingLeft:15 }
});
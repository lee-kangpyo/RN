import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StoreSelectBox from './StoreSelectBox';

export default function StoreSelectBoxWithTitle({titleflex, selectBoxFlex, titleText}) {
   
    return (
        <View style={styles.comp}>
            {
                (titleText == "")?null
                : <Text style={[styles.text, {flex:titleflex}]}>{titleText}</Text>
            }
            <StoreSelectBox flex={selectBoxFlex} />
        </View>
    );
};

const styles = StyleSheet.create({
    comp: { flexDirection:"row", },
    text: { alignSelf:"center", fontSize:20, paddingLeft:15, fontWeight:"bold" }
});
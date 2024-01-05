
import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { YYYYMMDD2Obj } from '../../util/moment';

export default function ConvertDayStr({dayStr, style = {}, fontSize=13}) {
    const date = YYYYMMDD2Obj(dayStr);
    return(
        <View style={[styles.row, style]}>
            <Text style={{fontSize:fontSize}}>{date.ymd}</Text>
            <Text style={{color:date.color, paddingLeft:5, fontSize:fontSize}}>({date.day})</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    row:{
        flexDirection:"row"
    },

});
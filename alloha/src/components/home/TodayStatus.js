
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

export default function TodayStatus() {
    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.spaceBetween, {paddingHorizontal:16, paddingVertical:15}]}>
                <Text style={font.mainFont}>오늘 근무 현황</Text>
                <Image source={require('../../../assets/icons/link-arrow.png')} style={styles.linkArrow} />
            </View>
            <View style={styles.HR} />
            <View style={{paddingHorizontal:16, paddingVertical:20}}>
                <Text>현재 근무 인원</Text>
            </View>
        </View>
    );
}
const font = StyleSheet.create({
    mainFont:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        color: "#111111",
        fontWeight: "800",
    },
    
})
const styles = StyleSheet.create({
    container:{
        borderRadius: 15,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    HR:{
        borderWidth:1,
        borderColor:"#EEEEEE",
        marginBottom:10
    },
    linkArrow:{alignSelf:"center", width:10, height:14},
    row:{flexDirection:"row"},
    spaceBetween:{justifyContent:"space-between"}
});
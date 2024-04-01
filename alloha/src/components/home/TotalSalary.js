
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import ProgressBar from '../common/ProgressBar';

export default function TotalSalary({data}) {
    const progress = (data.SRATE > 100)?1:data.SRATE/100;
    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.spaceBetween, {alignContent:"center", paddingBottom:10}]}>
                <Text style={[font.mainFont,]}>3월 총 급여</Text>
                <Image source={require('../../../assets/icons/link-arrow.png')} style={{alignSelf:"center", width:10, height:14}} />
            </View>
            <Text style={[font.amount, {paddingBottom:20}]}>{data.SALARY.toLocaleString()}원</Text>
            <ProgressBar progress={progress} marginBottom={15}/>
            <View style={[styles.row, {justifyContent:"space-between"}]}>
                <View style={[styles.row, {alignItems:"center"}]}>
                    <Text style={font.goalAmtLabel}>목표금액</Text>
                    <View style={styles.pill}>
                        <Text style={font.goalAmt}>{data.TSALARY/10000}만원</Text>
                    </View>
                </View>
                <Text style={font.progress}>{data.SRATE}%</Text>
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
    amount:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 30,
        color: "#000000",
        fontWeight: "800",
    },
    goalAmtLabel : {
        fontFamily: "SUIT-SemiBold",
        fontSize: 14,
        color: "#777777",
        fontWeight: "600",

    },
    goalAmt:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 13,
        color: "#FFFFFF",
        fontWeight: "800",
    },
    progress:{
        fontFamily: "SUIT-Bold",
        lineHeight: 14,
        color: "#3479EF",
        fontWeight: "700",
    }
})
const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:25,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1,
        marginBottom:7
    },
    pill:{
        marginLeft:10,
        paddingVertical:3,
        paddingHorizontal:6,
        borderRadius: 20,
        backgroundColor: "#555555"
    },
    row:{flexDirection:"row"},
    spaceBetween:{justifyContent:"space-between"}
});
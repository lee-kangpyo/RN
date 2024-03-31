
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import * as Progress from 'react-native-progress';
import ProgressBar from '../common/ProgressBar';

export default function WorkPlace() {
    return (
        <View style={styles.container}>
            <View style={[styles.row, styles.spaceBetween, {paddingBottom:23}]}>
                <Text style={font.mainFont}>근무지별 보기</Text>
                <Image source={require('../../../assets/icons/link-arrow.png')} style={styles.linkArrow} />
            </View>
            <View style={styles.HR}/>
            <View style={{paddingHorizontal:10}}>
                <View style={[styles.row, styles.spaceBetween, {paddingVertical:15}]}>
                    <View style={{alignItems:"flex-start"}}>
                        <Text style={[font.cstNa, {marginBottom:4}]}>메가 대학로점</Text>
                        <View style={styles.row}>
                            <Text style={font.ymd}>02.01-02.29</Text>
                        </View>
                    </View>
                    <View style={[styles.row, {alignItems:"center"}]}>
                        <Text style={font.amt}>568,500원</Text>
                        <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                    </View>
                </View>
                <View style={[styles.row, styles.spaceBetween, {paddingVertical:15}]}>
                    <View style={{alignItems:"flex-start"}}>
                        <Text style={[font.cstNa, {marginBottom:4}]}>소담 한성대점</Text>
                        <View style={styles.row}>
                            <Text style={font.ymd}>02.15-03.14</Text>
                            <Text style={[font.ymd, {marginHorizontal:8}]}>|</Text>
                            <Text style={font.dDay}>D-16</Text>
                        </View>
                    </View>
                    <View style={[styles.row, {alignItems:"center"}]}>
                        <Text style={font.amt}>844,900원</Text>
                        <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                    </View>
                </View>
                <View style={[styles.row, styles.spaceBetween, {paddingVertical:15}]}>
                    <View style={{alignItems:"flex-start"}}>
                        <Text style={[font.cstNa, {marginBottom:4}]}>컴포즈 용두</Text>
                        <View style={styles.row}>
                            <Text style={font.ymd}>02.01-02.16</Text>
                        </View>
                        
                    </View>
                    <View style={[styles.row, {alignItems:"center"}]}>
                        <Text style={font.amt}>844,900원</Text>
                        <Image source={require('../../../assets/icons/link-arrow.png')} style={[styles.linkArrow, {marginLeft:8}]} />
                    </View>
                </View>
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
    cstNa:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 15,
        fontWeight: "600",
        fontStyle: "normal",
        lineHeight: 15,
        color: "#555555"
    },
    ymd:{
        fontFamily: "SUIT-Medium",
        fontSize: 12,
        fontWeight: "500",
        fontStyle: "normal",
        lineHeight: 12,
        color: "#999999"
    },
    dDay:{
        fontFamily: "SUIT-Medium",
        fontSize: 12,
        fontWeight: "500",
        lineHeight: 12,
        color: "#3479EF"
    },
    amt:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        fontWeight: "800",
        fontStyle: "normal",
        lineHeight: 15,
        textAlign: "right",
        color: "#333333"
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
    HR:{
        borderWidth:1,
        borderColor:"#EEEEEE",
        marginBottom:10
    },
    linkArrow:{alignSelf:"center", width:10, height:14},
    row:{flexDirection:"row"},
    spaceBetween:{justifyContent:"space-between"}
});
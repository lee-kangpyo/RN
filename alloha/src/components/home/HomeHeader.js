
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../util/color';

export default function HomeHeader({data, leftIcons=[]}) {
    
    return (
        <LinearGradient style={styles.top} colors={['#43ABFC', '#3479EF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
            <View style={{flexDirection:"row"}}>
                <View style={styles.circle}>
                    <Text style={{fontSize:25, fontFamily:"SUIT-Bold"}}>{data.USERNA[0]}</Text>
                </View>
                <View style={{justifyContent:"center"}}>
                    <Text style={[styles.topColor, fonts.font_Medium, {fontSize:14, marginBottom:5}]}>안녕하세요</Text>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.topColor, fonts.font_Bold, {fontSize:20, marginBottom:0,}]}>{data.USERNA}님</Text>
                </View>
            </View>
            <View style={{flex:1, flexDirection:"row", justifyContent:"flex-end"}}>
            {
                leftIcons.map((el, idx) => <View key={idx}>{el}</View>)
            }
            </View>
            {/* <Image source={require('../../../assets/icons/alarm.png')} style={{alignSelf:"center", width:24, height:24}} /> */}
        </LinearGradient>
    );
}
const fonts = StyleSheet.create({
    mainFont:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        color: "#111111",
        fontWeight: "800",
    },
    font_Medium:{fontFamily:"SUIT-Medium"},
    font_Bold:{fontFamily:"SUIT-Bold"},
    
})
const styles = StyleSheet.create({
    container:{flex:1, backgroundColor:"#F6F6F8"},
    top:{paddingTop:60, padding:30, flexDirection:"row", borderBottomLeftRadius:15, borderBottomRightRadius:15, justifyContent:"space-between", alignItems:"center"},
    circle:{backgroundColor:"white", borderRadius:50, marginRight:15, width:50, height:50, paddingTop:5, justifyContent:"center", alignItems:"center"},
    
    topColor:{color:theme.white, },
    body:{padding:20, paddingHorizontal:16},
});
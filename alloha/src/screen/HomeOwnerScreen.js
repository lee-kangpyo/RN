
import { Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import { StatusBar } from 'expo-status-bar';
import { theme } from '../util/color';
import * as Font from "expo-font";
import { LinearGradient } from 'expo-linear-gradient';
import TotalSalary from '../components/home/TotalSalary';
import WorkPlace from '../components/home/WorkPlace';
import WeeklyStatus from '../components/home/WeeklyStatus';


export default function HomeOwnerScreen({navigation}) {
    const [isFont, setIsFont] = useState(false);
    const loadFonts = async () => {
        await Font.loadAsync({
            "SUIT-Bold": require('../../assets/fonts/SUIT-Bold.otf'),
            "SUIT-Medium": require('../../assets/fonts/SUIT-Medium.otf'),
            "SUIT-ExtraBold": require('../../assets/fonts/SUIT-ExtraBold.otf'),
            "SUIT-SemiBold": require('../../assets/fonts/SUIT-SemiBold.otf'),
            "SUIT-Regular": require('../../assets/fonts/SUIT-Regular.otf'),
          });
          setIsFont(true);
    }
    useEffect(() => {
        loadFonts();
    },[]);
    return (
        (!isFont)?<Text>로딩중</Text>:
        <View style={styles.container}>
            <StatusBar style='light'/>
            <LinearGradient style={styles.top} colors={['#43ABFC', '#3479EF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
                <View style={{flexDirection:"row"}}>
                    <View style={styles.circle}>
                        <Text style={{fontSize:25, fontFamily:"SUIT-Bold"}}>이</Text>
                    </View>
                    <View style={{justifyContent:"center", width:"75%"}}>
                        <Text style={[styles.topColor, styles.font_Medium, {fontSize:14, marginBottom:5}]}>안녕하세요</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.topColor, styles.font_Bold, {fontSize:20, marginBottom:0,}]}>메가커피 점주님</Text>
                    </View>
                </View>
                <Image source={require('../../assets/icons/alarm.png')} style={{alignSelf:"center", width:24, height:24}} />
            </LinearGradient>
            <ScrollView contentContainerStyle={styles.body}>
                <TotalSalary />
                <WorkPlace />
                <WeeklyStatus />
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{flex:1, backgroundColor:"#F6F6F8"},
    top:{paddingTop:60, padding:30, flexDirection:"row", borderBottomLeftRadius:15, borderBottomRightRadius:15, justifyContent:"space-between"},
    circle:{backgroundColor:"white", borderRadius:50, marginRight:15, width:50, height:50, justifyContent:"center", alignItems:"center"},
    font_Medium:{fontFamily:"SUIT-Medium"},
    font_Bold:{fontFamily:"SUIT-Bold"},
    topColor:{color:theme.white, },
    body:{padding:20, paddingHorizontal:16},
});
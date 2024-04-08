
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import { StatusBar } from 'expo-status-bar';
import { theme } from '../util/color';

import { LinearGradient } from 'expo-linear-gradient';
import TotalSalary from '../components/home/TotalSalary';
import WorkPlace from '../components/home/WorkPlace';
import WeeklyStatus from '../components/home/WeeklyStatus';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';


export default function HomeCrewScreen({navigation}) {
    const userId = useSelector((state)=>state.login.userId);
    // const [isFont, setIsFont] = useState(false);
    const [datas, setDatas] = useState({});
    // const loadFonts = async () => {
    //     await Font.loadAsync({
    //         "SUIT-Bold": require('../../assets/fonts/SUIT-Bold.otf'),
    //         "SUIT-Medium": require('../../assets/fonts/SUIT-Medium.otf'),
    //         "SUIT-ExtraBold": require('../../assets/fonts/SUIT-ExtraBold.otf'),
    //         "SUIT-SemiBold": require('../../assets/fonts/SUIT-SemiBold.otf'),
    //         "SUIT-Regular": require('../../assets/fonts/SUIT-Regular.otf'),
    //         "Tium": require('../../assets/fonts/Tium.ttf'),
    //       });
    //       setIsFont(true);
    // }
    useEffect(() => {
        // loadFonts();
        getMainINfo();
    },[]);
    const getMainINfo = async () => {
        await HTTP("GET", "/api/v1/main/crew", {userId})
        .then((res)=>{
            if(res.data.resultCode == "00"){
               setDatas(res.data.result)
            }else{
                alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");    
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    return (
        (Object.keys(datas).length == 0)?
        //(true)?
        <View style={{flex:1, justifyContent:"center"}}>
            <ActivityIndicator color={"black"}/>
        </View>
        :
        <View style={styles.container}>
            <StatusBar style='light'/>
            <LinearGradient style={styles.top} colors={['#43ABFC', '#3479EF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
                <View style={{flexDirection:"row"}}>
                    <View style={styles.circle}>
                        <Text style={{fontSize:25, fontFamily:"SUIT-Bold"}}>{datas.top.USERNA[0]}</Text>
                    </View>
                    <View style={{justifyContent:"center", width:"75%"}}>
                        <Text style={[styles.topColor, styles.font_Medium, {fontSize:14, marginBottom:5}]}>안녕하세요</Text>
                        <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.topColor, styles.font_Bold, {fontSize:20, marginBottom:0,}]}>{datas.top.USERNA}님</Text>
                    </View>
                </View>
                <Image source={require('../../assets/icons/alarm.png')} style={{alignSelf:"center", width:24, height:24}} />
            </LinearGradient>
            <ScrollView contentContainerStyle={styles.body}>
                <TotalSalary data={datas.TotalSalary}/>
                <WorkPlace data={datas.salaryByCst}/>
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
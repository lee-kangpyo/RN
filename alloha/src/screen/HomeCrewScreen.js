
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useState, useEffect} from 'react';

import { StatusBar } from 'expo-status-bar';
import { theme } from '../util/color';

import { LinearGradient } from 'expo-linear-gradient';
import TotalSalary from '../components/home/TotalSalary';
import WorkPlace from '../components/home/WorkPlace';
import WeeklyStatus from '../components/home/WeeklyStatus';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import HomeHeader from '../components/home/HomeHeader';
import CalendarScreen from './CalendarScreen';
import IconBtn from '../components/home/IconBtn';

export default function HomeCrewScreen({navigation}) {
    const userId = useSelector((state)=>state.login.userId);
    const [datas, setDatas] = useState({});
    useEffect(() => {
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
            <View style={{flex:1, justifyContent:"center"}}>
                <ActivityIndicator color={"black"}/>
            </View>
        :
    //     <GridBox
    //     text={"내점포"}
    //     onPress={()=>navigation.push("myStore")}
    //     icon={{type:"MaterialCommunityIcons", name:"store", size:48, color:"black"}}
    // />
            <View style={styles.container}>
                <StatusBar style='light'/>
                <HomeHeader 
                    data={datas.top} 
                    leftIcons={[
                        <IconBtn text={"내점포"} onPress={()=>navigation.push("myStore")} icon={{type:"MaterialCommunityIcons", name:"store"}}/>, 
                        <IconBtn text={"문의"} onPress={()=>Linking.openURL('http://pf.kakao.com/_mxmjLG/chat')} icon={{type:"MaterialCommunityIcons", name:"chat-question"}}/>
                    ]} 
                />
                <CalendarScreen />    
            </View>
        
        // <View style={styles.container}>
        //     <StatusBar style='light'/>
        //     <HomeHeader data={datas.top} />
        //     <ScrollView contentContainerStyle={styles.body}>
        //         <TotalSalary data={datas.TotalSalary}/>
        //         <WorkPlace data={datas.salaryByCst}/>
        //     </ScrollView>
        // </View>
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
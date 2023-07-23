import { StyleSheet, Text, View, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { theme } from '../util/color';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { URL } from "@env";
const LOCATION_TASK_NAME = 'background-location-task';

export default function GetLocationPermission({Grant, Deny}){
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [fore, setFore] = useState("포그라운드 위치권한 요청중...");
    const [back, setBack] = useState("백그라운드 위치권한 요청중...");
    const [idGrant, setGrant] = useState();
  
    useEffect(() => {
      (async () => {
        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        
        if (foregroundStatus === 'granted') {
            setFore("포그라운드 위치 권한 허용됨.")
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus === 'granted') {
                setBack("포그라운드 위치 권한 허용됨.")
                await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
                timeInterval: 600000,
                //deferredUpdatesDistance:1,
                deferredUpdatesInterval: 100,
                accuracy: Location.Accuracy.BestForNavigation,
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: "알로하",
                    notificationBody: "알로하가 위치 기반으로 출퇴근을 여부를 체크하고 있습니다.",
                    notificationColor: "#fff",
                },
                });
                console.log("내위치 추적 시작")
                setGrant(true);
            }else{
                setBack("백그라운드 위치 권한 거부됨.")
            }
        }else{
            setFore("포그라운드 위치 권한 거부됨.")
            setBack("백그라운드 위치 권한은 포그라운드 위치 허용이 필요.")
        }

      })();
    }, []);
  
    return (
        <>
        {
            (idGrant)?
                <Grant/>
            :
                <View style={{...styles.container, marginTop:30}}>
                    <Text style={styles.paragraph}>출 퇴근 체크를 위해 위치 권한 허용이 필요합니다.</Text>
                    <Text style={{...styles.sub_txt, marginTop:8}}>만약 위치 권한 동의 화면이 뜨지 않는다면,</Text>
                    <View style={styles.flexLow}>
                        <Text style={{...styles.sub_txt, fontWeight:"bold"}}>설정&gt;애플리케이션&gt;권한</Text> 
                        <Text>에서</Text>
                    </View>
                    <View style={styles.flexLow}>
                        <Text style={{...styles.sub_txt, fontWeight:"bold"}}>위치 권한</Text>
                        <Text>을 </Text>
                        <Text style={{...styles.sub_txt, fontWeight:"bold"}}>항상 허용</Text>
                        <Text>으로 설정 해주세요.</Text>
                    </View>
                    
                    <Text style={{...styles.sub_txt, marginBottom:16,}}>항상 허용이 백그라운드 위치 권한입니다.</Text>
                    <Text style={styles.stat_txt}>{fore}</Text>
                    <Text style={styles.stat_txt}>{back}</Text>
                    

                </View>
        }
        </>
    );
};

TaskManager.defineTask(LOCATION_TASK_NAME,  async ({ data, error } ) => {
  const getCurrentTimeWithDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');

    const currentTimeWithDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return currentTimeWithDate;
  };

  if (error) {
    // check `error.message` for more details.
    return;
  }
  if(data){
    let id = await AsyncStorage.getItem("id")
    id = (id)?id:"테스트아이디"
    const { locations } = data;
    await axios.get(URL+"/api/v1/checkStoreLocation", {params:{id:id, log:"You've move location[curdev]", lat:locations[0].coords.latitude, lon:locations[0].coords.longitude, day:getCurrentTimeWithDate()}})
    .catch((err)=>{console.log(err)})
  }
});

const styles = StyleSheet.create({

    container:{
        flex:1,
        justifyContent:"flex-start",
        alignItems:"center",
    },
    paragraph:{
        fontSize:16,
        fontWeight:"bold",
    },
    sub_txt:{
        fontSize:13,
        
    },
    stat_txt:{
        fontSize:13,
        color:theme.grey
    },
    flexLow:{flexDirection:"row"}

});
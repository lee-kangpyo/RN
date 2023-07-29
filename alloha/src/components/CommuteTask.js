import { StyleSheet, Text, View, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { theme } from '../util/color';
import * as TaskManager from 'expo-task-manager';


const LOCATION_TASK_NAME = 'background-location-task';

export default function CommuteTask(){
    const [isTaskStart, setTaskStart] = useState(false)
    useEffect(() => {
      (async () => {
        const {granted:forePerm} = await Location.getForegroundPermissionsAsync()
        const {granted:backPerm} = await Location.getBackgroundPermissionsAsync()
        const isTaskStarted = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
        if(forePerm && backPerm){
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
        }
      })();
    }, []);
  
    return (
        <>
        {
            (isTaskStart)?
                <Text>태스크 매니저가 실행되지 않고 있습니다.</Text>
            :
                <Text>자동 출퇴근 기록 동작중....</Text>
        }
        </>
    );
};


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
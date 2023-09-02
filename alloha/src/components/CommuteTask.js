import { StyleSheet, Text, View, Alert } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { theme } from '../util/color';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK } from "@env";
import { useFocusEffect } from '@react-navigation/native';


export default function CommuteTask(){
    const [isTaskStart, setTaskStart] = useState(false)

    const registerTask = async () => {
        const {granted:forePerm} = await Location.getForegroundPermissionsAsync()
        const {granted:backPerm} = await Location.getBackgroundPermissionsAsync()
        if(forePerm && backPerm){
            await Location.startLocationUpdatesAsync(LOCATION_TASK, {
                distanceInterval:20,
                timeInterval: 20000,
                deferredUpdatesInterval: 500,
                accuracy: Location.Accuracy.BestForNavigation,
                showsBackgroundLocationIndicator: true,
                foregroundService: {
                    notificationTitle: "알로하",
                    notificationBody: "알로하가 위치 기반으로 출퇴근을 여부를 체크하고 있습니다.",
                    notificationColor: "#fff",
                },  
            });
            const isTaskStarted = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
            setTaskStart(isTaskStarted)
        }
    }

    useEffect(() => {
        registerTask();
    }, []);


    
    useFocusEffect(
        useCallback(() => { // Do something when the screen is focused
            focusin();
            return () => { /* Do something when the screen is unfocused (cleanup functions)*/};
        }, [])
    )

    const focusin = async () => {
        console.log("포커스인");
        var isTaskRegistered = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK);
        setTaskStart(isTaskRegistered)
        if(!isTaskStart){
            registerTask();
        }
        
    }
  
    return (
        <>
        {
            (isTaskStart)?
                <Text>자동 출퇴근 기록 동작중....</Text>
            :
                <Text>태스크 매니저가 실행되지 않고 있습니다.</Text>
                
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
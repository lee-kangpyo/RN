import { StyleSheet, Text, View, Alert, Linking } from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { theme } from '../util/color';
import * as TaskManager from 'expo-task-manager';
import { LOCATION_TASK } from "@env";
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';




export default function CommuteTask(){
    const [isTaskStart, setTaskStart] = useState(false)
    const [isNotification, setNotivication] = useState(false)

    const allowsNotificationsAsync = async () => {
        const settings = await Notifications.getPermissionsAsync();

        if(!(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)){
            Alert.alert('알림 허용', '알로하 자동 출퇴근을 위해 알림 허용이 필요합니다. 비 허용 시 백그라운드에서 정상적으로 작동을 하지 않습니다.\n설정 > 애플리케이션 > 알로하 > 알림에서 변경\n', [
                {
                text: '알림없이 시작',
                onPress: () => {},
                style: 'cancel',
                },
                {text: '알림 허용', onPress: () => Linking.openSettings()},
            ]);
        }
        setNotivication(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL)
    }

    // 알림 허용
    // 알로하 자동 출퇴근을 위해 알림 허용이 필요합니다. 비 허용 시 백그라운드에서 정상적으로 작동을 하지 않습니다.
    // 설정 > 애플리케이션 > 알로하 > 알림에서 변경
    // 알림없이 시작
    // 알림 허용
    
    
    

    const registerTask = async () => {
        const {granted:forePerm} = await Location.getForegroundPermissionsAsync()
        const {granted:backPerm} = await Location.getBackgroundPermissionsAsync()
        if(forePerm && backPerm){
            await Location.startLocationUpdatesAsync(LOCATION_TASK, {
                distanceInterval:20,
                timeInterval: 20000,
                deferredUpdatesInterval: 500,
                accuracy: Location.Accuracy.Highest,
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
        allowsNotificationsAsync();
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

        allowsNotificationsAsync()
        
    }
  
    return (
        <>
        {
            (!isTaskStart)?
                <Text>태스크 매니저가 실행되지 않고 있습니다.</Text>
            : (!isNotification)?
                <Text>알로하 앱의 알림을 허용 해주세요.</Text>
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
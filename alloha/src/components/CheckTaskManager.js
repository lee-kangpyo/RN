import { StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { theme } from '../util/color';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { URL } from "@env";
const LOCATION_TASK_NAME = 'background-location-task';

export default function CheckTaskManager(){

    const [isRegister, setIsRegister] = useState()
    useEffect(() => {
      (async () => {

        const result = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);

        setIsRegister(result);
        
      })();
    }, []);
  
    const stopTaskManager = async () => {
        await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME);
    }
    return (
        <>
            <View>
                {
                    (isRegister)?
                        <>
                            <Text>자동 출퇴근 기록 동작중</Text>
                        </>
                        :
                            <Text>자동 출퇴근 기록 중지됨</Text>
                }
            </View>
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
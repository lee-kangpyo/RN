import { StyleSheet, Text, View, Alert } from 'react-native';
import React, {useEffect, useState} from 'react';
import * as Location from 'expo-location';
import { theme } from '../util/color';

import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

import { URL } from "@env";
import Loading from './Loding';



export default function GetLocationPermission({Grant, Deny}){
    const [fore, setFore] = useState("포그라운드 위치권한 요청중...");
    const [back, setBack] = useState("백그라운드 위치권한 요청중...");
    const [isLoading, setLoading] = useState(true)
    const [isGrant, setGrant] = useState();
  
    useEffect(() => {
      (async () => {

        const {granted:forePerm} = await Location.getForegroundPermissionsAsync()
        const {granted:backPerm} = await Location.getBackgroundPermissionsAsync()
        if(!forePerm || !backPerm || (forePerm && backPerm)){
            setLoading(false);
        }


        const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
        if (foregroundStatus === 'granted') {
            setFore("포그라운드 위치 권한 허용됨.")
            const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
            if (backgroundStatus === 'granted') {
                setBack("백그라운드 위치 권한 허용됨.")
   
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
            (isLoading)?
                <Loading/>
            :
                (isGrant)?
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
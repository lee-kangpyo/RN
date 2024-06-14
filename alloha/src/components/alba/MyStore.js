import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, Modal } from 'react-native';
import { theme } from '../../util/color';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { URL } from "@env";
import { useDispatch, useSelector } from 'react-redux';
import { setMyStores, setSelectedStore } from '../../../redux/slices/alba';
import { Platform } from 'react-native';


export default function MyStore({ userId }) {
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const myStores = useSelector((state)=>state.alba.myStores);
    const [iosPickerVisible, setIosPickerVisible] = useState(false);

    const dispatch = useDispatch();
    const searchMyAlbaList = async (init) => {
        await axios.get(URL+"/api/v1/searchMyAlbaList", {params:{userId:userId}})
        .then((res)=>{
            if(res.data.resultCode === "00"){
                const mystore = res.data.result.filter(el => ["R", "N"].includes(el.RTCL));
                if(mystore.length > 0 && init == true){
                    dispatch(setSelectedStore({data:mystore[0]}));
                }
                dispatch(setMyStores({data:mystore}));
             }else{
                Alert.alert("알림", "내 알바 리스트 요청 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.");
            }
        }).catch(function (error) {
            console.log(error);
            Alert.alert("오류", "알바 리스트 요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        searchMyAlbaList(true);
    }, [])
  return (
    null
  );
};

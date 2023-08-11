
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import StoreCard from '../components/StoreCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { theme } from '../util/color';

import { URL } from "@env";

export default function ManageStoreScreen({type, refresh, setRefresh}) {
    //const url = useSelector((state) => state.config.url);
    const userId = useSelector((state) => state.login.userId);
    const [storeList, setStoreList] = useState([]);
    const navigation = useNavigation();
    const getStoreList = useCallback(async () => {
        await axios.get(URL+`/api/v1/getStoreList`, {params:{userId:userId,}})
        .then((res)=>{
            setStoreList(res.data.result)
        }).catch(function (error) {
            alert("점포를 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }, [])

    useEffect(()=>{
        const title = (type === "ownr")?"점포관리":"점포검색"
        navigation.setOptions({title:title})
    }, [navigation])

    useEffect( () => {
        if(refresh){
            getStoreList();
            setRefresh(false);
        }
    }, [refresh])

    return (
        <>
            <View style={styles.container}>
                {
                    (storeList.length > 0)
                    ?
                        <ScrollView style={styles.scrollArea}>
                            {storeList.map((el, idx)=>{
                                return <StoreCard key={idx} store={el}  btntxt={"수정하기"} onButtonPressed={(cstCo)=>alert("준비중 입니다.")}/>
                            })}
                        </ScrollView>
                    :
                    <>
                        <Text style={{fontSize:16}}>등록된 점포가 없습니다.</Text>
                        <Text style={{color:theme.grey}}>우측 상단 추가 버튼으로 점포를 추가하세요.</Text>
                    </>
                }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16},
    sampleImage:{width:"100%", height:"100%"}, 
    scrollArea:{
        width:"100%"
    }
});
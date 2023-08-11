
import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import StoreCard from '../components/StoreCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { theme } from '../util/color';
import SearchBar from '../components/SearchBar';

import { URL } from "@env";
import { Confirm } from '../util/confirm';


export default function SearchStoreScreen({type, refresh, setRefresh}) {
    const userId = useSelector((state) => state.login.userId);
    //const url = useSelector((state) => state.config.url);
    const [storeList, setStoreList] = useState([]);
    const navigation = useNavigation();
    const [searchWrd, setsearchWrd] = useState("");

    useEffect(()=>{
        navigation.setOptions({title:"점포검색"})
    }, [navigation])

    
    const getStoreList = async () => {
        await axios.get(URL+`/api/v1/getStoreListCrew`, {params:{cstNa:searchWrd, userId:userId}})
        .then((res)=>{
            setStoreList(res.data.result)
        }).catch(function (error) {
            Alert.alert("오류", "점포를 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }
    const applyStore = (cstCo, store) => {
        const stat = store.STAT;
        const cstNa = store.CSTNA;
        
        if(stat == "지원하기"){
            Confirm("지원하기", "["+cstNa+"]에 지원하시겠습니까?", "아니오", "네", async ()=>{
                const params = {cstCo:cstCo, userId:userId, iUserId:userId, roleCl:"CREW"};
                await axios.post(URL+`/api/v1/applyStoreListCrew`, params)
                .then((res)=>{
                    console.log(res.data)
                    if(res.data.resultCode === "00"){
                        Alert.alert("알림", "해당 점포에 알바 지원이 완료되었습니다.")
                    }else{
                        Alert.alert("알림", "이미 지원한 점포입니다.")
                    }
                }).catch(function (error) {
                    console.log(error);
                    Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }).finally(function(){
                    getStoreList();
                })
            });
        }else{
            const txt = (stat === "퇴직")?"퇴직한":(stat === "거절됨")?"거절된":`${stat}인`
            Alert.alert(stat, `${cstNa}은 ${txt} 점포입니다.`);
        }
    }

    return (
        <>
            <View style={{margin:16,}}>
                <SearchBar searchText={searchWrd} onSearch={setsearchWrd} onButtonPress={getStoreList} iconName={"store-search"} />
            </View>
            <View style={styles.container}>
                
                {
                    (storeList.length > 0)
                    ?
                        <ScrollView style={styles.scrollArea}>
                            {storeList.map((el, idx)=>{
                                return <StoreCard key={idx} store={el} btntxt={el.STAT} onButtonPressed={(cstCo)=>applyStore(cstCo, el)}  />
                            })}
                        </ScrollView>
                    :
                    <>
                        <Text style={{fontSize:16}}>조회된 점포가 없습니다.</Text>
                        <Text style={{color:theme.grey}}>점포 조회해 주세요.</Text>
                    </>
                }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16,},
    sampleImage:{width:"100%", height:"100%"}, 
    scrollArea:{
        width:"100%"
    }
});
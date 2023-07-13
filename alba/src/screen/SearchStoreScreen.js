
import { StyleSheet, Text, View, Image, ScrollView, Alert } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import StoreCard from '../components/StoreCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { theme } from '../util/color';
import SearchBar from '../components/SearchBar';

export default function SearchStoreScreen({type, refresh, setRefresh}) {
    const userId = useSelector((state) => state.login.userId);
    const url = useSelector((state) => state.config.url);
    const [storeList, setStoreList] = useState([]);
    const navigation = useNavigation();
    const [searchWrd, setsearchWrd] = useState("");

    useEffect(()=>{
        navigation.setOptions({title:"점포검색"})
    }, [navigation])
    
    const getStoreList = async () => {
        await axios.get(url+`/api/v1/getStoreListCrew`, {params:{cstNa:searchWrd,}})
        .then((res)=>{
            setStoreList(res.data.result)
        }).catch(function (error) {
            Alert.alert("오류", "점포를 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }
    const applyStore = async (cstCo) => {
        const params = {cstCo:cstCo, userId:userId, iUserId:userId, roleCl:"CREW"};
        await axios.post(url+`/api/v1/applyStoreListCrew`, params)
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
        })
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
                                return <StoreCard key={idx} store={el} btntxt={"지원하기"} onButtonPressed={(cstCo)=>applyStore(cstCo)}  />
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
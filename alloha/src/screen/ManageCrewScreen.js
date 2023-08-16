import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import CrewCard from '../components/CrewCard';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { theme } from '../util/color';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { URL } from "@env";
import { Confirm } from '../util/confirm';
import { useFocusEffect } from '@react-navigation/native';

export default function ManageCrewScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const [searchWrd, setsearchWrd] = useState("");
    const [filterWrd, setfilterWrd] = useState("");
    const [crewList, setCrewList] = useState([]);

    const onApprov = (userNa, cstCo, userId) => {
        Confirm("승인", `지원 하신${userNa}님을 승인하시겠습니까?`, "아니오", "네", async ()=>{
            await axios.post(URL+`/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"N"})
            .then((res)=>{
                if(res.data.result === 1){
                    Alert.alert("알림", "승인 하였습니다..")
                    searchCrewList();
                }else{
                    Alert.alert("알림", "승인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
    }

    const onRetirement = (userNa, cstCo, userId) => {
        Confirm("퇴사", `${userNa}님의 퇴사를 진행 하시겠습니까?`, "아니오", "네", async ()=>{
            await axios.post(URL+`/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"Y"})
            .then((res)=>{
                if(res.data.result === 1){
                    Alert.alert("알림", "[퇴사] 요청을 완료 하였습니다.")
                    searchCrewList();
                }else{
                    Alert.alert("알림", "퇴사 요청 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
    }

    const onDeny = (userNa, cstCo, userId) => {
        Confirm("거절", `지원하신 ${userNa}님을 거절 하시겠습니까?`, "아니오", "네", async ()=>{
            await axios.post(URL+`/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"D"})
            .then((res)=>{
                if(res.data.result === 1){
                    Alert.alert("알림", "[거절] 요청을 완료 하였습니다.")
                    searchCrewList();
                }else{
                    Alert.alert("알림", "거절 요청 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
    }
    
    const searchCrewList = async () => {
        const response = await axios.get(URL+'/api/v1/searchCrewList', {params:{userId:userId}});
        if(JSON.stringify(crewList) !=  JSON.stringify(response.data.result)) setCrewList(response.data.result);
    };

    useEffect(()=>{
        navigation.setOptions({title:"알바관리"})
    }, [navigation])

    useEffect(()=>{
        searchCrewList()
    }, [filterWrd])
    
    useFocusEffect(
        useCallback(() => {
            // Do something when the screen is focused
            searchCrewList()
            return () => {
              // Do something when the screen is unfocused
              // Useful for cleanup functions
            };
          }, [])
    )
    
    const filterList = (filterWrd == "")?crewList:crewList.filter((el)=>el.USERNA == filterWrd);
    return (
        <>
            <View style={{margin:16,}}>
                <SearchBar placeHolder='이름 조회' searchText={searchWrd} onSearch={setsearchWrd} onButtonPress={()=>{setfilterWrd(searchWrd)}} iconName={"account-search-outline"} />
            </View>
            <View style={styles.container}>
                {
                    (crewList.length > 0)
                    ?
                        (filterList.length > 0)
                        ?
                            <ScrollView style={styles.scrollArea}>
                                {filterList.map((el, idx)=>{
                                    return <CrewCard 
                                                key={idx} 
                                                crew={el} 
                                                applyBtntxt={"승인"} 
                                                onApplyButtonPressed={(cstCo, userId)=>{onApprov(el.USERNA, cstCo, userId)}}
                                                retirementBtnTxt={"퇴직"}
                                                onRetirementButtonPressed={(cstCo, userId)=>{onRetirement(el.USERNA, cstCo, userId)}}
                                                denyBtnTxt={"거절"}
                                                onDenyButtonPressed={(cstCo, userId)=>{onDeny(el.USERNA, cstCo, userId)}}    
                                            />
                                })}
                            </ScrollView>
                        :
                        <Text style={{fontSize:16}}>조회 결과가 없습니다.</Text>
                    :
                    <>
                        <Text style={{fontSize:16}}>등록된 알바생이 없습니다.</Text>
                    </>
                }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:8},
    sampleImage:{width:"100%", height:"100%"},
    scrollArea:{width:"100%"}
});
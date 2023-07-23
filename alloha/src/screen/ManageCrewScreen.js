import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import SearchBar from '../components/SearchBar';
import StoreCard from '../components/StoreCard';
import CrewCard from '../components/CrewCard';

import axios from 'axios';
import { useSelector } from 'react-redux';
import { theme } from '../util/color';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { URL } from "@env";

export default function ManageCrewScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    //const url = useSelector((state) => state.config.url);
    const [searchWrd, setsearchWrd] = useState("");
    const [crewList, setCrewList] = useState([]);

    const onApprov = async (cstCo, userId) => {
        await axios.post(URL+`/api/v1/approvCrew`, {cstCo:cstCo, userId:userId})
        .then((res)=>{
            if(res.data.result === 1){
                Alert.alert("알림", "지원한 알바 승인이 완료되었습니다.")
                searchCrewList();
            }else{
                Alert.alert("알림", "승인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            }
        }).catch(function (error) {
            console.log(error);
            Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    const searchCrewList = async () => {
        const response = await axios.get(URL+'/api/v1/searchCrewList', {params:{userId:userId}});
        setCrewList(response.data.result);
        console.log(crewList);
    }

    useEffect(()=>{
        navigation.setOptions({title:"알바관리"})
        searchCrewList();
    }, [navigation])

    return (
        <>
            <View style={{margin:16,}}>
                <SearchBar searchText={searchWrd} onSearch={setsearchWrd} onButtonPress={()=>{}} iconName={"account-search-outline"} />
            </View>
            <View style={styles.container}>
                
                {
                    (crewList.length > 0)
                    ?
                        <ScrollView style={styles.scrollArea}>
                            {crewList.map((el, idx)=>{
                                return <CrewCard key={idx} crew={el} btntxt={"승인하기"} onButtonPressed={(cstCo, userId)=>{onApprov(cstCo, userId)}}  />
                            })}
                        </ScrollView>
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
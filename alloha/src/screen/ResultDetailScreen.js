
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import StoreSelectBox from '../components/common/StoreSelectBox';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import axios from 'axios';
import { URL } from "@env";
import { nextMonth, prevMonth, setWorkDetailResultList, setWorkResultList } from '../../redux/slices/result';
import { PayDetailContainer, TotalContainer } from '../components/common/Container';

export default function ResultDetailScreen({navigation, route}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const date = useSelector((state) => state.result.month)
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const { item } = route.params;

    const items = useSelector((state) => state.result.workDetailResultList)
    
    const total = items.reduce((result, next)=>{
        result.jobWage = result.jobWage + next.jobWage;
        result.jobDure = result.jobDure + next.jobDure;
        result.spcDure = result.spcDure + next.spcDure;
        result.weekWage = result.weekWage + next.weekWage;
        result.incentive = result.incentive + next.incentive;
        result.salary = result.salary + next.salary;
        return result; 
    }, {jobWage:0, jobDure:0, spcDure:0, weekWage:0, incentive:0, salary:0})
    const monthAlbaSlySearch = async () => {
        const param = {cls:"MonthAlbaSlySearch", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, cstNa:"", userId:item.userId, userNa:"", rtCl:"0"};
        await axios.get(URL+`/api/v1/rlt/monthCstSlySearch`, {params:param})
        .then((res)=>{
            dispatch(setWorkDetailResultList({data:res.data.result}))
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") monthAlbaSlySearch();
        }
    }, [isFocused, cstCo, date]);

    
    useEffect(()=>{
        navigation.setOptions({title:"결과 현황표 - 상세"})
    }, [navigation])


    return (
        <View style={styles.container}>
            <View style={{...styles.card, padding:5, width:"100%"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <View style={{flexDirection:"row"}}>
                        <TouchableOpacity onPress={()=> dispatch(prevMonth())}>
                            <Ionicons name="caret-back-outline" size={20} color="black" />
                        </TouchableOpacity>
                        <Text>{item.userNa}님 {date.mm}월 급여표</Text>
                        <TouchableOpacity onPress={()=> dispatch(nextMonth())}>
                            <Ionicons name="caret-forward-outline" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
                </View>
                <PayDetailContainer header={["주차", "기본", "대타", "주휴수당", "합계"]} contents={items} />
            </View>
            <View style={{padding:5, width:"100%"}}>
                <TotalContainer contents={["합계", [total.jobDure, total.jobWage.toLocaleString()], [total.spcDure, total.weekWage.toLocaleString()], total.incentive.toLocaleString(), total.salary.toLocaleString()]}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    card:{
        flex:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
    },
    

});

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
import { getWeekByWeekNumber } from '../util/moment';
import HeaderControl from '../components/common/HeaderControl';

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
            // TODO: 김이사님과 처리해야할일. 결과 현황표 상세에 점주는 모든 알바생의 데이터를 가져오는 문제가 있음 일단 빼둠.
            const data = res.data.result.filter((el)=>el.userId == item.userId);
            dispatch(setWorkDetailResultList({data}))
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

    const onDeataTap = async (info) => {
        const week = getWeekByWeekNumber(date.start, info.weekNumber);
        var param = {cls:"DetaAmtUpdate", ymdFr:week.startOfWeek, ymdTo:week.endOfWeek, cstCo:cstCo, userId:info.userId, userNa:"", rtCl:info.value}
        await axios.get(URL+`/api/v1/rlt/monthCstSlySearch`, {params:param})
        .then((res)=>{
            monthAlbaSlySearch();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    return (
        <View style={styles.container}>
            <View style={{...styles.card, padding:5, width:"100%"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <HeaderControl title={`${item.userNa}님 ${date.mm}월 급여표`} onLeftTap={()=> dispatch(prevMonth())} onRightTap={()=> dispatch(nextMonth())} />
                </View>
                <PayDetailContainer header={["주차", "시급", "주휴", "플러스", "합계"]} contents={items} ondeataTap={onDeataTap}/>
            </View>
            <View style={{padding:5, width:"100%"}}>
                <TotalContainer contents={["합계", [total.jobWage.toLocaleString(), total.jobDure], [total.weekWage.toLocaleString(), total.spcDure], total.incentive.toLocaleString(), total.salary.toLocaleString()]}/>
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
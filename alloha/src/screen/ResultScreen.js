
import { StyleSheet, View, StatusBar, SafeAreaView } from 'react-native';
import React, {useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import axios from 'axios';
import { URL } from "@env";
import { nextMonth, prevMonth, setWorkResultList } from '../../redux/slices/result';
import { PayContainer, TotalContainer } from '../components/common/Container';
import HeaderControl from '../components/common/HeaderControl';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';

export default function ResultScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const isFocused = useIsFocused();
    const date = useSelector((state) => state.result.month)
    const items = useSelector((state) => state.result.workResultList)
   
    
    const dispatch = useDispatch()

    const total = items.reduce((result, next)=>{
        result.jobWage = result.jobWage + next.jobWage;
        result.weekWage = result.weekWage + next.weekWage;
        result.incentive = result.incentive + next.incentive;
        result.salary = result.salary + next.salary;
        return result; 
    }, {jobWage:0, weekWage:0, incentive:0, salary:0})
    
    useEffect(()=>{
        navigation.setOptions({headerShown:false, title:"결과 현황표"})
    }, [navigation])

    
    const monthCstSlySearch = async () => {
        const param = {cls:"MonthCstSlySearch", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, cstNa:"", userId:userId, userNa:"", rtCl:"0"};
        await axios.get(URL+`/api/v1/rlt/monthCstSlySearch`, {params:param})
        .then((res)=>{
            dispatch(setWorkResultList({data:res.data.result}))
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") monthCstSlySearch();
        }
    }, [isFocused, cstCo, date]);

    const onNameTap = (item) => {navigation.push("resultDetail", {item:item})}
    const onIncentiveTap = async (incentive) => {
        var param = {cls:"IncentiveAmtUpdate", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, userId:incentive.userId, userNa:"", rtCl:incentive.value}
        await axios.get(URL+`/api/v1/rlt/monthCstSlySearch`, {params:param})
        .then((res)=>{
            monthCstSlySearch();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <StoreSelectBoxWithTitle titleText={"결과 현황표"} titleflex={4} selectBoxFlex={8} />
            <View style={{...styles.card, padding:5, width:"100%", overflow:"hidden"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <HeaderControl title={`${date.mm}월 급여표`} onLeftTap={()=> dispatch(prevMonth())} onRightTap={()=> dispatch(nextMonth())} />
                </View>
                <PayContainer header={["성명", "시급", "주휴", "플러스", "합계"]} contents={items} onNameTap={onNameTap} onIncentiveTap={onIncentiveTap}/>
            </View>
            <View style={{padding:5, width:"100%"}}>
                <TotalContainer contents={["합계", total.jobWage.toLocaleString(), total.weekWage.toLocaleString(), total.incentive.toLocaleString(), total.salary.toLocaleString()]}/>
            </View>
        </SafeAreaView>
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
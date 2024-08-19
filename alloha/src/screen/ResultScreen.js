
import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

import axios from 'axios';
import { URL } from "@env";
import { nextMonth, prevMonth, setWorkResultList } from '../../redux/slices/result';
import { PayContainer, TotalContainer } from '../components/common/Container';
import HeaderControl from '../components/common/HeaderControl';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import Excel from '../components/common/Excel';
import { StatusBar } from 'expo-status-bar';

export default function ResultScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const isFocused = useIsFocused();
    const date = useSelector((state) => state.result.month);
    const items = useSelector((state) => state.result.workResultList);
    //const cstCo = useSelector((state)=>state.common.cstCo);
    
    const storeList = useSelector((state)=>state.common.storeList);
    const store = storeList.filter((el)=>el.CSTCO == cstCo);
    
    const [cstNa, setCstNa] = useState("");
   
    const [excelData, setExcelData] = useState([]);
    
    const dispatch = useDispatch();

    const total = items.reduce((result, next)=>{
        //console.log(next);
        result.jobWage += (next.JOBTYPE == "M")?next.BASICWAGE:next.jobWage;
        result.weekWage += (next.JOBTYPE == "M")?next.MEALALLOWANCE:next.weekWage;
        result.incentive += next.incentive;
        result.salary += (next.JOBTYPE == "M")?next.BASICWAGE:next.salary;
        result.mealAllowance += (next.JOBTYPE == "M")?next.MEALALLOWANCE:0;
        return result; 
    }, {jobWage:0, weekWage:0, incentive:0, salary:0, mealAllowance:0})
    
    const monthCstSlySearch = async () => {
        const param = {cls:"MonthCstSlySearch", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, cstNa:"", userId:userId, userNa:"", rtCl:"0"};
        await axios.get(URL+`/api/v1/rlt/monthCstSlySearch`, {params:param})
        .then((res)=>{
            dispatch(setWorkResultList({data:res.data.result}));
            getExcelData();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") {
                monthCstSlySearch();
                if(store.length > 0){
                    setCstNa(store[0].CSTNA);
                }
            }
        }
    }, [isFocused, cstCo, date]);

    const onNameTap = (item) => {
        //console.log({ title: `${item.userNa}`, cstCo:item.cstCo, userId:item.userId, ymdFr:date.start, ymdTo:date.end});
        //navigation.push("resultDetail", {item:item})
        navigation.navigate("WageResultDetail", { title: `${item.userNa}`, cstCo:item.cstCo, userId:item.userId, ymdFr:date.start, ymdTo:date.end});
    }
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

    const getExcelData = async () => {
        var param = {ymdFr:date.start, ymdTo:date.end, cstCo:cstCo}
        await axios.get(URL+`/api/v1/rlt/excelData`, {params:param})
        .then((res)=>{
            //if(res.data.result && res.data.result.length > 0) setCstNa(res.data.result[0].CSTNA);
            const result = res.data.result.map(item => {
                let { CSTCO, USERID, CSTNA, sumOrd, ...rest } = item;
                return rest;
            });
            setExcelData(result)
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StoreSelectBoxWithTitle titleText={""} titleflex={0} selectBoxFlex={12} />
            <View style={{...styles.card, marginTop:20, padding:5, width:"100%", overflow:"hidden"}}>
                <View style={{marginBottom:20}}>
                    <HeaderControl title={`${date.mm}월`} onLeftTap={()=> dispatch(prevMonth())} onRightTap={()=> dispatch(nextMonth())} />
                </View>
                <Excel
                    custom={"result"}
                    type={"sharing"}
                    btntext={"공유하기"}
                    fileName={`${cstNa}_${date.mm}월_결과현황표`}
                    data={excelData}
                />
                <PayContainer header={["성명", "타입", "시급", "주휴/식대", "합계"]} contents={items} onNameTap={onNameTap} onIncentiveTap={onIncentiveTap}/>
            </View>
            <View style={{padding:5, width:"100%"}}>
                <TotalContainer contents={["합계", total.jobWage.toLocaleString(), total.weekWage.toLocaleString(), (total.salary+total.mealAllowance).toLocaleString()]}/>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', paddingHorizontal:16, paddingVertical: 10, backgroundColor:"#fff"},
    card:{
        flex:1,
    },
});
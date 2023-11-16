
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React, {useState, useEffect} from 'react';
import { ProfitLossAlbaList, ProfitLossContainer, ProfitLossPl, TotalContainer } from '../components/common/Container';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import { HTTP } from '../util/http';
import { useDispatch, useSelector } from 'react-redux';
import { nextMonth, prevMonth, setAlbaFeeList, setMonthCstPl } from '../../redux/slices/result';
import HeaderControl from '../components/common/HeaderControl';

export default function ProfitAndLossScreen({navigation}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const date = useSelector((state) => state.result.month);
    const monthCstPl = useSelector((state) => state.result.monthCstPl);
    const albaFeeList = useSelector((state) => state.result.albaFeeList);
    const dispatch = useDispatch()

    useEffect(()=>{
        navigation.setOptions({ headerShown:false, title:"손익관리"})
    }, [navigation])
    
    useEffect(()=>{
        getData();
        getAlbaData();
    }, [cstCo, date])

    const getData = async () => {
        var params = {cls:"MonCstPlSearch", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, plItCo:"", amt:0}
        await HTTP("GET", "/api/v1/profitAndLoss/execPL", params)
        .then((res)=>{
            const data = res.data.result.sort((a, b) => a.ORDBY - b.ORDBY);
            dispatch(setMonthCstPl({data:data}));
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    const getAlbaData = async () => {
        var params = {ymdFr:date.start, ymdTo:date.end, cstCo:cstCo}
        await HTTP("GET", "/api/v1/profitAndLoss/getAlbaFeeList", params)
        .then((res)=>{
            dispatch(setAlbaFeeList({data:res.data.result}));
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    const headerControl = (tap) => {
        if(tap === "left") dispatch(prevMonth());
        if(tap === "right")dispatch(nextMonth());
        getData();
    }
    const onChangeValue = async (chg) => {
        if(chg.value != ""){
            var params = {cls:"CstPlSave", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, plItCo:chg.plItCo, amt:chg.value}
            await HTTP("GET", "/api/v1/profitAndLoss/execPL", params)
            .then((res)=>{
                getData();
            }).catch(function (error) {
                console.log(error);
                alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
            })
        }

    }

    return (
        <View style={styles.container}>
            <StatusBar />
            <StoreSelectBoxWithTitle titleText={"매출 현황"} titleflex={4} selectBoxFlex={8} />
            <View style={[styles.card, {padding:10}]}>
                <HeaderControl title={`${date.mm}월 매출 현황`} onLeftTap={() => headerControl("left")} onRightTap={() =>  headerControl("right")} />
                <ProfitLossPl data={monthCstPl} onChangeValue={onChangeValue}/>
                <ProfitLossAlbaList data={albaFeeList} />
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
        padding:5,
        width:"100%"
    },
});
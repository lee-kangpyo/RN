
import { StyleSheet, Text, View, StatusBar, KeyboardAvoidingView, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import { ProfitLossAlbaList, ProfitLossContainer, ProfitLossPl, TotalContainer } from '../components/common/Container';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import { HTTP } from '../util/http';
import { useDispatch, useSelector } from 'react-redux';
import { nextMonth, prevMonth, setAlbaFeeList, setMonthCstPl } from '../../redux/slices/result';
import HeaderControl from '../components/common/HeaderControl';
import Excel from '../components/common/Excel';

export default function ProfitAndLossScreen({navigation}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const date = useSelector((state) => state.result.month);
    const monthCstPl = useSelector((state) => state.result.monthCstPl);
    const albaFeeList = useSelector((state) => state.result.albaFeeList);
    const dispatch = useDispatch()

    const getExcelData = () => {
        const data = monthCstPl.map((el) => {
            if(el.ORDBY % 100 == 0){
                const sep = el.CONA;
                if(sep == "손익"){
                    return {"구분":el.CONA, "내용":"", "금액":el.AMT}    
                }else {
                    return {"구분":el.CONA, "내용":"계", "금액":el.AMT}
                }
                
            }else{
                return {"구분":"", "내용":el.CONA, "금액":el.AMT}
            }
        })
        const alba = albaFeeList.map((el) => {
            return {"구분":"","내용":el.userNa, "금액":el.salary}
        })
        const index = data.findIndex(item => item.구분 === '인건비');
        if(index > -1) data.splice(index + 1, 0, ...alba);
        console.log(data);
        return data
    }

    useEffect(()=>{
        navigation.setOptions({ headerShown:false, title:"매출현황"})
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
        <KeyboardAvoidingView style={[styles.container, { flex: 1}]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar />
            <StoreSelectBoxWithTitle titleText={"매출 현황"} titleflex={4} selectBoxFlex={8} />
            <View style={[styles.card, {padding:10}]}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <HeaderControl title={`${date.mm}월`} onLeftTap={() => headerControl("left")} onRightTap={() =>  headerControl("right")} />
                    <Excel 
                        header={false}
                        custom={"profit"}
                        type={"sharing"}
                        btntext={"공유하기"} 
                        fileName={"매출 현황"}
                        data={getExcelData()} 
                    />
                </View>
                
                <ProfitLossPl data={monthCstPl} albaList={albaFeeList} onChangeValue={onChangeValue}/>
            </View>
            
        </KeyboardAvoidingView>
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
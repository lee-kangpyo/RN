
import { StyleSheet, Text, View, KeyboardAvoidingView, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { ProfitLossAlbaList, ProfitLossContainer, ProfitLossPl, TotalContainer } from '../components/common/Container';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import { HTTP } from '../util/http';
import { useDispatch, useSelector } from 'react-redux';
import { nextMonth, prevMonth, setAlbaFeeList, setMonthCstPl } from '../../redux/slices/result';
import HeaderControl from '../components/common/HeaderControl';
import Excel from '../components/common/Excel';
import { useIsFocused } from '@react-navigation/native';
import { theme } from '../util/color';
import {Feather} from '@expo/vector-icons';
import { setProfitHint } from '../../redux/slices/common';

export default function ProfitAndLossScreen({navigation}) {
    const isfocesed = useIsFocused()
    const userId = useSelector((state)=>state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const date = useSelector((state) => state.result.month);
    const isShow = useSelector((state)=> state.common.profitScreenHint);
    const monthCstPl = useSelector((state) => state.result.monthCstPl);
    const albaFeeList = useSelector((state) => state.result.albaFeeList);
    const [excelData, setExcelData] = useState([]);

    const storeList = useSelector((state)=>state.common.storeList);
    const store = storeList.filter((el)=>el.CSTCO == cstCo)
    const [cstNa, setCstNa] = useState("");
    const dispatch = useDispatch()

    const getExcelData = () => {
        const month = date.mm;
        let totalAlbaFee = 0;
        let totalSales = 0;
        const data = monthCstPl.map((el) => {
            if(el.ORDBY % 100 == 0){ // 상위 항목
                const sep = el.CONA;
                if(sep == "손익"){
                    return {"구분":el.CONA, [month+"월"]:"", "금액":el.AMT, "비율":(el.AMT / totalSales * 100).toFixed(2),}    
                }else if(sep == "매출"){
                    totalSales = el.AMT
                    return {"구분":el.CONA, [month+"월"]:"계", "금액":el.AMT, "비율":"100.00",}
                }else if(sep == "인건비"){
                    totalAlbaFee = el.AMT
                    return {"구분":el.CONA, [month+"월"]:"계", "금액":el.AMT, "비율":"100.00",}
                }else {
                    return {"구분":el.CONA, [month+"월"]:"계", "금액":el.AMT, "비율":(el.AMT / totalSales * 100).toFixed(2),}
                }
            }else{  // 하위 항목
                return {"구분":"", [month+"월"]:el.CONA, "금액":el.AMT, "비율":(el.AMT / totalSales * 100).toFixed(2),}
            }
        })
        // 인건비 세부
        const alba = albaFeeList.map((el) => {
            return {"구분":"", [month+"월"]:el.userNa, "금액":el.salary, "비율":(el.salary / totalAlbaFee * 100).toFixed(2)}
        })
        const index = data.findIndex(item => item.구분 === '인건비');
        if(index > -1) data.splice(index + 1, 0, ...alba);
        // 디버그 로그
        // for (idx in data){console.log(data[idx]);}
        return data;
    }

    useEffect(()=>{
        setExcelData(getExcelData())
    }, [monthCstPl, albaFeeList])

    useEffect(()=>{
        getData();
        getAlbaData();
        if(store.length > 0) setCstNa(store[0].CSTNA);
    }, [cstCo, date, isfocesed])

    const getData = async () => {
        var params = {cls:"MonCstPlSearch", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, plItCo:"", amt:0}
        await HTTP("GET", "/api/v1/profitAndLoss/execPL", params)
        .then((res)=>{
            const data = res.data.result.sort((a, b) => a.ORDBY - b.ORDBY);
            dispatch(setMonthCstPl({data:data, customPl:res.data.customPl}));
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
    }
    const onChangeValue = async (chg) => {
        
        if(chg.value != ""){
            if(chg.plItCo){
                var params = {cls:"CstPlSave", ymdFr:date.start, ymdTo:date.end, cstCo:cstCo, plItCo:chg.plItCo, amt:chg.value}
                await HTTP("GET", "/api/v1/profitAndLoss/execPL", params)
                .then((res)=>{
                    getData();
                }).catch(function (error) {
                    console.log(error);
                    alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
                })
            }else if(chg.categoryNo){
                var params = {ymdFr:date.start, ymdTo:date.end, cstCo, categoryNo:chg.categoryNo, amt:chg.value, userId}
                await HTTP("GET", "/api/v1/profitAndLoss/execCustomPL", params)
                .then((res)=>{
                    getData();
                }).catch(function (error) {
                    console.log(error);
                    alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
                })
            }
            
        }
    }
    return (
        <KeyboardAvoidingView style={[styles.container, { flex: 1}]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StoreSelectBoxWithTitle titleText={""} titleflex={4} selectBoxFlex={8} />
            <View style={{height:16}}/>
            <View style={[styles.card, {padding:10}]}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <HeaderControl title={`${date.mm}월`} onLeftTap={() => headerControl("left")} onRightTap={() =>  headerControl("right")} />
                    <Excel 
                        custom={"profit"}
                        type={"sharing"}
                        btntext={"공유하기"} 
                        fileName={`${cstNa}_${date.mm}월_매출 현황`}
                        data={excelData} 
                    />
                </View>
                {
                    (isShow)?
                        <View style={{justifyContent:"space-between", flexDirection:"row", borderWidth:0, borderColor:"#ddd", marginBottom:8, borderRadius:5, padding:8, backgroundColor:theme.backSky}}>
                            <Feather name="x-square" size={20} color={theme.backSky} />
                            <View style={{flexDirection:"row"}}>
                                <Text style={{color:theme.primary}}>파란색 </Text>
                                <Text style={{color:"#111"}}>항목은 터치해서 입력 가능합니다.</Text>
                            </View>
                            <TouchableOpacity onPress={()=>dispatch(setProfitHint({isShow:false}))}>
                                <Feather name="x-square" size={20} color="#111" />
                            </TouchableOpacity>
                        </View>
                    :null
                }
                <ProfitLossPl data={monthCstPl} albaList={albaFeeList} onChangeValue={onChangeValue}/>
                <TouchableOpacity onPress={()=>navigation.navigate("ProfitCategory")} style={styles.box}>
                    <Text style={styles.boxTxt}>매출 하위 항목 추가</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5, marginTop:10, marginVertical:10},
    card:{
        backgroundColor:"white",
        flex:1,
        borderWidth: 1, // 테두리 두께
        borderColor: '#ddd', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
        padding:5,
        width:"100%"
    },
    box:{
        alignItems:"center",
        borderWidth: 1,
        borderColor:theme.primary,
        borderRadius: 10,
        padding:16,
        marginTop:12
    },
    boxTxt:{
        fontFamily:"SUIT-SemiBold",
        fontSize:15,
        color:theme.primary
    }
});
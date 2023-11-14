
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import React, {useState, useEffect} from 'react';
import { ProfitLossContainer, TotalContainer } from '../components/common/Container';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';

export default function ProfitAndLossScreen({navigation}) {
    useEffect(()=>{
        navigation.setOptions({ headerShown:false, title:"손익관리"})
    }, [navigation])

    return (
        <View style={styles.container}>
            <StatusBar />
            <StoreSelectBoxWithTitle titleText={"손익 관리"} titleflex={4} selectBoxFlex={8} />
            <View style={[styles.card, {padding:30}]}>
                <Text>10월 손익</Text>
                <ProfitLossContainer StoreName={"대학로"} />
                <TotalContainer contents={["합계", "1000".toLocaleString(), "1000".toLocaleString()]}/>
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
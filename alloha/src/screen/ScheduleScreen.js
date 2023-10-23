
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import { getWeekNumber } from '../util/moment';
import WeekDate from '../components/schedule/WeekDate';
import WeekAlba from '../components/schedule/WeekAlba';
import { useSelector, useDispatch } from 'react-redux';
import { setAlba } from '../../redux/slices/schedule';

export default function ScheduleScreen({navigation}) {
    const albas = useSelector((state)=>state.schedule.albas)
    const dispatch = useDispatch();
    
    const weekNumber = getWeekNumber();

    useEffect(()=>{
        navigation.setOptions({title:"시간표"})
    }, [navigation])

    const alba = [
        {
            name:"이하나2", 
            sum:"14.0",
            sumSub:"1.5",
            "list":[
                {"day":"1022", "txt":"-", "subTxt":""},
                {"day":"1023", "txt":"3.5", "subTxt":""},
                {"day":"1024", "txt":"3.5", "subTxt":""},
                {"day":"1025", "txt":"3.5", "subTxt":"1.5"},
                {"day":"1026", "txt":"3.5", "subTxt":""},
                {"day":"1027", "txt":"-", "subTxt":""},
                {"day":"1028", "txt":"-", "subTxt":""},        
            ]
        },
        {
            name:"갑을병2", 
            sum:"14.0",
            sumSub:"",
            "list":[
                {"day":"1022", "txt":"-", "subTxt":""},
                {"day":"1023", "txt":"4.0", "subTxt":""},
                {"day":"1024", "txt":"3.5", "subTxt":""},
                {"day":"1025", "txt":"3.5", "subTxt":""},
                {"day":"1026", "txt":"3.5", "subTxt":""},
                {"day":"1027", "txt":"-", "subTxt":""},
                {"day":"1028", "txt":"-", "subTxt":""},        
            ]
        },
    ];

    return (
        <View style={styles.container}>
            <View style={{...styles.card, padding:5, width:"100%"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:15}}>
                    <Text>{weekNumber.month}월 {weekNumber.num}주차 일정표</Text>
                    <TouchableOpacity onPress={()=>dispatch(setAlba(alba))}>
                        <Text>지난 시간표 가져오기</Text>
                    </TouchableOpacity>
                </View>
                <WeekDate/>
                {albas.map((item, idx)=>{
                    return <WeekAlba key={idx} alba={item} />
                })}
                <TouchableOpacity>
                    <View style={styles.box}>
                        <Text style={{fontSize:24}}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Text>합계</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    card:{
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
    },
    sampleImage:{width:"100%", height:"100%"},
    box:{
        backgroundColor:"blue",
        paddingVertical:10,
        margin:1,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
});
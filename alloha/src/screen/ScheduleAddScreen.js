
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, FlatList} from 'react-native';
import React, { useEffect, Suspense, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import WeekDate from '../components/schedule/WeekDate';
import WeekCheckTime from '../components/schedule/WeekCheckTime';
import { Ionicons } from '@expo/vector-icons'; 


export default function ScheduleAddScreen({navigation}) {
    const checkBox = useSelector((state)=>state.schedule.timeBox)
    const totalTime = useSelector((state)=>state.schedule.totalTime)
    const totalCoverTime = useSelector((state)=>state.schedule.totalCoverTime)
    useEffect(()=>{
        navigation.setOptions({title:"시간표 일별 등록"})
    }, [navigation])

    function arraysAreEqual(arr1, arr2) {
        if (arr1.length !== arr2.length) {
            return false; // 길이가 다르면 다른 배열
        }
        
        for (let i = 0; i < arr1.length; i++) {
            if (arr1[i] !== arr2[i]) {
            return false; // 최소한 하나의 값이 다르면 다른 배열
            }
        }
        
        return true; // 모든 값이 일치하면 같은 배열
    };
        
    return (
        <View style={styles.container}>
            <Text>알바이름 등록</Text>
            <TextInput style={styles.input}/>
            <Text>시간표 등록</Text>
            <Text>주간 총 근무시간 : {totalTime}, 대타근무 : {totalCoverTime}</Text>
            <WeekDate sBlank={1.45}/>
            <FlatList
                keyExtractor={(item, index) => index.toString()}
                style={{width:"100%"}}
                data={checkBox}
                renderItem={({ item, index }) => {
                    const hour = String(Math.floor(index / 2)).padStart(2, '0');
                    const minute = index % 2 === 0 ? '00' : '30';
                    const timeString = `${hour}:${minute}`;
                    return <WeekCheckTime key={index} x={index} time={timeString} content={item} />
                }}
            />
            <View style={styles.hr}/>
            <TouchableOpacity style={styles.btn} onPress={()=>alert("저장하기 기능 구현 필요")}>
                <Text>저장</Text>
            </TouchableOpacity>
            <View>
                <Text>선택한 요일과 시간 옆에 (-) 버튼을 클릭하여 근무시간으로 등록하세요</Text>
                <View style={{flexDirection:"row", flexWrap:"wrap"}}>
                    <Text>시간표 버튼을 한번 누르면 일반 근무 : </Text>
                    <Ionicons name="checkmark-circle" size={20} color="black" />
                    <Text>두번 누르면 대타 근무 : </Text>
                    <Ionicons name="checkmark-circle" size={20} color="red" />
                    
                </View>
                <Text>세번 누르면 근무 해제 상태가 됩니다.</Text>
                <Text>시간표는 30분 단위로 등록할수 있습니다.</Text>
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    hr:{
        marginVertical:10,
        width:"100%",
        borderWidth: 1, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
    },
    btn:{
        backgroundColor:"#D7E5CA",
        paddingVertical:15,
        margin:1,
        width:"100%",
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    card:{
        flex:1,
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
    input: {
        width:200,
        height: 40,
        margin: 12,
        borderWidth: 1,
        borderRadius:10,
        padding: 10,
      },
});
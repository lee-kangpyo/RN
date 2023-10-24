
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, FlatList} from 'react-native';
import React, { useEffect, Suspense, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import WeekDate from '../components/schedule/WeekDate';
import WeekCheckTime from '../components/schedule/WeekCheckTime';


export default function ScheduleAddScreen({navigation}) {
    const checkBox = useSelector((state)=>state.schedule.timeBox)
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
            <Text>주간 총 근무시간 : 14.5, 대타근무 : 4.0</Text>
            <WeekDate sBlank={1.5}/>
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
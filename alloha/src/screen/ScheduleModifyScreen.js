
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, Modal, ActivityIndicator} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import WeekDate from '../components/schedule/WeekDate';
import WeekCheckTime from '../components/schedule/WeekCheckTime';
import { Ionicons } from '@expo/vector-icons';
import WeekTotal from '../components/schedule/WeekTotal';
import { getDayWeekNumber, getWeekList } from '../util/moment';
import axios from 'axios';
import { URL } from "@env";
import { updateTimeBox } from '../../redux/slices/schedule';

export default function ScheduleModifyScreen({navigation, route}) {
    const checkBox = useSelector((state)=>state.schedule.timeBox);
    const totalTime = useSelector((state)=>state.schedule.totalTime);
    const totalCoverTime = useSelector((state)=>state.schedule.totalCoverTime);
    const weekNumber = useSelector((state)=>state.schedule.weekNumber);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const week = useSelector((state)=>state.schedule.week)
    const weekList = getWeekList(week);
    const dispatch = useDispatch();
    
    const { alba, stat } = route.params;

    const [isSaving, setSaving] = useState(false);
    useEffect(()=>{
        navigation.setOptions({title:"근무 계획 일별 등록"});
    }, [navigation]);

    useEffect( ()=>{
        if(stat == "search"){
            searchAlbaChedule();
        }
    }, []);

    async function searchAlbaChedule() {
        const param = {cstCo:cstCo, userId:alba.userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD")};
        await axios.get(URL+`/api/v1/searchAlbaChedule`, {params:param})
        .then((res)=>{
            if(res.data.resultCode == "00"){
                const data = res.data.result;
                dispatch(updateTimeBox({data:data}))
            }else{
                alert("시간표 조회 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")    
            }
        }).catch(function (error) {
            console.log(error);
            alert("시간표 조회 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }


    function separateWorkAndOvertimeForDay(timeArray, dayIndex) {
        const ymd = weekList[dayIndex].format("yyyyMMDD");
        const daySchedule = [];
        let currentType = "";
        let sTime = 0;
        
        for (let i = 0; i < timeArray.length; i++) {
            const cell = timeArray[i][dayIndex];
            const hour = i * 0.5;
            if (cell === 1) {
                if (currentType !== "G") {
                    if (currentType !== "") {
                        const eTime = i * 0.5;
                        daySchedule.push({ jobCl: currentType, sTime, eTime });
                    }
                    currentType = "G";
                    sTime = hour;
                }
            } else if (cell === 2) {
                if (currentType !== "S") {
                    if (currentType !== "") {
                        const eTime = i * 0.5;
                        daySchedule.push({ jobCl: currentType, sTime, eTime });
                    }
                    currentType = "S";
                    sTime = hour;
                }
            } else {
                if (currentType !== "") {
                    const eTime = i * 0.5;
                    daySchedule.push({ jobCl: currentType, sTime, eTime });
                    currentType = "";
                }
            }
        }
        
        if (currentType !== "") {
            const eTime = timeArray.length * 0.5;
            daySchedule.push({ jobCl: currentType, sTime, eTime });
        }
        
        const formattedSchedule = daySchedule.map(({ jobCl, sTime, eTime }) => ({
            ymdFr:ymd,
            ymdTo:"",
            jobCl:jobCl,
            sTime: `${String(Math.floor(sTime)).padStart(2, '0')}:${String(Math.floor((sTime % 1) * 60)).padStart(2, '0')}`,
            eTime: `${String(Math.floor(eTime)).padStart(2, '0')}:${String(Math.floor((eTime % 1) * 60)).padStart(2, '0')}`,
        }));
        
        return formattedSchedule;
    }
        
    const onSave = async () => {
        const userId = (alba.USERID)?alba.USERID:alba.userId
        setSaving(true);
        const param = {cls:'WeekAlbaScheduleSave', cstCo:cstCo, userId:userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD")}
        const idxs = [0, 1, 2, 3, 4, 5, 6]
        const result = [];
        
        for(var idx in idxs){
            const data = separateWorkAndOvertimeForDay(checkBox, idx);
            result.push(...data);
        }
        param["data"] = result;

        await axios.post(URL+`/api/v1/saveAlbaChedule`, param)
        .then((res)=>{
            setSaving(false);
            if(res.data.resultCode == "00"){
                alert("저장 되었습니다.");
                navigation.goBack();
            }else{
                alert("시간표 등록 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")    
            }
            setSaving(false);
        }).catch(function (error) {
            setSaving(false);
            console.log(error);
            alert("시간표 등록 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    return (
        <View style={styles.container}>
            <View style={{padding:15}}>
                <Text>{alba.USERNA}{alba.userNa}님의 {weekNumber.month}월 {weekNumber.number}주차 시간표</Text>
                <View style={{flexDirection:"row", justifyContent:"space-between", width:"100%", paddingTop:10}}>
                    <View style={{flexDirection:"row"}}>
                        <Text>주간 총 근무시간 : {totalTime}</Text>
                    </View>
                </View>
            </View>
            <WeekDate sBlank={1.5} week={week}/>
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
            <WeekTotal checkBox={checkBox}/>
            <TouchableOpacity style={styles.btn} onPress={onSave}>
                <Text style={{fontSize:16, fontWeight:"bold"}}>저장</Text>
            </TouchableOpacity>
            <View>
                <Text>선택한 요일과 시간 옆에 [ - ] 버튼을 클릭하여 근무시간으로 등록하세요</Text>
                <View style={{flexDirection:"row", flexWrap:"wrap", alignItems:"center"}}>
                    <Text>체크 아이콘(</Text>
                    <Ionicons name="checkmark-circle" size={18} color="black" />
                    <Text>)이 있는 시간부터 30분간 근무입니다. </Text>
                </View>
                <Text>ex ) 07:00분에 체크했다면, 07:00-07:30 근무</Text>
            </View>
            <Modal
                transparent={true}
                animationType="none"
                visible={isSaving}
                onRequestClose={() => {
                setIsLoading(false);
                }}
            >
                <View style={styles.backGrey}>
                    <ActivityIndicator size="large" color="white" />
                    <Text style={{color:"white", fontSize:20}}>저장 중...</Text>
                </View>
            </Modal>
        </View>
        
    );
}



const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'flex-start', padding:5},
    hr:{
        marginVertical:3,
        width:"100%",
        borderWidth: 1, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
    },
    btn:{
        marginTop:10,
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

    backGrey:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
    }
});
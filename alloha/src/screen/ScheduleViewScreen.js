
import { StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { getDayWeekNumber, getWeekList } from '../util/moment';
import axios from 'axios';
import { URL } from "@env";

export default function ScheduleViewScreen({navigation}) {
    const ref = useRef();
    const albas = useSelector((state)=>state.schedule.albas)
    const cstCo = useSelector((state)=>state.common.cstCo);
    const week = useSelector((state)=>state.schedule.week)
    const weekList = getWeekList(week);
    const dispatch = useDispatch();

    const [weekSchSearch, setWeekSchSearch] = useState([])

    
    const getWeekSchedule2 = async () => {

        const param = {cls:"WeekScheduleSearch2", cstCo:cstCo, userId:"", ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), wCnt:"0",};
        //exec PR_PLYA01_SCHMNG 'WeekScheduleSearch2', 24, '', '20231022', '20231028', 0
        await axios.get(URL+`/api/v1/getWeekSchedule`, {params:param})
        .then((res)=>{
            
            const data = handelParam(res.data.result)
            setWeekSchSearch(data)
            

        }).catch(function (error) {
            console.log(error);
            alert("알바 일정을 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    const handelParam = (data) => {
        // 데이터를 YMD 및 USERID 값으로 그룹화
        const groupedData = data.reduce((result, item) => {
            const YMD = item.YMD;
            const USERID = item.USERID;
            const USERNA = item.USERNA;  
        
            // YMD와 USERID로 그룹화한 고유한 식별자 생성
            const key = `${YMD}_${USERID}`;
        
            if (!result[key]) {
            result[key] = {
                ymd:YMD,
                userId: USERID,
                userNa: USERNA,
                list: []
            };
            }
        
            result[key].list.push(item);
        
            return result;
        }, {});
        
        const groupedArray = Object.values(groupedData).map((group) => ({
            ...group,
            list: group.list.map(({ ymd, userId, userNa, ...rest }) => rest)
        }));
        //console.log(groupedArray);
        return groupedArray
    }
    
    useEffect(()=>{
        getWeekSchedule2();
    }, [])

    useEffect(()=>{
        navigation.setOptions({title:"시간표 일별 조회"})
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={() => onShare()}>
                    <Ionicons name="download-outline" size={24} color="black" />
                </TouchableOpacity>
            ),
        });
    }, [navigation])


    const test = () => {
        // 이미지 저장 관련 로직을 수행하거나 다른 함수 호출
        ref.current.capture().then(async uri => {
            console.log("do something with ", uri);
            await Sharing.shareAsync(
                Platform.OS === 'ios' ? `file://${uri}` : uri,
                {
                  mimeType: 'image/png',
                  dialogTitle: '공유하기',
                  UTI: 'image/png',
                },
              );
        });
    }

    return (
        <View style={[styles.container, styles.containerBox]}>
            <Text>10월 4주차 일정표</Text>
            <ViewShot ref={ref} options={{ fileName: "capture", format: "jpg", quality: 0.9 }}>
                <View style={styles.box}>
                    <Text>10 / 22 (일)</Text>
                    <View style={styles.line}>
                        <View style={styles.box}>
                            <Text>이하나</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>07:30 ~ 1:30</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>            </Text>
                        </View>
                        <View style={styles.box}>
                            <Text>4.0</Text>
                        </View>
                    </View>
                    <View style={styles.line}>
                        <View style={styles.box}>
                            <Text>용호명</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>08:00 ~ 12:00</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>            </Text>
                        </View>
                        <View style={styles.box}>
                            <Text>4.0</Text>
                        </View>
                    </View>
                    <View style={styles.line}>
                        <View style={styles.box}>
                            <Text>강다니엘</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>11:30 ~ 16:00</Text>
                        </View>
                        <View style={styles.box}>
                            <Text>16:00 ~ 19:00</Text>
                        </View>
                        <View style={{...styles.box, flexDirection:"column"}}>
                            <Text>4.0</Text>
                            <Text>3.0</Text>
                        </View>
                    </View>
                </View>
            </ViewShot>

            {
                weekSchSearch.map((el, idx) => {
                    for (var idx in weekList){
                        const ymd = weekList[idx].format('yyyyMMDD');
                        const weekNumber = getDayWeekNumber(ymd);
                        const mmdd = weekList[idx].format('MM/DD');
                        
                        const a = data.filter((item)=>item.ymd == mmdd);
                        console.log(a)
                        
                    }
                    return <Text>asdf</Text>
                })
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    containerBox:{
        paddingVertical:10,
        margin:15,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignItems:"flex-start",
    },
    box:{
        backgroundColor:"white",
        paddingVertical:10,
        margin:15,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    line:{ flexDirection:"row"},
});
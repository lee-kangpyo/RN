
import { StyleSheet, Text, View, TouchableOpacity, Platform} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ViewShot from "react-native-view-shot";
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { getDayWeekNumber, getWeekList } from '../util/moment';
import axios from 'axios';
import { URL } from "@env";
import { AntDesign } from '@expo/vector-icons'; 
import { theme } from '../util/color';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

export default function ScheduleViewScreen({navigation}) {
    const weekNumber = useSelector((state)=>state.schedule.weekNumber);
    const ref = useRef();
    const cstCo = useSelector((state)=>state.common.cstCo);
    const week = useSelector((state)=>state.schedule.week);
    const weekList = getWeekList(week);
    const dispatch = useDispatch();
    const [weekSchSearch, setWeekSchSearch] = useState([])

    const getWeekSchedule2 = async () => {
        const param = {cls:"WeekScheduleSearch3", cstCo:cstCo, userId:"", ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), wCnt:"0",};
        await axios.get(URL+`/api/v1/getWeekSchedule`, {params:param})
        .then((res)=>{
            //const data = handelParam(res.data.result)
            setWeekSchSearch(res.data.result)
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
        navigation.setOptions({title:""})
        // navigation.setOptions({
        //     headerRight: () => (
        //         <TouchableOpacity onPress={() => onShare()}>
        //             <Ionicons name="download-outline" size={24} color="black" />
        //         </TouchableOpacity>
        //     ),
        // });
    }, [navigation])
//sa/adminDba1!

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
        <View style={[styles.container]}>
            <Text style={{fontSize:16, marginBottom:15}}>{weekNumber.month}월 {weekNumber.number}주차 근무 계획</Text>
            <ViewShot ref={ref} options={{ fileName: "capture", format: "jpg", quality: 0.9 }}>
                <View style={styles.containerBox}>
                    {
                        (weekSchSearch.length > 0)?
                            <ScrollView contentContainerStyle={styles.scroll}>
                                {
                                weekList.map((dayStr, idx)=>{
                                    const day={ 0:"일", 1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토" };
                                    const albaList = weekSchSearch.filter((el)=>el.YMD == dayStr.format("YYYYMMDD"));
                                    return (albaList.length > 0)?<DailyScheduleBox key={idx} mmdd={dayStr} day={day[getDayWeekNumber(dayStr)]} albaList={albaList} />:null;
                                })
                                }
                            </ScrollView>
                        :
                            <View style={{alignSelf:"center"}}>
                                <Text>데이터가 없습니다.</Text>
                            </View>
                    }
                
                </View>
            </ViewShot>
        </View>
    );
}

const DailyScheduleBox = ({mmdd, day, albaList}) => {
    const navigation = useNavigation();
    const color={2:theme.open,5:theme.middle,9:theme.close,1:theme.etc,};
    return(
        <View style={styles.day}>
            <TouchableOpacity style={styles.mmdd} onPress={()=>navigation.push("scheduleTimeLine", {ymd:mmdd.format("YYYYMMDD"), mmdd:mmdd.format("MM / DD") + " " + day})}>
                <Text>{mmdd.format("MM / DD")}</Text>
                <Text>({day})</Text>
            </TouchableOpacity>
            <View style={styles.albaList}>
                {
                    albaList.map((alba)=>{
                        return(
                            <View style={styles.alba}>
                                <AntDesign name="checkcircle" size={16} color={color[alba.JOBCL]} style={styles.circle}/>
                                <View style={{flexDirection:"row",}}>
                                    <Text style={{fontSize:16, width:70}}>{alba.USERNA}</Text>
                                    <Text style={{fontSize:16}}>{alba.SCHTIME} 근무 ({alba.JOBDURE})</Text>
                                </View>
                            </View>
                        );
                    })
                }
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent:"flex-start", margin:15},
    containerBox:{
        backgroundColor:"white",
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
        height:"95%"
    },
    scroll:{

        alignItems:"flex-start",
    },
    day:{
        flexDirection:"row",
        padding:15
    },
    mmdd:{
        paddingRight:15,
        alignItems:"center"
    },
    albaList:{
        flex:1,
        padding:5,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 5, // 테두리 모서리 둥글게 
    },
    box:{
        paddingVertical:10,
        margin:15,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    alba:{
        flexDirection:"row",
        paddingBottom:2
    },
    circle:{
        verticalAlign:"middle",
        paddingRight:5
    },
});
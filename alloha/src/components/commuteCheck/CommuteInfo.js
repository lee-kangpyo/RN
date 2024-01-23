
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { HTTP } from '../../util/http';
import ConvertDayStr from './ConvertDayStr';
import { YYYYMMDD2Obj } from '../../util/moment';
import { useIsFocused } from '@react-navigation/native';

export default function CommuteInfo({day, dayJobInfo, setDayJobInfo}) {
    const isFocused = useIsFocused();
    const userId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    //const date = useSelector((state)=>state.alba.date);
    const [loading, setLoadin] = useState(true);
    //const [dayJobInfo, setDayJobInfo] = useState({});

    const dayJobSearch = async () => {
        //await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"dayJobInfo", userId:'mega7438226_0075', cstCo:'1010', ymdFr:'20231203', ymdTo:'20231209'})
        await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"dayJobInfo", userId:userId, cstCo:sCstCo, ymdFr:day, ymdTo:day})
        .then((res)=>{
            if(res.data.result.length > 0) setDayJobInfo(res.data.result[0]);
            setLoadin(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        if(isFocused){
            setLoadin(true);
            dayJobSearch();
        }
    }, [isFocused])
    const PlanAlba = ()=>{
        const date = YYYYMMDD2Obj(dayJobInfo.ymd);
        return(
            <View style={styles.row}>
                <Text>{date.ymd.split(".")[1]} / {date.ymd.split(".")[2]} </Text> 
                <Text style={{color:date.color}}>({date.day})</Text>
                <Text> {dayJobInfo.schFrom} ~ {dayJobInfo.schTo} ({dayJobInfo.schDure})</Text>
            </View>
        )
    }
    return(
        (loading)?
            <ActivityIndicator />
        :
            <View style={styles.card}>
                <ConvertDayStr dayStr={day} style={styles.dayStr} fontSize={16}/>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={styles.grey}>출근시간</Text>
                        <Text style={{fontSize:20, fontWeight:"bold"}}>{dayJobInfo.startTime}</Text>
                        <Text style={[styles.grey, {fontSize:10}]}>({dayJobInfo.realStartTime})</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.grey}>퇴근시간</Text>
                        <Text style={{fontSize:20, fontWeight:"bold"}}>{dayJobInfo.endTime}</Text>
                        <Text style={[styles.grey, {fontSize:10}]}>({dayJobInfo.realEndTime})</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={styles.grey}>총 근무시간</Text>
                        <Text style={{fontSize:20, fontWeight:"bold", color:"blue"}}>{dayJobInfo.jobDure} 시간</Text>
                        <Text style={[styles.grey, {fontSize:10}]}>(일반 : {dayJobInfo.genDure} 대타 : {dayJobInfo.spcDure})</Text>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={styles.grey}>근무계획 : </Text>
                    {
                        (dayJobInfo.ymd)?
                        <PlanAlba />
                        :
                        null
                    }

                </View>
                <View style={styles.row}>
                    <Text style={styles.grey}>근무상태 : </Text>
                    <Text>{dayJobInfo.attendence}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.grey}>근무기록변경요청 : </Text>
                    
                        {
                        (dayJobInfo.reqStat == 'N')?
                            <Text>없음</Text>
                        :(dayJobInfo.reqStat == 'R')?
                            <Text>요청중</Text>
                        :(dayJobInfo.reqStat == 'A')?
                            <Text>승인됨</Text>
                        :(dayJobInfo.reqStat == 'D')?
                            <Text>거절됨</Text>
                        :
                            null
                        }
                    
                </View>
            </View>
    )
}


const styles = StyleSheet.create({
    card:{
        borderWidth:1,
        borderRadius:5,
        width:"100%",
        marginBottom:15, 
        padding:15,
    },
    grey:{color:"grey"},
    dayStr:{ justifyContent:"center", marginBottom:16 },
    grid:{ flexDirection:"row", justifyContent:"space-between", paddingHorizontal:24, marginBottom:16  },
    gridItem:{alignItems:"center"},
    row:{ flexDirection:"row" },
});
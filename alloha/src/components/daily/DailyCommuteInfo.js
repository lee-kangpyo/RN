
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { HTTP } from '../../util/http';
import { YYYYMMDD2Obj } from '../../util/moment';
import { useIsFocused } from '@react-navigation/native';
import ConvertDayStr from '../commuteCheck/ConvertDayStr';

export default function DailyCommuteInfo({day, userId, sCstCo, dayJobInfo, setDayJobInfo}) {
    const isFocused = useIsFocused();
    const [loading, setLoadin] = useState(true);

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
            <View style={{justifyContent:"center", alignContent:"center"}}>
                <ActivityIndicator />
            </View>
        :
        <>
            <ConvertDayStr dayStr={day} style={styles.dayStr} fontSize={16} style={styles.dayStr} textStyle={fonts.dayStr}/>
            <View style={styles.card}>
                <View style={styles.grid}>
                    <View style={styles.gridItem}>
                        <Text style={[fonts.grey, {marginBottom:4}]}>출근시간</Text>
                        <Text style={[fonts.time, {color: "#111111"}]}>{dayJobInfo.startTime}</Text>
                        <Text style={[styles.grey, {fontSize:10}]}>({dayJobInfo.realStartTime})</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={[fonts.grey, {marginBottom:4}]}>퇴근시간</Text>
                        <Text style={[fonts.time, {color: "#111111"}]}>{dayJobInfo.endTime}</Text>
                        <Text style={[styles.grey, {fontSize:10}]}>({dayJobInfo.realEndTime})</Text>
                    </View>
                    <View style={styles.gridItem}>
                        <Text style={[fonts.grey, {marginBottom:4}]}>총 근무시간</Text>
                        <Text style={[fonts.time, {color: "#3479EF"}]}>{dayJobInfo.jobDure} 시간</Text>
                        <Text style={[styles.grey, {fontSize:10}]}>(일반 : {dayJobInfo.genDure} 대타 : {dayJobInfo.spcDure})</Text>
                    </View>
                </View>
                
            </View>
            <View style={[styles.card, {padding:16}]}>
                <View style={[styles.row, styles.line, styles.mb10]}>
                    <Text style={[fonts.grey, {fontSize:13}]}>근무계획</Text>
                    {
                        (dayJobInfo.ymd)?
                        <PlanAlba />
                        :
                        null
                    }

                </View>
                <View style={[styles.row, styles.line, styles.mb10]}>
                    <Text style={[fonts.grey, {fontSize:13}]}>근무상태</Text>
                    <Text style={fonts.content}>{dayJobInfo.attendence}</Text>
                </View>
                <View style={[styles.row, styles.line]}>
                    <Text style={[fonts.grey, {fontSize:13}]}>근무기록변경요청</Text>
                    
                        {
                        (dayJobInfo.reqStat == 'N')?
                            <Text style={fonts.content}>없음</Text>
                        :(dayJobInfo.reqStat == 'R')?
                            <Text style={fonts.content}>요청중</Text>
                        :(dayJobInfo.reqStat == 'A')?
                            <Text style={fonts.content}>승인됨</Text>
                        :(dayJobInfo.reqStat == 'D')?
                            <Text style={fonts.content}>거절됨</Text>
                        :
                            null
                        }
                    
                </View>
            </View>
        </>
    )
}

const fonts = StyleSheet.create({
    dayStr:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        fontWeight: "800",
        color: "#111111"
    },
    grey:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        fontWeight: "500",
        color: "#777777"
    },
    content:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#333333"
    },
    time:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 16,
        fontWeight: "800",
    }
});

const styles = StyleSheet.create({
    card:{
        width:"100%",
        padding:15,
        marginBottom:10,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.05)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1
            },
            android:{
                elevation :2,
            }
        })
    },
    grey:{color:"grey"},
    dayStr:{ justifyContent:"center", marginVertical:30 },
    grid:{ flexDirection:"row", justifyContent:"space-between", paddingHorizontal:24, marginBottom:16  },
    gridItem:{alignItems:"center"},
    row:{ flexDirection:"row" },
    line:{alignItems:"baseline", justifyContent:"space-between", },
    mb10:{marginBottom:10}
});
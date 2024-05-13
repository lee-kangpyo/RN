import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';
import { URL } from "@env";
import { getDayWeekNumber, YYMMDD2YYDD } from '../../util/moment';
import { AntDesign } from '@expo/vector-icons'; 
import { theme } from '../../util/color';

export default function ScheduleByAlba({cstCo, userId, ymdFr, ymdTo}) {
    const [data, setData] = useState({});
    const [isLoading ,setIsLoading] = useState(true);
    const getData = async (cstCo, userId, ymdFr, ymdTo) => {
        const param = {cls:"WeekAlbaScheduleSearch", cstCo:cstCo, userId:userId, ymdFr:ymdFr, ymdTo:ymdTo,};
        await axios.get(URL+`/api/v1/WeekAlbaScheduleSearch`, {params:param})
        .then((res)=>{
            setData(res.data.result);
            setIsLoading(false);
        }).catch(function (error) {
            console.log(error);
            alert("알바 일정을 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            setIsLoading(false);
        })
    }

    useEffect(()=>{
        setIsLoading(true);
        getData(cstCo, userId, ymdFr, ymdTo);
    }, [cstCo, userId, ymdFr, ymdTo])
    return (
        <ScrollView contentContainerStyle={styles.container}>
            {
                (isLoading)?
                <View style={{flex:1, justifyContent:"center"}}>
                    <ActivityIndicator />
                </View>
                :
                    (Object.keys(data).length > 0)?
                        Object.keys(data).map((userNa, idx)=>{
                            return (
                                <DailyScheduleBox key={idx} alba={data[userNa]} />
                            )
                        })
                    :
                    <View style={{justifyContent:"center", alignItems:"center"}}>
                        <Text style={fonts.noData}>데이터가 없습니다.</Text>
                        <Text style={fonts.noData}>근무 계획을 입력해주세요.</Text>
                    </View>
            }
        </ScrollView>
    );
};

const DailyScheduleBox = ({alba}) => {
    const day={ 0:"일", 1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토" };
    const color={2:theme.open,5:theme.middle,9:theme.close,1:theme.etc,};
    return(
        <View style={styles.albaList}>
            <View style={styles.userNa}>
                <Text style={fonts.userNa} numberOfLines={1} ellipsizeMode='tail'>{alba.userNa}</Text>
            </View>
            {
                alba.list.map((alba, idx)=>{
                    return(
                        <View key={idx} style={styles.alba}>
                            <AntDesign name="checkcircle" size={16} color={color[alba.JOBCL]} style={[styles.circle, {marginRight:10}]}/>
                            <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                                <Text style={[fonts.contents]} >{YYMMDD2YYDD(alba.YMD)} {day[getDayWeekNumber(alba.YMD)]}</Text>
                                <Text style={fonts.contents2}>{alba.SCHTIME}</Text>
                                <View style={styles.pill}>
                                    <Text style={fonts.pillText}>{alba.JOBDURE.toFixed(1)}</Text>
                                </View>
                            </View>
                        </View>
                    );
                })
            }
        </View>
    );
}
const fonts = StyleSheet.create({
    noData:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        fontWeight: "800",
        color: "#555555"
    },
    userNa:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        fontWeight: "800",
        color: "#111111"
    },
    contents:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        fontWeight: "800",
        color: "#555555"
    },
    contents2:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        color: "#555555"
    },
    pillText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        fontStyle: "normal",
        lineHeight: 13,
        letterSpacing: -1,
        color: "#999999"
    },
})
const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    box:{
        flexDirection:"row",
        padding:15
    },
    userNa:{
        marginBottom:8
    },
    albaList:{
        width:"100%",
        // flex:1,
        // padding:16,
        // borderWidth: 0.5, // 테두리 두께
        // borderColor: 'gray', // 테두리 색상
        // borderRadius: 5, // 테두리 모서리 둥글게 

        marginBottom:8,
        padding:15,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1,
            },
            android:{
                elevation :2,
            }
        })
        

    },
    alba:{
        flexDirection:"row",
        paddingBottom:2
    },
    circle:{
        verticalAlign:"middle",
        paddingRight:5
    },
    pill:{
        paddingHorizontal:14,
        paddingVertical:3,
        borderRadius: 10,
        backgroundColor: "#EEEEEE",
        justifyContent:"center",
        alignItems:"center",
        width:55,
    },
  });
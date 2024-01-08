import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator } from 'react-native';
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
                    <View style={{flex:1, justifyContent:"center"}}><Text>데이터가 없습니다.</Text></View>
            }
        </ScrollView>
    );
};

const DailyScheduleBox = ({alba}) => {
    const day={ 0:"일", 1:"월", 2:"화", 3:"수", 4:"목", 5:"금", 6:"토" };
    const color={2:theme.open,5:theme.middle,9:theme.close,1:theme.etc,};
    return(
        <View style={styles.box}>
            <View style={styles.userNa}>
                <Text style={{fontSize:16}} numberOfLines={1} ellipsizeMode='tail'>{alba.userNa}</Text>
            </View>
            <View style={styles.albaList}>
                {
                    alba.list.map((alba, idx)=>{
                        return(
                            <View key={idx} style={styles.alba}>
                                <AntDesign name="checkcircle" size={16} color={color[alba.JOBCL]} style={styles.circle}/>
                                <View style={{flex:1, flexDirection:"row", justifyContent:"space-between"}}>
                                    <Text style={{fontSize:16}} numberOfLines={1} ellipsizeMode='tail'>{YYMMDD2YYDD(alba.YMD)} {day[getDayWeekNumber(alba.YMD)]}</Text>
                                    <Text style={{fontSize:16}}>{alba.SCHTIME} ({alba.JOBDURE.toFixed(1)})</Text>
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
    container: {
      flex: 1,
      alignItems: 'center',
    },
    box:{
        flexDirection:"row",
        padding:15
    },
    userNa:{
        width:70
    },
    albaList:{
        flex:1,
        padding:5,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 5, // 테두리 모서리 둥글게 
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
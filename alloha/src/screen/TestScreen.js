
import { Text, ScrollView, SafeAreaView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, {useEffect, useState} from 'react';
import MyCalendar from "../components/Calendar2";
import { FontAwesome, FontAwesome6 } from '@expo/vector-icons';
import { HTTP } from './../util/http';
import { YYYYMMDD2Obj, convertTime, convertTime2 } from "../util/moment";
import moment from "moment";
import { theme } from "../util/color";

export default function TestScreen() {
    const today = convertTime2(moment(), {format : 'YYYY-MM-DD'});
    const [data, setData] = useState([]);
    // [{"CSTCO": 1014, "CSTNA": "글로리맘", "color": "#C80000"}, ]
    const [cstListColor, setCstListColor] = useState([]);
    const [selectDay, setSelectDay] = useState(today)
    const [bottomData, setBottomData] = useState(null);

    const main0205 = async () => {
        await HTTP("GET", "/v1/home/MAIN0205", {userId:"Sksksksk"})
        .then((res)=>{
            setData(res.data.data);
            setCstListColor(res.data.cstList);
        }).catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(()=>{
        main0205();
    }, [])


    const moveToday = () => {
        setSelectDay(today);
        setBottomData({day:getDateObject(today), items:data[today]??[]});
    }

    const onDayTap = (day, items) => {
        setSelectDay(day.dateString);
        setBottomData({day:day, items:items});
    };

    return(
        <View style={{paddingVertical:50}}>
            
            <View style={{flexDirection:"row", backgroundColor:"white", padding:8}}>
                {
                    cstListColor.map((el, idx) => (
                        <View key={idx} style={{flexDirection:"row", paddingHorizontal:8, alignItems:"center"}}>
                            <FontAwesome name="circle" size={16} color={el.color} />
                            <View style={{width:6}} />
                            <Text style={[styles.title, {color:"#111"}]}>{el.CSTNA}</Text>
                        </View>
                    ))
                }
            </View>
            
            <MyCalendar data={data} cstList={cstListColor} selectDay={selectDay} onDayTap={onDayTap}/>
            {
                (!bottomData)?
                    null
                :
                    <BottomCards data={bottomData}/>
            }
        </View>
    );
}

function getDateObject(dateString) {
    const momentDate = moment(dateString);

    return {
        dateString: dateString,
        day: momentDate.date(),
        month: momentDate.month() + 1, // month() returns 0-based month, so we add 1
        timestamp: momentDate.valueOf(),
        year: momentDate.year()
    };
}

const BottomCards = ({data}) => {
    const day = data.day;
    const items = data.items;
    const ymdObj = YYYYMMDD2Obj(day.dateString.replaceAll("-", ""));
    const ymd = ymdObj.ymd.split(".");
    console.log(items);

    return (
        <>
        {
            (items.length == 0)?
                <View style={{padding:16}}>
                    <View style={{backgroundColor:"white", padding:16, borderRadius:10}}>
                        <Text style={styles.day}>{ymd[1]}월 {ymd[2]}일 ({ymdObj.day})</Text>
                        <View style={{height:10}} />
                        <View style={{flexDirection:"row"}}>
                            <Image source={require('../../assets/icons/clock.png')} style={{width:16, height:16, resizeMode:'contain'}} />
                            <View style={{width:8}} />
                            <Text style={styles.title}>근무 계획이 없습니다.</Text>
                        </View>
                    </View>
                </View>
            :(items.length > 0)?
                <View style={{padding:16}}>
                    <View style={{backgroundColor:"white", padding:16, borderRadius:10}}>
                        <Text style={styles.day}>{ymd[1]}월 {ymd[2]}일 ({ymdObj.day})</Text>
                        <View style={{height:10}} />
                        {
                            items.map((el, idx) => (
                                <View key={idx} style={{marginBottom:8, flexDirection:"row"}} >
                                    <View>
                                        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", width:"100%",}}>
                                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                                <FontAwesome name="circle" size={18} color={el.color} />
                                                <View style={{width:6}} />
                                                <Text style={styles.title}>{el.CSTNA}</Text>
                                            </View>

                                            <View style={{borderRadius:20, backgroundColor:"#3479EF", paddingHorizontal:8, paddingVertical:2}}>
                                                <Text style={styles.pillText}>{el.ATTENDANCE}</Text>
                                            </View>
                                        </View>
                                        <View style={{height:8}} />

                                        <View style={{flexDirection:"row"}}>
                                            <FontAwesome name="circle" size={18} color={"white"} />
                                            <View style={{width:6}} />
                                            <View>
                                                {
                                                    (el.SCHDURE > 0) && <Text style={styles.content}>근무계획 - {convertTime(el.SCHSTART, {format:'HH:mm'})} ~ {convertTime(el.SCHEND, {format:'HH:mm'})}</Text> 
                                                }
                                                {
                                                    (el.JOBDURE > 0) && <Text style={styles.content}>근무시간 - {convertTime(el.STARTTIME, {format:'HH:mm'})} ~ {convertTime(el.ENDTIME, {format:'HH:mm'})}</Text>
                                                }
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                </View>
            :
                null
        }
        </>
    );
}

const styles = StyleSheet.create({
    day:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        color: "#333333"
    },
    title:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#555555"
    },
    content:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        color: "#777777"
    },
    pillText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#FFFFFF"
    }
})
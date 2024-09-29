
import { ScrollView, StyleSheet, Text, View,} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWeekList } from '../util/moment';
import axios from 'axios';
import { URL } from "@env";
import { theme } from '../util/color';
import { useIsFocused } from '@react-navigation/native';
import WeekDate, { WeekDate2 } from '../components/schedule/WeekDate';

export default function ScheduleTimeLineScreen({navigation, route}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const { ymd } = route.params;
    
    const [yyyyMMDD, setyyyyMMDD] = useState(ymd);
    const [data, setData] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const week = useSelector((state)=>state.schedule.week);

    const isFocused = useIsFocused();
    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") getdaySchedule();
        }
    }, [isFocused, cstCo, week]);


    const getdaySchedule = async () => {
        const weekList = getWeekList(week);
        const param = {cstCo:cstCo, ymd:yyyyMMDD, ymdTo:weekList[6].format("yyyyMMDD"), ymdFr:weekList[0].format("yyyyMMDD")};
        await axios.get(URL+`/api/v1/DayScheduleSearch`, {params:param})
        .then((res)=>{
            const data = res.data.result;
            setData(res.data.result)
            
        }).catch(function (error) {
            console.log(error);
            alert("일일 근무계획을 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }
    useEffect(()=>{
        const filtered = data.filter(el => el.YMD == yyyyMMDD);
        const userList = []
        for (var i = 0, len = (filtered.length > 5)?filtered.length:5; i < len; i++) {
            if (i < filtered.length) {
                userList.push({userNa:filtered[i].USERNA, userId:filtered[i].USERID, jobDure:filtered[i].JOBDURE});
            }else{
                userList.push({userNa:"", userId:"", jobDure:""});
            }
            
        }

        const scheduleList = Array.from({ length: 24 }, () => Array.from({ length: (filtered.length > 5)?filtered.length:5 }, () => [0, 0]));
        filtered.forEach(item => {
            const idx = userList.findIndex(user => user.userId === item.USERID);
            const today = new Date().toISOString().slice(0, 10);
            const startTime = new Date(`${today}T${item.TimeFr}:00`);
            const endTime = new Date(`${today}T${item.TimeTo}:00`);
            const jobCl = item.JOBCL;
            while (startTime < endTime) {
                const hour = startTime.getHours();
                const minute = startTime.getMinutes();
                scheduleList[hour][idx][Math.floor(minute / 30)] = jobCl;
                startTime.setMinutes(startTime.getMinutes() + 30);
            }
        });
        setUserInfo(userList);
        setDaySchedule(scheduleList)
    }, [data, yyyyMMDD])
    
    useEffect(()=>{
        getdaySchedule();
    }, [])

    useEffect(()=>{
        navigation.setOptions({title:""});
    }, [navigation])

    const scrollViewRef = useRef();
    const totRef = useRef();
    const handleScroll = (event) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        scrollViewRef.current.scrollTo({ y: offsetY, animated: false });
    };
    const handleScrollH = (event) => {
        const offsetY = event.nativeEvent.contentOffset.x;
        totRef.current.scrollTo({ x: offsetY, animated: false });
    }

    return(
        <View style={styles.container}>
            <Text style={fonts.title}>{yyyyMMDD.slice(4,6)}월 근무 계획</Text>
            
                {
                    
                    (userInfo.length == 0)?
                        <View style={[{justifyContent:"center", alignItems:"center", flex:1}]}>
                            <Text style={fonts.title}>데이터가 없습니다.</Text>
                        </View>
                    :   
                    <>
                    <WeekDate2 week={week} selectDay={yyyyMMDD} onTap={(ymd)=>setyyyyMMDD(ymd)}/>
                    <TimeLineMargin />
                    <View style={styles.card}>
                        <View style={{marginTop:8}}>
                            <View style={{flexDirection:"row"}}>
                            <View>
                                <ScrollView scrollEnabled={false} ref={scrollViewRef} scrollEventThrottle={16} showsVerticalScrollIndicator={false} contentContainerStyle={{width:60}}  stickyHeaderIndices={[0]}>
                                    <View style={[styles.timeLineEl, {backgroundColor:"white"}]}></View>
                                    <TimeLineClock ref={scrollViewRef} />
                                </ScrollView>
                            </View>
                            <ScrollView onScroll={handleScrollH} horizontal={true} bounces={false}>
                                <ScrollView onScroll={handleScroll} scrollEventThrottle={16}  stickyHeaderIndices={[0]} bounces={false} contentOffset={{ x: 0, y: 210 }}>
                                    <TimeLineHeader color='white' contents={userInfo} />
                                    <View>
                                        <TimeLineMargin />
                                        {
                                            daySchedule.map((contents, idx)=>{
                                                return (
                                                    <>
                                                        {(idx == 0)?<View style={[ styles.topLine, {alignItems:"center", margin:0}]}></View>:null}
                                                        <TimeLineContents key={idx} contents={contents} />
                                                    </>
                                                );
                                            })
                                        }
                                        <TimeLineMargin />
                                    </View>
                                </ScrollView>
                            </ScrollView>
                            </View>
                    </View>
                </View>
                <View style={{flexDirection:"row", paddingTop:5, paddingHorizontal:5}}>
                    <View style={{width:60, justifyContent:"center", alignItems:"center"}}>
                        <Text style={fonts.time}>합 계</Text>
                    </View>
                    <ScrollView ref={totRef} scrollEventThrottle={16} showsHorizontalScrollIndicator={false}  horizontal={true} bounces={false}>
                        <TimeLineBottom contents={userInfo} />
                    </ScrollView>
                </View>
                </>
                }
        </View>
    )
}

const TimeLineBottom = ({contents}) => {
    return(
        <View style={{flexDirection:"row", backgroundColor:"rgba(0,0,0,0.8)", borderRadius:5}}>
            {contents.map((el, idx)=>{
                return (
                    <>
                    <View key={idx} style={[styles.timeLineEl, {width:60, alignItems:"center"}]}>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={fonts.bottom}>{el.jobDure}</Text>
                    </View>
                    </>
                )
            })}
        </View>
    )
}
const TimeLineHeader = ({contents, color=""}) => {
    return(
        <View style={{flexDirection:"row"}}>
            {contents.map((el, idx)=>{
                return (
                    <View key={idx} style={[styles.timeLineEl, {width:60, alignItems:"center", backgroundColor:color,}]}>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={fonts.alba}>{el.userNa}</Text>
                    </View>
                )
            })}
        </View>
    )
}
const TimeLineContents = ({contents}) => {
    return(
        <View style={{flexDirection:"row"}}>
            {contents.map((el, idx)=>{
                const color = { "2":theme.open, "5":theme.middle, "9":theme.close, "1":theme.etc, }
                const top = (el[0] == 0)?<View style={styles.noLine}/>:<View style={[styles.line, {borderColor:color[el[0]]}]} />;
                const bot = (el[1] == 0)?<View style={styles.noLine}/>:<View style={[styles.line, {borderColor:color[el[1]]}]} />
                return (
                    <View key={idx} style={[styles.timeLineEl, styles.bottomLine,, {width:60, alignItems:"center", margin:0}]}>
                       {top}
                       {bot}
                    </View>
                )
            })}
        </View>
    )
}
const TimeLineClock = () => {
    let startTime = 0;  // 시작 시간
    let endTime = 24;  // 종료 시간
    let timeList = [];
    for (let hour = startTime; hour <= endTime; hour++) {
        let timeStr = `${hour.toString().padStart(2, '0')}:00`;
        timeList.push(timeStr);
    }
    return(
        <View>
            {
                timeList.map((el, idx)=><View key={idx} style={styles.timeLineEl}><Text style={fonts.time}>{el}</Text></View>)
            }
        </View>
    )
}
const TimeLineMargin = () =>{
    return <View style={{height:15}} />
}

const fonts = StyleSheet.create({
    title:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        color: "#111111",
        padding:12
    },
    alba:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        color: "#111111"
    },
    time:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 12,
        color: "#555555"
    },
    bottom:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#FFFFFF"
    }
})
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent:"flex-start", margin:15},
    card:{borderWidth:0, borderRadius:5, flex:1, backgroundColor:"white", paddingTop:3, margin:5},
    timeLineEl:{
        justifyContent:"center",
        alignItems:"center",
        height:30,
        //marginBottom:15
    },
    bottomLine:{
        borderBottomWidth:1,        
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    topLine:{
        borderTopWidth:1,        
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    line:{borderRightWidth:15, height:"53%",},
    noLine:{height:"50%",}
});
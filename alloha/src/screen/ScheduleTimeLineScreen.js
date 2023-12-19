
import { StyleSheet, Text, View,} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWeekList } from '../util/moment';
import axios from 'axios';
import { URL } from "@env";
import { theme } from '../util/color';
import { ScrollView } from 'react-native-gesture-handler';

export default function ScheduleTimeLineScreen({navigation, route}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const { ymd, mmdd } = route.params;

    const [daySchedule, setDaySchedule] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    
    
    const getdaySchedule = async () => {
        const param = {cstCo:cstCo, ymd:ymd};
        await axios.get(URL+`/api/v1/DayScheduleSearch`, {params:param})
        .then((res)=>{
            const data = res.data.result;
            const userList = []
            for (var i = 0, len = (data.length > 5)?data.length:5; i < len; i++) {
                if (i < data.length) {
                    userList.push({userNa:data[i].USERNA, userId:data[i].USERID, jobDure:data[i].JOBDURE});
                }else{
                    userList.push({userNa:"", userId:"", jobDure:""});
                }
                
            }

            const scheduleList = Array.from({ length: 24 }, () => Array.from({ length: (data.length > 5)?data.length:5 }, () => [0, 0]));
            data.forEach(item => {
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
        }).catch(function (error) {
            console.log(error);
            alert("일일 근무계획을 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    
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
            <Text style={{fontSize:20, marginBottom:15}}>{mmdd} 근무 계획</Text>
            
                {
                    
                    (userInfo.length == 0)?
                        <View style={[styles.card, {justifyContent:"center", alignItems:"center"}]}>
                            <Text>데이터가 없습니다.</Text>
                        </View>
                    :   
                    <>
                    
                    <View style={styles.card}>
                        <View>
                            <View style={{flexDirection:"row"}}>
                            <View>
                                <ScrollView scrollEnabled={false} ref={scrollViewRef}  scrollEventThrottle={16}  showsVerticalScrollIndicator={false} contentContainerStyle={{width:60}}  stickyHeaderIndices={[0]}>
                                    <Text style={[styles.timeLineEl, {backgroundColor:"white"}]}></Text>
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
                                                return <TimeLineContents key={idx} contents={contents} />;
                                            })
                                        }
                                        <TimeLineMargin />
                                    </View>
                                </ScrollView>
                            </ScrollView>
                            </View>
                    </View>
                </View>
                <View style={{flexDirection:"row", paddingTop:2}}>
                    <Text style={{width:60}}></Text>
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
        <View style={{flexDirection:"row"}}>
            {contents.map((el, idx)=>{
                return (
                    <View key={idx} style={[styles.timeLineEl, {width:60, alignItems:"center"}]}>
                        <Text ellipsizeMode="tail" numberOfLines={1}>({el.jobDure})</Text>
                    </View>
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
                        <Text ellipsizeMode="tail" numberOfLines={1}>{el.userNa}</Text>
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
                    <View key={idx} style={[styles.timeLineEl, styles.bottomLine, {width:60, alignItems:"center"}]}>
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
                timeList.map((el, idx)=><View key={idx} style={styles.timeLineEl}><Text>{el}</Text></View>)
            }
        </View>
    )
}
const TimeLineMargin = () =>{
    return <View style={{height:15}} />
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent:"flex-start", margin:15},
    card:{borderWidth:1, borderRadius:5, flex:1, backgroundColor:"white", paddingTop:3},
    timeLineEl:{
        justifyContent:"center",
        alignItems:"center",
        height:30,
        //marginBottom:15
    },
    bottomLine:{
        borderTopWidth:0.5,        
        borderBottomWidth:0.5,
    },
    line:{borderRightWidth:10, height:"50.1%",},
    noLine:{height:"50%",}
});
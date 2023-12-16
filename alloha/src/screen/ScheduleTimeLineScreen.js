
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
            //console.log(res.data.result)
            const data = res.data.result;
            const userList = []
            for (var i = 0; i < data.length; i++) userList.push({userNa:data[i].USERNA, userId:data[i].USERID, jobDure:data[i].JOBDURE})
            const scheduleList = Array.from({ length: 24 }, () => Array.from({ length: data.length }, () => [0, 0]));
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
        navigation.setOptions({title:""})
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
            <Text style={{fontSize:16, marginBottom:15}}>{mmdd} 근무 계획</Text>
            
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
                                <ScrollView scrollEnabled={false} ref={scrollViewRef}  scrollEventThrottle={16}  showsVerticalScrollIndicator={false} contentContainerStyle={{width:80}}  stickyHeaderIndices={[0]}>
                                    <Text style={[styles.timeLineEl, {backgroundColor:"white"}]}></Text>
                                    <TimeLineClock ref={scrollViewRef} />
                                </ScrollView>
                            </View>
                            <ScrollView onScroll={handleScrollH} horizontal={true} bounces={false}>
                                <ScrollView onScroll={handleScroll} scrollEventThrottle={16}  stickyHeaderIndices={[0]}  bounces={false}>
                                    <TimeLineHeader color='white' contents={userInfo} />
                                    <View>
                                        {
                                            daySchedule.map((contents, idx)=>{
                                                if(idx < 7) return null;
                                                return <TimeLineContents key={idx} contents={contents} />;
                                            })
                                        }
                                    </View>
                                </ScrollView>
                            </ScrollView>
                            </View>
                    </View>
                </View>
                <View style={{flexDirection:"row", paddingTop:2}}>
                    <Text style={{width:80}}></Text>
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
                    <View key={idx} style={[styles.timeLineEl, {width:50, alignItems:"center"}]}>
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
                    <View key={idx} style={[styles.timeLineEl, {width:50, alignItems:"center", backgroundColor:color,}]}>
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
                const color = {
                    "2":theme.open,
                    "5":theme.middle,
                    "9":theme.close,
                    "1":theme.etc,
                }
                const top = (el[0] == 0)?<View style={styles.noLine}/>:<View style={[styles.line, {borderColor:color[el[0]]}]} />;
                const bot = (el[1] == 0)?<View style={styles.noLine}/>:<View style={[styles.line, {borderColor:color[el[1]]}]} />
                return (
                    <View key={idx} style={[styles.timeLineEl, {width:50, alignItems:"center"}]}>
                       {top}
                       {bot}
                    </View>
                )
            })}
        </View>
    )
}
const TimeLineClock = () => {
    let startTime = 7;  // 시작 시간
    let endTime = 24;  // 종료 시간
    let timeList = [];
    for (let hour = startTime; hour <= endTime; hour++) {
        let timeStr = `${hour.toString().padStart(2, '0')}:00`;
        timeList.push(timeStr);
    }
    return(
        <View>
            {
                timeList.map((el, idx)=><View style={styles.timeLineEl}><Text key={idx}>{el}</Text></View>)
            }
        </View>
    )
}


const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent:"flex-start", margin:15},
    card:{borderWidth:1, borderRadius:5, flex:1, backgroundColor:"white", paddingTop:3},
    timeLineEl:{
        justifyContent:"center",
        alignItems:"center",
        height:30,
        marginBottom:-1,
        //borderWidth:1
        //marginBottom:15
    },
    line:{borderRightWidth:10, height:"50%",},
    noLine:{height:"50%",}
});
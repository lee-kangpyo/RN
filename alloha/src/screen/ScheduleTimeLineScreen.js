
import { ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View,} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getWeekList } from '../util/moment';
import axios from 'axios';
import { URL } from "@env";
import { lightenColor, theme } from '../util/color';
import { useIsFocused } from '@react-navigation/native';
import WeekDate, { WeekDate2 } from '../components/schedule/WeekDate';
import { useAlert } from '../util/AlertProvider';
import LayerPopUP from '../components/common/LayerPopUP';
import { calculateDifference, formatTimeObject, parseTimeString } from '../util/timeParser';
import { HTTP } from '../util/http';
import TimePicker_24 from '../components/library/TimePicker_24';
import DragAndDropCard from '../components/library/Draggerble';

export default function ScheduleTimeLineScreen({navigation, route}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const { ymd } = route.params;
    
    const [yyyyMMDD, setyyyyMMDD] = useState(ymd);
    const [data, setData] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const [userInfo, setUserInfo] = useState([]);
    const week = useSelector((state)=>state.schedule.week);
    const isFocused = useIsFocused();

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
                const user = filtered[i];
                userList.push({userNa:user.USERNA, userId:user.USERID, jobDure:user.JOBDURE, cstCo:user.CSTCO, jobCl:user.JOBCL, sTime:user.TimeFr, eTime:user.TimeTo, ymdFr:user.YMD, ymdTo:""});
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
    
    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") getdaySchedule();
        }
    }, [isFocused, cstCo, week]);

    useEffect(()=>{
        getdaySchedule();
    }, [])

    useEffect(()=>{
        navigation.setOptions({title:""});
    }, [navigation])

    // 스크롤 핸들러
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
    // 스크롤 핸들러
    // 막대 그래프 탭
    const [step, setStep] = useState(-1);
    const [selectUser, setSelectUser] = useState({});
    const openLayer = (user) => {
        setSelectUser(user);
        setStep(0);
    }
    // 막대 그래프 롱 프레스
    const [position, setPosition] = useState({x:0, y:0});
    const [showDragEl, setDragEl] = useState(false)
    const LongTap = (el, x, y) => {
        setPosition({x:x-80, y:y - 150})
        setTrace({x:x, y:y})
        setSelectUser(el);
        setDragEl(true);
    }
    // 드래그 위치 추적
    const [trace, setTrace] = useState({x:0, y:0})
    const [traceYmd, setTraceYmd] = useState("")
    useEffect(()=>{
        if(!showDragEl){
            console.log(traceYmd);
            console.log(selectUser);
        }
    }, [showDragEl])
    return(
        <>
            {
                (showDragEl)?
                    <View style={{ position:"absolute", height:"100%", width:"100%", zIndex:10 }}>
                        <DragAndDropCard user={selectUser} pos={position} setTrace={setTrace} hide={showDragEl} setHide={setDragEl} />
                    </View>
                :null
            }
            
           <Layer step={step} setStep={setStep} users={data} selectUser={selectUser} week={week} reload={getdaySchedule}/>
            <View style={[styles.container]}>
                <Text style={fonts.title}>{yyyyMMDD.slice(4,6)}월 근무 계획</Text>
                {
                    (userInfo.length == 0)?
                        <View style={[{justifyContent:"center", alignItems:"center", flex:1}]}>
                            <Text style={fonts.title}>데이터가 없습니다.</Text>
                        </View>
                    :   
                    <>
                    
                    <WeekDate2 week={week} selectDay={yyyyMMDD} onTap={(ymd)=>setyyyyMMDD(ymd)} position={trace} enterEl={setTraceYmd} isAnime={showDragEl}/>
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
                                    <TimeLineHeader color='white' contents={userInfo} onTap={(user)=>openLayer(user)}/>
                                    <View>
                                        <TimeLineMargin />
                                        {
                                            daySchedule.map((contents, idx)=>{
                                                return (
                                                    <>
                                                        {(idx == 0)?<View style={[ styles.topLine, {alignItems:"center", margin:0}]}></View>:null}
                                                        <TimeLineContents key={idx} contents={contents} userInfo={userInfo} onTap={(el)=>openLayer(el)} onLongTap={(el, x, y)=>LongTap(el, x, y)}/>
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
                    <ScrollView scrollEnabled={false} ref={totRef} scrollEventThrottle={16} showsHorizontalScrollIndicator={false}  horizontal={true} bounces={false}>
                        <TimeLineBottom contents={userInfo} />
                    </ScrollView>
                </View>
                </>
                }
            </View>
        </>
    )
}

const Layer = ({step, users, selectUser, setStep, week, reload}) => {
    const {showConfirm} = useAlert();
    const albaSch = async (url, params) => {
        await HTTP("POST", url, params)
        .then((res)=>{
            setStep(-1);
            reload()
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    
    const SelectMenu = () => {//0
        const userNa = selectUser.userNa;
        return (
            <View style={{padding:5}}>
                <Text style={fonts.selTxt}>{userNa}</Text>
                <View style={{height:8}}/>
                <TouchableOpacity onPress={()=>setStep(1)} style={styles.selBtn}>
                    <Text style={fonts.selTxt}>근무 시간 변경</Text>
                </TouchableOpacity>
                <View style={{height:8}}/>
                <TouchableOpacity onPress={()=>setStep(2)} style={styles.selBtn}>
                    <Text style={fonts.selTxt}>근무 요일 변경</Text>
                </TouchableOpacity>
                <View style={{height:8}}/>
                <TouchableOpacity onPress={()=>setStep(-1)} style={styles.selBtn}>
                    <Text style={fonts.selTxt}>닫기</Text>
                </TouchableOpacity>
            </View>
        )
    }
    const ChangeDay = () => {//2
        const weekList = getWeekList(week);
        const dateList = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"]
        const [selectDay, setSelectDay] = useState(selectUser.ymdFr);
        const next = () => {
            const dulpleCheck = users.filter( el => el.YMD == selectDay && el.USERID == selectUser.userId );
            if(selectUser.ymdFr == selectDay){ //이미 저장된 날짜 insert 안함
                setStep(-1);
            }else if( dulpleCheck.length > 0){
                const duple = dulpleCheck[0];
                showConfirm("중복", `선택한 요일에 ${duple.USERNA}님의 계획이 이미 존재합니다. 선택한 요일의 계획을 덮어쓰시겠습니까?`, ()=>{
                    albaSch("/api/v2/commute/MoveAlbaSch", {...selectUser, changeDay:selectDay});
                    })
            }else{
                albaSch("/api/v2/commute/MoveAlbaSch", {...selectUser, changeDay:selectDay});
            }
        }
        return (
            <View style={{padding:5}}>
                <Text style={fonts.selTxt}>근무 요일 변경</Text>
                <View style={{height:8}}/>
                {
                    weekList.map((el, idx)=>{
                        const ymd = el.format("yyyyMMDD");
                        const dd = el.format('dd');
                        const color = (dd == "일")?"#ff0000":(dd == "토")?"#0000ff":"#111111";
                        const color2 = (dd == "일")?"#ff0000":(dd == "토")?"#0000ff":"#111111";
                        return (
                            <>
                            <TouchableOpacity key={idx} onPress={()=>setSelectDay(ymd)} style={[styles.selBtn, {borderColor:(selectDay == ymd)?color:lightenColor(color, 80)}]}>
                                <Text style={[fonts.date, {color:(selectDay == ymd)?color:lightenColor(color, 80)}]}>{el.format('yyyy년 MM월 DD일')}{dateList[idx]}</Text>
                            </TouchableOpacity>
                            <View style={{height:8}}/>
                            </>
                        )
                    })
                }
                <View style={{height:8}}/>
                <BottomBtnSet next={next}/>
            </View>
        )
    }
    const ChangeTime = () => {//1
        const [sTime, setStime] = useState(selectUser.sTime);
        const [eTime, setEtime] = useState(selectUser.eTime);
        const [mode, setMode] = useState("");
        const hours = calculateDifference(sTime, eTime);
        const next = () => albaSch("/api/v2/commute/AlbaSchSave", {...selectUser, sTime, eTime});
        return (
            <>
            {
                (mode == "")?
                    <View style={{padding:5}}>
                    <Text style={fonts.selTxt}>근무시간 변경</Text>
                    <View style={{flexDirection:"row", paddingVertical:15, alignItems:"center"}}>
                        <TouchableOpacity onPress={()=>setMode("S")} style={{padding:10}}>
                            <Text style={[fonts.selTxt, {textDecorationLine:"underline"}]}>{sTime}</Text>
                        </TouchableOpacity>
                        <Text style={fonts.selTxt}> - </Text>
                        <TouchableOpacity onPress={()=>setMode("E")} style={{padding:10}}>
                            <Text style={[fonts.selTxt, {textDecorationLine:"underline"}]}>{eTime}</Text>
                        </TouchableOpacity>
                        <View style={{width:8}} />
                        <Text style={[fonts.selTxt, {color:(hours < 0)?theme.error:"#111"}]}>{hours}시간</Text>
                    </View>
                    {
                        (hours < 0)?
                            <View style={{marginTop:-15}}>
                                <Text style={{color:theme.error}}>근무시간을 확인해주세요.</Text>
                                <View style={{height:8}} />
                                <TouchableOpacity style={[styles.selBtn, {flex:1}]} onPress={()=>setStep(-1)}>
                                    <Text style={fonts.selTxt}>취소</Text>
                                </TouchableOpacity>
                            </View>
                        :<BottomBtnSet next={next}/>
                    }
                    
                </View>
                :(mode == "S")?
                    <View style={[styles.workBox, {marginVertical:15}]}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <TouchableOpacity onPress={()=>setMode("")}>
                                <Text style={[fonts.selTxt, {textDecorationLine:"underline"}]}>뒤로</Text>
                            </TouchableOpacity>
                            <View style={{flex:1}}>
                                <Text style={[fonts.selTxt, {textAlign:"center"}]}>시작시간</Text>
                            </View>
                        </View>
                        <View style={{height:8}} />
                        <TimePicker_24
                            refresh={false}
                            initValue={parseTimeString(sTime)}
                            itemHeight={40}
                            onTimeChange={(time) => {
                                const fTime = formatTimeObject(time);
                                setStime(fTime);
                            }}
                        />
                    </View>
                :(mode == "E")?
                    <View style={[styles.workBox, {marginVertical:15}]}>
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <TouchableOpacity onPress={()=>setMode("")} >
                                <Text style={[fonts.selTxt, {textDecorationLine:"underline"}]}>뒤로</Text>
                            </TouchableOpacity>
                            <View style={{flex:1}}>
                                <Text style={[fonts.selTxt, {textAlign:"center"}]}>종료시간</Text>
                            </View>
                        </View>
                        <TimePicker_24
                            refresh={false}
                            initValue={parseTimeString(eTime)}
                            itemHeight={40}
                            onTimeChange={(time) => {
                                const fTime = formatTimeObject(time);
                                setEtime(fTime);
                            }}
                        />
                    </View>
                :null
            }
            </>
        )
    }
    const BottomBtnSet = ({next}) => {
        const onConfirm = () => next();
        return (
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity style={[styles.selBtn, {flex:1}]} onPress={()=>setStep(-1)}>
                    <Text style={fonts.selTxt}>취소</Text>
                </TouchableOpacity>
                <View style={{width:8}}/>
                <TouchableOpacity style={[styles.selBtn, {flex:1}]} onPress={onConfirm}>
                    <Text style={fonts.selTxt}>확인</Text>
                </TouchableOpacity>
            </View>
        )
    }
    return (
        <>
            {
                (step > -1)?
                    <LayerPopUP body={(step==0)?<SelectMenu />:(step==1)?<ChangeTime/>:(step==2)?<ChangeDay/>:null} />
                :null
            }
        </>
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
const TimeLineHeader = ({contents, color="", onTap}) => {
    return(
        <View style={{flexDirection:"row"}}>
            {contents.map((el, idx)=>{
                return (
                    <TouchableOpacity key={idx} onPress={()=>onTap(el)} style={[styles.timeLineEl, {width:60, alignItems:"center", backgroundColor:color,}]}>
                        <Text ellipsizeMode="tail" numberOfLines={1} style={fonts.alba}>{el.userNa}</Text>
                    </TouchableOpacity>
                )
            })}
        </View>
    )
}
const TimeLineContents = ({contents, userInfo, onTap, onLongTap}) => {
    return(
        <View style={{flexDirection:"row"}}>
            {contents.map((el, idx)=>{
                const user = userInfo[idx] 
                const color = { "2":theme.open, "5":theme.middle, "9":theme.close, "1":theme.etc, }
                return (
                    <View key={idx} style={[styles.timeLineEl, styles.bottomLine,, {width:60, alignItems:"center", margin:0}]}>
                        { (el[0] == 0)?<View style={styles.noLine}/>:<TouchableOpacity onPress={()=>onTap(user)} onLongPress={(e)=>onLongTap(user, e.nativeEvent.pageX, e.nativeEvent.pageY)} activeOpacity={1} style={[styles.line, {borderColor:color[el[0]]}]} /> }
                        { (el[1] == 0)?<View style={styles.noLine}/>:<TouchableOpacity onPress={()=>onTap(user)} onLongPress={(e)=>onLongTap(user, e.nativeEvent.pageX, e.nativeEvent.pageY)} activeOpacity={1} style={[styles.line, {borderColor:color[el[1]]}]} /> }
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
    },
    selTxt:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 16,
        color: "#111"
    },
    date:{
        fontFamily: "SUIT-ExtraBold",
        fontWeight: "800",
    },
})
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent:"flex-start", margin:15},
    card:{borderWidth:0, borderRadius:5, flex:1, backgroundColor:"white", paddingTop:3, margin:5},
    timeLineEl:{
        justifyContent:"center",
        alignItems:"center",
        height:30,
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
    noLine:{height:"50%",},
    selBtn:{
        alignItems:"center",
        padding:10,
        borderRadius:5,
        borderWidth:1,
    },
    box:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:5,
        margin:5,
        borderWidth: 1, // 테두리 두께
        borderColor: 'white', // 테두리 색상
        borderRadius: 5, // 테두리 모서리 둥글게 
        alignItems:"center",
        borderWidth:1
    },

});
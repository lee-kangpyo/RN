
import { StyleSheet, TouchableOpacity, Text, View, ScrollView, TextInput, Keyboard, Platform } from 'react-native';
import { theme } from '../../util/color';
import React, { memo, useEffect, useRef, useState } from 'react';
import { convertTime2, strToDate } from '../../util/moment';
import { useAlert } from '../../util/AlertProvider';
import moment from 'moment';
import WheelPicker from '../library/WheelPicker';
import { MaterialIcons } from '@expo/vector-icons';
import { adjustTime, calculateDifference, calculateTimeDifferenceStr, formatTimeObject, parseTimeString } from '../../util/timeParser';
import { safeToLocaleString } from '../../util/utils';
import { useSelector } from 'react-redux';
import { HTTP } from '../../util/http';
import TimePicker_24 from '../library/TimePicker_24';

// 알바 홈화면, 점주 결과화면에서 사용
//[{"brkDure": 1, "cstCo": 1014, "cstNa": "글로리맘", "endTime": "16:00", "jobCl": "G", "startTime": "09:00", "userId": "Sksksksk", "ymd": "20240701"}, 
// {"brkDure": 0, "cstCo": 1014, "cstNa": "글로리맘", "endTime": "16:00", "jobCl": "S", "startTime": "09:00", "userId": "Sksksksk", "ymd": "20240701"}]
export default function  ChangeWorkTime2 ({wageInfo, dayJobInfo, setIsOpen, onConfirm, reload}) {
    const userId = useSelector((state) => state.login.userId);
    const { showAlert, showConfirm } = useAlert();
    // 근무 정보
    const [_dayJobInfo, setDayJobInfo] = useState(dayJobInfo.find(el => el.jobCl == "G"))
    
    
    //
    // 대타 / 일반
    const [type, setType] = useState("G");
    
    // 시급
    const [wage, setWage] = useState("");
    // 휴게시간
    const [restTime, setRestTime] = useState(_dayJobInfo.brkDure ?? 0);
    // 출근시간
    const[sTime, setSTime] = useState((_dayJobInfo.startTime == "-")?"09:00":_dayJobInfo.startTime);
    //const[sTime, setSTime] = useState(_dayJobInfo.startTime);
    // 퇴근 시간
    const[eTime, setETime] = useState((_dayJobInfo.endTime == "-")?"16:00":_dayJobInfo.endTime);
    //const[eTime, setETime] = useState(_dayJobInfo.endTime);
    // 근무 시간
    const [workHour, setWorkHOur] = useState((sTime == "-")?"7":calculateDifference(sTime, eTime));
    //const [workHour, setWorkHOur] = useState(6);
    // 모두 닫기:-1 근무시간 활성화:0 출근시간 활성화:1, 퇴근시간 활성화:2, 
    const [isSelectStime, setSelectStime] = useState(-1);
    // 색상 정보
    const sColor = (isSelectStime == 1)?theme.primary:"#999";
    const eColor = (isSelectStime == 2)?theme.primary:"#999";
    const rColor = (isSelectStime == 3)?theme.primary:"#999";
    

    useEffect(()=>{
        const type = "G";
        const jobInfo = dayJobInfo.find(el => el.jobCl == type);
        setDayJobInfo(jobInfo);
        setType(type);
        setWorkHOur((jobInfo.startTime == "-")?"7":calculateDifference(jobInfo.startTime, jobInfo.endTime));
        setSTime((jobInfo.startTime == "-")?"09:00":jobInfo.startTime);
        setETime((jobInfo.endTime == "-")?"16:00":jobInfo.endTime);
        setRestTime(jobInfo.brkDure ?? 0);
        setSelectStime(-1);
        setWage((jobInfo.tmp)?safeToLocaleString(wageInfo.WAGE, "0"):safeToLocaleString(jobInfo.wage, "0"))
    }, [dayJobInfo]);
    
    // 확인 버튼 클릭 이벤트
    const onPressConfirm = () => {
        inputRef.current.blur();
        if(eTime >= sTime){
            // 알바 호출
            // exec PR_PLYC03_JOBCHECK 'AlbaJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure
            // P_CLS		nvarchar(20)	-- 프로세스 구분
            // , @P_YMDFR	nchar(8)	-- 조회시작일
            // , @P_YMDTO	nchar(8)	-- 조회종료일
            // , @P_CSTCO	int		-- 점포코드: 특정 점포만 재생성 할 때 입력
            // , @P_USERID	nvarchar(20)	-- 사용자코드: 특정 사용자만 재생성 할 때 입력
            // , @P_CL1	nvarchar(20)
            // , @P_CL2	nvarchar(20)
            // , @P_JOBCL	nvarchar(20)
            // , @P_BRKDURE
            const param = {cstCo:_dayJobInfo.cstCo, userId:_dayJobInfo.userId, useId:_dayJobInfo.userId, ymd:_dayJobInfo.ymd, sTime:sTime, eTime:eTime, jobCl:type, brkDure:restTime, wage:wage.replaceAll(",", "")};
            
            onConfirm(param);
            //setIsOpen(false);
        }else{
            showAlert("알림", "출근 시간은 퇴근 시간보다 나중일수 없습니다.")
        }
    }
    
    const [sRefresh, setSRefresh] = useState(false);
    const [eRefresh, setERefresh] = useState(false);
    const previousValues = useRef({ sTime, eTime, workHour });
    
    // 여기가 주요 state 관리 포인트
    useEffect(()=>{
        const prev = previousValues.current;
        if (prev.sTime != sTime || prev.workHour != workHour) {
            console.log('sTime has changed:', prev.sTime, '->', sTime);
            const time = adjustTime(sTime, workHour);
            if(calculateTimeDifferenceStr(sTime, time.createTime) < 0){
                let time;
                if(sTime == "23:00"){
                    time = adjustTime("23:00", workHour * -1)
                }else {
                    time = adjustTime("23:30", workHour * -1)
                }
                //const time = adjustTime("23:00", workHour * -1);
                setSTime(time.createTime);
                setETime(time.baseTime);
                setSRefresh(!sRefresh);
            }else{
                if(eTime != time.createTime){
                    setETime(time.createTime);
                }
            }
        }else if (prev.eTime != eTime) {
            console.log('eTime has changed:', prev.eTime, '->', eTime);
            const time = adjustTime(eTime, workHour * -1);
            if(calculateTimeDifferenceStr(time.createTime, eTime) < 0){
                let time;
                if(eTime == "00:00"){
                    time = adjustTime("00:00", workHour)
                }else {
                    time = adjustTime("00:30", workHour)
                }
                //const time = adjustTime("00:00", workHour);
                setSTime(time.baseTime);
                setETime(time.createTime);
                setERefresh(!eRefresh);
            }else{
                if(sTime != time.createTime){
                    setSTime(time.createTime);
                }
            }
        }
        previousValues.current = { sTime, eTime, workHour };
    }, [sTime, eTime, workHour]);


    
    const tapTouch = (num) => {
        if(isSelectStime == num){
            setSelectStime(-1);
        }else{
            setSelectStime(num);
        }
    }

    const changeType = (type) => {
        jobInfo = dayJobInfo.find(el => el.jobCl == type);
        setDayJobInfo(jobInfo);
        setType(type);
        setWorkHOur((jobInfo.startTime == "-")?"7":calculateDifference(jobInfo.startTime, jobInfo.endTime));
        setSTime((jobInfo.startTime == "-")?"09:00":jobInfo.startTime);
        setETime((jobInfo.endTime == "-")?"16:00":jobInfo.endTime);
        setRestTime(jobInfo.brkDure ?? 0);
        setSelectStime(-1);
    }


     // 키보드 높이를 저장하는 스테이트(IOS 적용)
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const os = Platform.OS;
    const [shrink, setShrink] = useState(false)
    const inputRef = useRef(null);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
          'keyboardDidShow',
          (event)=>{
            setShrink(true)
            if(os == "ios"){
                setKeyboardHeight(event.endCoordinates.height - 50);
            }
          }
        );
        const keyboardDidHideListener = Keyboard.addListener(
          'keyboardDidHide',
          ()=>{
            setShrink(false)
            if(os == "ios"){
                setKeyboardHeight(0);
            }
            inputRef.current.blur();
          }
        );
    
        // 컴포넌트가 언마운트 될 때 리스너 해제
        return () => {
          keyboardDidShowListener.remove();
          keyboardDidHideListener.remove();
        };
      }, []);
    const dayAbsent = async () => {
        // showConfirm("결근", "선택하신 날짜를 결근을 입력하시겠습니까?", async () => {
            const dayJob = dayJobInfo[0];
            const param = {ymd:dayJob.ymd, userId:dayJob.userId, cstCo:dayJob.cstCo, iUserId:userId, useYn:"Y"};
            await HTTP("POST", "/api/v2/commute/absent", param)
            .then((res)=>{
                reload();
            }).catch(function (error) {
                console.log(error);
            })            
        // });
    }
    return(
        <>
            <View style={[{padding:8}]}>
                <Text style={fonts.sheetTitle}>{(_dayJobInfo.cstNa)?_dayJobInfo.cstNa+" ":""}근무 시간 입력</Text>
                <View style={{height:20}} />
                {/*일반, 대타, 결근*/}
                <TypeContainer type={type} changeType={changeType}/>
                
                {
                    (wageInfo.JOBTYPE == "M")?
                    //(false)?
                        <View style={[styles.miniBtn, styles.row, {borderColor:sColor, flex:1, justifyContent:"space-between", alignItems:"center", paddingVertical:15}]}>
                            <Text style={[fonts.sheetcontent]}>월급</Text>
                            <View style={{ width:150, padding:4, flexDirection:"row"}}>
                                <Text style={[fonts.sheetcontent2, {flex:1, textAlign:"right"}]}>{safeToLocaleString(wageInfo.WAGE, 0)}</Text>
                                <Text style={[fonts.sheetcontent2, {alignSelf:"center", marginLeft:8}]}>원</Text>
                            </View>
                        </View>
                    :
                        <View style={[styles.miniBtn, styles.row, {borderColor:sColor, flex:1, justifyContent:"space-between", alignItems:"center", paddingVertical:15}]}>
                            <Text style={[fonts.sheetcontent]}>시급</Text>
                            <View style={{borderBottomWidth:1 , borderBottomColor:"#aaa", width:100, padding:4, flexDirection:"row"}}>
                                <TextInput ref={inputRef} style={[fonts.sheetcontent2, {flex:1, textAlign:"right"}]} value={wage} onChange={(v)=>{console.log(safeToLocaleString(v.nativeEvent.text, "0"));setWage(safeToLocaleString(v.nativeEvent.text, "0"))}} keyboardType='number-pad' />
                                <Text style={[fonts.sheetcontent2, {alignSelf:"center", marginLeft:8}]}>원</Text>
                            </View>
                        </View>
                }
                <View style={styles.sep} />
                {
                    (shrink)?
                        null
                    :
                        <>
                        {/*근무시간*/}
                        <WorkTime workTime={workHour} setWorkTime={setWorkHOur} isSelectStime={isSelectStime} tapTouch={tapTouch}/>
                        {/*출근시간*/}
                        <TouchableOpacity onPress={()=>tapTouch(1)} style={[styles.miniBtn, styles.row, {borderColor:sColor, flex:1, justifyContent:"space-between", alignItems:"center", paddingVertical:15}]}>
                            <Text style={[fonts.sheetcontent]}>출근시간</Text>
                            <View style={[styles.row, {alignItems:"center"}]}>
                                <Text style={[fonts.sheetcontent2]}>{sTime}</Text>
                                <View style={{width:4}}/>
                                <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
                            </View>
                        </TouchableOpacity>
                        {
                            (isSelectStime == 1)?
                                <View style={[styles.workBox, {marginVertical:15}]}>
                                    <TimePicker_24
                                        refresh={sRefresh}
                                        initValue={parseTimeString(sTime)}
                                        itemHeight={40}
                                        onTimeChange={(time) => {
                                            const sTime = formatTimeObject(time);
                                            setSTime(sTime);
                                        }}
                                    />
                                </View>
                            :
                                null
                        }
                        {/*퇴근시간*/}
                        <TouchableOpacity onPress={()=>tapTouch(2)} style={[styles.miniBtn, styles.row, {borderColor:eColor, flex:1, justifyContent:"space-between", alignItems:"center", paddingVertical:15}]}>
                            <Text style={[fonts.sheetcontent]}>퇴근시간</Text>
                            <View style={[styles.row, {alignItems:"center"}]}>
                                <Text style={[fonts.sheetcontent2]}>{eTime}</Text>
                                <View style={{width:4}}/>
                                <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
                            </View>
                        </TouchableOpacity>
                        {
                            (isSelectStime == 2)?
                                <View style={[styles.workBox, {marginVertical:15}]}>
                                    <TimePicker_24
                                        refresh={eRefresh}
                                        initValue={parseTimeString(eTime)}
                                        itemHeight={40}
                                        onTimeChange={(time) => {
                                            const eTime = formatTimeObject(time);
                                            setETime(eTime);
                                        }}
                                    />
                                </View>
                                //<InlineTimeSelection date={sTime} setDate={setSTime} />
                                // <TimeSelection date={sTime} setDate={setSTime}/>
                            :
                                null
                        }

                        {/*휴게시간*/}
                        <View style={{justifyContent:"space-between", width:"100%",}}>
                            <TouchableOpacity onPress={()=>tapTouch(3)} style={[styles.miniBtn, styles.row, {borderColor:rColor, flex:1, justifyContent:"space-between", paddingVertical:15}]}>
                                <Text style={[fonts.sheetcontent]}>휴게시간</Text>
                                <View style={[styles.row, {alignItems:"center"}]}>
                                    <Text style={[fonts.sheetcontent2]}>{restTime} 시간</Text>
                                    <View style={{width:4}}/>
                                    <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
                                </View>
                                
                            </TouchableOpacity>
                        </View>
                        {
                            (isSelectStime == 3)?
                            <>
                                <View style={[styles.workBox, {marginVertical:15, padding:44}]}>
                                    <View style={{flex:1, flexDirection:"row"}}>
                                        <RestTimeSelection restTime={restTime} setRestTime={setRestTime} />
                                    </View>
                                </View>
                            </>
                            :null
                        }
                        <View style={styles.sep} />
                        <View style={{flexDirection:"row", justifyContent:"flex-start", marginTop:8}}>
                            <TouchableOpacity onPress={dayAbsent}>
                                <Text style={{textDecorationLine:"underline", color:theme.primary, }}>결근입력</Text>
                            </TouchableOpacity>
                        </View>
                        </>
                        
                }
                
                <View style={styles.mv} />
            </View>

            {/*하단버튼*/}
            <View style={styles.row}>
                <TouchableOpacity onPress={()=>{inputRef.current.blur();setType("G");setIsOpen(false);}} style={styles.cancel}>
                    <Text style={fonts.cancel}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressConfirm} style={styles.confirm}>
                    <Text style={fonts.confirm}>확인</Text>
                </TouchableOpacity>
            </View>
            <View style={{height:keyboardHeight}} />
        </>
    )
}

// 일반/대타
const TypeContainer = ({type, changeType}) => {
    const gBoxColor = (type == "G")?"#555555":"#ddd";
    const gTextColor = (type == "G")?"#555555":"#999";
    const sBoxColor = (type == "S")?"#555555":"#ddd";
    const sTextColor = (type == "S")?"#555555":"#999";
    return (
        <View style={{justifyContent:"space-between", width:"100%"}}>
            <View style={{flexDirection:"row",}}>
                <TouchableOpacity onPress={()=>changeType("G")} style={[styles.row, styles.miniBtn2, {flex:1, justifyContent:"center", borderColor:gBoxColor}]}>
                    <Text style={[fonts.typeText, {color:gTextColor}]}>일반</Text>
                </TouchableOpacity>
                <View style={{width:8}} />
                <TouchableOpacity onPress={()=>changeType("S")} style={[styles.row, styles.miniBtn2, {flex:1, justifyContent:"center", borderColor:sBoxColor}]}>
                    <Text style={[fonts.typeText, {color:sTextColor}]}>대타</Text>
                </TouchableOpacity>
            </View>
            <View style={{height:8}} />
            <View style={{backgroundColor:"#f1f1f1", padding:5, borderRadius:5, alignItems:"center"}}>
                <Text style={fonts.hint}>대타는 주휴수당에 포함되지 않습니다.</Text>
            </View>
        </View>
    )
}
// 근무시간
const WorkTime = ({workTime, setWorkTime, isSelectStime, tapTouch}) => {
    const works = workTime.toString().split(".");
    const [hour, setHour] = useState(works[0] ?? 0);
    const [min, setMin] = useState(works[1] ?? 0);
    useEffect(()=>{
        setWorkTime(hour+"."+min);
    }, [hour, min])

    useEffect(()=>{
        setHour(works[0] ?? 0);
        setMin(works[1] ?? 0);
    }, [workTime])

    const hColor = (isSelectStime == 0)?theme.primary:"#999";
    const items = [];
    for (let i = 0; i <= 23; i += 1) { items.push(i); }
    
    return (
        <View style={{justifyContent:"space-between", width:"100%"}}>
            <TouchableOpacity onPress={()=>tapTouch(0)} style={[styles.miniBtn, styles.row, {borderColor:hColor, flex:1, justifyContent:"space-between", paddingVertical:15}]}>
                <Text style={[fonts.sheetcontent]}>근무시간</Text>
                <View style={[styles.row, {alignItems:"center",}]}>
                    <Text style={[fonts.sheetcontent2]}>{workTime} 시간</Text>
                    <View style={{width:4}}/>
                    <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
                </View>
            </TouchableOpacity>
            {
                (isSelectStime == 0)?
                    <View style={[styles.workBox,]}>
                        <View style={[styles.row,]}>
                            <WheelPicker
                                initValue={Number(hour)}
                                itemHeight={40}
                                items={items}
                                onItemChange={(item) => {
                                    setHour(item);
                                }}
                                containerStyle={[{width:80}]}
                            />
                        <View style={[{borderColor:"white", justifyContent:"center"}]}>
                        <Text style={[fonts.workTime, {fontSize:20, marginHorizontal:5, fontFamily: "SUIT-Bold", fontSize: 24,}]}>.</Text>
                        </View>
                            <WheelPicker
                                initValue={Number(min)}
                                itemHeight={40}
                                items={[0, 5]}
                                onItemChange={(item) => {
                                    setMin(item);
                                }}
                                containerStyle={[{width:80}]}
                            />
                        </View>
                    </View>
                :
                null
            }
        </View>
    )
}

// 휴게 시간
const RestTimeSelection = ({restTime, setRestTime}) => {
    const HourBox = memo(({ time, selBoxStyle, selTextStyle }) => {
        return (
            <>
            <TouchableOpacity onPress={()=>setRestTime(time)} style={[timeSelection.box, selBoxStyle]}>
                <Text style={[timeSelection.text, selTextStyle]}>{time}</Text>
            </TouchableOpacity>
            <View style={timeSelection.W8} />
            </>
        );
    }, (prevProps, nextProps) => {
        return prevProps.selBoxStyle === nextProps.selBoxStyle && prevProps.selBoxStyle === nextProps.selTextStyle;
    });

    return(
        <View style={timeSelection.container}>
            {
                [0, 0.5, 1, 1.5, 2].map((hour, idx) => <HourBox key={idx} time={hour} selBoxStyle={(restTime == hour)?timeSelection.selBox:null} selTextStyle={(restTime == hour)?timeSelection.selText:null}/>)
            }
        </View>
    )
}


// 버튼으로 만든 출근 시간 - 안씀
const TimeSelection = ({date, setDate}) => {
    const timeStart = "06:00";
    const timeEnd = "23:00";

    function generateTimeList(start, end) {
        const timeList = [];
        let [startHour, startMinute] = start.split(':').map(Number);
        let [endHour, endMinute] = end.split(':').map(Number);

        while (startHour < endHour || (startHour === endHour && startMinute <= endMinute)) {
            const formattedTime = `${String(startHour).padStart(2, '0')}:${String(startMinute).padStart(2, '0')}`;
            timeList.push(formattedTime);
            startMinute += 30;
            if (startMinute >= 60) {
                startMinute -= 60;
                startHour += 1;
            }
        }
        return timeList;
    }

    const timeList = generateTimeList(timeStart, timeEnd);

    const TimeBox = memo(({ time, selBoxStyle, selTextStyle }) => {
        return (
            <>
            <TouchableOpacity onPress={()=>setDate(time)} style={[timeSelection.box, selBoxStyle]}>
                <Text style={[timeSelection.text, selTextStyle]}>{time}</Text>
            </TouchableOpacity>
            <View style={timeSelection.W8} />
            </>
        );
    }, (prevProps, nextProps) => {
        return prevProps.selBoxStyle === nextProps.selBoxStyle && prevProps.selBoxStyle === nextProps.selTextStyle;
    });

    return(
        <ScrollView contentContainerStyle={{}} style={{height:150,}}>
            <View style={timeSelection.container}>
                {
                    timeList.map((time, idx) => <TimeBox key={idx} time={time} selBoxStyle={(time == date)?timeSelection.selBox:null} selTextStyle={(time == date)?timeSelection.selText:null}/>)
                }
            </View>
        </ScrollView>
    )
}
// 버튼으로 만든 퇴근 시간 - 안씀 - 오류 수정 안함.
const TimeSelection2 = ({sTime, date, setDate, selHour, setSelHOur}) => {
    // 숫자 버튼(TimeBox) 클릭시 호출됨
    const onTap = (additionalHours) => {
        // Moment 객체 생성
        let time = moment(sTime, "HH:mm");
        // 시간을 더함
        time.add(additionalHours, 'hours');
        // 결과 출력
        setSelHOur(additionalHours);
        setDate(time.format("HH:mm"));
    };

    // 숫자 버튼 렌더링 함수
    const TimeBox = memo(({ time, selBoxStyle, selTextStyle }) => {
        return (
            <>
            <TouchableOpacity onPress={()=>setDate(time)} style={[timeSelection.box, selBoxStyle]}>
                <Text style={[timeSelection.text, selTextStyle]}>{time}</Text>
            </TouchableOpacity>
            <View style={timeSelection.W8} />
            </>
        );
    }, (prevProps, nextProps) => {
        return prevProps.selBoxStyle === nextProps.selBoxStyle && prevProps.selBoxStyle === nextProps.selTextStyle;
    });

    // 시간을 생성([0.5, 1, 1.5 .... 23.5, 24]) 하는데 sTime시간과 합칠때 23.5가 넘어가지 않는 숫자까지 생성 
    function generateTimeList(startTime) {
        let numList = [];
        let currentTime = moment(startTime, "HH:mm").add(30, "minutes");
    
        while (currentTime.format("HH:mm") !== "23:30") {
            numList.push(currentTime.diff(moment(startTime, "HH:mm"), "hours", true));
            currentTime.add(30, "minutes");
        }
    
        numList.push(currentTime.diff(moment(startTime, "HH:mm"), "hours", true)); // 23:30 추가
        return numList;
    }
    // 생성된 시간 리스트
    var numList = generateTimeList(sTime);
    return(
        <ScrollView contentContainerStyle={{}} style={{height:150}}>
            <View style={timeSelection.container}>
                {
                    numList.map((time, idx) => <TimeBox key={idx} time={time} selBoxStyle={(time == selHour)?timeSelection.selBox:null} selTextStyle={(time == selHour)?timeSelection.selText:null}/>)
                }
            </View>
        </ScrollView>
    )
}

const timeSelection = StyleSheet.create({
    container:{flexDirection:"row", overflow:"hidden", justifyContent:"center", alignContent:"center", alignItems:"center", flexWrap: 'wrap',},
    box:{borderRadius:20, paddingHorizontal:8, paddingVertical:4, borderWidth:1, marginBottom:4, borderColor:"#999", minWidth:40, alignItems:"center"},
    selBox:{backgroundColor:"#555555", borderColor:"#555555"},
    text:{color:"#999", fontSize:12},
    selText:{color:"white"},
    W8:{width:4}
})

const fonts = StyleSheet.create({
    btn:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#3479EF"
    },
    sheetTitle:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111111",
        alignSelf:"center"
    },
    sheetcontent:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 15,
        color: "#555555"
    },
    sheetcontent2:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#333333",
    },
    hint:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#999"
    },
    cancel:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#999999"
    },
    confirm:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#FFFFFF"
    },
    workTime:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111"
    },
    typeText:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
    }
})

  
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:10, backgroundColor:"#F6F6F8" },
    btn:{
        alignItems:"center",
        borderRadius: 10,
        backgroundColor: "#DAE5F9",
        width:"100%"
    },
    row:{
        flexDirection:"row"
    },
    timePicker:{
        alignItems:"center",
        borderRadius: 15,
        backgroundColor: "#F7F7F7",
        marginVertical:20,
    },
    cancel:{
        flex:1,
        paddingVertical:17,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
        marginRight:9,
        alignItems:"center",
    },
    confirm:{
        flex:3,
        paddingVertical:17,
        borderRadius: 10,
        backgroundColor: "#3479EF",
        alignItems:"center",
    },
    miniBtn2:{borderWidth:1, borderRadius:8, padding:12},
    miniBtn:{borderWidth:0, borderRadius:5, padding:8},
    title:{
        fontFamily:"SUIT-Bold",
        marginBottom:4,
    },
    workBox:{
        width:"100%",
        alignItems:"center",
        backgroundColor:"#F7F7F7",
        borderWidth:0,
        borderColor:"#ddd",
        borderRadius:15,
    },
    mv:{
        marginVertical:7
    },
    sep:{
        width:"100%",
        height:1,
        backgroundColor:"#999"
    }
});
  
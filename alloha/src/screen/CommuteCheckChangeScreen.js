
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Keyboard, Alert, Platform, Image } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { YYYYMMDD2Obj } from '../util/moment';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { theme } from './../util/color';
import CustomButton from '../components/common/CustomButton';
import { HTTP } from '../util/http';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

export default function CommuteCheckChangeScreen({navigation, route}) {

    const { dayJobInfo, isScheduled=false } = route.params;
    const [isExistReq, setIsExistReq] = useState(null);
    const userId = useSelector((state)=>state.login.userId);
    const isFocused = useIsFocused();
    useEffect(()=>{
        if(isFocused){
            getDayJobReq();
        }
    }, [isFocused]);

    
    const date = YYYYMMDD2Obj(dayJobInfo.ymd);
    const getDayJobReq = async () => {
        if(dayJobInfo.jobNo == "999999"){
            setStartTime("00:00");
            setEndTime("00:00");
            setReason("");
            setIsExistReq(true);
        }else{
            await HTTP("GET", "/api/v1/commute/getDayJobReq", {jobNo:dayJobInfo.jobNo})
            .then((res)=>{
                if(res.data.resultCode == "00"){
                    // 근무 변경 기록이 있을때
                    console.log(res.data)
                    if(res.data.rows > 0){
                        const data = res.data.result[0];
                        setStartTime(data.STIME.split('T')[1].slice(0, 5));
                        setEndTime(data.ETIME.split('T')[1].slice(0, 5));
                        setReason(data.REASON);
                        setIsExistReq(true)
                    }else{
                        //인정 요청할 때
                        
                        if(isScheduled){
                            setStartTime(dayJobInfo.schFrom);
                            setEndTime(dayJobInfo.schTo);
                            setReason("인정 요청");
                        }else{
                            setStartTime(dayJobInfo.startTime);
                            setEndTime(dayJobInfo.endTime);
                            setReason("");
                        }
                        setIsExistReq(false)
                    }
                }
            }).catch(function (error) {
                console.log(error);
                alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
            })
        }
    }

    const reqCommuteChange = async (params) => {
        await HTTP("POST", "/api/v1/commute/reqCommuteChange", params)
        .then((res)=>{
            if(res.data.resultCode == 0){
                Alert.alert(
                    '요청 성공',          // 타이틀
                    '입력하신 근무 기록 변경 요청 완료했습니다.',  // 메시지
                    [
                      {
                        text: '확인', // 버튼 텍스트
                        onPress: () => navigation.goBack(),
                      },
                    ],
                    { cancelable: false } // 취소 버튼 비활성화 여부
                  );
                
            }else{
                alert(res.data.result);
            }
            
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    const onConfirm = () => {
        if(dayJobInfo.startTime == startTime && dayJobInfo.endTime == endTime){
            alert(`${dayJobInfo.startTime} ~ ${dayJobInfo.endTime} → ${startTime} ~ ${endTime}\n근무 시간과 변경 요청 시간이 동일합니다. 다시 한번 확인해 주세요.`)
            return;
        }
        if(reason == ""){
            alert(`요청 사유가 입력되지 않았습니다.`)
            return;
        }
        const ymd = dayJobInfo.ymd;
        const sTime = convertDate(ymd, startTime);
        const eTime = convertDate(ymd, endTime);
        const startRealTime = (dayJobInfo.attendence == "결근")?sTime:convertDate(ymd, dayJobInfo.startTime);
        const endRealTime = (dayJobInfo.attendence == "결근")?eTime:convertDate(ymd, dayJobInfo.endTime);
        const jobNo = (dayJobInfo.attendence == "결근")?0:dayJobInfo.jobNo;
        const params = {curStat:dayJobInfo.reqStat, cstCo:dayJobInfo.cstCo, userId:userId, jobNo:jobNo, sTime:sTime, eTime:eTime, reason:reason, reqStat:"R", startTime:startRealTime, endTime:endRealTime};
        //console.log(params)
        reqCommuteChange(params);
    }

    const convertDate = (dateString, timeString) => {
        if(timeString == "-") return "";
        // 'YYYYMMDD'에서 년, 월, 일을 추출
        const year = parseInt(dateString.substring(0, 4), 10);
        const month = parseInt(dateString.substring(4, 6), 10) - 1; // 월은 0부터 시작하므로 1을 빼줌
        const day = parseInt(dateString.substring(6, 8), 10);

        // 'HH:mm'에서 시간과 분을 추출
        const [hours, minutes] = timeString.split(':').map(num => parseInt(num, 10));
        // Date 객체 생성
        const targetDate = new Date(year, month, day, hours, minutes);
        const formattedString = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')} ${String(targetDate.getHours()).padStart(2, '0')}:${String(targetDate.getMinutes()).padStart(2, '0')}`;
        
        return formattedString;
    }
    const [statNa, setStatNa] = useState(dayJobInfo.attendence);
    const [startTime, setStartTime] = useState("00:00");
    const [endTime, setEndTime] = useState("00:00");
    const [reason, setReason] = useState("");
    const [type, setType] = useState(0);
    const [isKeyboardShow, setIsKeyboardShow] = useState(false);


    useEffect(()=>{
        if(startTime == dayJobInfo.schFrom && endTime == dayJobInfo.schTo){
            setStatNa("정상");
        }else{
            setStatNa(dayJobInfo.attendence);
        }
    }, [startTime, endTime]);
    useEffect(() => {
        let keyboardDidShowListener;
        let keyboardDidHideListener;
      
        if (type === 0) {
          keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
              setIsKeyboardShow(true);
            }
          );
      
          keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
              setIsKeyboardShow(false);
            }
          );
        } else {
          // type이 0이 아닐 때, 리스너 제거
          keyboardDidShowListener?.remove();
          keyboardDidHideListener?.remove();
        }
      
        // 이벤트 리스너 정리
        return () => {
          keyboardDidShowListener?.remove();
          keyboardDidHideListener?.remove();
        };
      }, [type]);
    return (
        <View style={styles.container}>
            {
            (type == 0)?
                <>
                <View style={[styles.row, {marginTop:14, marginBottom:22, justifyContent:"space-between"}]}>
                    <View style={styles.row}>
                        <Text style={fonts.title}>{date.ymd} </Text> 
                        <Text style={[{color:date.color}, fonts.title]}>({date.day}) </Text>
                    </View>
                </View>
                
                {
                    (isKeyboardShow)?
                    <>
                        <View style={styles.row}>
                            <View style={{marginRight:15, justifyContent:"center"}}>
                                <Text style={[styles.title]}>변경 시간</Text>
                            </View>
                            {
                                (isExistReq != null)?
                                    <View style={[styles.row]}>
                                        <Text style={fonts.main}>{startTime}</Text>
                                        <Text style={fonts.main}> ~ </Text>
                                        <Text style={fonts.main}>{endTime}</Text>
                                    </View>
                                :null
                            }
                            
                        </View>
                    </>
                    :
                    <>
                        <View style={styles.cardContainer}>
                            <View style={[styles.row, styles.topBar]}>
                                <Text style={[fonts.topText, {fontWeight:"bold"}]}>계획 시간</Text>
                                <View style={styles.row}>
                                    <Text style={fonts.topText2}>{dayJobInfo.schFrom}</Text>
                                    <Text style={fonts.topText2}>~</Text>
                                    <Text style={fonts.topText2}>{dayJobInfo.schTo}</Text>
                                </View>
                            </View>
                            <View style={[styles.row, styles.pill]}>
                                <Text style={[fonts.pillText,{color:(statNa == "정상")?"black":"#777777"}]}>{statNa}</Text>
                            </View>
                            <View style={[styles.row, {marginBottom:10}]}>
                                {
                                    (dayJobInfo.attendence == "결근")?
                                            <View style={styles.mainPill}>
                                                <Text style={[fonts.main, {color:"red"}]}>결근</Text>
                                            </View>
                                        :
                                            <View style={[styles.row, styles.mainPill]}>
                                                <Text style={fonts.main}>{(dayJobInfo.startTime=="-")?"00:00":dayJobInfo.startTime}</Text>
                                                <Text style={fonts.main}> ~ </Text>
                                                <Text style={fonts.main}>{(dayJobInfo.endTime=="-")?"00:00":dayJobInfo.endTime}</Text>
                                            </View>
                                }
                                
                                <View style={{justifyContent:"center", paddingHorizontal:19}}>
                                    <Image source={require('../../assets/icons/arrow.png')} style={{width:12, height:12,}} />
                                </View>  
                                {
                                    (isExistReq != null)?
                                        <View style={[styles.row, styles.mainPill]}>
                                            <Text style={fonts.main}>{startTime}</Text>
                                            <Text style={fonts.main}> ~ </Text>
                                            <Text style={fonts.main}>{endTime}</Text>
                                            
                                        </View>  
                                    : null
                                }
                            </View>
                            <TouchableOpacity onPress={()=>setType(1)}>
                                <Text style={fonts.sub}>수정</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    
                }
                <View style={{width:"100%"}}>
                    <Text style={[fonts.reason, {marginBottom:10}]}>요청 사유</Text>
                    <ScrollView contentContainerStyle={styles.text}>
                        <TextInput 
                            onChange={(e)=>setReason(e.nativeEvent.text)}
                            value={reason}
                            placeholder="사유를 입력해주세요."
                            multiline={true}	
                            maxLength={300}
                        />
                    </ScrollView>
                </View>
                </>
            :(type == 1)?
                <TimeContainer setType={setType} startController={{time:startTime, setTime:setStartTime}} endController={{time:endTime, setTime:setEndTime}} />
            :
                null
            }
            {
                (type == 0)?<View style={{flex:1, width:"100%", justifyContent:"flex-end"}}><CustomButton onClick={onConfirm} text={"점주승인요청"} style={[styles.btn, ]} fontStyle={fonts.btnText}/></View>:null
            }
            
        </View>
    );
}

const TimeContainer = ({setType, startController, endController}) => {
    const TimeModifier = ({time, setTime, isSumit}) => {
        const [H, M] = time.split(":")
        const [Hour, setHour] = useState(H);
        const [hColor, setHColor] = useState(theme.link);
        const [Min, setMin] = useState(M);
        const [mColor, setMColor] = useState(theme.link);

        useEffect(()=>{
            var result = 0
            if(/^(0[1-9]|1\d|2[0-4])$/.test(Hour)){
                setHColor(theme.link);
                result++
            }else{
                setHColor(theme.error);
            }

            var result2 = 0
            if(/^(00|30)$/.test(Min)){
                setMColor(theme.link);
                result2++;
            }else{
                setMColor(theme.error);
            }

            if(result * result2 == 1){
                setTime(`${Hour}:${Min}`)
                //isCorrect(true);
                isSumit.current = true;
            }else{
                isSumit.current = false;
            }
        }, [Hour, Min])
        return (
            <View style={styles.row}>
                <TextInput
                    style={[styles.timeFont, {width:45, borderWidth:1, borderRadius:5, borderColor:theme.grey, color:hColor, padding:5, marginBottom:10, textAlign:"center"}]}
                    onChangeText={(hour) => setHour(hour)}
                    //onBlur={(e) => changeTime({hour:e.nativeEvent.text})}
                    value={Hour}
                    maxLength={2}
                    returnKeyType="done"
                    keyboardType="number-pad"
                /> 
                <Text style={[styles.timeFont, {borderWidth:0, borderRadius:5, borderColor:theme.grey, color:theme.link, padding:5, marginBottom:10}]}>:</Text>
                <TextInput
                    style={[styles.timeFont, {width:45, borderWidth:1, borderRadius:5, borderColor:theme.grey, color:mColor, padding:5, marginBottom:10, textAlign:"center"}]}
                    onChangeText={(min) => setMin(min)}
                    //onBlur={(e) => changeTime({min:e.nativeEvent.text})}
                    value={Min}
                    maxLength={2}
                    returnKeyType="done"
                    keyboardType="number-pad"
                />            
            </View>
        )
    }

    const [stime, setStime] = useState("00:00");
    const [etime, setEtime] = useState("00:00");
    
    const sTime = useRef("00:00");
    const sTimeCorrect = useRef(true);
    const eTime = useRef("00:00");
    const eTimeCorrect = useRef(true);

    useEffect(()=>{
        setStime(startController.time);
        setEtime(endController.time)
        sTime.current = startController.time
        eTime.current = endController.time
    }, [])
    
    const onConfirm = () => {
        if(sTimeCorrect.current * eTimeCorrect.current){
            startController.setTime(sTime.current);
            endController.setTime(eTime.current);
            setType(0);
        }else{
            alert("빨갛게 표시된 값을 다시 입력해주세요\n시 : 01-24 범위의 값입니다.\n분 : '00' 또는 '30' 만 입력가능합니다.")
        }
        
    }

    const setstime = (time) => {
        sTime.current = time;
        setStime(time);
    }

    const setetime = (time) => {
        eTime.current = time;
        setEtime(time)
    }
    return(
        <>
        
            <View style={{flexDirection:"row", marginBottom:15}}>
                <TouchableOpacity onPress={()=>setType(0)} style={[styles.row, styles.timeBtn, {paddingRight:20}]}>
                    <Ionicons name="caret-back-outline" size={24} color="white" />
                    <Text style={styles.timeBtnText}>돌아가기</Text>
                </TouchableOpacity>
            </View>
            
            <View style={[styles.row, {alignItems:"center"}]}>
                <Text>시작</Text>
                <View style={[styles.row, {flex:1, alignItems:"center", justifyContent:"space-evenly"}]}>
                    <Text style={styles.timeFont}>{startController.time}</Text> 
                    <FontAwesome name="long-arrow-right" size={24} color="black" />
                    <TimeModifier time={stime} setTime={setstime} isSumit={sTimeCorrect}/>
                </View>
            </View>
            
    
            <View style={[styles.row, {alignItems:"center", marginBottom:15}]}>
                <Text>종료</Text>
                <View style={[styles.row, {flex:1, alignItems:"center", justifyContent:"space-evenly"}]}>
                    <Text style={styles.timeFont}>{endController.time}</Text>
                    <FontAwesome name="long-arrow-right" size={24} color="black" />
                    <TimeModifier time={etime} setTime={setetime} isSumit={eTimeCorrect}/>
                </View>
            </View>
            <View style={{flexDirection:"row", justifyContent:"flex-end"}}>
                <TouchableOpacity style={styles.timeBtn} onPress={onConfirm}>
                    <Text style={styles.timeBtnText}>확정</Text>
                </TouchableOpacity>
            </View>
            
        </>
    )
}
const fonts=StyleSheet.create({
    title:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        fontWeight: "800",
        color: "#111111"
    },
    reason:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        color: "#111111"
    },
    btnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        fontStyle: "normal",
        color: "#FFFFFF"
    },
    topText:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        fontWeight: "800",
        color: "#111111"
    },
    topText2:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        fontWeight: "800",
        fontStyle: "normal",
        lineHeight: 14,
        letterSpacing: -1,
        textAlign: "right",
        color: "#777777"
    },
    pillText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#777777"
    },
    main:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 16,
        fontWeight: "800",
        textAlign: "center",
        color: "#111111"
    },
    sub:{
        textDecorationLine:"underline",
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        color: "#3479EF"
    },
})
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:16 },
    row:{ flexDirection:"row" },
    
    topText:{
        fontSize:13,
        color:"white"
    },
    
    textInput:{
        borderWidth:1,
    },
    text:{ 
        padding:15,
        height: 240,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    },
    card:{
        borderWidth:1,
        borderRadius:5,
        width:"100%",
        marginBottom:15, 
        padding:15,
        
    },
    mainCard:{
        backgroundColor:"lightblue"
    },
    timeFont:{
        fontSize:24,
        color:"grey",
    },
    timeBtn:{padding:10, borderRadius:15, backgroundColor:theme.link},
    timeBtnText:{fontSize:16, color:"white"},
    btn:{
        height:52,
        alignItems:"center",
        borderRadius: 10,
        backgroundColor: "#3479EF",
        width:"100%",
        marginTop:10,
    },
    cardContainer:{
        backgroundColor:"white", 
        borderRadius:10, 
        alignItems:"center", 
        paddingBottom:20, 
        marginBottom:30, 
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
                elevation:2,
            }
        })
    },
    topBar:{
        paddingHorizontal:16,
        paddingVertical:12,   
        alignItems:"center",
        marginBottom:20,
        justifyContent:"space-between", 
        width:"100%", 
        borderBottomWidth:1,
        borderBottomColor:"rgba(238, 238, 238, 1.0)"
    },
    pill:{
        paddingHorizontal:8,
        paddingVertical:3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
        marginBottom:9,
    },
    mainPill:{
        minWidth:100,
        paddingHorizontal:15,
        paddingVertical:10,
        borderRadius: 10,
        backgroundColor: "#F6F8FD",
        borderWidth: 1,
        borderColor: "rgba(227, 234, 246, 1.0)"
    }
});
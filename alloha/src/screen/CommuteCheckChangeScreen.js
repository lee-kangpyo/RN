
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Keyboard, Alert } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { YYYYMMDD2Obj } from '../util/moment';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { theme } from './../util/color';
import CustomButton from '../components/common/CustomButton';
import { HTTP } from '../util/http';
import { useSelector } from 'react-redux';

export default function CommuteCheckChangeScreen({navigation, route}) {
    const { dayJobInfo } = route.params;
    //const [YYYYMMDD, setYYYYMMDD] = useState(ymd);
    const userId = useSelector((state)=>state.login.userId);
    useEffect(()=>{
        navigation.setOptions({title:"근무기록변경"})
    }, [navigation])
    const date = YYYYMMDD2Obj(dayJobInfo.ymd);

    const reqCommuteChange = async (params,) => {
    
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

        // N:insert D, A:update
        // const param = {curStat:"N", cstCo:'1010', userId:'Sksksksk', sChkNo:'1', eChkNo:'2', sTime:"12:00", eTime:"18:00", reason:"사유입력", reqStat:"R"};
        console.log(dayJobInfo.ymd)

        console.log(convertDate(dayJobInfo.ymd, startTime))
        const params = {curStat:dayJobInfo.reqStat, cstCo:dayJobInfo.cstCo, userId:userId, jobNo:dayJobInfo.jobNo, sTime:convertDate(dayJobInfo.ymd, startTime), eTime:convertDate(dayJobInfo.ymd, endTime), reason:reason, reqStat:"R"};
        //console.log(params)
        reqCommuteChange(params);
    }

    const convertDate = (dateString, timeString) => {

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



    const [startTime, setStartTime] = useState(dayJobInfo.startTime);
    const [endTime, setEndTime] = useState(dayJobInfo.endTime);
    const [reason, setReason] = useState("");
    const [type, setType] = useState(0);
    const [isKeyboardShow, setIsKeyboardShow] = useState(false);
    
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
            <View style={styles.card}>
            {
            (type == 0)?
                <>
                <View style={[styles.row, {marginBottom:15}]}>
                    <Text style={styles.title}>{date.ymd.split(".")[1]}월 {date.ymd.split(".")[2]}일 </Text> 
                    <Text style={[{color:date.color}, styles.title]}>({date.day}) </Text>
                </View>
                <View style={[styles.row, {marginBottom:5}]}>
                    <Text style={styles.title}>상태 : </Text>
                    <Text style={styles.title}>{dayJobInfo.attendence}</Text>
                </View>
                {
                    (isKeyboardShow)?
                    <>
                        <View style={styles.row}>
                            <View style={{marginRight:15, justifyContent:"center"}}>
                                <Text style={[styles.title]}>변경 시간</Text>
                            </View>
                            <View style={[styles.row]}>
                                <Text style={styles.main}>{startTime}</Text>
                                <Text style={styles.main}> ~ </Text>
                                <Text style={styles.main}>{endTime}</Text>
                            </View>
                        </View>
                    </>
                    :
                    <>
                    <View style={[styles.row, {justifyContent:"flex-start", paddingLeft:50}]}>
                        <Text style={styles.main}>{dayJobInfo.startTime}</Text>
                        <Text style={styles.main}> ~ </Text>
                        <Text style={styles.main}>{dayJobInfo.endTime}</Text>
                    </View>
                    <View style={[styles.row, {justifyContent:"center"}]}>
                        <FontAwesome name="long-arrow-right" size={24} color="black" />
                    </View>  
                    <View style={[styles.row, {marginBottom:5, justifyContent:"flex-end", paddingRight:50}]}>
                        <Text style={styles.main}>{startTime}</Text>
                        <Text style={styles.main}> ~ </Text>
                        <Text style={styles.main}>{endTime}</Text>
                        <TouchableOpacity onPress={()=>setType(1)} style={{alignSelf:"center", marginLeft:10}}>
                            <FontAwesome name="pencil-square-o" size={30} color={theme.link}/>
                        </TouchableOpacity>
                    </View>  
                    </>
                }
                <Text style={[styles.title, {marginBottom:5}]}>요청 사유</Text>
                <ScrollView contentContainerStyle={styles.text}>
                    <TextInput 
                        onChange={(e)=>setReason(e.nativeEvent.text)}
                        value={reason}
                        placeholder="사유를 입력해주세요."
                        multiline={true}	
                        maxLength={300}
                    />
                </ScrollView>
                </>
            :(type == 1)?
                <TimeContainer setType={setType} startController={{time:startTime, setTime:setStartTime}} endController={{time:endTime, setTime:setEndTime}} />
            :
                null
            }
            </View>
            {
                (type == 0)?<CustomButton onClick={onConfirm} text={"점주승인요청"} style={[styles.btn, {alignSelf:"flex-end"}]}/>:null
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
                            style={[styles.timeFont, {width:40, borderWidth:1, borderRadius:5, borderColor:theme.grey, color:hColor, padding:5, marginBottom:10}]}
                            onChangeText={(hour) => setHour(hour)}
                            //onBlur={(e) => changeTime({hour:e.nativeEvent.text})}
                            value={Hour}
                            maxLength={2}
                            returnKeyType="done"
                            keyboardType="number-pad"
                        /> 
                        <Text style={[styles.timeFont, {borderWidth:0, borderRadius:5, borderColor:theme.grey, color:theme.link, padding:5, marginBottom:10}]}>:</Text>
                        <TextInput
                            style={[styles.timeFont, {width:40, borderWidth:1, borderRadius:5, borderColor:theme.grey, color:mColor, padding:5, marginBottom:10}]}
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
    }

    const setetime = (time) => {
        eTime.current = time;
        
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

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:10 },
    row:{ flexDirection:"row" },
    title:{fontSize:16},
    main:{fontSize:24},
    textInput:{
        borderWidth:1,
    },
    text:{ 
        padding:15,
        backgroundColor:"yellow",
        height:180,
    },
    card:{
        borderWidth:1,
        borderRadius:5,
        width:"100%",
        marginBottom:15, 
        padding:15,
    },
    timeFont:{
        fontSize:24,
        color:"grey",
    },
    timeBtn:{padding:10, borderRadius:15, backgroundColor:theme.link},
    timeBtnText:{fontSize:16, color:"white"},
});
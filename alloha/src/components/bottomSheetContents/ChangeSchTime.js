
import { StyleSheet, TouchableOpacity, Text, View, ScrollView } from 'react-native';
import { theme } from '../../util/color';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useAlert } from '../../util/AlertProvider';
import moment from 'moment';
import WheelPicker from '../library/WheelPicker';
import TimePicker_24 from '../library/TimePicker_24';
import { MaterialIcons } from '@expo/vector-icons';
import { adjustTime, calculateDifference, calculateTimeDifferenceStr, formatTimeObject, parseTimeString } from '../../util/timeParser';


export default function  ChangeSchTime ({item, setIsOpen, onConfirm}) {
    // const { showAlert } = useAlert();
    // // 근무 정보
    // const _dayJobInfo = dayJobInfo;
    // // 대타 / 일반
    // const [type, setType] = useState("G");
    // // 휴게시간
    // const [restTime, setRestTime] = useState(0);
    // // 출근시간
    // const[sTime, setSTime] = useState((_dayJobInfo.startTime == "-")?"09:00":_dayJobInfo.startTime);
    // //const[sTime, setSTime] = useState(_dayJobInfo.startTime);
    // // 퇴근 시간
    // const[eTime, setETime] = useState((_dayJobInfo.endTime == "-")?"16:00":_dayJobInfo.endTime);
    // //const[eTime, setETime] = useState(_dayJobInfo.endTime);
    // // 근무 시간
    // const [workHour, setWorkHOur] = useState((sTime == "-")?"":calculateDifference(sTime, eTime));
    // //const [workHour, setWorkHOur] = useState(6);
    // // 모두 닫기:-1 근무시간 활성화:0 출근시간 활성화:1, 퇴근시간 활성화:2, 
    // const [isSelectStime, setSelectStime] = useState(-1);
    
    // // 색상 정보
    // const sColor = (isSelectStime == 1)?theme.primary:"#999";
    // const eColor = (isSelectStime == 2)?theme.primary:"#999";
    // const rColor = (isSelectStime == 3)?theme.primary:"#999";

    
    // // 확인 버튼 클릭 이벤트
    // const onPressConfirm = () => {
    //     if(eTime > sTime){
    //         // 점주 호출
    //         // exec PR_PLYB02_WRKMNG 'JumjoWorkSave', 1014, 'mangdee22', '20240509', '07:00', '16:00'
    //         // @CLS 구분 : JumjoWorkSave
    //         // @CSTCO : 점포코드
    //         // @USERID : 알바ID
    //         // @YMD : 일자 'YYYYMMDD'
    //         // @CL1 : 시작시간 'HH:MM'
    //         // @CL2 : 종료시간 'HH:MM'

    //         // 알바 호출
    //         // exec PR_PLYC03_JOBCHECK 'AlbaJobSave', @ymd, '', @cstCo, @userId, @sTime, @eTime, @jobCl, @brkDure
    //         // P_CLS		nvarchar(20)	-- 프로세스 구분
    //         // , @P_YMDFR	nchar(8)	-- 조회시작일
    //         // , @P_YMDTO	nchar(8)	-- 조회종료일
    //         // , @P_CSTCO	int		-- 점포코드: 특정 점포만 재생성 할 때 입력
    //         // , @P_USERID	nvarchar(20)	-- 사용자코드: 특정 사용자만 재생성 할 때 입력
    //         // , @P_CL1	nvarchar(20)
    //         // , @P_CL2	nvarchar(20)
    //         // , @P_JOBCL	nvarchar(20)
    //         // , @P_BRKDURE
    //         const param = {cstCo:_dayJobInfo.cstCo, userId:_dayJobInfo.userId, useId:_dayJobInfo.userId, ymd:_dayJobInfo.ymd, sTime:sTime, eTime:eTime, jobCl:type, brkDure:restTime};
    //         onConfirm(param);
    //         setIsOpen(false);
    //     }else{
    //         showAlert("알림", "출근 시간은 퇴근 시간보다 나중일수 없습니다.")
    //     }
    // }
    
    // const [sRefresh, setSRefresh] = useState(false);
    // const [eRefresh, setERefresh] = useState(false);
    // const previousValues = useRef({ sTime, eTime, workHour });
    
    // // 여기가 주요 state 관리 포인트
    // useEffect(()=>{
    //     const prev = previousValues.current;
    //     if (prev.sTime != sTime || prev.workHour != workHour) {
    //         console.log('sTime has changed:', prev.sTime, '->', sTime);
    //         const time = adjustTime(sTime, workHour);
    //         if(calculateTimeDifferenceStr(sTime, time.createTime) < 0){
    //             const time = adjustTime("24:00", workHour * -1)
    //             setSTime(time.createTime);
    //             setETime(time.baseTime);
    //             setSRefresh(!sRefresh)
    //         }else{
    //             if(eTime != time.createTime){
    //                 setETime(time.createTime);
    //             }
    //         }
    //     }else if (prev.eTime != eTime) {
    //         console.log('eTime has changed:', prev.eTime, '->', eTime);
    //         const time = adjustTime(eTime, workHour * -1);
    //         if(calculateTimeDifferenceStr(time.createTime, eTime) < 0){
    //             const time = adjustTime("00:00", workHour)
    //             setSTime(time.baseTime);
    //             setETime(time.createTime);
    //             setERefresh(!eRefresh)
    //         }else{
    //             if(sTime != time.createTime){
    //                 setSTime(time.createTime);
    //             }
    //         }
    //     }
    //     previousValues.current = { sTime, eTime, workHour };
    // }, [sTime, eTime, workHour]);


    
    // const tapTouch = (num) => {
    //     if(isSelectStime == num){
    //         setSelectStime(-1)
    //     }else{
    //         setSelectStime(num)
    //     }
    // }


    // 0: 모두 닫기, 1:sTime 열기, 2:eTime 열기
    const [openTime, setOpenTime] = useState(0)
    const [sTime, setSTime] = useState(item.sTime ?? "09:00")
    const [eTime, setETime] = useState(item.eTime ?? "16:00")
    useEffect(()=>{
        setSTime((item.sTime == "")?"09:00":item.sTime);
        setETime((item.eTime == "")?"16:00":item.eTime);
        setOpenTime(0);
    }, [item])
    return(
        <>
            <Text style={fonts.sheetTitle}>근무 계획 입력</Text>
            <View style={{height:8}} />
            <View style={{backgroundColor:"#f1f1f1", padding:5, borderRadius:5, alignItems:"center"}}>
                <Text style={fonts.hint}>근무 계획을 미리 입력하세요.</Text>
            </View>
            <TimeClock label={"출근시간"} time={sTime} setTime={setSTime} mode={1} isOpen={openTime == 1} setIsOpen={setOpenTime}/>
            <TimeClock label={"퇴근시간"} time={eTime} setTime={setETime} mode={2} isOpen={openTime == 2} setIsOpen={setOpenTime}/>
            {/*하단버튼*/}
            <View style={styles.row}>
                <TouchableOpacity onPress={()=>setIsOpen(false)} style={styles.cancel}>
                    <Text style={fonts.cancel}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{onConfirm({sTime:sTime, eTime:eTime});setIsOpen(false);}} style={styles.confirm}>
                    <Text style={fonts.confirm}>확인</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

const TimeClock = ({label, time, setTime, mode, isOpen, setIsOpen}) => {
    const sRefresh = false;
    const onTap = () => {
        if(isOpen){
            setIsOpen(0)
        }else{
            setIsOpen(mode)
        }
        
    }
    return (
        <>
        <TouchableOpacity onPress={onTap} style={[styles.miniBtn, styles.row, {flex:1, justifyContent:"space-between", alignItems:"center", paddingVertical:15}]}>
            <Text style={[fonts.sheetcontent]}>{label}</Text>
            <View style={[styles.row, {alignItems:"center"}]}>
                <Text style={[fonts.sheetcontent2]}>{time}</Text>
                <View style={{width:4}}/>
                <MaterialIcons name="keyboard-arrow-down" size={22} color="black" />
            </View>
        </TouchableOpacity>
        {
            (isOpen)?
                <View style={[styles.workBox, {marginVertical:15}]}>
                    <TimePicker_24
                        refresh={sRefresh}
                        initValue={parseTimeString(time)}
                        itemHeight={40}
                        onTimeChange={(cTime) => {
                            const time = formatTimeObject(cTime);
                            setTime(time);
                            //setITime(time);
                        }}
                    />
                </View>
            :
                null
        }
        </>
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
    }
});
  
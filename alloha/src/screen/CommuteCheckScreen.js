
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MyStorePicker from '../components/alba/MyStorePicker';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import { YYMMDD2YYDD, getStartAndEndOfWeek } from './../util/moment';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import CurTimer from '../components/common/CurTimer';

export default function CommuteCheckScreen({navigation}) {
    const userId = useSelector((state)=>state.login.userId)
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    const { thisSunday, thisSaturday, today } = getStartAndEndOfWeek();
    const [jobChk, setJobChk] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const [isCommonJob, setJobCls] = useState(true);
    const jobchksearch = async (cstCo) => {
        await HTTP("GET", "/api/v1/commute/jobchksearch", {userId:userId, cstCo:cstCo})
        .then((res)=>{
            setJobChk(res.data.result);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    const MonthAlbaSlySearch = async () => {
        // exec PR_PLYD02_SALARY 'MonthAlbaSlySearch', '20231203', '20231209', 1010, '', 'mega7438226_0075', '', 0
        await HTTP("GET", "/api/v1/commute/monthCstSlySearch", {userId:userId, cstCo:sCstCo, ymdFr:thisSunday, ymdTo:thisSaturday})
        .then((res)=>{
            //console.log(res.data.result)
            //const data = res.data.result.sort((a, b) => a.ORDBY - b.ORDBY);
            //dispatch(setMonthCstPl({data:data}));
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    const getDaySchedule = async (cstCo) => {
        const params = {userId:userId, cstCo:cstCo, ymd:today};
        await HTTP("GET", "/api/v1/commute/daySchedule", params)
        .then((res)=>{
            const data = res.data.result;
            setDaySchedule(data);
            const isJobCls = (data.length > 0)?true:false;
            setJobCls(isJobCls);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    
    const insertJobChk = async (chkYn) => {
        const jobCl = (isCommonJob)?"G":"S"
        await HTTP("POST", "/api/v1/commute/insertJobChk", {userId:userId, cstCo:sCstCo, lat:0, lon:0, chkYn:chkYn, apvYn:"Y", jobCl:jobCl})
        .then((res)=>{
            jobchksearch();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })

    }
    
    useFocusEffect(
        useCallback(() => {
            jobchksearch(sCstCo);
            getDaySchedule(sCstCo);
            MonthAlbaSlySearch();
            return () => { 
                //console.log("unFocused");
            };
        }, [sCstCo])
    )
    useEffect(()=>{
        jobchksearch(sCstCo);
        getDaySchedule(sCstCo);
    }, [sCstCo])

    useEffect(()=>{
        navigation.setOptions({title:"근무 현황"})
        //navigation.setOptions({headerShown:false})
    }, [navigation])

    return (
        <>
        <View style={styles.container}>
            <View style={styles.row}>
                <MyStorePicker width={'75%'} borderColor='rgba(9,9,9,1)' userId={userId} />    
                <View style={{flexDirection:"row"}}>
                    <AntDesign name="checksquareo" size={24} color="black" />
                    <Text>수동체크</Text>
                </View>
            </View>
            <View style={[styles.row, {marginBottom:10}]}>
                <View>
                    <Text>근무계획</Text>   
                    {(daySchedule.length > 0)
                        ?
                            daySchedule.map((el, idx)=>{
                                const dateString = el.YMD;
                                const date = new Date(`${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`);
                                const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
                                return <Text key={idx}>{YYMMDD2YYDD(el.YMD)} ({dayOfWeek}) {el.SCHTIME} ({el.JOBDURE})</Text>
                            })
                        :
                            <Text>근무계획이없습니다.</Text>
                    }
                </View>
                <View style={[styles.pill, {backgroundColor:"#D9D9D9",}]}>
                    <Text>{(isCommonJob)?"일반근무":"대타근무"}</Text>
                </View>
            </View>
            <CommuteButton onButtnPressed={insertJobChk} data={jobChk} sTime={(jobChk.length > 0)?jobChk[0].chkTime.split(" ")[1]:"00:00"}/>
            <View style={[styles.center, {marginBottom:20}]}>
                <CurTimer />
            </View>
            <CommuteBar data={jobChk} isCommonJob={isCommonJob} onPressed={()=>alert("전환 기능은 아직 확정되지 않음")/*setJobCls(!isCommonJob)*/} />
        </View>
        <View style={{backgroundColor:"#5372D7", borderTopLeftRadius:15, borderTopRightRadius:15, paddingHorizontal:25, paddingVertical:10, position:"absolute", bottom:0, width:"100%"}}>
            <View style={[styles.row, {alignItems:"flex-start"}]}>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>주간 근무 시간</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>13시간 30분</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>(대타 1:30)</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>급여내역</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={{color:"white"}}>일반 :</Text>
                        <Text style={{color:"white"}}>0 원</Text>
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={{color:"white"}}>플러스 :</Text>
                        <Text style={{color:"white"}}>0 원</Text>
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={{color:"white"}}>주휴 : </Text>
                        <Text>0 원</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.row, {alignItems:"flex-start"}]}>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>이슈요약</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>지각 3</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>조회 4</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>결근 4</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>주간 총 급여</Text>
                    <Text style={{color:"white", paddingHorizontal:15, alignSelf:"flex-end"}}>129,879 원</Text>
                </View>
            </View>
        </View>
        </>
    );
}

const CommuteButton = ({data, sTime, onButtnPressed}) => {
    var top = "", main = "", bot = "", color = "";
    const length = data.length;
    if(length == 0){
        top = "출근 전", main = "출근", bot = "CLICK", color = "#2F3269";
    }else if(length == 1){
        const [timerId, setTimerId] = useState(null);
        const [timer, setTime] = useState("00:00");
        useEffect(()=>{
            const startTimer = () => {
                setTime(timeCalculation(sTime));
                if (timerId) {
                    clearTimeout(timerId);
                }
                const newTimerId = setTimeout(() => {
                    setTime(timeCalculation(sTime));
                    startTimer();
                }, 1000);
                setTimerId(newTimerId);
            };
            startTimer();
            return () => { if (timerId) clearTimeout(timerId); }
        }, [sTime]);
        top = "근무 중", main = "퇴근", bot = timer, color = "#465EFE";
    } else{
        top = "", main = "퇴근 완료", bot = "", color = "#2F3269";
    }
    const onPressed = () => {
        const chkYn = (length == 0)?"I":(length == 1)?"X":"";
        if(chkYn != ""){
            onButtnPressed(chkYn);
        }else{
            alert("퇴근 완료 상태입니다.");
        }
    }
    return(
        <View style={styles.center}>
            <View style={styles.outerCircle}>
                <TouchableOpacity onPress={onPressed} style={[styles.circle, {backgroundColor:color}]}>
                    {
                        (top != "")?<Text style={[styles.circleText, {fontSize:10, marginBottom:10}]}>{top}</Text>:null
                    }
                    <Text style={[styles.circleText, {fontSize:24, marginBottom:5}]}>{main}</Text>
                    {
                        (bot != "")?<Text style={[styles.circleText, {color:"grey"}]}>{bot}</Text>:null
                    }
                    
                </TouchableOpacity>
            </View>
        </View>
    )
}

const CommuteBar = ({data, isCommonJob, onPressed}) => {
    const start = (data[0])?data[0].chkTime.split(" ")[1]:"--:--";
    const end = (data[1])?data[1].chkTime.split(" ")[1]:"--:--";;
    const text = (isCommonJob)?"대타근무":"일반근무";
    return(
        <View style={[styles.center, {flexDirection:"row"}]}>
            <View style={styles.center}>
                <Text>출근</Text>
                <Text>{start}</Text>
            </View>
            <TouchableOpacity onPress={onPressed} style={[styles.box, styles.row, {borderRadius:5}]}>
                <View>
                    <AntDesign name="arrowright" size={24} color="black" />
                    <AntDesign name="arrowleft" size={24} color="black" />
                </View>
                <View style={{alignItems:"center", paddingLeft:5}}>
                    <Text>{text}</Text>
                    <Text>전환</Text>
                </View>
            </TouchableOpacity>
            <View  style={styles.center}>
                <Text>퇴근</Text>
                <Text>{end}</Text>
            </View>
        </View>
    )
}

function timeCalculation(sTime) {
    var result = "00:00"
    const now = new Date();
    const [hour, min] = sTime.split(":");
    const sDate = new Date().setHours(hour, min, 0, 0);
    if (sDate < now) {
        //차이
        const diffInMilliseconds = now - sDate;
        const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
        // 경과시간
        const elapsedHours = Math.floor(diffInMinutes / 60);
        const elapsedMinutes = diffInMinutes % 60;
        const formattedRemainingTime = `${String(elapsedHours).padStart(2, '0')}:${String(elapsedMinutes).padStart(2, '0')}`;
        result = formattedRemainingTime;
    } 
    return result;
}
const styles = StyleSheet.create({
    container:{ padding:15 },
    center:{ justifyContent: 'center', alignItems: 'center', marginBottom:10 },
    row:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
    pill:{
        paddingVertical:5,
        paddingHorizontal:15,
        borderRadius:15
    },
    outerCircle:{
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:160,
        height:160,
        borderRadius:160,
        borderWidth:2,
        borderColor:"#ddd"
    },
    circle:{
        borderColor:'rgba(0,0,0,0.2)',
        alignItems:'center',
        justifyContent:'center',
        width:150,
        height:150,
        
        borderRadius:150,
        borderWidth:5,
        borderColor:"#D9E2FC"

    },
    circleText:{
        color:"white",
    },
    box:{
        borderColor:"#A59C9C",
        borderWidth:1,
        padding:5,
        marginHorizontal:20,
    }
});
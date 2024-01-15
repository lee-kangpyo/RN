
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, ScrollView } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MyStorePicker from '../components/alba/MyStorePicker';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import { YYMMDD2YYDD, getStartAndEndOfWeek } from './../util/moment';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import CurTimer from '../components/common/CurTimer';
import { getLocation } from '../util/location';
import { MaterialIcons } from '@expo/vector-icons'; 

export default function CommuteCheckScreen({navigation}) {
    const userId = useSelector((state)=>state.login.userId)
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    const myStores = useSelector((state)=>state.alba.myStores)
    const { thisSunday, thisSaturday, today } = getStartAndEndOfWeek();
    const [jobChk, setJobChk] = useState([]);
    const [daySchedule, setDaySchedule] = useState([]);
    const [isCommonJob, setJobCls] = useState(true);
    const [weekInfo, setWeekInfo] = useState({});
    const store = myStores.find(el => el.CSTCO == sCstCo);
    const [checkLocation, setCheckLocation] = useState(false);

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
            setWeekInfo(res.data.result[0])
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
        const rtcl = store.RTCL;
        if(rtcl == "N"){
            setCheckLocation(true)
            const result = await getLocation();
            if(result && result.mocked) {
                alert("모의 위치가 설정되어있습니다.")
                setCheckLocation(false)
            }else{
                if(result){
                    const jobCl = (isCommonJob)?"G":"S"
                    await HTTP("POST", "/api/v1/commute/insertJobChk", {userId:userId, cstCo:sCstCo, lat:result.latitude, lon:result.longitude, chkYn:chkYn, apvYn:"Y", jobCl:jobCl})
                    .then((res)=>{
                        jobchksearch(sCstCo);
                        getDaySchedule(sCstCo);
                        setCheckLocation(false)
                    }).catch(function (error) {
                        console.log(error);
                        alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
                        setCheckLocation(false)
                    })
                }else{
                    Alert.alert(
                        '위치 권한 요청',
                        '위치 권한을 허용해주세요',
                        [
                            {text: '취소', onPress: () => {setCheckLocation(false)}, style: 'cancel'},
                            {
                            text: '설정창열기',
                            onPress: () => {setCheckLocation(false);Linking.openSettings();},
                            style: 'destructive',
                            },
                        ],
                        {
                            cancelable: true,
                            onDismiss: () => {setCheckLocation(false)},
                        },
                    )
                }
            }
        }else{
            const type = {R:"승인 대기 중", Y:"퇴직", D:"거절됨"};
            alert(`출퇴근 불가능 점포입니다. \n사유 : ${type[rtcl]}`)
        }

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
    // useEffect(()=>{
    //     jobchksearch(sCstCo);
    //     getDaySchedule(sCstCo);
    // }, [sCstCo])

    useEffect(()=>{
        navigation.setOptions({title:"근무 현황"})
        //navigation.setOptions({headerShown:false})
    }, [navigation])
    return (
        (sCstCo > 0)?
            <>
            <TouchableOpacity onPress={()=>navigation.push("CommuteCheckInfo")} style={{ backgroundColor:"rgba(0,0,0,1)", padding:10, flexDirection:"row", justifyContent:"space-between"}}>
                <Text style={{color:"white"}}>근무정보이동 임시버튼</Text>
                <Text style={{color:"white"}}>→</Text>
            </TouchableOpacity>
            <ScrollView style={styles.container}>
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
                <CommuteButton onButtnPressed={insertJobChk} data={jobChk} sTime={(jobChk.length > 0)?jobChk[0].chkTime.split(" ")[1]:"00:00"} checkLocation={checkLocation}/>
                <View style={[styles.center, {marginBottom:20}]}>
                    <CurTimer />
                </View>
                <CommuteBar data={jobChk} isCommonJob={isCommonJob} onPressed={()=>alert("전환 기능은 아직 확정되지 않음")/*setJobCls(!isCommonJob)*/} />
            </ScrollView>
            <Bottom data={weekInfo} />
            </>
        :   
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <MyStorePicker userId={userId} />
                <Text>등록된 점포가 없습니다. 점포검색을 이용해 주세요</Text>
            </View>
    );
}

const Bottom = ({data}) => {
    const [isMin, setIsMin] = useState(true);
    const convertTime = (num) => {
        const hours = Math.floor(num);
        const minutes = Math.round((num - hours) * 60);
        return `${hours}시간 ${minutes}분`;
    }
    const item = (data && Object.keys(data).length > 0)?data:{jobDure:0, spcDure:0, jobWage:0, incentive:0, spcWage:0, ATTCL:0, ATTCL2:0, ATTCL3:0, salary:0 }

    const TouchableIcon = ({name, onPress}) => {
        return(
            <View style={styles.iconBox}>
                <TouchableOpacity onPress={onPress}>
                    <MaterialIcons name={name} size={40} color="white" />
                </TouchableOpacity> 
            </View>
        )
    }

    return (
        // (data && Object.keys(data).length > 0)?
        <View style={styles.bottomSheet}>
        {
        (isMin)?
        <>
            <TouchableIcon name={"keyboard-arrow-up"} onPress={()=>setIsMin(false)} />
            <View style={[styles.row, {alignItems:"flex-start", marginBottom:0}]}>
                <Text style={{color:"white", fontSize:16}}>주간 근무 시간</Text>
                <View style={{flexDirection:"row"}}>
                    <Text style={{color:"white", paddingRight:5}}>{convertTime(item.jobDure)}</Text>
                    <Text style={{color:"white",}}>(대타 {convertTime(item.spcDure)})</Text>
                </View>
            </View>
            <View style={[styles.row, {alignItems:"flex-start"}]}>
                <Text style={{color:"white", fontSize:16}}>주간 총 급여</Text>
                <Text style={{color:"white", paddingHorizontal:15, alignSelf:"flex-end"}}>{item.salary.toLocaleString()} 원</Text>
            </View>
        </>
        :
        <>
            <TouchableIcon name={"keyboard-arrow-down"} onPress={()=>setIsMin(true)} />
            <View style={[styles.row, {alignItems:"flex-start"}]}>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>주간 근무 시간</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>{convertTime(item.jobDure)}</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>(대타 {convertTime(item.spcDure)})</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>급여내역</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={{color:"white"}}>일반 :</Text>
                        <Text style={{color:"white"}}>{item.jobWage.toLocaleString()} 원</Text>
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={{color:"white"}}>플러스 :</Text>
                        <Text style={{color:"white"}}>{item.incentive.toLocaleString()} 원</Text>
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={{color:"white"}}>주휴 : </Text>
                        <Text style={{color:"white"}}>{item.spcWage.toLocaleString()} 원</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.row, {alignItems:"flex-start"}]}>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>이슈요약</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>지각 {item.ATTCL}</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>조회 {item.ATTCL2}</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>결근 {item.ATTCL3}</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>주간 총 급여</Text>
                    <Text style={{color:"white", paddingHorizontal:15, alignSelf:"flex-end"}}>{item.salary.toLocaleString()} 원</Text>
                </View>
            </View>
        </>
        }
        </View>
        // :
        // <View style={styles.bottomSheet}>
        //     <View style={[styles.row, {alignItems:"flex-start"}]}>
        //         <View style={{flex:1}}>
        //             <Text style={{color:"white", fontSize:16}}>주간 근무 시간</Text>
        //             <Text style={{color:"white", paddingHorizontal:15}}>00:00</Text>
        //             <Text style={{color:"white", paddingHorizontal:15}}>(대타 00:00)</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text style={{color:"white", fontSize:16}}>급여내역</Text>
        //             <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
        //                 <Text style={{color:"white"}}>일반 :</Text>
        //                 <Text style={{color:"white"}}>0 원</Text>
        //             </View>
        //             <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
        //                 <Text style={{color:"white"}}>플러스 :</Text>
        //                 <Text style={{color:"white"}}>0 원</Text>
        //             </View>
        //             <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
        //                 <Text style={{color:"white"}}>주휴 : </Text>
        //                 <Text style={{color:"white"}}>0 원</Text>
        //             </View>
        //         </View>
        //     </View>
        //     <View style={[styles.row, {alignItems:"flex-start"}]}>
        //         <View style={{flex:1}}>
        //             <Text style={{color:"white", fontSize:16}}>이슈요약</Text>
        //             <Text style={{color:"white", paddingHorizontal:15}}>지각 0</Text>
        //             <Text style={{color:"white", paddingHorizontal:15}}>조회 0</Text>
        //             <Text style={{color:"white", paddingHorizontal:15}}>결근 0</Text>
        //         </View>
        //         <View style={{flex:1}}>
        //             <Text style={{color:"white", fontSize:16}}>주간 총 급여</Text>
        //             <Text style={{color:"white", paddingHorizontal:15, alignSelf:"flex-end"}}>0 원</Text>
        //         </View>
        //     </View>
        // </View>
    )
}
const CommuteButton = ({data, sTime, onButtnPressed, checkLocation}) => {
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
                {
                    (checkLocation)?
                    <View style={[styles.circle, {backgroundColor:color}]}>
                        <Text style={[styles.circleText, {fontSize:18, marginBottom:0}]}>위치정보</Text>
                        <Text style={[styles.circleText, {fontSize:18, marginBottom:0}]}>체크중</Text>
                    </View>
                    :
                    <TouchableOpacity onPress={onPressed} style={[styles.circle, {backgroundColor:color}]}>
                        {
                            (top != "")?<Text style={[styles.circleText, {fontSize:10, marginBottom:10}]}>{top}</Text>:null
                        }
                        <Text style={[styles.circleText, {fontSize:24, marginBottom:5}]}>{main}</Text>
                        {
                            (bot != "")?<Text style={[styles.circleText, {color:"grey"}]}>{bot}</Text>:null
                        }
                        
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

const CommuteBar = ({data, isCommonJob, onPressed}) => {
    const start = (data[0])?data[0].chkTime.split(" ")[1]:"--:--";
    const start2 = (data[0])?data[0].chkTime.split(" ")[2]:null;

    const end = (data[1])?data[1].chkTime.split(" ")[1]:"--:--";
    const end2 = (data[1])?data[1].chkTime.split(" ")[2]:null;
    const text = (isCommonJob)?"대타근무":"일반근무";
    return(
        <View style={[styles.center, {flexDirection:"row"}]}>
            <View style={styles.center}>
                <Text>출근</Text>
                <Text>{start}</Text>
                {
                    (start2)?
                        <Text>{start2}</Text>
                    : 
                        null
                }
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
                {
                    (end2)?
                        <Text>{end2}</Text>
                    : 
                        null
                }
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
    container:{ padding:15, flex:1 },
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
    },
    bottomSheet:{
        backgroundColor:"#5372D7", 
        borderTopLeftRadius:15, 
        borderTopRightRadius:15, 
        paddingHorizontal:25, 
        paddingVertical:10, 
        width:"100%",
    },
    iconBox:{
        alignItems:"center",
    },
    
});
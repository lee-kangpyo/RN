
import { StyleSheet, Text, View, TouchableOpacity, Linking, Alert, ScrollView, Image, Platform } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import MyStorePicker from '../components/alba/MyStorePicker';
import { useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import { YYMMDD2YYDD, formatTime, getStartAndEndOfWeek, isBetween } from './../util/moment';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons';
import CurTimer from '../components/common/CurTimer';
import { getLocation } from '../util/location';
import { MaterialIcons } from '@expo/vector-icons'; 
import { theme } from '../util/color';

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
    const [jobInfo, setJobInfo] = useState({});

    const jobchksearch = async (cstCo) => {
        await HTTP("GET", "/api/v1/commute/jobchksearch", {userId:userId, cstCo:cstCo})
        .then((res)=>{
            setJobChk(res.data.result);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        });
    }

    const commuteCheckInfo = async () => {
        await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"JobInfo", userId:userId, cstCo:sCstCo, ymdFr:today, ymdTo:today})
        .then((res)=>{
            setJobInfo(res.data.result[0] ?? {})
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

    
    
    const insertJobChk = async (chkYn, stat) => {
        const rtcl = store.RTCL;
        if(rtcl == "N"){
            setCheckLocation(true)
            const result = await getLocation();
            if(result && result.mocked) {
                alert("모의 위치가 설정되어있습니다.")
                setCheckLocation(false)
            }else{
                if(result){
                    //원래는 jobCl은 계획이있으면 G 없으면 S로 저장하는데 현재는 출근시 Y 퇴근시 Y or S로 바꿈.
                    const jobCl = (isCommonJob)?"G":"S"
                    await HTTP("POST", "/api/v1/commute/insertJobChk", {userId:userId, cstCo:sCstCo, lat:result.latitude, lon:result.longitude, chkYn:chkYn, apvYn:"Y", jobCl:stat})
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
            commuteCheckInfo();             // Bottom2 컴포넌트 사용하기 위한 위젯
            //MonthAlbaSlySearch();         // Bottom 컴포넌트 사용하기 위한 위젯
            return () => { 
                //console.log("unFocused");
            };
            
        }, [sCstCo])
    )

    useEffect(()=>{
        navigation.setOptions({title:"근무 현황"})
        //navigation.setOptions({headerShown:false})
    }, [navigation])
    return (
        (sCstCo > 0)?
            <>
            <ScrollView style={styles.container}>
                <MyStorePicker userId={userId} />    
                <View style={[styles.row, styles.planCard, {marginTop:8, marginBottom:30}]}>
                    <View>
                        <Text style={font.planCardTitle}>근무계획</Text>
                        {(daySchedule.length > 0)
                            ?
                                daySchedule.map((el, idx)=>{
                                    const dateString = el.YMD;
                                    const date = new Date(`${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`);
                                    const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
                                    return (
                                        <View key={idx} style={styles.row}>
                                            <Text style={font.planCardContent}>{YYMMDD2YYDD(el.YMD)} ({dayOfWeek}) {el.SCHTIME}</Text>
                                            <View style={styles.pillGray}>
                                                <Text style={font.pillText}>{el.JOBDURE}시간</Text>
                                            </View>
                                            <View style={styles.sep} />
                                            <Text style={font.planCardContent2}>{(isCommonJob)?"일반근무":"대타근무"}</Text>
                                        </View>
                                    )
                                })
                            :
                                <Text style={font.planCardContent}>근무계획이없습니다.</Text>
                        }
                    </View>
                </View>
                {
                    (false)?
                    <View style={[styles.row, {marginBottom:50}]}>
                        <TouchableOpacity onPress={()=>navigation.push("CommuteCheckInfo")} style={[{flex:1.5, marginRight:8}, styles.showCommuteCheckInfo]}>
                            <Text style={font.commuteCheckInfoText}>근무 정보 보기</Text>
                            <Image source={require('../../assets/icons/link-arrow.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <View style={[{flex:1, justifyContent:"center"}, styles.manualCheck]}>
                            <AntDesign name="checksquareo" size={15} color="rgba(170, 170, 170, 1.0)"/>
                            <Text style={[font.commuteCheckInfoText, {paddingLeft:10}]}>수동체크</Text>
                        </View>
                    </View>
                :null
                }
                
                <CommuteButton onButtnPressed={insertJobChk} data={jobChk} daySchedule={daySchedule} sTime={(jobChk.length > 0)?jobChk[0].chkTime.split(" ")[1]:"00:00"} checkLocation={checkLocation}/>
                <View style={[styles.center, {marginBottom:20, marginTop:25}]}>
                    <CurTimer />
                </View>
                <CommuteBar data={jobChk} isCommonJob={isCommonJob} onPressed={()=>alert("전환 기능은 아직 확정되지 않음")/*setJobCls(!isCommonJob)*/} />
            </ScrollView>
            <Bottom2 data={jobInfo} />
            </>
        :   
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                <MyStorePicker userId={userId} />
                <Text>등록된 점포가 없습니다. 점포검색을 이용해 주세요</Text>
            </View>
    );
}


const Bottom2 = ({data}) => {
    const [isMin, setIsMin] = useState(true);
    const convertTime = (num) => {
        const hours = Math.floor(num);
        const minutes = Math.round((num - hours) * 60);
        return `${hours}시간 ${minutes}분`;
    }
    const item = (data && Object.keys(data).length > 0)?data:{preJobWage:0, jobDure:0, jobDure2:0, ATTCL2:0, ATTCL:0, ATTCL3:0 }

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
        <View style={styles.bottomSheet}>
        {
        (isMin)?
        <>
            <TouchableIcon name={"keyboard-arrow-up"} onPress={()=>setIsMin(false)} />
            <View style={[styles.row, {alignItems:"flex-start", marginTop:10}]}>
                <Text style={font.bottomSheetText}>예상 급여액</Text>
                <View style={{flexDirection:"row"}}>
                    <Text style={font.bottomSheetText2}>{item.preJobWage.toLocaleString()}원</Text>
                </View>
            </View>
        </>
        :
        <>
            <TouchableIcon name={"keyboard-arrow-down"} onPress={()=>setIsMin(true)} />
            <View style={[styles.row, {alignItems:"flex-start", marginTop:10}]}>
                <View style={{flex:1}}>
                    <Text style={font.bottomSheetText}>예상 급여액</Text>
                    <Text style={[font.bottomSheetText, {fontSize:13, paddingHorizontal:15}]}>{item.preJobWage.toLocaleString()}원</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={font.bottomSheetText}>근무 시간</Text>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={[font.bottomSheetText, {fontSize:13}]}>승인됨</Text>
                        <Text style={[font.bottomSheetText, {fontSize:13}]}>:</Text>
                        <Text style={[font.bottomSheetText, {fontSize:13}]}>{formatTime(item.jobDure)}</Text>
                    </View>
                    <View style={{flexDirection:"row", justifyContent:"space-between", paddingHorizontal:15}}>
                        <Text style={[font.bottomSheetText, {fontSize:13}]}>요청중</Text>
                        <Text style={[font.bottomSheetText, {fontSize:13}]}>:</Text>
                        <Text style={[font.bottomSheetText, {fontSize:13}]}>{formatTime(item.jobDure2)}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.row, {alignItems:"flex-start"}]}>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}>이슈사항</Text>
                    <Text style={[font.bottomSheetText, {fontSize:13, paddingHorizontal:15}]}>지각 {item.ATTCL2}</Text>
                    <Text style={[font.bottomSheetText, {fontSize:13, paddingHorizontal:15}]}>조회 {item.ATTCL3}</Text>
                    <Text style={[font.bottomSheetText, {fontSize:13, paddingHorizontal:15}]}>결근 {item.ATTCL}</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={{color:"white", fontSize:16}}></Text>
                    <Text style={{color:"white", paddingHorizontal:15, alignSelf:"flex-end"}}>{item.salary}</Text>
                </View>
            </View>
        </>
        }
        </View>
    )
}

//<Bottom data={weekInfo} />
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
                    <Text style={{color:"white", paddingHorizontal:15}}>지각 {item.ATTCL2}</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>조회 {item.ATTCL3}</Text>
                    <Text style={{color:"white", paddingHorizontal:15}}>결근 {item.ATTCL}</Text>
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
const CommuteButton = ({data, sTime, onButtnPressed, daySchedule, checkLocation}) => {
    //console.log(data)
    var top = "", main = "", bot = "", color = "";
    const length = data.length;
    if(length == 0){
        top = "출근 전", main = "출근", bot = "CLICK", color = "#3479EF";
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
        let title, sub;
        const chkYn = (length == 0)?"I":(length == 1)?"X":"";
        if(chkYn == "I"){
            //출근은 아묻따 Y -> G로 변경
            onButtnPressed(chkYn, "G");
        }else if(chkYn == "X"){
            //현재 시간 구하기
            const date = new Date();
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            //계획 시간 가져오기
            if(daySchedule.length > 0){
                //계획있음
                const timeFr = daySchedule[0].TimeFr;
                const timeTo = daySchedule[0].TimeTo
                //시간 체크
                const isBetweenrlt = isBetween(`${hours}:${minutes}`, timeFr, timeTo)
                if(isBetweenrlt){
                    //퇴근 버튼 클릭 시간이 계획시간 안일떄.
                    onButtnPressed(chkYn, "G");
                }else{
                    //퇴근 버튼 클릭 시간이 계획시간을 벗어나있을때
                    title = "대타근무를 기록하시겠습니까?";
                    sub = `대타근무를 기록하지않으면 ${timeTo} 시간까지 인정됩니다.`;
                    Alert.alert(title, sub,
                        [
                            {
                            text: "네",                           
                                onPress: () => onButtnPressed(chkYn, "S"), 
                                style: "cancel"
                            },
                            { text: "아니오", onPress: () => onButtnPressed(chkYn, "G") },
                        ],
                        { cancelable: false }
                    );
                }
            }else{
                //계획 없음.
                //alert(일반/ 대타인지?)
                title = "근무 기록을 대타 근무로 기록하시겠습니까?";
                sub = ``;
                Alert.alert(title, sub,
                    [
                        {
                        text: "대타 근무로 기록",                           
                            onPress: () => onButtnPressed(chkYn, "S"), 
                            style: "cancel"
                        },
                        { text: "일반 근무로 기록", onPress: () => onButtnPressed(chkYn, "G") },
                    ],
                    { cancelable: false }
                );
            }
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
                        <Text style={[font.circleText, {fontSize:18, marginBottom:0}]}>위치정보</Text>
                        <Text style={[font.circleText, {fontSize:18, marginBottom:0}]}>체크중</Text>
                    </View>
                    :
                    <TouchableOpacity onPress={onPressed} style={[styles.circle, {backgroundColor:color}]}>
                        {
                            (top != "")?<Text style={[font.circleText, {fontSize:10, marginBottom:10}]}></Text>:null
                        }
                        <Text style={[font.circleText, {fontSize:24, marginBottom:5}]}>{main}</Text>
                        {
                            (bot != "")?<Text style={font.circleBotText}>{bot}</Text>:null
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
        <View style={[styles.center, {flexDirection:"row", justifyContent:"space-evenly"}]}>
            <View style={styles.center}>
                <Text style={font.CommuteBarText}>출근</Text>
                <Text style={font.CommuteBarText2}>{start}</Text>
                {
                    (start2)?
                        <Text>{start2}</Text>
                    : 
                        null
                }
            </View>

            {
            (false)?
            <TouchableOpacity onPress={onPressed} style={[styles.box, styles.row]}>
                <View style={{alignItems:"center", paddingLeft:5, flexDirection:"row", marginRight:6}}>
                    <Text style={font.CommuteBarText3}>{text} </Text>
                    <Text style={font.CommuteBarText3}>전환</Text>
                </View>
                <Image source={require('../../assets/icons/switch-horizontal.png')} style={[styles.icon, {width:16, height:16}]}/>
            </TouchableOpacity>
            :
            null
            }
            <View  style={styles.center}>
                <Text style={font.CommuteBarText}>퇴근</Text>
                <Text style={font.CommuteBarText2}>{end}</Text>
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

const font = StyleSheet.create({
    planCardTitle:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        fontWeight: "800",
        color: "#111111",
        marginBottom:10,
    },
    planCardContent:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#111111"
    },
    planCardContent2:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: theme.primary
    },
    pillText:{
        fontFamily: "SUIT-Bold",
        fontSize: 12,
        fontWeight: "700",
        color: "#999999"
    },
    commuteCheckInfoText:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        fontWeight: "500",
        color: "#333333"
    },
    circleText:{
        fontFamily: "SUIT-Bold",
        fontSize: 20,
        fontWeight: "700",
        fontStyle: "normal",
        textAlign: "center",
        color: "#FFFFFF"
    },
    circleBotText:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        fontWeight: "400",
        textAlign: "center",
        color: "#FFFFFF"
    },
    CommuteBarText:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
        color: "#555555"
    },
    CommuteBarText2:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 13,
        fontWeight: "800",
        textAlign: "center",
        color: "#111111"
    },
    CommuteBarText3:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        fontStyle: "normal",
        color: "#3479EF"
    },
    bottomSheetText:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        fontWeight: "500",
        color: "#FFFFFF"
    },
    bottomSheetText2:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        fontWeight: "800",
        color: "#FFFFFF"
    }
})
const styles = StyleSheet.create({
    container:{ padding:15, flex:1 },
    center:{ justifyContent: 'center', alignItems: 'center', marginBottom:10 },
    planCard:{
        paddingHorizontal:15,
        paddingVertical:16,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1
    },
    row:{ flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginBottom:10 },
    pill:{
        paddingVertical:5,
        paddingHorizontal:15,
        borderRadius:15
    },
    pillGray:{
        marginLeft:8,
        paddingHorizontal:8,
        paddingVertical:3,
        borderRadius: 10,
        backgroundColor: "#EEEEEE"
    },
    sep:{
        width: 0,
        height: 12,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
        marginHorizontal:10,
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
        width:180,
        height:180,
        
        borderRadius:150,
        borderWidth: 6,
        borderColor: "rgba(217, 237, 255, 1.0)",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(52, 121, 239, 0.4)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 20,
                shadowOpacity: 1,
            },
            android:{
                elevation :3,
            }
        })
    },
    
    box:{
        paddingHorizontal:24,
        paddingVertical:12,
        borderRadius: 10,
        backgroundColor: "#DAE5F9",
        marginHorizontal:20,
    },
    bottomSheet:{
        backgroundColor:"#333333", 
        borderTopLeftRadius:15, 
        borderTopRightRadius:15, 
        paddingHorizontal:25, 
        paddingVertical:10, 
        width:"100%",
    },
    iconBox:{
        padding:-10,
        margin:-10,
        alignItems:"center",
    },

    showCommuteCheckInfo:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:15,
        paddingVertical:12,
        borderRadius: 10,
        backgroundColor: "#E6ECF2"
    },
    manualCheck:{
        paddingHorizontal:15,
        paddingVertical:12,
        flexDirection:"row",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        shadowColor: "rgba(0, 0, 0, 0.05)",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 10,
        shadowOpacity: 1
    },
    icon:{
        width: 8,
        height: 14,
        resizeMode:"contain"
    },
    
});

import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar, Keyboard, Animated, Dimensions, Alert } from 'react-native';
import React, {useState, useEffect, useRef, useCallback, useMemo} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import WeekAlba from '../components/schedule/WeekAlba';
import { useSelector, useDispatch } from 'react-redux';
import { disabledEditing, initTimeBox, moveWeek, moveWeekDown, nextWeek, prevWeek, setAlba, setAlbaList, setScheduleAlbaInfo, setscheduleAlbaSTime } from '../../redux/slices/schedule';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { URL } from "@env";
import { useIsFocused } from '@react-navigation/native';
import { calTimeDiffHours, getETime, getSTime, getWeekList, manipulateTime } from '../util/moment';
import { AlbaModal, ModifyTimeModal } from '../components/common/customModal';
import HeaderControl from '../components/common/HeaderControl';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import { NumberBottomSheet } from '../components/common/CustomBottomSheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//import DateTimePicker from "react-native-modal-datetime-picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import { AntDesign } from '@expo/vector-icons';
import { theme } from './../util/color';
import RadioGroup from 'react-native-radio-buttons-group';

export default function ScheduleScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const albas = useSelector((state)=>state.schedule.albas);
    const weekNumber = useSelector((state)=>state.schedule.weekNumber);
    const cstCo = useSelector((state)=>state.common.cstCo);
    // [v] 이걸 풀어주면 근무 계획에서 다음 주만 + 가 추가됨.
    //const isScheduleEditable = useSelector((state)=>state.schedule.week == state.schedule.eweek);
    const isScheduleEditable = true
    const week = useSelector((state)=>state.schedule.week);
    const weekList = getWeekList(week);
    const scheduleInfo = useSelector((state)=>state.schedule.scheduleAlbaInfo);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    // 애니매이션
    const [ShowDelBtn, setShowDelBtn] = useState(false);
    const toggleWidth = () => {
        if(!ShowDelBtn){
            showDelBtn()
        }else{
            hideDelBtn()
        }
        setShowDelBtn(!ShowDelBtn);
      };
    const widthValue = useRef(new Animated.Value(Dimensions.get('window').width - 22)).current;
    const showDelBtn = () => {
    Animated.timing(widthValue, {
        toValue: (Dimensions.get('window').width-22) - 50,
        duration: 500,
        useNativeDriver: false,
    }).start();
    };
    const hideDelBtn = () => {
    Animated.timing(widthValue, {
        toValue: Dimensions.get('window').width - 22,
        duration: 500,
        useNativeDriver: false,
    }).start();
    };
    // 애니매이션

    const getWeekSchedule = async (callback) => {
        await axios.get(URL+`/api/v1/getWeekSchedule`, {params:{cls:"WeekScheduleSearch2", cstCo:cstCo, userId:'', ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), wCnt:"0",}})
        .then((res)=>{
            //console.log(res.data.result);
            dispatch(setAlba({data:res.data.result}));
            if (callback) callback();
        }).catch(function (error) {
            console.log(error);
            alert("알바 일정을 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    const getAlbaList = async()=>{
        const response = await axios.post(URL+'/api/v1/easyAlbaMng', {
            cls:"CstAlbaSearch", cstCo:cstCo, userName: "", hpNo:"", email:""
        });
        dispatch(setAlbaList({albaList:response.data.result}));
    }
    
    const getTmpAlbaInfo = () => {
        var params = {cls:"AlbaSave", ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD")}
        return {screen:"schedule", url:'/api/v1/saveAlba', params:params};
    }


    const isFocused = useIsFocused();
    
    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") getWeekSchedule();
        }
    }, [isFocused, cstCo, week]);

    useEffect(()=>{
        navigation.setOptions({
            headerShown:false,
            title:"근무 계획",
            headerStyle: {
                backgroundColor: "#A0E9FF",
            },
            headerTintColor: "black",
        })
    }, [navigation])

    const addAlba = () => {
        setModalVisible(false)
        dispatch(initTimeBox());
        navigation.push("registerAlba", { data: getTmpAlbaInfo() });
    }

    const selectAlba = async (alba) => {
        const param = {cls:"albaSave", cstCo:cstCo, userId:alba.USERID, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD")};
        await axios.post(URL+`/api/v1/saveAlba`, param)
        .then((res)=>{
            getWeekSchedule();
        }).catch(function (error) {
            console.log(error);
        })
        setModalVisible(false)
        // 수정하는화면 삭제
        //navigation.navigate("scheduleModify", {alba:alba})
    }

    // // 바텀 시트 몇번째인지
    const [bottomSheetIndex, setBottomSeetIndex] = useState(-1)
    // //바텀시트ref
    const sheetRef = useRef(null);
    // // 바터시트 움직이는거
    const handleSnapPress = useCallback((index) => {
      sheetRef.current.snapToIndex(index);
      Keyboard.dismiss();
    }, []);
    const onAlbaTap = (info, item) => {
        dispatch(setScheduleAlbaInfo({data:info}));
        handleSnapPress(0)
    }

    const delAlba = (userId, userNa)=> {
        Alert.alert("계획 삭제", userNa+"님의 계획이 삭제 됩니다. 진행하시겠습니까?",
            [
                {text:"네", 
                    onPress: async ()=>{
                        param = {cls:"AlbaDelete", cstCo:cstCo, userId:userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), wCnt:"0",};
                        await axios.get(URL+`/api/v1/getWeekSchedule`, {params:param})
                        .then((res)=>{
                            sheetRef.current.close();
                            getWeekSchedule();
                        }).catch(function (error) {
                            console.log(error);
                            alert("삭제하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                        })
                    }
                },
                {text:"아니오", onPress:()=>console.log("취소")},
            ]
        )
    };
    //dateTimepiker
    const [dateTime, setDateTime] = useState(new Date());
    const [isTimePikerShow, setTimePiker] = useState(false);
        // exec PR_PLYA01_SCHMNG 'AlbaDelete', 16, 'Qpqpqpqp', '20231105', '20231111', 0
    const openDateTimeModal = (startTime) => {
        setDateTime(startTime)
        setTimePiker(true);
    }
    const onDateTimeModalConfirm = (param) => {
        setTimePiker(false)
        const date = new Date(param.nativeEvent.timestamp);
        var currentHours = date.getHours().toString().padStart(2, '0');
        var currentMinutes = date.getMinutes().toString().padStart(2, '0');
        const sTime = currentHours+":"+currentMinutes;
        const eTime = getETime(sTime, scheduleInfo.jobDure);
        if(param.type == "set" && scheduleInfo.jobDure > 0){
            saveAlbaSchedule(sTime, eTime);
        }else if(param.type == "set" && scheduleInfo.jobDure == 0){
            sTime
            dispatch(setscheduleAlbaSTime({data:sTime}))
        }
    }
    const saveAlbaSchedule = async (sTime, eTime) => {
        const param = {cls:"WeekAlbaScheduleSave", cstCo:cstCo, userId:scheduleInfo.userId, ymdFr:scheduleInfo.ymd, ymdTo:"", jobCl:"G", startTime:sTime, endTime:eTime};
        await axios.post(URL+`/api/v1/WeekAlbaScheduleSave`, param)
        .then((res)=>{
            getWeekSchedule();
            dispatch(moveWeekDown());
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }
    //직접입력
    const [modifyTimeShow, setModifyTimeShow] = useState(false);
    const onConfrimModifyTime = (val) =>{
        const sTime = scheduleInfo.sTime;
        const eTime = getETime(sTime, val);
        saveAlbaSchedule(sTime, eTime);
        setModifyTimeShow(false);
    } 
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <GestureHandlerRootView >
                <StoreSelectBoxWithTitle titleText={"근무 계획"} titleflex={4} selectBoxFlex={8} />
                <View style={{...styles.card, padding:5}}>
                    <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                        <HeaderControl title={`${weekNumber.month}월 ${weekNumber.number}주차`} onLeftTap={()=> dispatch(prevWeek())} onRightTap={()=> dispatch(nextWeek())} />
                        <TouchableOpacity onPress={toggleWidth}>
                            <View style={{...styles.btnMini, paddingVertical:0, paddingHorizontal:5, borderColor:theme.link}}>
                                <Text style={styles.btnText}>편집</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Animated.View style={{width:widthValue}}>
                        <WeekDate sBlank={2} eBlank={2} week={week}/>
                    </Animated.View>
                    <ScrollView  contentContainerStyle={{paddingBottom:(bottomSheetIndex == -1)?0:Dimensions.get('window').height * 0.3, }}>
                        {
                            (albas.length == 0)?
                                <View style={{alignItems:"center", borderWidth:1, borderColor:"grey", padding:5}}>
                                    <Text>데이터가 없습니다.</Text>
                                </View>
                            :
                                albas.map((item, idx)=>{
                                    return (
                                        <View key={idx} style={{flexDirection:"row"}}>
                                            <Animated.View style={{width:widthValue}} >
                                                <WeekAlba key={idx} alba={item} week={week} onTap={onAlbaTap} onDel={getWeekSchedule} />
                                            </Animated.View>
                                            <TouchableOpacity onPress={()=>delAlba(item.userId, item.userNa)} style={{...styles.btnMini, alignItems:"center", backgroundColor:"red", justifyContent:"center", width:50}}>
                                                <Text style={{color:"white"}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                        }
                        {
                            (isScheduleEditable)?
                                <TouchableOpacity onPress={()=>{dispatch(initTimeBox());setModalVisible(true);}}>
                                    <View style={{...styles.box, width:Dimensions.get('window').width - 22}}>
                                        <Text style={{fontSize:24}}>+</Text>
                                    </View>
                                </TouchableOpacity>

                            :
                                null
                        }
                        
                    </ScrollView>
                </View>
                <View>
                    <Text>(+)버튼을 클릭하여 알바생 등록 또는 기존 알바생 근무계획을 작성합니다.</Text>
                    <Text>근무 계획에 등록된 알바를 클릭하면 수정 또는 삭제 할 수 있습니다.</Text>
                </View>
                <AlbaModal
                    execptAlbaId={albas.map(item => item.userId)}
                    isShow={modalVisible}
                    onClose={()=>setModalVisible(false)}
                    onShow={()=>getAlbaList()}
                    addAlba={addAlba}
                    selectAlba={selectAlba}
                />
                <NumberBottomSheet
                    sheetRef = {sheetRef}
                    onBottomSheetChanged = {(idx)=>setBottomSeetIndex(idx)}
                    onClose={()=>dispatch(disabledEditing())}
                    Content = {
                        //<BtnSet scheduleInfo={scheduleInfo} cstCo={cstCo} refresh={(callback)=>getWeekSchedule(callback)} onDelete={()=>console.log("onDelete")} onClose={()=>sheetRef.current.close()} openDateTimeModal={openDateTimeModal} onTypingModalShow={(param)=>{setModifyTimeShow(true)}} />
                        <BtnSetV3 scheduleInfo={scheduleInfo} cstCo={cstCo} refresh={(callback)=>getWeekSchedule(callback)} onDelete={()=>console.log("onDelete")} onClose={()=>sheetRef.current.close()} />
                    }
                />
                {
                (isTimePikerShow)?
                    <DateTimePicker
                        locale="ko-kr"
                        testID="dateTimePicker12"
                        value={dateTime}
                        mode={"time"}
                        is24Hour={false}
                        onChange={onDateTimeModalConfirm}
                        minuteInterval={30}
                    />
                    : null
                }
                <ModifyTimeModal isShow={modifyTimeShow} onClose={()=>setModifyTimeShow(false)} onConfirm={(val)=>{onConfrimModifyTime(val)}} onShow={()=>console.log("onShow")} />
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}


function BtnSetV3({ scheduleInfo, cstCo, refresh }){
    const _TimeComponent = ({time, setTime, fontSize=16}) => {
        const changeTime = (min)=>{ if(!((time == "00:00" && min < 0) || (time == "23:30" && min > 0))) setTime(manipulateTime(time, min)) }
        return (
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>changeTime(-30)}>
                    <AntDesign name="caretleft" size={24} color="black" />
                </TouchableOpacity>
                <View style={{alignItems:"center"}}>
                    <Text style={{fontSize:fontSize}}>{time}</Text>
                </View>
                <TouchableOpacity onPress={()=>changeTime(30)}>
                    <AntDesign name="caretright" size={24} color="black" />
                </TouchableOpacity>
            </View>
        )
    }
    const _Section = ({fontSize=16, text, sTime, eTime, setStime, setEtime}) => {
        //const [startTime, setStime] = useState(sTime);
        //const [endTime, setEtime] = useState(eTime);
        const hours = calTimeDiffHours(sTime, eTime);
        return (
            <View style={{borderWidth:1, flexDirection:"row", marginBottom:5, padding:20, borderRadius:5}} >
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={{fontSize:fontSize}}>{text}</Text>
                </View>
                <View style={{flex:1, flexDirection:"row", justifyContent:"center"}}>
                    <_TimeComponent fontSize={fontSize} time={sTime} setTime={setStime} />
                    <Text> ~ </Text>
                    <_TimeComponent fontSize={fontSize} time={eTime} setTime={setEtime} />
                </View>
                <View style={{justifyContent:"center", alignItems:"flex-end", marginRight:5}}>
                    <Text style={{fontSize:fontSize}}>{hours}</Text>
                </View>
            </View>
        )
    }
    const radioButtons = useMemo(() => ([
        {id: 0, label: '오픈', value: '2', color:theme.open},
        {id: 1, label: '미들', value: '5', color:theme.middle},
        {id: 2, label: '마감', value: '6', color:theme.close},
        {id: 3, label: '기타', value: '1', color:theme.etc}
    ]), []);
    const selectData = [
        {text:"오픈", sTime:"07:00", eTime:"12:00", jobCl:"2", color:theme.open},
        {text:"미들", sTime:"12:00", eTime:"18:00", jobCl:"5", color:theme.middle},
        {text:"마감", sTime:"18:00", eTime:"22:00", jobCl:"9", color:theme.close},
        {text:"기타", sTime:"00:00", eTime:"23:30", jobCl:"1", color:theme.etc},
    ]
    const [selectRadio, setSelectRadio] = useState(0);
    const [isFncRunning, setIsFncRunning] = useState(false);
    const [sTime, setStime] = useState(selectData[selectRadio].sTime);
    const [eTime, setEtime] = useState(selectData[selectRadio].eTime);
    useEffect(()=> {
        setStime(selectData[selectRadio].sTime);
        setEtime(selectData[selectRadio].eTime);
    }, [selectRadio])

    const dispatch = useDispatch()
    const onSave = async (sTime, eTime, cl) => {
        if (isFncRunning) return;
        setIsFncRunning(true)
        const param = {cls:"WeekAlbaScheduleSave", cstCo:cstCo, userId:scheduleInfo.userId, ymdFr:scheduleInfo.ymd, ymdTo:"", jobCl:cl, startTime:sTime, endTime:eTime};
        await axios.post(URL+`/api/v1/WeekAlbaScheduleSave`, param)
        .then((res)=>{
            refresh(()=>{
                dispatch(moveWeekDown());
                setIsFncRunning(false);
            })
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            setIsFncRunning(false);
        })
    }
    return(
        <View style={{flex:1,}}>
            <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between", height:30, marginHorizontal:15, marginBottom:15}}>
                <Text style={{fontSize:20}}>{scheduleInfo.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} [{scheduleInfo.userNa}]</Text>
            </View>
            <View style={{flex:1, marginHorizontal:15, marginBottom:10}}>
                <RadioGroup 
                    containerStyle={{justifyContent:"space-evenly", marginBottom:5}}
                    layout="row"
                    radioButtons={radioButtons} 
                    onPress={setSelectRadio}
                    selectedId={selectRadio}
                />
                <_Section 
                    cl={selectData[selectRadio].jobCl} 
                    color={selectData[selectRadio].color} 
                    text={"시간"} 
                    sTime={sTime} 
                    eTime={eTime} 
                    setStime={setStime}
                    setEtime={setEtime}
                />
                <View style={{flexDirection:"row", justifyContent:"center", marginTop:15}}>
                    <TouchableOpacity style={[styles.btnSetBtn, {marginRight:15}]} onPress={()=>dispatch(moveWeekDown())}>
                        <Text>다음</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSetBtn} onPress={()=>onSave(sTime, eTime, selectData[selectRadio].jobCl)}>
                        <Text>저장</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )

}

function _BtnSetV2({ scheduleInfo, cstCo, refresh, onTypingModalShow, openDateTimeModal }){
    const TimeComponent = ({text, time, setTime, fontSize=16}) => {
        const changeTime = (min)=>{ if(!((time == "00:00" && min < 0) || (time == "23:30" && min > 0))) setTime(manipulateTime(time, min)) }
        return (
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <TouchableOpacity onPress={()=>changeTime(-30)}>
                    <AntDesign name="caretleft" size={24} color="black" />
                </TouchableOpacity>
                <View style={{alignItems:"center"}}>
                    <Text style={{fontSize:8}}>{text}</Text>
                    <Text style={{fontSize:fontSize}}>{time}</Text>
                </View>
                <TouchableOpacity onPress={()=>changeTime(30)}>
                    <AntDesign name="caretright" size={24} color="black" />
                </TouchableOpacity>
            </View>
        )
    }
    const Section = ({cl, color, fontSize=16, text, sTime, eTime, onSelect}) => {
        const [startTime, setStime] = useState(sTime);
        const [endTime, setEtime] = useState(eTime);
        const hours = calTimeDiffHours(startTime, endTime);
        return (
            <View style={{borderWidth:1, flexDirection:"row", marginBottom:5, padding:5, borderRadius:5, backgroundColor:color}} >
                <TouchableOpacity onPress={()=>onSelect(sTime, eTime, cl)} style={{flexDirection:"row", alignItems:"center", width:80}}>
                    <AntDesign name="pluscircle" size={20} color={theme.link} style={{marginRight:5}} />
                    <Text style={{fontSize:fontSize}}>{text}</Text>
                </TouchableOpacity>
                <View style={{flex:1, flexDirection:"row", justifyContent:"space-around"}}>
                    <TimeComponent text={"시작"} fontSize={fontSize} time={startTime} setTime={setStime} />
                    <TimeComponent text={"끝"} fontSize={fontSize} time={endTime} setTime={setEtime} />
                </View>
                <View style={{justifyContent:"center", alignItems:"flex-end", width:35, marginRight:5}}>
                    <Text style={{fontSize:fontSize}}>{hours}</Text>
                </View>
            </View>
        )
    }

    const [isFncRunning, setIsFncRunning] = useState(false);
    const dispatch = useDispatch()

    const onSelectSection = async (sTime, eTime, cl) => {
        if (isFncRunning) return;
        setIsFncRunning(true)
        const param = {cls:"WeekAlbaScheduleSave", cstCo:cstCo, userId:scheduleInfo.userId, ymdFr:scheduleInfo.ymd, ymdTo:"", jobCl:cl, startTime:sTime, endTime:eTime};
        await axios.post(URL+`/api/v1/WeekAlbaScheduleSave`, param)
        .then((res)=>{
            refresh(()=>{
                dispatch(moveWeekDown());
                setIsFncRunning(false);
            })
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            setIsFncRunning(false);
        })
    }
    return(
        <View style={{flex:1,}}>
            <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between", height:30, marginHorizontal:15}}>
                <Text>{scheduleInfo.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} [{scheduleInfo.userNa}]</Text>
            </View>
            <View style={{flex:1, marginHorizontal:15, marginBottom:10}}>
                <Section cl={2} color={theme.open} text={"오픈"} sTime={"07:00"} eTime={"12:00"} onSelect={onSelectSection}/>
                <Section cl={5} color={theme.middle} text={"미들"} sTime={"12:00"} eTime={"18:00"}  onSelect={onSelectSection}/>
                <Section cl={9} color={theme.close} text={"크로즈"} sTime={"18:00"} eTime={"22:00"}  onSelect={onSelectSection}/>
                <Section cl={1} color={theme.etc} text={"기타"} sTime={"00:00"} eTime={"23:30"}  onSelect={onSelectSection}/>
            </View>
        </View>
    )

}

function _BtnSet({ scheduleInfo, cstCo, refresh, onTypingModalShow, openDateTimeModal }){
    const [isFncRunning, setIsFncRunning] = useState(false);
    const dispatch = useDispatch()
    const sTime = getSTime(scheduleInfo.sTime);
    const onBtnTap = async (num) => {
        if (isFncRunning) return;
        const eTime = getETime(scheduleInfo.sTime, num);
        //const eTime = time.eTime.format("HH:mm");
        const param = {cls:"WeekAlbaScheduleSave", cstCo:cstCo, userId:scheduleInfo.userId, ymdFr:scheduleInfo.ymd, ymdTo:"", jobCl:"G", startTime:scheduleInfo.sTime, endTime:eTime};
        await axios.post(URL+`/api/v1/WeekAlbaScheduleSave`, param)
        .then((res)=>{
            refresh(()=>{
                dispatch(moveWeekDown());
                setIsFncRunning(false);
            })
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            setIsFncRunning(false);
        })
    }
    const onBtnPress = (num) => {
        if(!isFncRunning){
            setIsFncRunning(true)
            onBtnTap(num)
        };
    }
    return(
        <View style={{flex:1, justifyContent:"center"}}>
            <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between", height:30, marginHorizontal:15, marginBottom:10}}>
                <Text>{scheduleInfo.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} [{scheduleInfo.userNa}]</Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <TouchableOpacity style={{marginRight:5}} onPress={()=>{
                        //onTypingModalShow(param);
                        const param = {cls:"WeekAlbaWorkSave", cstCo, userId:scheduleInfo.userId, ymdFr:scheduleInfo.ymd, ymdTo:"", jobCl:"", jobDure:0}
                        //alert("직접 입력 구현중")
                        onTypingModalShow(param);
                    }}>
                        <Text style={styles.btnMini}>직접입력</Text>
                    </TouchableOpacity>
                    
                </View>
            </View>
            <View style={{paddingHorizontal:10,  marginBottom:10}}>
                <View style={{flexDirection:"row",}}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                </View>
                <View style={{flexDirection:"row"}}>
                    {
                        [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 0].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                    
                </View>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:15}}>
                <TouchableOpacity onPress={()=>openDateTimeModal(sTime)} style={{borderWidth:1, borderRadius:5, width:100, height:50, alignItems:"center"}}>
                    <Text>시작시간</Text>
                    <Text>{scheduleInfo.sTime}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, {marginTop:0}]} onPress={()=>dispatch(moveWeekDown())}>
                    <Text>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    card:{
        flex:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
    },
    box:{
        backgroundColor:"#D7E5CA",
        paddingVertical:10,
        margin:1,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    numberBox:{
        flex:1, 
        height:40,
        margin:3,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        backgroundColor:"white", 
        alignItems:"center",
        justifyContent:"center"
    },
    btn:{
        marginTop:20,
        backgroundColor:"#FFCD4B", 
        paddingHorizontal:100,
        paddingVertical:15, 
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignSelf:"center",
    },
    btnSetBtn:{
        flex:1,
        padding:15,
        alignItems:"center",
        backgroundColor:"#FFCD4B", 
        borderRadius: 10,
    },
    btnMini:{borderWidth:1, borderColor:"grey", borderRadius:5, padding:1,  verticalAlign:"middle", padding:4},
    title:{alignSelf:"center", fontSize:20, marginBottom:15},
    user:{
        marginBottom:5,
        justifyContent:"space-between",
        flexDirection:"row",
        padding:20,
        borderWidth:0.5,
        borderColor:"gray",
    },
    btnText:{
        color:theme.link
    }
});
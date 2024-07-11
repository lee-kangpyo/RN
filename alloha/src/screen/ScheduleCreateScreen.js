import { Text, ScrollView, View, StyleSheet, TouchableOpacity } from "react-native";
import React, {useEffect, useState} from 'react';
import { theme } from "../util/color";
import { convertTime, convertTime2, getWeekList, getWeekNumber, getWeekRange, moveNextWeek, movePrevWeek } from "../util/moment";
import moment from "moment";
import { AntDesign } from '@expo/vector-icons';
import CustomStandardBtn from './../components/common/CustomStandardBtn';
import { CustomBottomSheet2 } from "../components/common/CustomBottomSheet2";
import TimePicker_24 from '../components/library/TimePicker_24';
import { calculateTimeDifferenceStr, formatTimeObject, parseTimeString } from "../util/timeParser";
import { useSelector } from "react-redux";
import { HTTP } from "../util/http";
import { useAlert } from "../util/AlertProvider";

export default function ScheduleCreateScreen({navigation, route}) {
    const {cstCo} = route.params;
    const userId = useSelector((state)=>state.login.userId);
    
    const [yyyymmdd, setyyyymmdd] = useState(convertTime2(moment(), {format : 'YYYYMMDD'}));
    const w = getWeekRange(yyyymmdd);
    const weekList = getWeekList(w.first);
    const weekNumber = getWeekNumber(yyyymmdd);
    const initWeek = getWeekNumber(convertTime2(moment(), {format : 'YYYYMMDD'}));

    const [selected, setselected] = useState([false, false, false, false, false, false, false]);

    const [btnDisabled, setBtnDisabled] = useState(true);
    const [sTime, setStime] = useState("09:00");
    const [eTime, setEtime] = useState("18:00");
    const [hour, setHour] = useState(9);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState();

    const {showAlert} = useAlert();

    const openSheen = (mode)=> {
        setMode(mode);
        setIsOpen(true);
    }
    const changeTime = (val) => {
        if(mode == "sTime"){
            setStime(val);
        }else if(mode == "eTime"){
            setEtime(val);
        }
    }

    useEffect(()=>{
        setHour(calculateTimeDifferenceStr(sTime, eTime))
    }, [sTime, eTime])

    useEffect(()=>{
        if(selected.find(el=>el==true) && hour > 0){
            setBtnDisabled(false);
        }else{
            setBtnDisabled(true);
        }
    }, [selected, hour])

    const save = async () => {
        ymds = weekList.reduce((result, el, idx) => {
            const sel = selected[idx];
            if(sel){
                result.push(convertTime2(el, {format : 'YYYYMMDD'}));
            }
            return result;
        }, [])
        const param = {sTime, eTime, ymds, userId, cstCo}
        await HTTP("POST", "/api/v2/commute/AlbaSchsSave", param)
        .then((res)=>{
            if(res.data.resultCode == "00"){
                showAlert("계획 입력 완료", "계획이 입력되었습니다.", {callBack:()=>{
                    navigation.goBack();
                }})
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
        
    }

    return(
        <>
            <View style={styles.container}>
                <WeekNumber initWeek={initWeek} weekNumber={weekNumber} yyyymmdd={yyyymmdd} setyyyymmdd={setyyyymmdd} setselected={setselected}/>
                <WeekBoxs weeks={weekList} selectState={{selected, setselected}}/>
                <WorkTime time={{sTime, eTime, hour}} tap={openSheen}/>
                <View style={{flex:1, marginBottom:-16, paddingHorizontal:8, justifyContent:"flex-end",}}>
                    <CustomStandardBtn disabled={btnDisabled} text={"입력하기"} onPress={save}/>
                </View>
            </View>
            <CustomBottomSheet2
                isOpen={isOpen}
                onClose={()=>console.log("onClose")}
                content={<BotSheet setIsOpen={setIsOpen} time={(mode == "sTime")?sTime:eTime} onConfirm={changeTime}/>}
            />
        </>
    );
}

function BotSheet ({setIsOpen, time, onConfirm}){
    const [val, setVal] = useState(time);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        setVal(time);
        setRefresh(!refresh)
    }, [time])
    return (
        <>
        <View style={[styles.workBox, {marginVertical:15}]}>
            <TimePicker_24
                refresh={refresh}
                initValue={parseTimeString(val)}
                itemHeight={40}
                onTimeChange={(cTime) => {
                    const time = formatTimeObject(cTime);
                    setVal(time)
                }}
            />
        </View>
        <View style={styles.row}>
            <TouchableOpacity onPress={()=>setIsOpen(false)} style={styles.cancel}>
                <Text style={fonts.cancel}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{onConfirm(val);setIsOpen(false);}} style={styles.confirm}>
                <Text style={fonts.confirm}>확인</Text>
            </TouchableOpacity>
        </View>
        </>
    )
}

function WorkTime ({time, tap}){
    const {sTime, eTime, hour} = time;
    return (
        <View>
            <Text style={fonts.label}>근무 시간</Text>
            <View style={{height:4}}/>
            <View style={styles.workTimeComp}>
                <TouchableOpacity onPress={()=>tap("sTime")} style={styles.boxLine}>
                    <Text style={fonts.time}>{sTime}</Text>
                </TouchableOpacity>
                <Text style={[fonts.time, {marginHorizontal:8}]}>~</Text>
                <TouchableOpacity onPress={()=>tap("eTime")} style={styles.boxLine}>
                    <Text style={fonts.time}>{eTime}</Text>
                </TouchableOpacity>
                <View style={{width:55, alignItems:"center"}}>
                    <Text style={[fonts.workHour, (hour <= 0)?{color:"#D32F2F"}:null]}>{hour}시간</Text>
                </View>
            </View>
            {
                (hour <= 0)?
                    <View style={{marginVertical:10, alignItems:"flex-end"}}>
                        <Text style={fonts.warn}>근무시간을 다시 확인해주세요.</Text>
                    </View>
                :null
            }
        </View>
    )
}

function WeekNumber({initWeek, weekNumber , yyyymmdd, setyyyymmdd, setselected}) {
    const onTap = (type) => {
        if(type == "next"){
            setyyyymmdd(moveNextWeek(yyyymmdd));
        }else if(type == "prev"){
            if(initWeek.year+initWeek.month+"1" < weekNumber.year+weekNumber.month+weekNumber.number){
                setyyyymmdd(movePrevWeek(yyyymmdd));
            }
        }
        setselected([false, false, false, false, false, false, false]);
    }
    return (
        <View style={styles.weekNumber}>
            <TouchableOpacity onPress={()=>onTap("prev")}>
                <AntDesign name="left" size={24} color="black" />
            </TouchableOpacity>
            <Text style={fonts.weekText}>{weekNumber.month}월 {weekNumber.number}주차</Text>
            <TouchableOpacity onPress={()=>onTap("next")}>
                <AntDesign name="right" size={24} color="black" />
            </TouchableOpacity>
        </View>
    )
}

function WeekBoxs ({weeks, selectState}) {
    const {selected, setselected} = selectState;
    const boxTap = (idx) => {
        selected[idx] = !selected[idx]
        setselected([...selected])
    }
    return (
        <>
        <Text style={fonts.label}>요일</Text>
        <View style={{height:16}}/>
        <View style={styles.weekLine}>
            {
                ["일", "월", "화", "수", "목", "금", "토"].map((el, idx) => {
                    const week = weeks[idx];
                    const date = convertTime2(week, {format : 'MM/DD'});
                    const targetDay = convertTime2(week, {format : 'YYYYMMDD'});
                    const today = convertTime2(moment(), {format : 'YYYYMMDD'}).slice(0, 6) + "01";
                    return(
                        (today <= targetDay)?
                            <TouchableOpacity onPress={()=>boxTap(idx)} key={idx} style={[styles.weekBox, (selected[idx])?styles.sel:null]}>
                                <Text style={[fonts.week, (selected[idx])?styles.sel:null]}>{el}</Text>
                                <Text style={fonts.weekSub}>{date}</Text>
                            </TouchableOpacity>
                        :
                            <View onPress={()=>boxTap(idx)} key={idx} style={[styles.weekBox, (selected[idx])?styles.sel:null]}>
                                <Text style={[fonts.week, (selected[idx])?styles.sel:null]}>{el}</Text>
                                <Text style={fonts.weekSub}>{date}</Text>
                            </View>
                    )
                })
            }
        </View>
        <View style={{height:30}}/>
        </>
    )
}

const fonts = StyleSheet.create({
    week:{
        color:"#111",
        fontFamily:"SUIT-Bold",
        fontSize:13
    },
    weekSub:{
        color:"#555",
        fontFamily:"SUIT-Regular",
        fontSize:10
    },
    label:{
        fontSize:10,
        fontFamily:"SUIT-Regular",
        color:"#999"
    },
    time:{
        fontSize:16,
        fontFamily:"SUIT-Bold",
        color:"#555"
    },
    weekText:{
        fontSize:16,
        fontFamily:"SUIT-SemiBold",
        color:"#111"
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
    workHour:{
        fontSize:13,
        fontFamily:"SUIT-Medium",
        color:"#555"
    },
    warn:{
        fontSize:13,
        fontFamily:"SUIT-SemiBold",
        color:"#D32F2F"
    }
})
const styles = StyleSheet.create({
    container:{
        backgroundColor:"white",
        flex:1,
        padding:16,
    },
    weekNumber:{
        alignItems:"center",
        flexDirection:"row",
        justifyContent:"space-evenly",
        marginVertical:30,
    },
    weekLine:{
        flexDirection:"row",
        justifyContent:"space-evenly"
    },
    weekBox:{
        width:40,
        height:40,
        borderRadius:5,
        borderWidth:1,
        borderColor:"#DDD",
        justifyContent:"center",
        alignItems:"center"
    },
    sel:{
        borderColor:theme.primary,
        color:theme.primary,
    },
    workTimeComp:{
        flexDirection:"row",
        paddingHorizontal:8,
        alignItems:"center"
    },
    boxLine:{
        borderBottomColor:"#555",
        borderBottomWidth:1,
        padding:8,
        flex:1,
    },
    row:{flexDirection:"row"},
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
})
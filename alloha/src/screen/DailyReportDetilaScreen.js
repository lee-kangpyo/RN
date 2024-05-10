
import { StyleSheet, Text, View, TouchableOpacity, Alert,} from 'react-native';
import React, {useState, useEffect} from 'react';
import CustomButton from '../components/common/CustomButton';
import DailyCommuteInfo from '../components/daily/DailyCommuteInfo';
import DailyCommuteDetail from '../components/daily/DailyCommuteDetail';
import { InlineTimePicker } from '../components/TimePicker';
import { CustomBottomSheet2 } from '../components/common/CustomBottomSheet2';
import { convertTime2, strToDate } from '../util/moment';
import { theme } from '../util/color';
import { HTTP } from '../util/http';

export default function DailyReportDetilaScreen({navigation, route}) {
    const { ymd, userId, sCstCo } = route.params;
    const [YYYYMMDD, setYYYYMMDD] = useState(ymd);
    const [dayJobInfo, setDayJobInfo] = useState({});
    const [btnShow, setBtnShow] = useState(false);
    const [isOpen, setIsOpen] = useState(false); 

    const [isActive, setIsActive] = useState(false);

    useEffect(()=>{
        if(Object.keys(dayJobInfo).length > 0){
            setBtnShow(true)
        }
    },[dayJobInfo]);

    useEffect(()=>{
        navigation.setOptions({title:"근무내역"})
    }, [navigation])

    const dayJobSearch = async () => {
        setIsActive(!isActive);
        await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"dayJobInfo", userId:userId, cstCo:sCstCo, ymdFr:YYYYMMDD, ymdTo:YYYYMMDD})
        .then((res)=>{
            if(res.data.result.length > 0) {
                setDayJobInfo(res.data.result[0])
                
            };
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    const onConfirm = async (params) => {
        await HTTP("POST", "/api/v1/daily/JumjoWorkSave", params)
        .then((res)=>{
            const msg = (res.data.resultCode == "00")?"요청한 근무 기록이 변경 되었습니다.":"변경 중 오류가 발생했습니다.잠시후 다시 시도해 주세요.";
            Alert.alert('알림', msg, [{text: '확인', onPress: () => dayJobSearch()},], { cancelable: false });
            
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    return (
        <>
        <View style={styles.container}>
            <DailyCommuteInfo day={YYYYMMDD} userId={userId} sCstCo={sCstCo} dayJobInfo={dayJobInfo} setDayJobInfo={setDayJobInfo} />
            <DailyCommuteDetail day = {YYYYMMDD} userId={userId} sCstCo={sCstCo} isActive={isActive}/>
            {
                (btnShow)?
                    <CustomButton onClick={()=>setIsOpen(true)} text={"근무기록변경"} style={styles.btn} fontStyle={fonts.btn}/>
                :
                    null
            }
        </View>
        <CustomBottomSheet2 
            isOpen={isOpen} 
            onClose={()=>setIsOpen(false)}
            content={<ChangeWorkTime dayJobInfo={dayJobInfo} setIsOpen={setIsOpen} onConfirm={onConfirm}/>}
        />
        </>
    );
}

const ChangeWorkTime = ({dayJobInfo, setIsOpen, onConfirm}) => {
    const[_dayJobInfo, setDayJobInfo] = useState(dayJobInfo)
    const[sTime, setSTime] = useState(strToDate(_dayJobInfo.ymd +' '+ _dayJobInfo.startTime))
    const[eTime, setETime] = useState(strToDate(_dayJobInfo.ymd +' '+ _dayJobInfo.endTime))
    const [isSelectStime, setSelectStime] = useState(true);
    const sColor = (isSelectStime)?theme.primary:"#999";
    const eColor = (!isSelectStime)?theme.primary:"#999";
    const onPressConfirm = () => {
        // exec PR_PLYB02_WRKMNG 'JumjoWorkSave', 1014, 'mangdee22', '20240509', '07:00', '16:00'
        // @CLS 구분 : JumjoWorkSave
        // @CSTCO : 점포코드
        // @USERID : 알바ID
        // @YMD : 일자 'YYYYMMDD'
        // @CL1 : 시작시간 'HH:MM'
        // @CL2 : 종료시간 'HH:MM'
        const param = {cls:"JumjoWorkSave", cstCo:_dayJobInfo.cstCo, useId:_dayJobInfo.userId, ymd:_dayJobInfo.ymd, sTime:convertTime2(sTime,  {format:'HH:mm'}), eTime:convertTime2(eTime,  {format:'HH:mm'})};
        console.log(param);
        onConfirm(param);
        setIsOpen(false);
    }
    return(
        <>
            <Text style={fonts.sheetTitle}>근무 시간 수정</Text>
            <View style={styles.timePicker}>
                <View style={{marginLeft:16}}>
                    <TouchableOpacity onPress={()=>setSelectStime(true)} style={[styles.row, styles.miniBtn, {borderColor:sColor}]}>
                        <Text style={[fonts.sheetcontent, {color:sColor}]}>출근시간 : </Text>
                        <Text style={[fonts.sheetcontent, {color:sColor}]}>{convertTime2(sTime,  {format:'HH:mm'})}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>setSelectStime(false)} style={[styles.row, styles.miniBtn, {borderColor:eColor}]}>
                        <Text style={[fonts.sheetcontent, {color:eColor}]}>퇴근시간 : </Text>
                        <Text style={[fonts.sheetcontent, {color:eColor}]}>{convertTime2(eTime,  {format:'HH:mm'})}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    {
                        (isSelectStime)?
                            <InlineTimePicker date={sTime} setDate={setSTime}/>
                        :
                            <InlineTimePicker date={eTime} setDate={setETime}/>
                    }
                </View>
            </View>
            <View style={styles.row}>
                <TouchableOpacity onPress={()=>setIsOpen(false)} style={styles.cancel}>
                    <Text style={fonts.cancel}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={onPressConfirm} style={styles.confirm}>
                    <Text style={fonts.confirm}>확인</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}


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
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#111111"
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
        flexDirection:"row",
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
    miniBtn:{marginBottom:8, borderWidth:1, borderRadius:10, padding:8},
});
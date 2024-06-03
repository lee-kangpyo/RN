
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Platform } from 'react-native';
import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import { theme } from '../util/color';
import CustomBtn from '../components/CustomBtn';
import CustomButton from '../components/common/CustomButton';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import { AntDesign } from '@expo/vector-icons';
import CustomTap from '../components/common/CustomTap';
import ReqChangeWork from '../components/daily/ReqChangeWork';
import { setIssueCnt } from '../../redux/slices/dailyReport';
import PushTest from '../components/test/PushTest';
import { useIsFocused } from '@react-navigation/native';
import { getFirstAndLastDay } from '../util/moment';
import HeaderControl from '../components/common/HeaderControl';
import moment from 'moment';

export default function DailyReportScreen({navigation}) {
    const isFocused = useIsFocused();
    const getYMD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return {date:date, ymdKo:`${year}년 ${month}월 ${day}일`, ymKo:`${year}년 ${month}월`, ymd:`${year}${month}${day}`, firstLastDay: getFirstAndLastDay(`${year}${month}${day}`)};
    }
    const userId = useSelector((state)=>state.login.userId);
    const issueCnt = useSelector((state)=>state.dailyReport.issueCnt);
    const dispatch = useDispatch();
    const [datas, setDatas] = useState([]);
    const [isBtnDisabled, setIsBtnDisabled] = useState(false);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const [ymd, setYmd] = useState(getYMD(new Date()));
    const [selectedKey, setSelectedKey] = useState(0);
    useEffect(()=>{
        navigation.setOptions({title:"일일보고서"});
    }, [navigation])

    
    const DailyReport1 = async () => {
        // exec PR_PLYB02_WRKMNG  'DailyReport1', 1010, '', '20231228', '', ''
        //await HTTP("GET", "/api/v1/daily/DailyReport1", {cstCo:"1010", ymd:'20231228'})
        await HTTP("GET", "/api/v1/daily/DailyReport1", {cstCo:cstCo, ymd:ymd.ymd})
        .then((res)=>{
            const result = res.data.result;
            // 승인 안한 항목
            const unApprovedList = result.filter(el => ["R"].includes(el.APVYN));
            // 이슈 있는 항목
            //const issuedList = result.filter(el => el.REQCNT > 0);
            setDatas(result);
            setIsBtnDisabled(unApprovedList.length == 0)
            //dispatch(setIssueCnt({cnt:issuedList.length}));
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    
    const getReqCommuteListForDay = async () => {
        await HTTP("GET", "/api/v1/commute/getReqCommuteCntForMonth", {userId, ymdTo:ymd.firstLastDay.lastDay, ymdFr:ymd.firstLastDay.firstDay, cstCo})
        .then((res)=>{
            console.log(res.data)
            dispatch(setIssueCnt({cnt:res.data.dayCnt}));
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        DailyReport1();
        getReqCommuteListForDay();
    }, [cstCo, ymd, selectedKey, isFocused]);

    const changeDay = (cls) =>{
        const date = new Date(ymd.date)
        if(cls == "prev"){
            date.setDate(date.getDate() - 1);
        }else if(cls == "next"){
            date.setDate(date.getDate() + 1);
        }
        console.log(date);
        setYmd(getYMD(date));
    }
    const changeMonth = (cls) => {
        let date = moment(ymd.date);
        if (cls == "prev") {
            date = date.subtract(1, 'months');
        } else if (cls == "next") {
            date = date.add(1, 'months');
        }
        setYmd(getYMD(new Date(date)));
    }

    const confirm = async () => {
        const filterd = datas.filter(el => el.REQCNT > 0);
        if(filterd.length > 0){
            alert("이슈 내역이 있습니다. 확인후 확정을 해주세요")
        }else{
            const unApprovedList = datas.filter(el => ["R", "P"].includes(el.APVYN));
            const jobNos = unApprovedList.map(el => el.JOBNO);
            await HTTP("POST", "/api/v1/daily/approve", {jobNos:jobNos, userId:userId, ymd:ymd.ymd, cstCo:cstCo})
            .then((res)=>{
                const rowsAffected = res.data.rowsAffected;
                if(rowsAffected == unApprovedList.length){
                    DailyReport1()
                    alert("확정 되었습니다.");
                }else{
                    alert("알수 없는 오류가 발생했습니다. 잠시후 다시 시도해 주세요.");
                }
            }).catch(function (error) {
                console.log(error);
                alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
            })
        }
    }
    return (
        <>
        <View style={styles.container}>
            <View style={styles.topContainer}>
                {
                    (selectedKey == 0)?
                        <HeaderControl title={ymd.ymdKo} onLeftTap={()=>changeDay("prev")} onRightTap={()=>changeDay("next")} />    
                    :
                        <HeaderControl title={ymd.ymKo} onLeftTap={()=>changeMonth("prev")} onRightTap={()=>changeMonth("next")} />    
                        // <Text style={{alignSelf:"center", marginVertical:8, fontFamily: "SUIT-Bold",fontSize: 14,fontWeight: "700",fontStyle: "normal",color: "#111111"}}>{ymd.ymKo}</Text>
                
                }
                
            </View>
            <CustomTap data={[{key:0, name:"결과보기"}, {key:1, name:"요청보기", cnt:issueCnt}]} selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>
            <View style={styles.albaList}>
                <View>
                    <StoreSelectBoxWithTitle titleText={""} titleflex={0} selectBoxFlex={6} />
                </View>
                    {
                        (datas.length == 0)?
                        <View style={{flex:1, justifyContent:"center"}}>
                            <Text style={{alignSelf:"center"}}>데이터가 없습니다.</Text>
                        </View>
                        :
                        (selectedKey == 0)?
                            <ScrollView contentContainerStyle={{paddingTop:20}}>
                            {
                                datas.map((el, idx)=>{
                                    return <Item key={idx} data={el} ymd={ymd.ymd} navigator={navigation} />
                                })
                            }
                            </ScrollView>
                        :
                            <ReqChangeWork ymd={ymd.firstLastDay} cstCo={cstCo}/>
                    }
                <View style={{height:16}} />
                <CustomButton text={"확정"} onClick={confirm} fontStyle={styles.btnText} style={styles.btn} disabled={isBtnDisabled}/>
            </View>
        </View>
        </>
    );
}

const Item = ({data, ymd, navigator}) => {
    const cstCo = useSelector((state)=>state.common.cstCo);

    const CalTime = ({txt, dure, sTime, eTime, isCurrectDure = true}) => {
        const modifyDure = (dure) => {
            let hours = Math.floor(dure); // 정수 부분을 시간으로 변환
            let remainingMinutes = (dure % 1 === 0.5) ? " 30분" : ""; // 0.5면 30분, 아니면 빈 문자열
            return (hours > 0 ? hours + "시간" : "") + remainingMinutes;
        }
        const modifyTime = (time) => {
            const dateObject = new Date(time);
            const hours = dateObject.getUTCHours().toString().padStart(2, '0');
            const minutes = dateObject.getUTCMinutes().toString().padStart(2, '0');
            return `${hours}:${minutes}`;
        }
        return(
            <View style={item.box}>
                <Text style={item.boxTitle}>{txt}</Text>
                <View style={[item.pill, (txt=="계획 시간")?{backgroundColor: "#333333"}:(isCurrectDure)?{backgroundColor: "#3479EF"}:{backgroundColor: "#FF3333"}]}>
                    <Text style={{color:"white"}}>{(dure == 0)?"0시간":modifyDure(dure)}</Text>
                </View>
                
                {
                    (dure == 0)?
                    <Text style={item.timelenth}>-</Text>
                    :
                    <View style={styles.row}>
                        <Text style={item.timelenth}>{modifyTime(sTime)}</Text>
                        <Text style={item.timelenth}>~</Text>
                        <Text style={item.timelenth}>{modifyTime(eTime)}</Text>
                    </View>
                }
                
            </View> 
        )
    }
    const goToDetailScreen = () => navigator.push("DailyReportDetail", {ymd:ymd, userId:data.USERID, sCstCo:cstCo});
    
    const attendanceColor = (["정상", "대타", "조퇴"].includes(data.ATTENDANCE))?"#999999":"#FF3333";
    return(
        <>
        {/* <View style={styles.row}>
            <Text style={{color:"grey", fontSize:10}}>히든값 : </Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>AVPYN:{data.APVYN}</Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>JOBNO:{data.JOBNO}</Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>REQNO:{data.REQNO}</Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>REQCNT:{data.REQCNT}</Text>
        </View> */}
        <View style={item.card}>
            <View style={[styles.row, {marginBottom:11, justifyContent:"space-between",}]}>
                <View style={styles.row}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={item.name}>{data.USERNA}</Text>
                    <Text style={[item.statNa, {color:attendanceColor}]}>{data.ATTENDANCE}</Text>
                </View>
                <TouchableOpacity style={{}} onPress={goToDetailScreen}>
                    <AntDesign name="right" size={16} color="#333" />
                </TouchableOpacity>
            </View>
            <View style={styles.row}>
                <View style={[styles.ItemMain, styles.row, {alignItems:"center", }]}>
                    <View style={[styles.row, {justifyContent:"space-between"}]}>
                        <CalTime txt={"계획 시간"} sTime={data.SCHSTART} eTime={data.SCHEND} dure={data.SCHDURE} />
                        <View style={{width:7}} />
                        <CalTime txt={"결과 시간"} sTime={data.STARTTIME} eTime={data.ENDTIME} dure={data.JOBDURE} isCurrectDure={data.SCHDURE <= data.JOBDURE} />
                    </View>
                </View>
            </View>
        </View>
        </>
    )
}

const item = StyleSheet.create({
    card:{ 
        borderRadius:10,  
        marginBottom:8,  
        backgroundColor:theme.white, 
        padding:20,
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1,
            },
            android:{
                elevation :2,
            }
        })
    },
    box:{alignItems:"center", padding:10, flex:1, backgroundColor:"#F7F7F7", borderRadius:10},
    pill:{
        marginVertical:10,
        paddingVertical:4,
        paddingHorizontal:8,
        borderRadius:16
    },
    //font
    name:{
        marginRight:5,
        fontFamily: "SUIT-Regular",
        fontSize: 15,
        color: "#111111"
    },
    statNa:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
    },
    boxTitle:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#111111"
    },
    timelenth:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 13,
        color: "#999999"
    }
})


const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center',},
    topContainer:{backgroundColor:"#fff", width:"100%", paddingVertical:15},
    row:{flexDirection:"row"},
    ymd:{alignSelf:"flex-start", marginBottom:15},
    albaList:{ flex:1, width:"100%", paddingHorizontal:16, paddingVertical:20, backgroundColor:"#F6F6F8"},
    
    ItemMain:{flex:1,},
    ItemRightBtn:{backgroundColor:theme.link, justifyContent:"center", padding:5},
    btn:{width:"100%", alignItems:"center", backgroundColor:"#3479EF"},
    btnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#FFFFFF"
    }
});
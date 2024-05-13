
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
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

export default function DailyReportScreen({navigation}) {
    const isFocused = useIsFocused();
    const getYMD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return {date:date, ymdKo:`${year}년 ${month}월 ${day}일`, ymd:`${year}${month}${day}`};
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
            const unApprovedList = result.filter(el => ["R", "P"].includes(el.APVYN));
            // 이슈 있는 항목
            const issuedList = result.filter(el => el.REQCNT > 0);
            setDatas(result);
            setIsBtnDisabled(unApprovedList.length == 0)
            dispatch(setIssueCnt({cnt:issuedList.length}));
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    useEffect(()=>{
        DailyReport1();
    }, [cstCo, ymd, selectedKey, isFocused]);

    const changeDay = (cls) =>{
        const date = new Date(ymd.date)
        if(cls == "prev"){
            date.setDate(date.getDate() - 1);
        }else if(cls == "next"){
            date.setDate(date.getDate() + 1);
        }
        setYmd(getYMD(date));
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
            <StoreSelectBoxWithTitle titleText={"일일 보고서"} titleflex={4} selectBoxFlex={8} />
            <View style={[styles.row, {marginTop:10}]}>
                <TouchableOpacity onPress={()=>changeDay("prev")}>
                    <Text style={{fontSize:16}}>◀</Text>
                </TouchableOpacity>
                <Text style={[styles.ymd, {marginHorizontal:5, fontSize:16}]}>{ymd.ymdKo}</Text>
                <TouchableOpacity onPress={()=>changeDay("next")}>
                    <Text style={{fontSize:16}}>▶</Text>
                </TouchableOpacity>
            </View>
            <CustomTap data={[{key:0, name:"전체보기"}, {key:1, name:"이슈보기", cnt:issueCnt}]} selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>
            <View style={styles.albaList}>
                <ScrollView contentContainerStyle={{padding:15}} >
                    {
                        (datas.length == 0)?
                        <Text style={{alignSelf:"center"}}>데이터가 없습니다.</Text>
                        :
                        (selectedKey == 0)?
                            datas.map((el, idx)=>{
                                return <Item key={idx} data={el} ymd={ymd.ymd} navigator={navigation} />
                            })
                        :
                            <ReqChangeWork ymd={ymd.ymd} cstCo={cstCo}/>
                    }
                </ScrollView>
            </View>
            <CustomButton text={"확정"} onClick={confirm} style={{alignSelf:"flex-end"}} disabled={isBtnDisabled}/>
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
            <View style={{alignItems:"center", padding:10, borderWidth:1, borderColor:theme.grey2, flex:1, margin:5}}>
                <Text style={{fontSize:12, marginRight:5}}>{txt}</Text>
                <Text style={{color:(isCurrectDure)?"black":"red"}}>{(dure == 0)?"0시간":modifyDure(dure)}</Text>
                {
                    (dure == 0)?
                    <Text style={{color:theme.grey, fontSize:12, alignSelf:"center"}}>-</Text>
                    :
                    <View style={styles.row}>
                        <Text style={{color:theme.grey, fontSize:12, alignSelf:"center"}}>{modifyTime(sTime)}</Text>
                        <Text style={{color:theme.grey, fontSize:12, alignSelf:"center"}}>~</Text>
                        <Text style={{color:theme.grey, fontSize:12, alignSelf:"center"}}>{modifyTime(eTime)}</Text>
                    </View>
                }
                
            </View> 
        )
    }
    const goToDetailScreen = () => navigator.push("DailyReportDetail", {ymd:ymd, userId:data.USERID, sCstCo:cstCo});
    
    const attendanceColor = (data.ATTENDANCE != "정상")?"red":theme.grey
    return(
        <>
        <View style={styles.row}>
            <Text style={{color:"grey", fontSize:10}}>히든값 : </Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>AVPYN:{data.APVYN}</Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>JOBNO:{data.JOBNO}</Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>REQNO:{data.REQNO}</Text>
            <Text style={{color:"grey", fontSize:10, marginRight:5}}>REQCNT:{data.REQCNT}</Text>
        </View>
        <View style={styles.Item}>
            <View style={[styles.ItemMain, styles.row, {alignItems:"center"}]}>
                <View style={{flex:2}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{marginRight:5}}>{data.USERNA}</Text>
                    <Text style={{color:attendanceColor}}>{data.ATTENDANCE}</Text>
                </View>
                <View style={[styles.row, {flex:7, justifyContent:"space-between"}]}>
                    <CalTime txt={"계획 시간"} sTime={data.SCHSTART} eTime={data.SCHEND} dure={data.SCHDURE} />
                    <CalTime txt={"결과 시간"} sTime={data.STARTTIME} eTime={data.ENDTIME} dure={data.JOBDURE} isCurrectDure={data.SCHDURE == data.JOBDURE} />
                </View>
            </View>
            <TouchableOpacity style={styles.ItemRightBtn} onPress={goToDetailScreen}>
                <AntDesign name="right" size={24} color="white" />
            </TouchableOpacity>
            
        </View>
        </>
    )
}



const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:5},
    row:{flexDirection:"row"},
    ymd:{alignSelf:"flex-start", marginBottom:15},
    albaList:{ flex:1, width:"100%", borderBottomWidth:2, marginBottom:15},
    Item:{ borderColor:theme.grey2, borderWidth:1, borderRadius:5,  marginBottom:5, flexDirection:"row"},
    ItemMain:{flex:1, padding:10,},
    ItemRightBtn:{backgroundColor:theme.link, justifyContent:"center", padding:5},
});

import { StyleSheet, Text, View, ScrollView, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import { theme } from '../util/color';
import CustomBtn from '../components/CustomBtn';
import CustomButton from '../components/common/CustomButton';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import { AntDesign } from '@expo/vector-icons';

export default function DailyReportScreen({navigation}) {
    const getYMD = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return {date:date, ymdKo:`${year}년 ${month}월 ${day}일`, ymd:`${year}${month}${day}`}
    }

    const dispatch = useDispatch();
    const [datas, setDatas] = useState([]);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const [ymd, setYmd] = useState(getYMD(new Date()));

    useEffect(()=>{
        navigation.setOptions({title:"일일보고서"})
    }, [navigation])

    const DailyReport1 = async () => {
        // exec PR_PLYB02_WRKMNG  'DailyReport1', 1010, '', '20231228', '', ''
        await HTTP("GET", "/api/v1/daily/DailyReport1", {cstCo:cstCo, ymd:ymd.ymd})
        //await HTTP("GET", "/api/v1/daily/DailyReport1", {cstCo:"1010", ymd:'20231228'})
        .then((res)=>{
            setDatas(res.data.result);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    useEffect(()=>{
        DailyReport1();
    }, [cstCo, ymd])
    const changeDay = (cls) =>{
        const date = new Date(ymd.date)
        if(cls == "prev"){
            date.setDate(date.getDate() - 1);
        }else if(cls == "next"){
            date.setDate(date.getDate() + 1);
        }
        setYmd(getYMD(date));
    }
    const confirm = () => {
        const notCheck = checkedItem.filter(el => el.REQCNT > 0);
        if(notCheck.length > 0){
            alert("근무 변경 요청이있습니다.")
        }else{
            console.log(checkedItem)
            console.log("확정 진행")
        }
    }
    return (
        <>
        <View style={styles.container}>
            <StatusBar />
            <StoreSelectBoxWithTitle titleText={"일일 보고서"} titleflex={4} selectBoxFlex={8} />
            <View style={styles.row}>
                <TouchableOpacity onPress={()=>changeDay("prev")}>
                    <Text>◀</Text>
                </TouchableOpacity>
                <Text style={[styles.ymd, {marginHorizontal:5}]}>{ymd.ymdKo}</Text>
                <TouchableOpacity onPress={()=>changeDay("next")}>
                    <Text>▶</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.albaList}>
                <ScrollView contentContainerStyle={{padding:15}} >
                    {
                        (datas.length == 0)?
                        <Text style={{alignSelf:"center"}}>데이터가 없습니다.</Text>
                        :
                        datas.map((el, idx)=><Item key={idx} data={el} />)
                    }
                </ScrollView>
            </View>
            <CustomButton text={"확정"} onClick={confirm} style={{alignSelf:"flex-end"}}/>
        </View>
        </>
    );
}

const Item = ({data}) => {
    const CalTime = ({txt, dure, sTime, eTime}) => {
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
            <View>
                <View style={[styles.row, {justifyContent:"space-between"}]}>
                    
                    <Text>{txt}</Text>
                    <View style={styles.row}>
                        <Text style={{marginRight:5}}>{modifyDure(dure)}</Text>
                        <Text style={{color:theme.grey, fontSize:10, alignSelf:"center"}}>{modifyTime(sTime)}</Text>
                        <Text style={{color:theme.grey, fontSize:10, alignSelf:"center"}}>~</Text>
                        <Text style={{color:theme.grey, fontSize:10, alignSelf:"center"}}>{modifyTime(eTime)}</Text>
                    </View>
                </View>
            </View> 
        )
    }

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
            <View style={styles.ItemMain}>
                <View style={styles.row}>
                    <Text style={{marginRight:5}}>{data.USERNA}</Text>
                    <Text style={{color:attendanceColor}}>{data.ATTENDANCE}</Text>
                </View>
                <CalTime txt={"계획"} sTime={data.SCHSTART} eTime={data.SCHEND} dure={data.SCHDURE} />
                <CalTime txt={"실제"} sTime={data.STARTTIME} eTime={data.ENDTIME} dure={data.JOBDURE} />
            </View>
            {
                //(data.REQCNT > 0)?
                (data.JOBNO == 1859)?
                <TouchableOpacity style={styles.ItemRightBtn}>
                    <AntDesign name="right" size={24} color="white" />
                </TouchableOpacity>
                :null
            }
            
        </View>
        </>
    )
}



const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:5},
    row:{flexDirection:"row"},
    ymd:{alignSelf:"flex-start", marginBottom:15},
    albaList:{ flex:1, width:"100%", borderTopWidth:1, borderBottomWidth:1, marginBottom:15},
    Item:{ borderColor:theme.grey2, borderWidth:1, borderRadius:5,  marginBottom:5, flexDirection:"row"},
    ItemMain:{flex:1, padding:10,},
    ItemRightBtn:{backgroundColor:theme.link, justifyContent:"center", padding:5}
});
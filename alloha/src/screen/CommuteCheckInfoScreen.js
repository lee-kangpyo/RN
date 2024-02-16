
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
import { theme } from '../util/color';
import { useNavigation } from '@react-navigation/native';
import Notion from '../components/common/Notion';
import { useDispatch, useSelector } from 'react-redux';
import { YYYYMMDD2Obj } from '../util/moment';
import { HTTP } from '../util/http';
import { MaterialIcons } from '@expo/vector-icons';
import { currentWeek, nextWeek, prevWeek } from '../../redux/slices/alba';
import ConvertDayStr from '../components/commuteCheck/ConvertDayStr';

export default function CommuteCheckInfoScreen({navigation}) {
    const dispatch = useDispatch();
    useEffect(()=>{
        navigation.setOptions({title:"근무정보"})
    }, [navigation])

    useEffect(() => {
        return () => {
            dispatch(currentWeek());
        };
    }, []); // 빈 배열을 전달하여 처음 한 번만 실행

    return (
        <View style={styles.container}>
            <Top />
            <BotContainer />
            <View>
                <Notion text="일자 및 근무상태와 유형을 선택하여 조회 할 수 있습니다." />
                <Notion text="일자별 근무 내역을 클릭하면 근무내역 상세조회 페이지로 이동합니다." />
                <Notion text="당일 표시된 근무내역을 클릭하면 근무현황으로 이동합니다." />
                <Notion text={`근무상태 이상의 경우 "인정요청"을 클릭하면 점주에게 인정을 요청할 수 있습니다.`} />
            </View>
        </View>
    );
}
    
//######################################################################################################3
const Top = () => {
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const date = useSelector((state)=>state.alba.date);
    const [loading, setLoadin] = useState(true);
    const [jobInfo, setJobInfo] = useState({});

    const jobchksearch = async () => {
        //await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"dayJobInfo", userId:'mega7438226_0075', cstCo:'1010', ymdFr:'20231208', ymdTo:'20231208'})
        await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"JobInfo", userId:userId, cstCo:sCstCo, ymdFr:date.start, ymdTo:date.end})
        .then((res)=>{
            setJobInfo(res.data.result[0] ?? {})
            setLoadin(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        setLoadin(true);
        jobchksearch();
    }, [date])

    const TopWeek = () =>{
        return(
            <View style={[styles.row, {marginBottom:15}]}>
                <ConvertDayStr dayStr={date.start} />
                <Text> ~ </Text>
                <ConvertDayStr dayStr={date.end} />
                <TouchableOpacity onPress={()=>dispatch(prevWeek())}>
                    <Text style={{color:theme.link, paddingLeft:15}}>[이전주]</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>dispatch(nextWeek())}>
                    <Text style={{color:theme.link, paddingLeft:15}}>[다음주]</Text>
                </TouchableOpacity>
            </View>
        )
    }

    function formatTime(number) {
        const hours = Math.floor(number);
        const minutes = (number - hours) * 60;
        const formattedHours = String(hours).padStart(2, '0');
        const formattedMinutes = String(Math.round(minutes)).padStart(2, '0');
        return `${formattedHours}시간 ${formattedMinutes}분`;
    }
//////////////////////////////////////////////////////////////////////////////////////////////////
    return(
        (loading)?
            <View style={[styles.card]}>
                <TopWeek/>
                <ActivityIndicator />
            </View>
        :
        (Object.keys(jobInfo).length == 0)?
            <View style={[styles.card, {flex:1}]}>
                <TopWeek/>
                <View style={{flex:1, justifyContent:"center", alignSelf:"center"}}>
                    <Text>해당 날짜에 근무 내역이 없습니다.</Text>
                </View>
            </View>
        :
            <View style={[styles.card]}>
                <TopWeek/>
                <View style={topStyle.topMain}>
                    <View>
                        <View style={topStyle.blueBox}>
                            <Text style={{color:"white", fontWeight:"bold", fontSize:20}}>총 근무시간</Text>
                        </View>
                        <Text style={topStyle.time}>{formatTime(jobInfo.jobDure)}</Text>
                    </View>
                    <View>
                        <View style={[styles.row, {marginBottom:10}]}>
                            <Text style={{color:"grey"}}>일반</Text>
                            <Text> : {formatTime(jobInfo.genDure)}</Text>
                        </View>
                        <View style={styles.row}>
                        <Text style={{color:"grey"}}>대타</Text>
                            <Text> : {formatTime(jobInfo.spcDure)}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.row}>
                    <Text style={{color:"grey"}}>이슈사항 - 지각 : {jobInfo.ATTCL2}, 조퇴 : {jobInfo.ATTCL3}, </Text>
                    <Text style={{color:"red"}}>결근 : {jobInfo.ATTCL}</Text>
                </View>
            </View>
    )
}

const BotContainer = () => {
    const userId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const date = useSelector((state)=>state.alba.date);
    const [loading, setLoadin] = useState(true);
    const [dayJobInfo, setDayJobInfo] = useState([]);

    const dayJobSearch = async () => {
        //await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"dayJobInfo", userId:'mega7438226_0075', cstCo:'1010', ymdFr:'20231203', ymdTo:'20231209'})
        await HTTP("GET", "/api/v1/commute/commuteCheckInfo", {cls:"dayJobInfo", userId:userId, cstCo:sCstCo, ymdFr:date.start, ymdTo:date.end})
        .then((res)=>{
            if(res.data.result) setDayJobInfo(res.data.result);
            setLoadin(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        setLoadin(true);
        dayJobSearch();
    }, [date])
//////////////////////////////////////////////////////////////////////////////////////////////////
    return(
        (loading)?
        <View style={[styles.card]}>
            <ActivityIndicator />
        </View>
        :
        (dayJobInfo.length == 0)?
            null
        :
        <>
        <View style={[styles.row, { width:"100%", justifyContent:"flex-end"}]}>
            <TouchableOpacity style={[styles.row, {marginRight:10}]}>
                <Text>승인상태</Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.row}>
                <Text>근무유형 </Text>
                <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
            </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{padding:15}} style={[styles.scrollContainer]}>
            {
                dayJobInfo.map((el, idx)=>{
                    return(
                        <BotItem key={idx} data={el} />
                    );
                })
            }
        </ScrollView>
        </>
    )
}
const BotItem = ({data}) => {
    //sconsole.log(data)
    const date = YYYYMMDD2Obj(data.ymd);
    const navigation = useNavigation();
    return(
        <TouchableOpacity onPress={()=>navigation.push("CommuteCheckDetail", {"ymd":data.ymd})} style={[styles.card, {flexDirection:"row", justifyContent:"space-between"}]}>
            <View>
                <View style={styles.row}>
                    <View style={[styles.row, {paddingVertical:5}]}>
                        <Text>{date.ymd.split(".")[1]} / {date.ymd.split(".")[2]} </Text> 
                        <Text style={{color:date.color}}>({date.day})</Text>    
                    </View>
                    <View style={{backgroundColor:theme.link, padding:5, borderRadius:15, marginLeft:15, alignSelf:"center"}}>
                        <Text style={{color:"white", width:50, textAlign:"center", fontSize:10}}>{data.attendence}</Text>
                    </View>
                </View>
                <Text>출근:{data.startTime} ~ {data.endTime}</Text>
            </View>
            <View>
                { (data.genDure == 0)? <Text></Text>:<View style={styles.row}><Text style={{color:"grey"}}>일반 : </Text><Text>{data.genDure}</Text></View> }
                { (data.spcDure == 0)? <Text></Text>:<View style={styles.row}><Text style={{color:"grey"}}>대타 : </Text><Text>{data.spcDure}</Text></View> }
            </View>
        </TouchableOpacity>
    )
}

const topStyle = StyleSheet.create({
    blueBox:{
        borderWidth:1,
        paddingVertical:15,
        paddingHorizontal:30,
        backgroundColor:"blue",
        borderRadius:20,
        marginBottom:10
    },
    time:{
        alignSelf:"flex-end",
        fontSize:24,
        color:"blue"
    },
    topMain:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginBottom:15,
    },

});
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:10 },
    card:{
        borderWidth:1,
        borderRadius:5,
        width:"100%",
        marginBottom:15, 
        padding:15,
    },
    scrollContainer:{
        borderWidth:1,
        borderRadius:5,
        width:"100%",
        flex:1
    },
    row:{ flexDirection:"row", },
});
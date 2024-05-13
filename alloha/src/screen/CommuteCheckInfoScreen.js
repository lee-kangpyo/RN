
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator, ScrollView, Platform } from 'react-native';
import React, {useState, useEffect} from 'react';
import { theme } from '../util/color';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Notion from '../components/common/Notion';
import { useDispatch, useSelector } from 'react-redux';
import { YYYYMMDD2Obj, formatTime } from '../util/moment';
import { HTTP } from '../util/http';
import { MaterialIcons } from '@expo/vector-icons';
import { currentWeek, nextWeek, prevWeek } from '../../redux/slices/alba';
import ConvertDayStr from '../components/commuteCheck/ConvertDayStr';
import { LinearGradient } from 'expo-linear-gradient';
import MyStorePicker from '../components/alba/MyStorePicker';

export default function CommuteCheckInfoScreen({navigation}) {
    const userId = useSelector((state)=>state.login.userId);
    const dispatch = useDispatch();

    useEffect(() => {
        return () => {
            dispatch(currentWeek());
        };
    }, []); // 빈 배열을 전달하여 처음 한 번만 실행

    return (
        <View style={styles.container}>
            <View style={{flexDirection:"row", paddingHorizontal:16, paddingBottom:5, paddingTop:10}}>
                <MyStorePicker userId={userId} />
            </View>
            <Top userId={userId}/>
            <BotContainer userId={userId}/>
        </View>
    );
    /*
    <View>
        <Notion text="일자 및 근무상태와 유형을 선택하여 조회 할 수 있습니다." />
        <Notion text="일자별 근무 내역을 클릭하면 근무내역 상세조회 페이지로 이동합니다." />
        <Notion text="당일 표시된 근무내역을 클릭하면 근무현황으로 이동합니다." />
        <Notion text={`근무상태 이상의 경우 "인정요청"을 클릭하면 점주에게 인정을 요청할 수 있습니다.`} />
    </View>
    */
}


    
//######################################################################################################3
const Top = ({userId}) => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const date = useSelector((state)=>state.alba.date);
    const [loading, setLoadin] = useState(true);
    const [jobInfo, setJobInfo] = useState({});

    const commuteCheckInfo = async () => {
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
        commuteCheckInfo();
    }, [date, sCstCo, isFocused])

    const TopWeek = () =>{
        return(
            <>
            <View style={[styles.row, styles.TopWeekContainer, ]}>
                <TouchableOpacity onPress={()=>dispatch(prevWeek())}>
                    <Image source={require('../../assets/icons/leftBtn.png')} style={{width:18, height:18, resizeMode: 'contain'}} />
                </TouchableOpacity>
                <View style={styles.row}>
                    <ConvertDayStr dayStr={date.start} textStyle={styles.TopWeekText}/>
                    <Text style={styles.TopWeekText}> ~ </Text>
                    <ConvertDayStr dayStr={date.end} textStyle={styles.TopWeekText}/>
                </View>
                <TouchableOpacity onPress={()=>dispatch(nextWeek())}>
                    <Image source={require('../../assets/icons/rightBtn.png')} style={{width:18, height:18, resizeMode: 'contain'}} />
                </TouchableOpacity>
            </View>
            </>
        )
    }
  
//////////////////////////////////////////////////////////////////////////////////////////////////
    return(
        (loading)?
            <View style={[{flex:1, width:"100%", paddingHorizontal:16}]}>
                <TopWeek/>
                <ActivityIndicator />
            </View>
        :
        (Object.keys(jobInfo).length == 0)?
            <View style={[{flex:1, width:"100%", paddingHorizontal:16}]}>
                <TopWeek/>
                <View style={{flex:1, justifyContent:"center", alignSelf:"center"}}>
                    <Text style={fonts.greyContent}>해당 날짜에 근무 내역이 없습니다.</Text>
                </View>
            </View>
        :
            <View style={{width:"100%", paddingHorizontal:16}}>
                <TopWeek/>
                <View style={topStyle.topMain}>
                    <LinearGradient style={topStyle.blueGradient} colors={['#43ABFC', '#3479EF']} start={{x:0, y:0.5}} end={{x:1, y:0.5}}>
                        <View style={topStyle.blueBox}>
                            <View style={styles.row}>
                                <Image source={require('../../assets/icons/won-circle.png')} style={{width:18, height:18, marginRight:7}} />
                                <Text style={topStyle.blueBoxFont}>예상 급여액</Text>
                            </View>
                            <Text style={topStyle.blueBoxFont2}>{(jobInfo.preJobWage)?jobInfo.preJobWage.toLocaleString():0}원</Text>
                        </View>
                    </LinearGradient>
                    <View style={[styles.row, {justifyContent:"space-evenly", alignItems:"center", marginBottom:20}]}>
                        <View style={{alignItems:"center"}}>
                            <Text style={fonts.greyTitle}>요청중 근무시간</Text>
                            <Text style={fonts.greyContent}>{formatTime(jobInfo.jobDure2)}</Text>
                        </View>
                        <View style={styles.sep}/>
                        <View style={{alignItems:"center"}}>
                            <Text style={fonts.greyTitle}>승인된 근무시간</Text>
                            <Text style={fonts.greyContent}>{formatTime(jobInfo.jobDure)}</Text>
                        </View>
                    </View>
                </View>
                <View style={[styles.row, {justifyContent:"center", marginBottom:10}]}>
                    <View style={styles.topBox}>
                        <Text style={[fonts.topBoxText, fonts.colorRed]}>{jobInfo.ATTCL2}</Text>
                        <Text style={[fonts.topBoxText, fonts.colorRed]}>지각</Text>
                    </View>

                    <View style={styles.topBox}>
                        <Text style={[fonts.topBoxText, fonts.colorRed]}>{jobInfo.ATTCL3}</Text>
                        <Text style={[fonts.topBoxText, fonts.colorRed]}>조퇴</Text>
                    </View>


                    <View style={styles.topBox}>
                        <Text style={[fonts.topBoxText, fonts.colorRed]}>{jobInfo.ATTCL}</Text>
                        <Text style={[fonts.topBoxText, fonts.colorRed]}>결근</Text>
                    </View>
                    <View style={styles.topBox}>
                        <Text style={[fonts.topBoxText, fonts.colorBlue]}>{jobInfo.issueCount}</Text>
                        <Text style={[fonts.topBoxText, fonts.colorBlue]}>요청</Text>
                    </View>
                    <View style={styles.topBox}>
                        <Text style={[fonts.topBoxText, fonts.colorBlue]}>{jobInfo.issueCount2}</Text>
                        <Text style={[fonts.topBoxText, fonts.colorBlue]}>통보</Text>
                    </View>
                </View>
            </View>
    )
}

const BotContainer = ({userId}) => {
    const isFocused = useIsFocused();
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
    }, [date, sCstCo, isFocused])
//////////////////////////////////////////////////////////////////////////////////////////////////
    return(
        (loading)?
            null
        :
        (dayJobInfo.length == 0)?
            null
        :
        <>
        {
            (1 == 1)?
            null
            :
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
        }
        <ScrollView contentContainerStyle={{paddingHorizontal:16, paddingVertical:20}} style={[styles.scrollContainer, {backgroundColor:"#F6F6F8"}]}>
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
    const date = YYYYMMDD2Obj(data.ymd);
    const navigation = useNavigation();
    const statColor = (["결근", "지각"].includes(data.attendence))?{color:"red"}:{color:"white"};
    const statBox = (["결근", "지각"].includes(data.attendence))?{borderWidth:1, borderColor:"red"}:(data.attendence == "근무중")?{backgroundColor:"blue"}:{backgroundColor:theme.link};
    const isAbsence = ["결근"].includes(data.attendence);
    return(
        <TouchableOpacity onPress={()=>(isAbsence)?alert("해당 일자는 결근 하셨습니다. 인정 요청으로 근무 시간 인정 요청하세요."):navigation.push("CommuteCheckDetail", {"ymd":data.ymd})} style={styles.card}> 
            <View style={[styles.row, {flex:1, justifyContent:"space-between", marginBottom:8}]}>
                <View style={[styles.row, {alignItems:"center"}]}>
                    <Text style={fonts.cardDate}>{date.ymd.split(".")[1]}.{date.ymd.split(".")[2]} </Text> 
                    <Text style={[fonts.cardDate, {color:date.color}]}>({date.day})</Text>    
                </View>
                <View style={styles.row}>
                    {
                        (["결근", "지각"].includes(data.attendence))?
                            <TouchableOpacity onPress={()=>{navigation.push("CommuteCheckChange", { dayJobInfo: data, isScheduled:true});}} style={{justifyContent:"center", marginLeft:5}}> 
                                <Text style={fonts.reqAprov}>인정 요청</Text>
                            </TouchableOpacity>
                        :
                            null
                    }
                    <View style={[styles.statBox, statBox]}>
                        <Text style={[fonts.statFont, statColor]}>{data.attendence}</Text>
                    </View>
                </View>
            </View>
            <View style={[styles.row, {marginBottom:10, alignItems:"center"}]}>
                <Image source={require('../../assets/icons/clock.png')} style={{width:16, height:16, resizeMode:'contain'}} />
                <Text style={fonts.time}>{data.startTime} ~ {data.endTime}</Text>
            </View>
            <View style={styles.row}>
                <View style={styles.cardTag}>
                    <Text style={fonts.tagText}>요청:{data.issueCount}</Text>
                </View>
                <View style={styles.cardTag}>
                    <Text style={fonts.tagText}>통보:{data.issueCount2}</Text>
                </View>
                { (false && data.genDure != 0)? <View style={styles.cardTag}><Text style={fonts.tagText}>{data.genDure}시간(일반)</Text></View>:null}
                { (false && data.spcDure != 0)? <View style={styles.cardTag}><Text style={fonts.tagText}>{data.spcDure}시간(대타)</Text></View>:null}    
            </View>
        </TouchableOpacity>
    )
}

const fonts = StyleSheet.create({
    greyTitle:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        fontWeight: "500",
        color: "#777777"
    },
    greyContent:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        fontWeight: "800",
        color: "#555555"
    },
    topBoxText:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        fontWeight: "800",
        
    },
    cardDate:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        fontWeight: "500",
        color: "#333333"
    },
    reqAprov:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        color: "#999999",
        textDecorationLine:"underline"
    },
    statFont:{
        
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        fontWeight: "700",
        color: "#FFFFFF"
    },
    time:{
        marginLeft:6,
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        fontWeight: "800",
        color: "#555555"
    },
    colorRed:{color:"#FF3333"},
    colorBlue:{color:"#3479EF"}
})

const topStyle = StyleSheet.create({
    blueGradient:{borderRadius:20, paddingVertical:25, paddingHorizontal:52, marginBottom:20},
    blueBox:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center"
    },
    blueBoxFont:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        fontWeight: "500",
        color: "#FFFFFF"
    },
    blueBoxFont2:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 24,
        fontWeight: "800",
        color: "#FFFFFF"
    },
    topMain:{
        justifyContent:"space-between",
        marginBottom:10,
    },

});
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center',  backgroundColor:"white"},
    card:{
        marginBottom:10,
        paddingHorizontal:13,
        paddingVertical:18,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.05)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1
            },
            android:{
                elevation :2,
            }
        })
    },
    scrollContainer:{
        width:"100%",
        flex:1
    },
    row:{ flexDirection:"row", },
    statBox:{
        marginLeft:8,
        borderRadius:20, 
        alignSelf:"center",
        paddingHorizontal:8,
        paddingVertical:3,
    },
    
    TopWeekContainer:{
        justifyContent:"space-between",
        padding:15,
        marginBottom:10,
        alignItems:"center",
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        ...Platform.select({
            ios:{
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowOffset: {
                    width: 0,
                    height: 0
                },
                shadowRadius: 10,
                shadowOpacity: 1
            },
            android:{
                elevation :2,
            }
        })
    },
    TopWeekText:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        color: "#111111"
    },
    sep:{
        width: 0,
        height: 28,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    },
    topBox:{
        alignItems:"center",
        marginRight:8,
        paddingHorizontal:12,
        paddingVertical:8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    cardTag:{
        marginRight:4,
        paddingHorizontal:7,
        paddingVertical:3,
        borderRadius: 3,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    }
});
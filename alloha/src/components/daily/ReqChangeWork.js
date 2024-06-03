import { ActivityIndicator, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { YYYYMMDD2Obj } from '../../util/moment';
import { FontAwesome, MaterialIcons, AntDesign } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { theme } from '../../util/color';
import { HTTP } from '../../util/http';
import { setIssueCnt } from '../../../redux/slices/dailyReport';
import { useCommuteChangeList } from '../../hooks/useReqCommuteList';

export default function ReqChangeWork({ymd, cstCo}) {
    const userId = useSelector((state) => state.login.userId);
    const isFocused = useIsFocused();
    const [reqList, setReqList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const [showReq, setShowReq] = useState(true);

    const getReqCommuteListForDay = async () => {
        setIsLoading(true);
        await HTTP("GET", "/api/v1/commute/getReqCommuteListForMonth", {userId, ymdTo:ymd.lastDay, ymdFr:ymd.firstDay, cstCo})
        .then((res)=>{
            const result = res.data.dayReqList;
            dispatch(setIssueCnt({cnt:res.data.dayReqList.filter(el => el.REQSTAT == "R").length}));
            setReqList(result);
            setIsLoading(false);
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(() => {
        getReqCommuteListForDay();
    }, [isFocused, ymd, cstCo]);

    const onAprovDeny = () => {
        getReqCommuteListForDay();
    }
    
    return (
        <>
            <TouchableOpacity activeOpacity={1} style={styles.filterBtn} onPress={()=>setShowReq(!showReq)}>
                {(showReq)?<FontAwesome name="check-square" size={24} color="#ddd" />:<FontAwesome name="square" size={24} color="#ddd" />}
                <View style={{width:8}} />
                <Text style={fonts.subBoxTime}>요청중만 모아보기</Text>
            </TouchableOpacity>
            {
                (isLoading)?
                    <View style={styles.noData}>
                        <ActivityIndicator />
                    </View>
                :(reqList.length == 0)?
                    <View style={styles.noData}>
                        <Text>데이터가 없습니다.</Text>
                    </View>
                :(showReq && reqList.filter(el => el.REQSTAT == "R").length == 0)?
                    <View style={styles.noData}>
                        <Text>요청중인 내역이 없습니다.</Text>
                    </View>
                :
                    <View style={styles.container}>
                        
                        <View style={{width:"100%", flex:1}}>
                            <ScrollView>
                                <View>
                                    <View style={{paddingBottom:15}}>
                                    {
                                        reqList.map(
                                            (el, idx)=>{
                                                if(showReq){
                                                    if(el.REQSTAT == "R"){
                                                        return <ReqItem key={idx} data={el} refresh={()=>onAprovDeny()}/>    
                                                    }
                                                }else{
                                                    return <ReqItem key={idx} data={el} refresh={()=>onAprovDeny()}/>
                                                }
                                                
                                            }
                                        )
                                    }
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
            }
        </>
    );
}

const ReqItem = ({data, refresh}) => {
    const userId = useSelector((state) => state.login.userId);
    const getChageList = useCommuteChangeList(userId);
    const [isOpen, setIsOpen] = useState(false);
    const YMD = YYYYMMDD2Obj(data.YMD);
    const createDate = formatDateTimeList(data.createDate);
    const reqStime = formatDateTimeList(data.reqStime);
    const sTime = formatDateTimeList(data.sTime);
    const reqEtime = formatDateTimeList(data.reqEtime);
    const eTime = formatDateTimeList(data.eTime);
    
    const cofirm = async (reqStat) => reqCofirm(reqStat, data);

    const reqCofirm = async (reqStat, data) => {

        const params = {reqStat:reqStat, userId:userId, reqNo:data.REQNO, jobNo:data.JOBNO};
        await HTTP("POST", "/api/v1/commute/albaWorkChangeProcess", params)
        .then((res)=>{
            getChageList();
            refresh();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    // 폴드 너비 변경 대응
    const fontRatio = Dimensions.get('window').width / 25;
    const [dynamicFontSize, setDynamicFontSize] = useState((fontRatio > 13)?13:fontRatio)
    useEffect(() => {
        const dimensionsChange = Dimensions.addEventListener('change', (status) => {
            const fontRatio = status.window.width / 25;
            setDynamicFontSize((fontRatio > 16)?16:fontRatio);
        });
        return () => {
            dimensionsChange.remove();
        };
    }, []);

    const TimeContainer = ({sTime, eTime}) => {
        var startParts = sTime.split(":");
        var endParts = eTime.split(":");
        var startDate = new Date(0, 0, 0, startParts[0], startParts[1]);
        var endDate = new Date(0, 0, 0, endParts[0], endParts[1]);
        var timeDiff = endDate - startDate;
        var hours = Math.floor((timeDiff % 86400000) / 3600000);
        var minutes = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
        return (
            <View style={{alignItems:"center"}}>
                <View style={[styles.row, {marginBottom:4}]}>
                    {
                        (hours > 0)?
                            <Text style={fonts.subBoxHour}>{hours}시간</Text>
                        :
                            null
                    }
                    {
                        (hours > 0 && minutes > 0)?
                            <View style={{marginHorizontal:2}}/>
                        :
                            null
                    }
                    {
                        (minutes > 0)?
                            <Text style={fonts.subBoxHour}>{minutes}분</Text>
                        :
                            null
                    }
                </View>
                <Text style={fonts.subBoxTime}>{sTime} ~ {eTime}</Text>
            </View>
        )
    }
    const ContentBox = () => {
        const statNa = (data.REQSTAT == "R")?"요청중":(data.REQSTAT == "A")?"승인됨":(data.REQSTAT == "D")?"거절됨":"";
        const statColor = (data.REQSTAT == "R")?"#999999":(data.REQSTAT == "A")?"#3479EF":(data.REQSTAT == "D")?"#999999":"#999999";
        return(
            <>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:13}}>
                    <View style={{flexDirection:"row"}}>
                        <Text style={fonts.userNa}>{data.USERNA}</Text>
                        <View style={{width:10}} />
                        <Text style={fonts.date}>{createDate[2]}</Text>
                    </View>
                    <View style={{flexDirection:"row"}}>
                        <AntDesign name="checkcircle" size={16} color={statColor} style={[styles.circle, {marginRight:10}]}/>
                        <Text style={[fonts.statNaText, {color:statColor}]}>{statNa}</Text>
                    </View>
                </View>
                <View style={styles.subBox}>
                    <Text style={[fonts.subBoxDate, {marginBottom:5}]}>{YMD.ymd}</Text>
                    <View style={[styles.row, {justifyContent:"space-evenly", width:"100%", alignItems:"center"}]}>
                        <TimeContainer sTime={sTime[1]} eTime={eTime[1]}/>
                        <Image source={require('../../../assets/icons/arrowRoundBox.png')} style={{width:22, height:22,}} />
                        <TimeContainer sTime={reqStime[1]} eTime={reqEtime[1]}/>
                    </View>
                </View>

            </>
        )
    }
    return(
        (data.REQSTAT == "R")?
            <>
                <TouchableOpacity activeOpacity={1} style={styles.ReqItem} onPress={()=>setIsOpen(!isOpen)}>
                    <ContentBox />
                    <View style={[styles.row, {justifyContent:"space-between"}]}>
                        <View style={[styles.statNa, {flexDirection:"row", paddingLeft:0, alignItems:"center"}]}>
                            <MaterialIcons name="keyboard-arrow-down" size={20} color={"#555"} style={{marginRight:5}} />
                            <Text style={fonts.openReason}>사유 확인</Text>
                        </View>
                    </View>
                    {
                        (isOpen)?
                        <>
                            <View style={{backgroundColor: "#F7F7F7", marginVertical:15, maxHeight:250,  padding:10, borderRadius:10}}>
                                <ScrollView nestedScrollEnabled>
                                    <Text>{data.REASON}</Text>
                                </ScrollView>
                            </View>
                            <View style={{flexDirection:"row"}}>
                                <TouchableOpacity style={[styles.bottomBtn, {borderColor: "#555555"}]} onPress={()=>cofirm("D")}>
                                    <Text style={[styles.bottomBtnText, {color:"#555555"}]}>거절</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.bottomBtn, {borderColor: "#3479EF"}]} onPress={()=>cofirm("A")}>
                                    <Text style={[styles.bottomBtnText, {color: "#3479EF"}]}>승인</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                        :
                            null
                    }
                </TouchableOpacity>
                
            </>
        :
        <>
            <View style={styles.ReqItem} >
                <ContentBox />
                
            </View>
        </>
    )
}

const formatDateTimeList = (dateString) => {
    const dateObject = new Date(dateString.replace("Z", ""));
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
    const day = String(dateObject.getDate()).padStart(2, '0');
    const hours = String(dateObject.getHours()).padStart(2, '0');
    const minutes = String(dateObject.getMinutes()).padStart(2, '0');

    return [`${year}년 ${month}월 ${day}일`, `${hours}:${minutes}`, `${year}.${month}.${day}   ${hours}:${minutes}`];
}

const fonts = StyleSheet.create({
    userNa:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        color: "#111111"
    },
    date:{
        fontFamily: "SUIT-Regular",
        fontSize: 12,
        color: "#999999"
    },
    statNaText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
    },
    subBoxDate:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        color: "#555555"
    },
    subBoxHour:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 16,
        color: "#111111"
    },
    subBoxTime:{
        fontFamily: "SUIT-Regular",
        fontSize: 12,
        color: "#555555"
    },
    openReason:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        color: "#555555"
    }
})
const styles = StyleSheet.create({
    noData:{ flex: 1, justifyContent:"center", alignItems: 'center', padding:15},
    container:{ flex: 1, alignItems: 'center',},
    top:{alignItems: 'center', marginVertical:10, paddingHorizontal:15},
    ReqItem:{
        marginBottom:11,
        paddingHorizontal:16,
        paddingVertical:20,
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
                shadowOpacity: 1,
            },
            android:{
                elevation :2,
            }
        })
    },
    subBox:{
        alignItems:"center", 
        padding:12, 
        borderRadius:20,
        borderRadius: 10,
        backgroundColor: "#F6F8FD",
        borderWidth: 1,
        borderColor: "rgba(227, 234, 246, 1.0)"
    },
    pill:{
        borderRadius:15,
        padding:3,
        paddingHorizontal:15,
        marginBottom:10,
        alignSelf:"flex-end",
        backgroundColor:theme.link
    },
    pillText:{
        fontSize:10,
        color:"white",
        fontWeight:"bold"
    },
    cstTitle:{backgroundColor:theme.grey, borderColor:theme.grey, borderWidth:1, padding:5, marginBottom:5},
    mainFont:{fontSize:16, marginHorizontal:15},
    row:{flexDirection:"row"},
    statNa:{ marginTop:15, borderRadius:20, paddingVertical:2, paddingHorizontal:10, alignSelf:"flex-end"},
    statNaText:{color:"white", fontWeight:"bold", fontSize:13},
    bottomBtn:{flex:1, justifyContent:"center", marginHorizontal:10,  alignItems:"center",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#555555"
    },
    bottomBtnText:{
        padding:10,
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        color: "#555555"
    },
    filterBtn:{
        justifyContent:"center",
        alignItems:"center",
        flexDirection:"row",
        borderWidth:1, 
        borderColor:"#ddd",
        width:"100%",
        backgroundColor:"white",
        borderRadius:10,
        padding:8,
        marginVertical:8,
    }
});
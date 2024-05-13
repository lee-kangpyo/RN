import { ActivityIndicator, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { YYYYMMDD2Obj } from '../../util/moment';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { theme } from '../../util/color';
import { HTTP } from '../../util/http';
import { setIssueCnt } from '../../../redux/slices/dailyReport';

export default function ReqChangeWork({ymd, cstCo}) {
    //const jobNos = issued.map(el => el.JOBNO);
    const userId = useSelector((state) => state.login.userId);
    //const data = useSelector((state) => state.owner.reqList)
    const isFocused = useIsFocused();
    //const getChageList = useCommuteChangeList(userId);
    const [reqList, setReqList] = useState([]);
    //const [cstList, setCstList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();

    const getReqCommuteListForDay = async () => {
        setIsLoading(true);
        await HTTP("GET", "/api/v1/commute/getReqCommuteListForDay", {userId, ymd, cstCo})
        .then((res)=>{
            // /console.log(res.data.dayReqList)
            dispatch(setIssueCnt({cnt:res.data.dayReqList.filter(el => el.REQSTAT == "R").length}));
            setReqList(res.data.dayReqList);
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
            {
                (isLoading)?
                    <View style={styles.noData}>
                        <ActivityIndicator />
                    </View>
                :(reqList.length == 0)?
                    <View style={styles.noData}>
                        <Text>데이터가 없습니다.</Text>
                    </View>
                :
                    <View style={styles.container}>
                        <View style={{width:"100%", borderWidth:1, borderColor:theme.grey, backgroundColor:"white", flex:1}}>
                            <ScrollView>
                                <View>
                                    <View style={{paddingHorizontal:10, paddingBottom:15}}>
                                    {
                                        reqList.map(
                                            (el, idx)=>{
                                                return <ReqItem key={idx} data={el} refresh={()=>onAprovDeny()}/>
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
    const [isOpen, setIsOpen] = useState(false);
    const YMD = YYYYMMDD2Obj(data.YMD);
    const createDate = formatDateTimeList(data.createDate);
    const reqStime = formatDateTimeList(data.reqStime);
    const sTime = formatDateTimeList(data.sTime);
    const reqEtime = formatDateTimeList(data.reqEtime);
    const eTime = formatDateTimeList(data.eTime);
    const statNa = (data.REQSTAT == "R")?"요청중":(data.REQSTAT == "A")?"승인됨":(data.REQSTAT == "D")?"거절됨":"";
    const cofirm = async (reqStat) => reqCofirm(reqStat, data);

    const reqCofirm = async (reqStat, data) => {
        const params = {reqStat:reqStat, userId:userId, reqNo:data.REQNO, jobNo:data.JOBNO};
        await HTTP("POST", "/api/v1/commute/albaWorkChangeProcess", params)
        .then((res)=>{
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
                <View style={styles.row}>
                    {
                        (hours > 0)?
                            <Text>{hours}시간</Text>
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
                            <Text>{minutes}분</Text>
                        :
                            null
                    }
                </View>
                <Text style={[styles.mainFont, {fontSize:dynamicFontSize, color:theme.grey2, alignSelf:"center"}]}>{sTime} ~ {eTime}</Text>
            </View>
        )
    }
    return(
        (data.REQSTAT == "R")?
            <>
                <TouchableOpacity activeOpacity={1} style={styles.ReqItem} onPress={()=>setIsOpen(!isOpen)}>
                    <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                        <Text>{data.USERNA}</Text>
                        <Text>{createDate[2]}</Text>
                    </View>
                    <View style={styles.subBox}>
                        <Text style={[styles.mainFont, {marginBottom:5}]}>{YMD.ymd}</Text>
                        <View style={styles.row}>
                            <TimeContainer sTime={sTime[1]} eTime={eTime[1]}/>
                            <FontAwesome name="arrow-circle-right" size={24} color="black" style={{alignSelf:"center"}} />
                            <TimeContainer sTime={reqStime[1]} eTime={reqEtime[1]}/>
                        </View>
                    </View>
                    <View style={[styles.row, {justifyContent:"space-between"}]}>
                        <View style={[styles.statNa, {flexDirection:"row", paddingLeft:0}]}>
                            <MaterialIcons name="keyboard-arrow-down" size={20} color={"#5b5b5b"} style={{marginRight:5}} />
                            <Text style={{color:"#5b5b5b"}}>사유 확인</Text>
                        </View>
                        <View style={[styles.statNa, {backgroundColor:"#00d06c", }]}>
                            <Text style={styles.statNaText}>{statNa}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                {
                    (isOpen)?
                    <>
                        <View style={{backgroundColor:"yellow", margin:15, marginTop:-10, maxHeight:250,  padding:10, borderRadius:10}}>
                            <ScrollView nestedScrollEnabled>
                                <Text>{data.REASON}</Text>
                            </ScrollView>
                        </View>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>cofirm("D")}>
                                <Text style={styles.bottomBtnText}>거절</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bottomBtn} onPress={()=>cofirm("A")}>
                                <Text style={styles.bottomBtnText}>승인</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                    :
                        null
                }
                <View style={{borderWidth:1, borderColor:"#DDD"}} />
            </>
        :
        <>
            <View style={styles.ReqItem} >
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <Text>{data.USERNA}</Text>
                    <Text>{createDate[2]}</Text>
                </View>
                <View style={styles.subBox}>
                    <Text style={[styles.mainFont, {marginBottom:5}]}>{YMD.ymd}</Text>
                    <View style={styles.row}>
                        <TimeContainer sTime={sTime[1]} eTime={eTime[1]}/>
                        <FontAwesome name="arrow-circle-right" size={24} color="black" style={{alignSelf:"center"}} />
                        <TimeContainer sTime={reqStime[1]} eTime={reqEtime[1]}/>
                    </View>
                </View>
                <View style={[styles.statNa, {backgroundColor:theme.orange}]}>
                    <Text style={styles.statNaText}>{statNa}</Text>
                </View>
            </View>
            <View style={{borderWidth:1, borderColor:"#DDD"}} />
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

const styles = StyleSheet.create({
    noData:{ flex: 1, justifyContent:"center", alignItems: 'center', padding:15},
    container:{ flex: 1, alignItems: 'center', padding:15},
    top:{alignItems: 'center', marginVertical:10, paddingHorizontal:15},
    ReqItem:{
        borderRadius:5,
        marginBottom:5,
        padding:15,
        width:"100%"
    },
    subBox:{alignItems:"center", backgroundColor:theme.lightgrey, padding:5, borderRadius:20},
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
    bottomBtn:{flex:1, justifyContent:"center", backgroundColor:theme.link, marginHorizontal:10, padding:5, marginBottom:15, alignItems:"center", borderRadius:5},
    bottomBtnText:{color:"white", fontSize:20}
});
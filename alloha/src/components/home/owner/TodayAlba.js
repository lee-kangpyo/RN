
import { Platform, ScrollView, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { convertTime } from '../../../util/moment';

export default function TodayAlba({todayAlba, storeList, curStore}) {
    const [detailAlba, setDetailAlba] = useState([]);           // 근태 현황 상세 카드에 사용되는 데이터 (정제 전)
    const [detailShow, setDetailShow] = useState(false);        // 근태 현황 상세 카드를 보여주는 상태를 저장
    const [curselBox, setCurSelBox] = useState("");             // 근태 현황 터치 할때 필터링 조건을 문자열로 저장
    const [filterList, setFilterList] = useState([])            // 필터링 문자 리스트
    const alba = todayAlba.reduce((acc, item) => {              // 근태 현황 상세 카드에 사용되는 데이터 (정제 후)
        const key = item.attendance;
        if(!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
    }, {});

    const cur = alba["근무중"]??[];                             // 정제된 데이터에서 근무중 데이터만 가져옴
    const pre = alba["근무계획"]??[];                           // 정제된 데이터에서 근무계획 데이터만 가져옴.
    let filterS = '';
    useEffect(()=>{
        if(detailShow){
            setDetailAlba(todayAlba.filter(el => filterList.includes(el.attendance)));
        }
    }, [todayAlba])
    
    const detailShowAction = (filterList) => {
        const filterStr = JSON.stringify(filterList);
        if(curselBox == filterStr){
            setCurSelBox("");
            setDetailAlba([]);
            setDetailShow(false);
            setFilterList([]);
        }else{
            setCurSelBox(filterStr);
            setDetailAlba(todayAlba.filter(el => filterList.includes(el.attendance)));
            setDetailShow(true);
            setFilterList(filterList);
        }
        
    }
    
    return (
        <>
        <View style={styles.container}>
            <Text style={fonts.title}>오늘 근무 현황</Text>
            {
                (todayAlba.length > 0)?
                    <>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} style={{flexDirection:"row", marginBottom:20}} contentContainerStyle={{minWidth:"100%"}}>
                        {
                            (cur.length > 0)?
                            <>
                            <View>
                                <Text style={fonts.contents}>현재 근무 인원</Text>
                                <View style={styles.userList}>
                                {
                                    cur.map((el, idx) => {
                                        // console.log(el);
                                        return <User key={idx} userInfo={el}/>;
                                    })
                                }
                                </View>
                            </View>
                            <View style={styles.sep}/>
                            </>
                            :
                            null
                        }
                        <View>
                            <Text style={fonts.contents}>근무 예정</Text>
                            <View style={styles.userList}>
                            {
                                pre.map((el, idx) => {
                                    // console.log(el);
                                    return <User key={idx} userInfo={el}/>
                                })
                            }
                            {
                                (pre.length == 0)?
                                    <View style={{marginLeft:8, paddingVertical:22}}>
                                        <Text style={fonts.contents2}>근무 예정 인원이 없습니다.</Text>
                                    </View>
                                :
                                    null
                            }
                            </View>
                        </View>
                    </ScrollView>
                    <View>
                        <Text style={[fonts.contents, {marginBottom:10}]}>근태 현황</Text>
                        <View style={styles.row}>
                            <CommuteBox num={todayAlba.filter(el => ["정상", "근무중", "퇴근확인"].includes(el.attendance)).length} text={"출근"} onTap={()=>detailShowAction(["정상", "근무중", "퇴근확인"])}/>
                            <CommuteBox num={todayAlba.filter(el => el.attendance == "결근").length} text={"결근"} textStyle={{color:"#FF3333"}} onTap={()=>detailShowAction(["결근"])}/>
                            <CommuteBox num={todayAlba.filter(el => el.attendance == "조퇴").length} text={"조퇴"} textStyle={{color:"#FF3333"}} onTap={()=>detailShowAction(["조퇴"])}/>
                            <CommuteBox num={todayAlba.filter(el => el.attendance == "지각").length} text={"지각"} textStyle={{color:"#FF3333"}} onTap={()=>detailShowAction(["지각"])}/>
                            <CommuteBox num={0} text={"대타"}/>
                        </View>
                    </View>
                    </>
                :
                <View style={{alignItems:"center"}}>
                    <Text style={fonts.contents}>근무 인원이 없습니다.</Text>
                </View>
            }
    </View>
    {(detailShow)?<DetailView data={detailAlba}/>:null}
    </>
    );
}

const DetailView = ({data}) => {
    return (
        <View style={styles.container}>
            {
                data.map((el, idx)=>{
                    const jobTo = convertTime(el.JOBTO, {format:"HH:mm"});
                    return (
                        <View key={idx} style={{borderBottomColor:"rgba(238, 238, 238, 1.0)", borderBottomWidth:1, padding:8}}>
                            <Text style={[fonts.contents2, {marginBottom:4}]}>{el.USERNA} ({el.attendance})</Text>
                            <View style={styles.row}>
                                <Text style={fonts.boxText}>{convertTime(el.JOBFR, {format:"HH:mm"})}</Text>
                                {
                                    (jobTo)?
                                    <>
                                        <Text style={fonts.boxText}> ~ </Text>
                                        <Text style={fonts.boxText}>{jobTo}</Text>
                                    </>
                                    : null
                                }
                            </View>
                        </View>
                    )
                })
            }
            
        </View>
    )
}

const CommuteBox = ({num, text, textStyle, onTap}) => {
    return (
            (num > 0 && onTap)?
            <TouchableOpacity onPress={onTap} style={styles.box}>
                <Text style={[fonts.boxNum, textStyle]}>{num}</Text>
                <Text style={[fonts.boxText, textStyle]}>{text}</Text>
            </TouchableOpacity>
        :
            <View style={styles.box}>
                <Text style={[fonts.boxNum, textStyle]}>{num}</Text>
                <Text style={[fonts.boxText, textStyle]}>{text}</Text>
            </View>
    )
}

const User = ({userInfo}) => {
    return (
        <View>
            <View style={styles.circle}>
                <Text style={fonts.circleText}>{userInfo.USERNA[0]}</Text>
            </View>
            <Text style={fonts.userText}>{userInfo.USERNA}</Text>
        </View>
    )
}
const fonts = StyleSheet.create({
    title:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 18,
        color: "#333333",
        marginBottom:23,
    },
    contents:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 14,
        color: "#333333",
    },
    contents2:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#333333",
    },
    userText:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#555555"
    },
    circleText:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        color: "#777777"
    },
    boxNum:{
        marginBottom:4,
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#555555"
    },
    boxText:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#777777"
    },
    
    font_Medium:{fontFamily:"SUIT-Medium"},
    font_Bold:{fontFamily:"SUIT-Bold"},
    
})
const styles = StyleSheet.create({
    container:{
        marginBottom:16,
        paddingHorizontal:16,
        paddingVertical:25,
        borderRadius: 20,
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
    row:{
        flexDirection:"row"
    },
    box:{
        alignItems:"center",
        padding:10,
        marginHorizontal:4,
        flex:1,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    sep:{
        marginHorizontal:20,
        borderWidth: 1,
        borderColor: "rgba(238, 238, 238, 1.0)"
    },
    circle:{
        justifyContent:"center",
        alignItems:"center",
        width:40,
        height:40,
        borderRadius:50,
        borderWidth: 1,
        borderColor:"rgba(238, 238, 238, 1.0)",
        marginBottom:6,
        marginRight:12,
    },
    userList:{
        flexDirection:"row",
        paddingTop:20,
    }
});
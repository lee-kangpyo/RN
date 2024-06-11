
import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, {useCallback, useEffect, useState} from 'react';
import MyCalendar from "../components/Calendar2";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { HTTP } from '../util/http';
import { YYYYMMDD2Obj, convertDateStr, convertTime, convertTime2 } from "../util/moment";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../util/color";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { setSelectedStore } from "../../redux/slices/alba";
import { CustomBottomSheet2 } from "../components/common/CustomBottomSheet2";
import ChangeWorkTime from "../components/bottomSheetContents/ChangeWorkTime";
import { useAlert } from "../util/AlertProvider";


export default function CalendarScreen() {
    const { showAlert } = useAlert();
    const userId = useSelector((state)=>state.login.userId);
    const today = convertTime2(moment(), {format : 'YYYY-MM-DD'});
    const isFocused = useIsFocused();
    // 바텀시트 열기
    const [isOpen, setIsOpen] = useState(false);
    // 점포 선택 열기
    const [isOpenJumpo, setIsOpenJumpo] = useState(false);
    // 달력 데이터
    const [data, setData] = useState({});
    //하단 카드 데이터
    const [bottomData, setBottomData] = useState(null);
    // 바텀 시트 데이터 - 일정 입력
    const [sheetData, setSheetData] = useState({})
    // [{"CSTCO": 1014, "CSTNA": "글로리맘", "color": "#C80000"}, ] 점포 정보
    const [cstListColor, setCstListColor] = useState([]);
    //선택한 날짜
    const [selectDay, setSelectDay] = useState(today);
    //초기 날짜
    const [initDay, setInitDay] = useState(selectDay)
    // main0205에서 호출할때 사용하는 state
    const [first, setFirst] = useState(true);
    
    
    const main0205 = async (ymd, isBottom) => {
        await HTTP("GET", "/v1/home/MAIN0205", {userId:userId, ymd:ymd.replaceAll("-", "")})
        .then((res)=>{
            const result = Object.assign(data, res.data.data??{})
            setData(result);
            if(first) {
                setCstListColor(res.data.cstList??[]);
                setBottomData({day:getDateObject(today), items:res.data.data[today]??[]});
                setFirst(false);
            }else{
                setBottomData({day:getDateObject(selectDay), items:res.data.data[selectDay]??[]});
            }
        }).catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(()=>{
        main0205(initDay);
    }, [isFocused])

    const moveToday = useCallback(() => {
        setInitDay(today);
        onDayTap(getDateObject(today), data[today]??[]);
    }, [data, today]);

    const onDayTap = useCallback((day, items) => {
        const d = day.dateString;
        setSelectDay(d);
        setBottomData({day:day, items:items});
        
        const dObj = d.split("-");
        const iObj = initDay.split("-");
        if(!(dObj[0] == iObj[0] && dObj[1] == iObj[1])) setInitDay(d);
    }, []);

    const onChangeMonth = useCallback((month) => {
        setInitDay(month.dateString)
        main0205(month.dateString);
    }, []);

    const onConfirm = async (params) => {
        //console.log(param);
        //exec PR_PLYC03_JOBCHECK 'AlbaJobSave', '20240605', '', 1015, 'Chaewonp3306', '09:00', '14:30', 'G', 0.5
        // await HTTP("POST", "/api/v2/daily/JumjoWorkSave", params) -- 점주가 저장할때.
        await HTTP("POST", "/api/v2/commute/AlbaJobSave", params)
        .then((res)=>{
            const dateObject = getDateObject(params.ymd);
            main0205(dateObject.dateString);
            if(res.data.resultCode == "00"){
                showAlert("근무 기록", '입력 되었습니다.',);
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    
    const openBottomSheet = (item) => {
        const jobDure = item.JOBDURE;
        const schDure = item.SCHDURE;
        if(jobDure > 0){
            setSheetData({startTime:convertTime(item.STARTTIME, {format:"HH:mm"}), endTime:convertTime(item.ENDTIME, {format:"HH:mm"}), cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA})
            setIsOpen(true);
        }else if(schDure > 0 ){
            setSheetData({startTime:convertTime(item.SCHSTART, {format:"HH:mm"}), endTime:convertTime(item.SCHEND, {format:"HH:mm"}), cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA})
            setIsOpen(true);
        }else{
            setSheetData({startTime:"09:00", endTime:"16:00", cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA})
            setIsOpen(true);
        }
    }

    // 점포 선택 화면 열기
    const openSelectJumpo = (ymd) => {
        setSheetData({startTime:"09:00", endTime:"16:00", userId:userId, ymd:ymd.replaceAll("-", "")})
        setIsOpen(false);
        setIsOpenJumpo(true);
    }
    // 점포 선택 화면 닫기
    const closeSelectJumpo = () => setIsOpenJumpo(false);
    const nextStep = (cstCo) => {
        const cst = cstListColor.find(el => el.CSTCO == cstCo);
        setIsOpenJumpo(false);
        setSheetData({...sheetData, cstCo:cst.CSTCO, cstNa:cst.CSTNA})
        setIsOpen(true);
    }
    return(
        <>
            <View style={{paddingHorizontal:15, paddingVertical:8, backgroundColor:"white"}}>
                <View style={{flexDirection:"row", alignItems:"center", marginBottom:-8, zIndex:5}}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} style={{flexDirection:"row", backgroundColor:"white", padding:8}}>
                        {
                            cstListColor.map((el, idx) => (
                                <View key={idx} style={{flexDirection:"row", paddingHorizontal:8, alignItems:"center"}}>
                                    <FontAwesome name="circle" size={16} color={el.color} />
                                    
                                    <View style={{width:6}} />
                                    <Text style={[styles.title, {color:"#111"}]}>{el.CSTNA}</Text>
                                </View>
                            ))
                        }
                    </ScrollView>
                    <View style={{alignItems:"flex-end", backgroundColor:"white", paddingHorizontal:8}}>
                        <TouchableOpacity style={{paddingHorizontal:10, paddingVertical:5, borderWidth:1, borderRadius:15, alignItems:"center"}} onPress={()=>moveToday()}>
                            <Text style={{fontFamily:"SUIT-Medium", fontSize:13}}>오늘</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <MyCalendar data={data} cstList={cstListColor} initialDate={initDay} selectDay={selectDay} onDayTap={onDayTap} onChangeMonth={onChangeMonth}/>
            </View>
            <ScrollView contentContainerStyle={{padding:15}}>
                {
                    (!bottomData)?
                        null
                    :
                        <BottomCards data={bottomData} openBottomSheet={openBottomSheet} openSelectJumpo={openSelectJumpo}/>
                }
            </ScrollView>
            {
                (Object.keys(sheetData).length > 0)?
                    <CustomBottomSheet2
                        isOpen={isOpen} 
                        onClose={()=>setIsOpen(false)}
                        content={<ChangeWorkTime dayJobInfo={sheetData} setIsOpen={setIsOpen} onConfirm={onConfirm}/>}
                    />
                :
                    null
            }
            <CustomBottomSheet2
                isOpen={isOpenJumpo}
                onClose={()=>setIsOpenJumpo(false)}
                content={
                    <SelJumPoList cstListColor={cstListColor} closeSelectJumpo={closeSelectJumpo} next={nextStep}/>
                }
            />
            
        </>
    );
}

const SelJumPoList = ({cstListColor, closeSelectJumpo, next}) => {
    const {showAlert} = useAlert();
    const [cstCo, setCstCo] = useState(0);
    const confirm = () => {
        if(cstCo > 0) {
            next(cstCo);
        }else{
            showAlert("점포 선택", "일정을 입력할 점포를 선택해 주세요.");
        }
    }
    return(
        <View>
            <ScrollView contentContainerStyle={{padding:10}} style={{maxHeight:300}}>
            {
                cstListColor.map((el, idx) => {
                    console.log(el)
                    return (
                        <TouchableOpacity onPress={()=>setCstCo(el.CSTCO)} key={idx} style={styles.jumpoBox}>
                            {
                                (cstCo == el.CSTCO)?
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={el.color} />
                                :
                                <FontAwesome name="circle" size={16} color={el.color} />
                            }
                            <View style={{width:6}} />
                            <Text style={fonts.sheetcontent}>{el.CSTNA}</Text>
                        </TouchableOpacity>
                    )
                })
            }
            </ScrollView>
            {/*하단버튼*/}
            <View style={styles.row}>
                <TouchableOpacity onPress={closeSelectJumpo} style={styles.cancel}>
                    <Text style={fonts.cancel}>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirm} style={styles.confirm}>
                    <Text style={fonts.confirm}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

function getDateObject(dateString) {
    const momentDate = moment(dateString);
    return {
        dateString: convertDateStr(dateString),
        day: momentDate.date(),
        month: momentDate.month() + 1, // month() returns 0-based month, so we add 1
        timestamp: momentDate.valueOf(),
        year: momentDate.year()
    };
}

const BottomCards = ({data, openBottomSheet, openSelectJumpo}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const day = data.day;
    const items = data.items;
    const ymdObj = YYYYMMDD2Obj(day.dateString.replaceAll("-", ""));
    const ymd = ymdObj.ymd.split(".");
    return (
        <>
        {
            (items.length == 0)?
                <View style={{padding:16}}>
                    <View style={{backgroundColor:"white", padding:16, borderRadius:10}}>
                        <Text style={styles.day}>{ymd[1]}월 {ymd[2]}일 ({ymdObj.day})</Text>
                        <View style={{height:10}} />
                        <View style={{flexDirection:"row",}}>
                            <Image source={require('../../assets/icons/clock.png')} style={{width:16, height:16, resizeMode:'contain'}} />
                            <View style={{width:8}} />
                            <Text style={styles.title}>데이터가 없습니다.</Text>
                        </View>
                        <TouchableOpacity onPress={()=>openSelectJumpo(day.dateString)} style={styles.btn}>
                            <Text style={[styles.content, {color:"#333"}]}>일정 입력 하기</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            :(items.length > 0)?
                <ScrollView style={{padding:16}}>
                    <View style={{backgroundColor:"white", padding:16, borderRadius:10}}>
                        <Text style={styles.day}>{ymd[1]}월 {ymd[2]}일 ({ymdObj.day})</Text>
                        {
                            items.map((el, idx) => (
                                <View key={idx} style={{marginBottom:8, paddingTop:18}} >
                                    <TouchableOpacity onPress={()=>{dispatch(setSelectedStore({data:el}));navigation.push("CommuteCheckDetail", {"ymd":el.YMD});}} activeOpacity={1}>
                                        <View style={{flexDirection:"row"}}>
                                            <View style={{flex:10}}>
                                                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                                                    <View style={{flexDirection:"row", alignItems:"center"}}>
                                                        <FontAwesome name="circle" size={18} color={el.color} />
                                                        
                                                        <View style={{width:6}} />
                                                        <Text style={styles.title}>{el.CSTNA}</Text>
                                                    </View>
                                                    <View style={{borderRadius:20, backgroundColor:"#3479EF", paddingHorizontal:8, paddingVertical:2}}>
                                                        <Text style={styles.pillText}>{el.ATTENDANCE}</Text>
                                                    </View>
                                                </View>
                                                <View style={{height:8}} />
                                                <View style={{flexDirection:"row"}}>
                                                    <FontAwesome name="circle" size={18} color={"white"} />
                                                    
                                                    <View style={{width:6}} />
                                                    <View>
                                                        {
                                                            (el.SCHDURE > 0) && <Text style={styles.content}>근무계획 - {convertTime(el.SCHSTART, {format:'HH:mm'})} ~ {convertTime(el.SCHEND, {format:'HH:mm'})}</Text> 
                                                        }
                                                        {
                                                            (el.JOBDURE > 0) && <Text style={styles.content}>근무시간 - {convertTime(el.STARTTIME, {format:'HH:mm'})} ~ {convertTime(el.ENDTIME, {format:'HH:mm'})}</Text>
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                            <View style={{ flex:1, justifyContent:"center", alignItems:"flex-end"}}>
                                                <MaterialIcons name="arrow-forward-ios" size={18} color="black" />
                                            </View>
                                        </View> 
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>openBottomSheet(el)} style={styles.btn}>
                                        <Text style={[styles.content, {color:"#333"}]}>근무시간 입력하기</Text>
                                    </TouchableOpacity>
                                </View>
                            ))
                        }
                    </View>
                </ScrollView>
            :
                null
        }
        </>
    );
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
        fontFamily: "SUIT-SemiBold",
        fontSize: 15,
        color: "#555555"
    },
    sheetcontent2:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#333333",
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
    workTime:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111"
    },
    typeText:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
    }
})

const styles = StyleSheet.create({
    day:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        color: "#333333"
    },
    title:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        color: "#555555"
    },
    content:{
        fontFamily: "SUIT-Medium",
        fontSize: 14,
        color: "#777777"
    },
    pillText:{
        fontFamily: "SUIT-Bold",
        fontSize: 13,
        color: "#FFFFFF"
    },
    btn:{
        marginTop:8,
        padding:2,
        borderWidth:1,
        borderRadius:5,
        alignItems:"center",
    },
    row:{flexDirection:"row"},
    jumpoBox:{flexDirection:"row", alignItems:"center", borderRadius:10, borderColor:"#555", borderWidth:1, padding:17, marginBottom:8},
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
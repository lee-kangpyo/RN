
import { Text, ScrollView, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, {useCallback, useEffect, useState} from 'react';
import MyCalendar from "../components/Calendar2";
import { FontAwesome, MaterialIcons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import { HTTP } from '../util/http';
import { YYYYMMDD2Obj, checkTimeOverlap, convertDateStr, convertTime, convertTime2, isAfterDeadLine, isFutureDate } from "../util/moment";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { theme } from "../util/color";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { setSelectedStore } from "../../redux/slices/alba";
import { CustomBottomSheet2 } from "../components/common/CustomBottomSheet2";
import { useAlert } from "../util/AlertProvider";
import ChangeSchTime from "../components/bottomSheetContents/ChangeSchTime";
import ChangeWorkTime2 from "../components/bottomSheetContents/ChangeWorkTime2";


export default function CalendarScreen() {
    const { showAlert } = useAlert();
    const userId = useSelector((state)=>state.login.userId);
    const today = convertTime2(moment(), {format : 'YYYY-MM-DD'});
    
    // 점주 마감 날짜 현재는 이전달 말일까지 자동 제한
    const [deadLine, setDeadLine] = useState(convertTime2(moment().subtract(1, 'months').endOf('month'), {format : 'YYYY-MM-DD'}));

    const isFocused = useIsFocused();
    // 결과 바텀시트 열기
    const [isOpen, setIsOpen] = useState(false);
    // 점포 선택 바텀시트 열기
    const [isOpenJumpo, setIsOpenJumpo] = useState(false);
    // 계획 바텀시트 열기
    const [isOpenSch, setIsOpenSch] = useState(false);
    // 달력 데이터
    const [data, setData] = useState({});
    //하단 카드 데이터
    const [bottomData, setBottomData] = useState(null);
    // 달력 터치했을때 가져올 데이터.
    const [bottomData2, setBottomData2] = useState(null);
    
    // 바텀 시트 데이터 - 근무 시간일정 입력
    const [sheetData, setSheetData] = useState({});
    //하단 카드 데이터 - 근무 계획 입력
    const [sheetSchData, setSheetSchData] = useState({});
    // [{"CSTCO": 1014, "CSTNA": "글로리맘", "color": "#C80000"}, ] 점포 정보
    const [cstListColor, setCstListColor] = useState([]);
    //선택한 날짜
    const [selectDay, setSelectDay] = useState(today);
    //초기 날짜
    const [initDay, setInitDay] = useState(selectDay);
    // main0205에서 호출할때 사용하는 state
    const [first, setFirst] = useState(true);
    const [wageInfo, setWageInfo] = useState([])
    
    const main0205 = async (ymd, isBottom) => {
        const newData = Object.keys(data)
            .filter(key => key != ymd)
            .reduce((obj, key) => {
                obj[key] = data[key];
                return obj;
            }, {});
        
        await HTTP("GET", "/v1/home/MAIN0205", {userId:userId, ymd:ymd.replaceAll("-", "")})
        .then((res)=>{
            const result = Object.assign(newData, res.data.data??{})
            setData(result);
            if(first) {
                setCstListColor(res.data.cstList??[]);
                setBottomData({day:getDateObject(today), items:res.data.data[today]??[]});
                setFirst(false);
            }else{
                setBottomData({day:getDateObject(selectDay), items:res.data.data[selectDay]??[]});
            }
            setWageInfo(res.data.wageInfo);
        }).catch(function (error) {
            console.log(error);
        })
    }
    
    //exec PR_PLYA00_MAIN02 'MAIN0206', 0, 'Sksksksk', '20240625', '', ''
    const main0206 = async (ymd) => {
        await HTTP("GET", "/v1/home/MAIN0206", {userId:userId, ymd:ymd.replaceAll("-", "")})
        .then((res)=>{
            setBottomData2(res.data.data);
        }).catch(function (error) {
            console.log(error);
        })
    }
    
    useEffect(()=>{
        main0205(initDay);
        main0206(initDay)
    }, [isFocused])

    const moveToday = useCallback(() => {
        setInitDay(today);
        onDayTap(getDateObject(today), data[today]??[]);
    }, [data, today]);

    const onDayTap = useCallback( async (day, items) => {
        const d = day.dateString;
        main0206(d);
        
        setSelectDay(d);
        setBottomData({day:day, items:items});
        
        const dObj = d.split("-");
        const iObj = initDay.split("-");
        if(!(dObj[0] == iObj[0] && dObj[1] == iObj[1])) setInitDay(d);
    }, []);

    const onChangeMonth = useCallback((month) => {
        setInitDay(month.dateString);
        main0205(month.dateString);
        main0206(month.dateString);
    }, []);

    //근무 결과 입력
    const onConfirm = async (params) => {
        const check = bottomData2.filter(el => el.cl=="JOB" && el.CSTCO == params.cstCo && el.JOBCL != params.jobCl);
        if(check.length > 0){
            const job = check[0];
            const isProceed = checkTimeOverlap( convertTime(job.STARTTIME, {format:"HH:mm"}), convertTime(job.ENDTIME, {format:"HH:mm"}), params.sTime, params.eTime );
            if(!isProceed){
                showAlert("알림", "입력하신 시간이 중복됩니다.\n 일반, 대타 시간을 다시 한번 확인해주세요.");
                return;
            }
        }
        setIsOpen(false);
        await HTTP("POST", "/api/v2/commute/AlbaJobSave", params)
        .then((res)=>{
            const dateObject = getDateObject(params.ymd);
            main0205(dateObject.dateString);
            main0206(dateObject.dateString);
            if(res.data.resultCode == "00"){
                showAlert("근무 기록", '입력 되었습니다.',);
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    const reload = () => {
        console.log("reload");
        //setIsOpen(false);
    }
    
    //근무 계획 입력
    const onConfirmSch = async (params) => {
        // exec PR_PLYA02_ALBASCHMNG @cls, @cstCo, @userId, @ymdFr, @ymdTo, @jobCl, @sTime, @eTime
        // exec PR_PLYA02_ALBASCHMNG ‘WeekAlbaScheduleSave’, ‘1021’, ‘Sksksksk’, ‘20240617’, ‘’, ‘2’, ‘07:00’, ‘12:00’
        const p = {...sheetSchData, ...params};
        await HTTP("POST", "/api/v2/commute/AlbaSchSave", p)
        .then((res)=>{
            const dateObject = getDateObject(p.ymdFr);
            main0205(dateObject.dateString);
            main0206(dateObject.dateString);
            if(res.data.resultCode == "00"){
                showAlert("근무 계획", '입력 되었습니다.',);
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    
    const openBottomSheet = (item) => {

        const data = bottomData2.reduce((result, el)=>{
            if(el.CSTCO == item.CSTCO && el.cl == "JOB"){
                return [...result, {startTime:convertTime(el.STARTTIME, {format:"HH:mm"}), endTime:convertTime(el.ENDTIME, {format:"HH:mm"}), brkDure:el.BRKDURE / 60, jobCl:el.JOBCL, cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA, wage:el.wage}];
            }
            return result;
        }, [])
        console.log("onpenBottomSheet");
        console.log(data);
        const g = data.find(el => el.jobCl == "G") ?? {startTime:"09:00", endTime:"16:00", brkDure:0, jobCl:"G", tmp:true, cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA};
        const s = data.find(el => el.jobCl == "S") ?? {startTime:"09:00", endTime:"16:00", brkDure:0, jobCl:"S", tmp:true, cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA};
        setSheetData([g, s]);
        setIsOpen(true);
        
        //const data = bottomData2.filter(el => el.CSTCO == item.CSTCO && el.cl == "JOB")

        // const jobDure = item.JOBDURE;
        // const schDure = item.SCHDURE;
        // const brkDure = item.BRKDURE ?? 0;
        
        // if(jobDure > 0){
        //     const param = {startTime:convertTime(item.STARTTIME, {format:"HH:mm"}), endTime:convertTime(item.ENDTIME, {format:"HH:mm"}), cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA, brkDure:brkDure};
        //     setSheetData(param);
        //     setIsOpen(true);
        // }else if(schDure > 0 ){
        //     setSheetData({startTime:convertTime(item.SCHSTART, {format:"HH:mm"}), endTime:convertTime(item.SCHEND, {format:"HH:mm"}), cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA, brkDure:brkDure})
        //     setIsOpen(true);
        // }else{
        //     setSheetData({startTime:"09:00", endTime:"16:00", cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA, brkDure:brkDure})
        //     setIsOpen(true);
        // }
    }

    const [selectYmd, setSelectYmd] = useState("");
    // 점포 선택 화면 열기
    const openSelectJumpo = (ymd) => {
        setSelectYmd(ymd.replaceAll("-", ""));
        // {startTime:"09:00", endTime:"16:00", brkDure:0, jobCl:"S", cstCo:item.CSTCO, userId:item.USERID, ymd:item.YMD, cstNa:item.CSTNA}
        const params = [{startTime:"09:00", endTime:"16:00", brkDure:0, jobCl:"G", userId:userId, ymd:ymd.replaceAll("-", "")},
                        {startTime:"09:00", endTime:"16:00", brkDure:0, jobCl:"S", userId:userId, ymd:ymd.replaceAll("-", "")}]
        setSheetData(params);
        setIsOpen(false);
        setIsOpenJumpo(true);
    }
    // 점포 선택 화면 닫기
    const closeSelectJumpo = () => setIsOpenJumpo(false);
    // 점포 선택후 다음으로 넘기기
    const nextStep = (cstCo, type) => {
        const cst = cstListColor.find(el => el.CSTCO == cstCo);
        setIsOpenJumpo(false);
        if(type == "계획"){
            // 만약 계획이 추가되면 수정해야됨.. 데이터가 바뀌었다.
            const param = {cstCo:cst.CSTCO, userId:sheetData.userId, ymdFr:sheetData.ymd, ymdTo:"", jobCl:1, sTime:sheetData.startTime, eTime:sheetData.endTime}    
            setSheetSchData(param);
            setIsOpenSch(true);
        }else if(type == "근무"){
            const params = sheetData.map(it => { return {...it, cstCo:cst.CSTCO, cstNa:cst.CSTNA} });
            setSheetData(params);
            setIsOpen(true);
        }
    }
    //계획 열기
    const openSch = (item) => {
        const param = {cstCo:item.CSTCO, userId:item.USERID, ymdFr:item.YMD, ymdTo:"", jobCl:1, sTime:convertTime(item.SCHSTART, {format:"HH:mm"}), eTime:convertTime(item.SCHEND, {format:"HH:mm"})}
        setSheetSchData(param);
        setIsOpenSch(true);
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
            <ScrollView contentContainerStyle={{padding:0}}>
                {
                    (!bottomData || !bottomData2)?
                        null
                    :
                        <BottomCards deadLine={deadLine} data={bottomData} data2={bottomData2} openBottomSheet={openBottomSheet} openSelectJumpo={openSelectJumpo} openSch={openSch}/>
                }
            </ScrollView>
            {
                (Object.keys(sheetData).length > 0)?
                    <CustomBottomSheet2
                        isOpen={isOpen} 
                        onClose={()=>setIsOpen(false)}
                        content={<ChangeWorkTime2 wageInfo={wageInfo.filter(el => el.CSTCO == sheetData[0].cstCo)[0]} dayJobInfo={sheetData} setIsOpen={setIsOpen} onConfirm={onConfirm} reload={reload}/>}
                    />
                :
                    null
            }
            <CustomBottomSheet2
                isOpen={isOpenJumpo}
                onClose={()=>setIsOpenJumpo(false)}
                content={
                    <SelJumPoList ymd={selectYmd} item={data[convertDateStr(selectYmd)]??[]} cstListColor={cstListColor} closeSelectJumpo={closeSelectJumpo} next={nextStep}/>
                }
            />
            {
                (Object.keys(sheetSchData).length > 0)?
                    <CustomBottomSheet2
                        isOpen={isOpenSch}
                        onClose={()=>setIsOpenSch(false)}
                        content={<ChangeSchTime item={sheetSchData} setIsOpen={setIsOpenSch} onConfirm={onConfirmSch}/>}
                    />
                :
                    null
            }
        </>
    );
}

const SelJumPoList = ({ymd, item, cstListColor, closeSelectJumpo, next}) => {
    const data = cstListColor.reduce((rslt, next)=>{
        const itm = item.find(el => el.CSTCO == next.CSTCO);
        if(itm){
            rslt.push({...next, disabled:true});
        }else{
            rslt.push({...next, disabled:false});
        }
        return rslt
    }, []);
    
    const isFuture = isFutureDate(ymd);
    const [type, setType] = useState((isFuture)?"계획":"근무");
    const {showAlert} = useAlert();
    const [cstCo, setCstCo] = useState(0);
    const confirm = () => {
        if(cstCo > 0) {
            next(cstCo, type);
        }else{
            showAlert("점포 선택", "계획을 입력할 점포를 선택해 주세요.");
        }
    }
    useEffect(()=>{
        setType((isFuture)?"계획":"근무");
        setCstCo(0);
    }, [ymd, item])

    const cancel = () => {
        setCstCo(0);
        closeSelectJumpo();
    }
    return(
        <View>
            <View style={{alignItems:"center"}}>
                <Text style={fonts.workTime}>입력할 점포를 선택해주세요.</Text>
            </View>
            <View style={{height:8}}/>
            <ScrollView contentContainerStyle={{paddingHorizontal:10}} style={{maxHeight:300}}>
            {
                data.map((el, idx) => {
                    return (
                        <TouchableOpacity disabled={el.disabled} onPress={()=>setCstCo(el.CSTCO)} key={idx} style={[styles.jumpoBox, {borderColor:(el.disabled)?"#ddd":(cstCo == el.CSTCO)?theme.primary:"#555"}, ]}>
                            {
                                (el.disabled)?
                                    <AntDesign name="closecircle" size={16} color={el.color} />
                                :(cstCo == el.CSTCO)?
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color={el.color} />
                                :
                                <FontAwesome name="circle" size={16} color={el.color} />
                            }
                            <View style={{width:6}} />
                            <Text style={[fonts.sheetcontent, {color:(el.disabled)?"#ddd":"#111"}]}>{el.CSTNA}</Text>
                        </TouchableOpacity>
                    )
                })
            }
            </ScrollView>
            {/* [계획 입력 제거]로 주석처리 
                <View style={{padding:10}}>
                <View style={{alignItems:"center"}}>
                    <Text style={fonts.workTime}>유형을 선택해주세요.</Text>
                </View>
                <BtnSet isFuture={isFuture} fncLeft={()=>setType("계획")} fncRight={()=>setType("근무")} selected={type}/>
                <View style={{height:8}}/>
                <View style={{backgroundColor:"#f1f1f1", padding:5, borderRadius:5}}>
                    <View style={{flexDirection:"row", paddingBottom:4, alignItems:"center"}}>
                        {
                            (type == "근무")?
                                <>
                                    <Text style={[fonts.hint, {fontWeight:"bold"}]}>근무</Text>
                                    <Text style={fonts.hint}>: 실제로 일한 시간</Text>
                                </>
                            :(type == "계획")?
                                <>
                                    <Text style={[fonts.hint, {fontWeight:"bold"}]}>계획</Text>
                                    <Text style={fonts.hint}>: 계획된 시간</Text>
                                </>
                            :null
                        }
                    </View>
                    {
                        (type=="계획")?<Text style={fonts.hint}>계획을 미리 입력하면 자동으로 근무가 기록됩니다.</Text>:null
                    }
                </View>
            </View> */}
            {/*하단버튼*/}
            <View style={styles.row}>
                <TouchableOpacity onPress={cancel} style={styles.cancel}>
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

const BottomCards = ({deadLine, data, data2, openBottomSheet, openSelectJumpo, openSch}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch()
    const day = data.day;
    const items = data.items;
    const ymdObj = YYYYMMDD2Obj(day.dateString.replaceAll("-", ""));
    const ymd = ymdObj.ymd.split(".");
    const isFuture = isFutureDate(day.dateString);
    
    //마감일 이후인지 체크
    const isAfter = isAfterDeadLine(deadLine, day.dateString);
    return (
        <>
        {
            (items.length == 0)?
                <View style={{padding:16}}>
                    <View style={{backgroundColor:"white", padding:16, borderRadius:10}}>
                        <View style={[styles.row, {justifyContent:"space-between", alignItems:"center"}]}>
                            <Text style={styles.day}>{ymd[1]}월 {ymd[2]}일 ({ymdObj.day})</Text>
                            {/*[계획 입력 제거]로 미래는 입력 막기 */
                                (isFuture)?null:
                                <TouchableOpacity onPress={()=>openSelectJumpo(day.dateString)}>
                                    <AntDesign name="plussquare" size={24} color={theme.link} />
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{height:10}} />
                        <View style={{flexDirection:"row",}}>
                            <Image source={require('../../assets/icons/clock.png')} style={{width:16, height:16, resizeMode:'contain'}} />
                            <View style={{width:8}} />
                            <Text style={styles.title}>데이터가 없습니다.</Text>
                        </View>
                        {/* <BtnSet isFuture={isFuture} fncLeft={goSchPage} fncRight={()=>openSelectJumpo(day.dateString)} />  */}
                    </View>
                </View>
            :(items.length > 0 && data2.length > 0)?
                <ScrollView style={{padding:16}}>
                    <View style={{backgroundColor:"white", padding:16, borderRadius:10}}>
                        <View style={[styles.row, {justifyContent:"space-between", alignItems:"center"}]}>
                            <Text style={styles.day}>{ymd[1]}월 {ymd[2]}일 ({ymdObj.day})</Text>
                            <TouchableOpacity onPress={()=>openSelectJumpo(day.dateString)}>
                                <AntDesign name="plussquare" size={24} color={theme.link} />
                            </TouchableOpacity>
                        </View>
                        {
                            items.map((el, idx) => {
                                const it = data2.filter(dt2 => dt2.CSTCO == el.CSTCO);
                                return (
                                    <View key={idx} style={{marginBottom:8, paddingTop:18}} >
                                        {/* {<TouchableOpacity onPress={()=>{dispatch(setSelectedStore({data:el}));navigation.push("CommuteCheckDetail", {"ymd":el.YMD});}} activeOpacity={1}>} */}
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
                                                            <BottomCardContent data={it} />
                                                        </View>
                                                    </View>
                                                </View>
                                                {/* <View style={{ flex:1, justifyContent:"center", alignItems:"flex-end"}}>
                                                    <MaterialIcons name="arrow-forward-ios" size={18} color="black" />
                                                </View> */}
                                            </View> 
                                        {/* {</TouchableOpacity>} */}
                                        {   /*color가 없으면 퇴사일 확률이 높음(예외사항은 확인안해봄. isAfter는 현재는 이번달 이전은 입력 불가)*/
                                            (el.color && isAfter)?
                                                <BtnSet isFuture={isFuture} fncLeft={()=>openSch(el)} fncRight={()=>{openBottomSheet(el)}} /> 
                                            :
                                                null
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>
                </ScrollView>
            :
                null
        }
        </>
    );
}

const BottomCardContent = ({data}) =>{
    return(
        <>
        {
            (data.length > 0)?
                data.map((el, idx) => {
                    return (
                        <View key={idx} style={{flexDirection:"row"}}>
                            <Text style={styles.content}>{(el.cl == "JOB")?"근무":"계획"} - </Text>
                            <Text style={styles.content}>{convertTime(el.STARTTIME, {format:'HH:mm'})} ~ {convertTime(el.ENDTIME, {format:'HH:mm'})} ({(el.JOBDURE - el.BRKDURE) / 60}시간)</Text>
                            <Text style={styles.content}>{(el.cl == "JOB" && el.JOBCL == "G")?"(일반)":(el.cl == "JOB" && el.JOBCL == "S")?"(대타)":null}</Text>
                            {(el.BRKDURE > 0) && <Text  style={styles.content}>, 휴게:{el.BRKDURE / 60}</Text>}
                        </View>
                    )
                })
            :null
        }
        </>
    )
}

const BtnSet = ({isFuture, fncLeft, fncRight, selected}) => {
    return (
        <>
        {
        (isFuture)?
            null
        :
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={()=>fncRight()} style={[styles.btn, {borderColor:(selected == "근무")?theme.primary:"#888"}]}>
                    <Text style={[styles.content, {color:"#333"}]}>근무</Text>
                </TouchableOpacity>
            </View>
        }
        {/* [계획 입력 제거]로 주석처리
        (isFuture)?
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={fncLeft} style={[styles.btn, {borderColor:(selected == "계획")?theme.primary:"#888"}]}>
                    <Text style={[styles.content, {color:"#333"}]}>계획</Text>
                </TouchableOpacity>
            </View>
        :
            <View style={{flexDirection:"row"}}>
                <TouchableOpacity onPress={fncLeft} style={[styles.btn, {borderColor:(selected == "계획")?theme.primary:"#888"}]}>
                    <Text style={[styles.content, {color:"#333"}]}>계획</Text>
                </TouchableOpacity>
                <View style={{width:16}} />
                <TouchableOpacity onPress={()=>fncRight()} style={[styles.btn, {borderColor:(selected == "근무")?theme.primary:"#888"}]}>
                    <Text style={[styles.content, {color:"#333"}]}>근무</Text>
                </TouchableOpacity>
            </View>
        */}
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
    },
    hint:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#999"
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
        padding:10,
        borderWidth:1,
        borderRadius:5,
        borderColor:"#888",
        alignItems:"center",
        flex:1,
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
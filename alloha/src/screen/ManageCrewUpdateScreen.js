import { ActivityIndicator, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, Animated, Easing} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ScheduleByAlba from '../components/schedule/ScheduleByAlba';
import { getStartAndEndOfWeek } from '../util/moment';
import MyStorePicker from '../components/alba/MyStorePicker';
import PushTest from '../components/test/PushTest';
import HeaderControl from '../components/common/HeaderControl';
import { nextMonth, prevMonth } from '../../redux/slices/result';
import { HTTP } from '../util/http';
import { useAlert } from '../util/AlertProvider';
import { theme } from '../util/color';
import CustomInput from '../components/common/CustomInput';
import CustomSwitch from '../components/common/CustomSwitch';
import CustomBtn from '../components/CustomBtn';
import CustomButton from '../components/common/CustomButton';
import CustomStandardBtn from '../components/common/CustomStandardBtn';
import { CustomBottomSheet2 } from '../components/common/CustomBottomSheet2';
import { calculateDifference, formatTimeObject, parseTimeString } from '../util/timeParser';
import { FontAwesome5, AntDesign  } from '@expo/vector-icons';
import { headerLeftComponent, headerLeftNon } from '../util/utils';
import { Confirm } from '../util/confirm';
import TimePicker_24 from '../components/library/TimePicker_24';


export default function ManageCrewUpdateScreen({navigation, route}) {
    const {cstCo, userId, userNa, mode} = route.params; 
    const {showAlert} = useAlert();
    const dispatch = useDispatch();
    const iUserId = useSelector((state)=>state.login.userId);
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const date = useSelector((state) => state.result.month);
    const [loading, setLoading] = useState(true);
    const [isSubmit, setIsSumbmit] = useState(false);                                            // 수정하기 버튼 클릭시 로딩 화면 덮는 스테이트
    const [isOpen, setIsOpen] = useState(false);                                                // 시작시간, 종료시간 입력 바텀 시트
    const animLeft = useRef(new Animated.Value(-1000)).current;                                 // 고정 근무 시간 입력 화면 처음 위치
    const [checks, setChecks] = useState([false, false, false, false, false, false, false]);    //고정 근무 시간 입력 화면에 체크박스 체크 여부
    // 생성할 파라메터
    const [wageType, setWageType] = useState(0);                                                // 급여형태
    const [wage, setWage] = useState(9860);                                                     // 시급
    const [wage2, setWage2] = useState(2000000);                                                // 월급
    const [foodWage, setFoodWage] = useState(0);                                                // 식대
    const [isWeekWage, setIsWeekWage] = useState(true)                                          // 주휴수당 여부
    const [isSch, setIsSch] = useState(false)                                                   // 고정 근무 시간 여부
    const [weeks, setWeeks] = useState({0:[], 1:[], 2:[], 3:[], 4:[], 5:[],6:[],});             // 선택된 요일

    useEffect(()=>{
        navigation.setOptions({ headerLeft:()=>headerLeftComponent((mode == "create")?"승인":"수정"), title:"" })
        searchAlbaWork();
    }, []);

    const searchAlbaWork = async () => {
        await HTTP("GET", "/api/v2/manageCrew/searchAlbaWork", {cstCo, userId})
        .then((res)=>{
            if(res.data.resultCode == "00"){//저장된 정보있음
                const basicInfo = res.data.basicInfo;
                const wageType = (basicInfo.jobType == "H")?0:1;
                setWageType(wageType);
                (wageType == 0)?setWage(basicInfo.basicWage):setWage2(basicInfo.basicWage);
                setFoodWage(basicInfo.mealAllowance);
                setIsWeekWage((basicInfo.isWeekWage == "Y")?true:false);
                setIsSch((basicInfo.isSch == "Y")?true:false);
                setWeeks(res.data.weeks);
            }else if(res.data.resultCode == "01"){
                console.log("저장된 정보 없음");
            }
        }).catch(function (error) {
            console.log(error);
        }).finally(function (){
            setLoading(false);
        })
    } 
    //sumbmit에서 사용하는 함수
    function _checkIfAnyNotEmpty(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key) && obj[key].length > 0) {
                return true;
            }
        }
        return false;
    }
    const sumbmit = async () => {
        setIsSumbmit(true);
        const jobType = (wageType == 0)?"H":"M";
        const w = (wageType == 0)?wage:wage2;
        const mealAllowance = (wageType == 0)?0:foodWage;
        const sch = isSch && _checkIfAnyNotEmpty(weeks);
        for (const key in weeks) {
            const week = weeks[key];
            if(week.length > 0){
                const jobDure = calculateDifference(week[0], week[1]);
                week[2] = jobDure;
            }
        }
        
        const param = {jobType, wage:w, mealAllowance, isWeekWage, isSch:sch, weeks, cstCo, userId, iUserId};
        
        await HTTP("POST", "/api/v2/manageCrew/update", param)
        .then((res)=>{
            if(res.data.resultCode == "00"){
                if(mode == "create"){
                    showAlert("승인", "승인 하였습니다.")
                }else{
                    showAlert("수정", "수정 되었습니다.")
                }
            }
        }).catch(function (error) {
            console.log(error);
            //showAlert("수정 하기", "수정 되었습니다.")
        }).finally(()=>{
            setIsSumbmit(false);
            navigation.pop();
        })
    }

    const create = async () => {
        Confirm("승인", `지원 하신${userNa}님을 승인하시겠습니까?`, "아니오", "네", async ()=>{
            setIsSumbmit(true);
            // 승인처리
            await HTTP("POST", `/api/v1/changeCrew`, {cstCo:cstCo, userId:userId, rtCl:"N"})
            .then((res)=>{
                if(res.data.result === 1){
                    sumbmit()
                    //searchCrewList();
                    // 병합체크
                    // if(check.data.result.length ?? 0 > 0){
                    //     const tmpId = check.data.result[0].USERID // 점주가 생성한 아이디
                    //     Confirm("근무 병합", `승인된 [${userNa}]님과 동일한 전화 번호로 점주가 직접 생성한 아이디가 있습니다. 근무 기록을 병합 하시겠습니까?`, "아니오", "네", async ()=>{
                    //         await axios.post(URL+`/api/v1/changeAlbaUpdate`, {hpNo:hpNo, cstCo:cstCo, userId:tmpId})
                    //         .then((res)=>{
                    //             if(res.data.resultCode === "00"){
                    //                 Alert.alert("알림", "병합되었습니다.")
                                    
                    //             }else{
                    //                 Alert.alert("알림", "근무 병합 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                    //             }
                    //         }).catch(function (error) {
                    //             console.log(error);
                    //             Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                    //         })
                    //     })
                    // }else{
                    //     Alert.alert("알림", "승인 하였습니다.")
                    //     searchCrewList();
                    // }
                }else{
                    Alert.alert("알림", "승인 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        })
    }


    const goWeeksTime = () => {// 고정 근무 시간 입력 화면으로 변경
        navigation.setOptions({
                headerLeft:() => headerLeftNon(), 
                title:"고정 근무 시간 변경", 
                headerRight:()=><TouchableOpacity onPress={modifySelectors}><Text style={fonts.textLink}>선택 수정</Text></TouchableOpacity>,
            })
        Animated.timing(animLeft, {
            toValue: 0, // 어떤 값으로 변경할지 - 필수
            duration: 200, // 애니메이션에 걸리는 시간(밀리세컨드) - 기본값 500
            delay: 0, // 딜레이 이후 애니메이션 시작 - 기본값 0
            useNativeDriver: true, // 네이티브 드라이버 사용 여부 - 필수
            isInteraction: true, // 사용자 인터랙션에 의해 시작한 애니메이션인지 지정 - 기본값 true
            easing: Easing.inOut(Easing.ease), // 애니메이션 속성 변경 함수 - 기본값 Easing.inOut(Easing.ease)
          }).start(() => {
            // 애니메이션 처리 완료 후 실행할 작업
            console.log("열기")
          })
    }
    
    const backWeeksTime = () => {
        navigation.setOptions({headerLeft:()=>headerLeftComponent((mode == "create")?"승인":"수정"), title:"", headerRight:()=>null})
        Animated.timing(animLeft, {
            toValue: -500, // 어떤 값으로 변경할지 - 필수
            duration: 200, // 애니메이션에 걸리는 시간(밀리세컨드) - 기본값 500
            delay: 0, // 딜레이 이후 애니메이션 시작 - 기본값 0
            useNativeDriver: true, // 네이티브 드라이버 사용 여부 - 필수
            isInteraction: true, // 사용자 인터랙션에 의해 시작한 애니메이션인지 지정 - 기본값 true
            easing: Easing.inOut(Easing.ease), // 애니메이션 속성 변경 함수 - 기본값 Easing.inOut(Easing.ease)
        }).start(() => {
            // 애니메이션 처리 완료 후 실행할 작업
            setChecks([false, false, false, false, false, false, false]);
        })
    }

    const modifySelectors = () => {
        const cnt = checks.reduce((cnt, el) => (el == true)?cnt+1:cnt, 0);
        if(cnt > 0){
            setIsOpen(true)
        }else{
            showAlert("체크 항목 없음", "체크된 항목이 없습니다. 변경하실 요일을 체크해주세요.")
        }
    }
    return (
        (loading)?
            <View style={styles.container}>
                <View style={{flex:1, justifyContent:"center"}}>
                    <ActivityIndicator />
                </View>
            </View>
        :
        <>
        {
            (isSubmit)?
                <View style={{flex:1, justifyContent:"center", position:"absolute", width:"100%", height:"100%", zIndex:10, backgroundColor:"rgba(0,0,0,0.5)"}}>
                    <ActivityIndicator />
                </View>
            :null
        }
            <View style={[styles.container, {paddingTop:25, justifyContent:"space-between"}]}>
                <ScrollView>
                    <BlockContent label={"급여형태"} component={<WageType wageType={wageType} setWageType={setWageType}/>}/>
                    <BlockContent label={"급여"} subLabel={(wageType==0)?"2024년 최저 시급 9,860원":""} component={<WageInput value={(wageType == 0)?wage:wage2} onChangeText={(v)=>{(wageType == 0)?setWage(v):setWage2(v)}} />}/>
                    {
                        (wageType==0)?
                            <SwitchContent label={"주휴 수당"} isOn={isWeekWage} setIsOn={setIsWeekWage}/>
                        :  
                            <BlockContent label={"식대"} component={<WageInput value={foodWage} onChangeText={(v)=>{setFoodWage(v)}} />}/>

                    }
                    {/* <SwitchContent label={"근무 시간"} isOn={isSch} setIsOn={setIsSch}/> */}
                    <View style={{height:12}} />
                    {
                        (isSch)?
                            <>
                                <BlockContent label={"요일"} subComponent={<TouchableOpacity onPress={goWeeksTime}><Text style={fonts.subComponent}>수정하기</Text></TouchableOpacity>} component={<WeekBoxs weeks={weeks} />}/>
                            </>
                        :null
                    }
                </ScrollView>
                <CustomStandardBtn style={{flex:1}} text={(mode == "create")?(wageType==0)?"시급 승인 하기":"월급 승인 하기":(wageType==0)?"시급 수정 하기":"월급 수정 하기"} onPress={(mode == "create")?create:sumbmit}/>
            </View>
            <CustomBottomSheet2
                isOpen={isOpen}
                onClose={()=>console.log("onClose")}
                content={<BotSheet setIsOpen={setIsOpen} data={{checks, setChecks, weeks2: weeks, setWeeks2: setWeeks}}/>}
            />
            {/*고정 근무 시간 입력 화면*/}
            <Animated.View  style={[styles.container, {paddingTop:30, position:"absolute", width:"100%", height:"100%", transform: [{translateX: animLeft}]}]}>
                <View style={{flex:1}}>
                    {/* <View style={{justifyContent:"flex-end", marginBottom:16, flexDirection:"row"}}>
                        <TouchableOpacity onPress={backWeeksTime} style={{flexDirection:"row", alignItems:"center"}}>
                            <FontAwesome5 name="arrow-alt-circle-left" size={20} color="#777" />
                            <Text style={[fonts.textLink, {marginLeft:4}]}>뒤로가기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={modifySelectors}>
                            <Text style={fonts.textLink}>선택 수정</Text>
                        </TouchableOpacity>
                    </View> */}
                    <WeekBoxs2 weeks={weeks} setWeeks={setWeeks} checkState={{checks, setChecks}} openBottomSheet={()=>setIsOpen(true)} />
                </View>
                <CustomStandardBtn style={{flex:1}} text={"확인"} onPress={ backWeeksTime }/>
            </Animated.View >
        </>
    );
}
//급여형태
const WageType = ({wageType, setWageType}) => {
    const hColor = wageType === 0 && styles.sepSelected;
    const mColor = wageType === 1 && styles.sepSelected;
    const hTxt = wageType === 0 && styles.sepSelectedText;
    const mTxt = wageType === 1 && styles.sepSelectedText;
    const hCircle = (wageType === 0)?theme.primary:"#999";
    const mCircle = (wageType === 1)?theme.primary:"#999";
    return(
        <View style={[styles.sep, {height:50}]}>
            <TouchableWithoutFeedback onPress={()=>setWageType(0)}>
                <View style={[styles.sepTap, hColor]}>
                    <AntDesign name="checkcircle" size={16} color={hCircle} />
                    <View style={{width:8}}/>
                    <Text style={[styles.sepTxt, hTxt]}>시급</Text>
                </View>
            </TouchableWithoutFeedback>
            <View style={{width:10}} />
            <TouchableWithoutFeedback onPress={()=>setWageType(1)}>
                <View style={[styles.sepTap, mColor]}>
                    <AntDesign name="checkcircle" size={16} color={mCircle} />
                    <View style={{width:8}}/>
                    <Text style={[styles.sepTxt, mTxt]}>월급</Text>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}
//급여
const WageInput = ({value, onChangeText}) => {
    const [txt, setTxt] = useState(value.toLocaleString());
    useEffect(()=>{
        setTxt(value.toLocaleString());
    }, [value]);
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[fonts.input, {flex:1, textAlign:"right", marginRight:8}]}
                keyboardType='number-pad'
                onChangeText={(value) => {
                    const valNum = Number(value.replaceAll(",", ""));
                    setTxt(valNum.toLocaleString());
                    onChangeText(valNum);
                }}
                value={txt}
            />
            <Text style={fonts.input}>원</Text>
        </View>
    )
}
//요일
function WeekBoxs ({weeks}) {
    return (
        <View style={[styles.weekLine, {flexDirection:"column",}]}>
            {
                ["일", "월", "화", "수", "목", "금", "토"].map((el, idx) => {
                    return(
                        <View key={idx} style={{alignItems:"center", flexDirection:"row", justifyContent:"space-between", borderBottomWidth:1, borderColor:"#ddd", padding:13, paddingHorizontal:48}}>
                            <View key={idx} onPress={()=>boxTap(idx)}>
                                <Text style={fonts.week}>{el}</Text>
                            </View>
                            {
                                (weeks[idx].length > 0)?
                                    <View style={{alignItems:"center", flexDirection:"row"}}>
                                        <Text style={fonts.weekSub}>{weeks[idx][0]}</Text>
                                        <Text style={[fonts.weekSub, {marginHorizontal:8}]}>~</Text>
                                        <Text style={fonts.weekSub}>{weeks[idx][1]}</Text>
                                    </View>
                                :
                                    <View style={{alignItems:"center", width:120}}>
                                        <Text style={fonts.weekSub}>-</Text>
                                    </View>
                            }
                            
                        </View>
                    )
                })
            }
        </View>
    )
}
function WeekBoxs2 ({weeks, setWeeks, checkState, openBottomSheet}) {
    
    const {checks, setChecks} = checkState;
    const checkTap = (idx) => {
        checks[idx] = !checks[idx];
        setChecks([...checks]);
    }
    const deleteIndex = (idx) => {
        console.log("deleteIndex", idx);
        weeks[idx] = [];
        setWeeks({...weeks});
    }
    const addIndex = (idx) => {
        console.log("addIndex", idx);
        newCheck = [false, false, false, false, false, false, false];
        newCheck[idx] = true;
        setChecks([...newCheck]);
        openBottomSheet();
    }
    return (
        <View style={[styles.weekLine2, {paddingHorizontal:10}]}>
            {
                ["일", "월", "화", "수", "목", "금", "토"].map((el, idx) => {
                    return(
                        <View key={idx} style={{flexDirection:"row", marginBottom:16}}>
                            <TouchableOpacity onPress={()=>checkTap(idx)} style={{justifyContent:"center", marginRight:13}}>
                                {
                                (checks[idx])?
                                    <AntDesign name="checkcircle" size={22} color={theme.green} />
                                :
                                    <AntDesign name="checkcircle" size={22} color={"#dfdfdf"} />
                                }
                            </TouchableOpacity>
                            <View key={idx} onPress={()=>boxTap(idx)}  style={[styles.weekBox, {width:50, height:50}, (weeks[idx].length > 0)?styles.sel:null]}>
                                <Text style={[fonts.week, {fontSize:14}, (weeks[idx].length > 0)?fonts.sel:null]}>{el}</Text>
                            </View>
                            {
                                (weeks[idx].length > 0)?
                                    <>
                                        <View style={{alignItems:"center", flexDirection:"row", flex:1}}>
                                            <TouchableOpacity style={[styles.weekBox, styles.weekBox2, {borderColor:"#111"}]}>
                                                <Text style={fonts.week}>{weeks[idx][0]}</Text>
                                            </TouchableOpacity>
                                            <Text style={fonts.weekSub2}>~</Text>
                                            <TouchableOpacity style={[styles.weekBox, styles.weekBox2, {borderColor:"#111"}]}>
                                                <Text style={fonts.week}>{weeks[idx][1]}</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <TouchableOpacity onPress={()=>deleteIndex(idx)} style={{justifyContent:"center"}}>
                                            <FontAwesome5 name="trash-alt" size={17} color="black" />
                                        </TouchableOpacity>
                                    </>
                                :
                                    <>
                                        <View style={{alignItems:"center", flexDirection:"row", flex:1}} />
                                        <TouchableOpacity onPress={()=>addIndex(idx)} style={{justifyContent:"center"}}>
                                            <Text style={fonts.addText}>추가</Text>
                                        </TouchableOpacity>
                                    </>
                            }
                            
                        </View>
                    )
                })
            }
        </View>
    )
}
//근무시간
const WorkHours = ({sTime, eTime, setIsOpen}) => {
    return (
        <View style={{flexDirection:"row", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>setIsOpen(true)} style={[styles.inputContainer, {flex:1, justifyContent:"flex-end"}]}>
                <Text style={fonts.week}>{sTime}</Text>
            </TouchableOpacity>
            <View style={{width:15, justifyContent:"center"}}>
                <Text style={fonts.week}> - </Text>
            </View>
            <TouchableOpacity onPress={()=>setIsOpen(true)} style={[styles.inputContainer, {flex:1, justifyContent:"flex-end"}]}>
                <Text style={fonts.week}>{eTime}</Text>
            </TouchableOpacity>
        </View>
    )
}

function BotSheet ({setIsOpen, data}){
    const {checks, setChecks, weeks2, setWeeks2} = data;

    const checked = checks.reduce((result, next, idx) => {
        if(next) result[idx] = weeks2[idx]; 
        return result
    }, {});

    function getInitTime(obj) {
        const defaultList = ["09:00", "18:00"];                 // 디폴트 값 설정
        const keys = Object.keys(obj).sort((a, b) => a - b);    // 객체의 키를 순서대로 배열로 정렬
        // 키 순서대로 순회하며 길이가 0보다 큰 리스트를 찾음
        for (let key of keys) {
            if (obj[key].length > 0) {
                return obj[key];
            }
        }
        return defaultList;                                     // 모든 리스트의 길이가 0인 경우 디폴트 값 반환
    }
    
    const [stime, etime] = getInitTime(checked)
    const [sTime, setSTime] = useState(stime);
    const [eTime, setETime] = useState(etime);
    
    const [sel, setSel] = useState("S");
    const [val, setVal] = useState(sTime);
    const [refresh, setRefresh] = useState(false);
    
    useEffect(()=>{
        setSTime(stime);
        setETime(etime);
        setVal((sel=="S")?stime:etime);
        setRefresh(!refresh)
    }, [stime, etime, checks])

    useEffect(() => {
        setVal((sel=="S")?sTime:eTime);
        setRefresh(!refresh)
    }, [sel])

    const checkTime = (time) => {
        if(sel=="S"){
            const d= calculateDifference(time, eTime);
            return {isChange:d > 0, sTime, eTime};
        }else if(sel == "E"){
            const d= calculateDifference(sTime, time);
            return {isChange:d > 0, sTime, eTime};
        }
        return {isChange:false, sTime, eTime};
    }

    const onSubmit = () => {
        // console.log(checks);        //[true, false, false, false, false, false, false]
        // console.log(weeks2);        //{"0": [], "1": ["10:00", "17:00"], "2": ["09:00", "18:00"], "3": [], "4": ["09:00", "18:00"], "5": [], "6": []}
        // console.log(checked);
        const keys = Object.keys(checked);
        for (const key of keys) {
            checked[key] = [sTime, eTime];
        }
        setWeeks2({...weeks2, ...checked});
        setChecks([false, false, false, false, false, false, false]);
        setIsOpen(false);
    }

    return (
        <>
        <View style={[styles.workBox, {marginVertical:15}]}>
            <View style={{flexDirection:"row", justifyContent:"space-evenly"}}>
                <TouchableOpacity onPress={()=>setSel("S")} style={[styles.tap, (sel=="S")?{borderColor:theme.primary}:{}]}>
                    <Text style={fonts.tap2}>시작시간</Text>
                    <Text style={fonts.tap}>{sTime}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>setSel("E")} style={[styles.tap, (sel=="E")?{borderColor:theme.primary}:{}]}>
                    <Text style={fonts.tap2}>종료시간</Text>
                    <Text style={fonts.tap}>{eTime}</Text>
                </TouchableOpacity>
            </View>
            <TimePicker_24
                refresh={refresh}
                initValue={parseTimeString(val)}
                itemHeight={40}
                onTimeChange={(cTime) => {
                    const time = formatTimeObject(cTime);
                    const data = checkTime(time)
                    if(data.isChange){
                        (sel=="S")?setSTime(time):setETime(time);
                        //setRefresh(!refresh)
                    }else{
                        setRefresh(!refresh)
                    };
                    
                }}
            />
        </View>
        <View style={styles.row}>
            <TouchableOpacity onPress={onSubmit} style={styles.confirm}>
                <Text style={fonts.confirm}>확인</Text>
            </TouchableOpacity>
        </View>
        </>
    )
}

// 블럭
const SwitchContent = ({label, isOn, setIsOn}) => {
    const handleToggle = () => {
      setIsOn(prevState => !prevState);
    };
    return (
        <View style={{marginBottom:20, flexDirection:'row', justifyContent:"space-between", alignItems:"center", paddingVertical:5}}>
            <Text style={fonts.switchLabel}>{label}</Text>
            <CustomSwitch onToggle={handleToggle} isOn={isOn}  />
        </View>
    )
}
const BlockContent = ({label, subLabel, subComponent=null, component}) => {
    return (
        <View style={{marginBottom:20}}>
            <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                <Text style={fonts.label}>{label}</Text>
                {(subLabel != "")? <Text style={fonts.label}>{subLabel}</Text> : null}
                {(subComponent)?subComponent : null}
            </View>
            {component}
        </View>
    )
}

const fonts = StyleSheet.create({
    label:{
        fontFamily:"SUIT-Regular",
        fontSize:10,
        color:"#555",
        marginBottom:12,
    },
    switchLabel:{
        fontFamily:"SUIT-Bold",
        fontSize:16,
        color:"#111",
    },
    input:{
        fontFamily:"SUIT-Bold",
        fontSize:16,
        color:"#111",
    },
    week:{
        color:"#111",
        fontFamily:"SUIT-SemiBold",
        fontSize:16
    },
    weekSub:{
        color:"#111",
        fontFamily:"SUIT-SemiBold",
        fontSize:16
    },
    weekSub2:{
        color:"#555",
        fontFamily:"SUIT-Regular",
        fontSize:16
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
    tap:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#111"
    },
    tap2:{
        fontFamily: "SUIT-Regular",
        fontSize: 13,
        color: "#111"
    },
    subComponent:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        color: "#888",
        textDecorationLine:"underline"
    },
    textLink:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        color: "#111",
    },
    addText:{
        fontFamily: "SUIT-SemiBold",
        fontSize: 13,
        color: "#999",
        textDecorationLine:"underline"
    },
    sel:{color:"white"}
})

const styles = StyleSheet.create({
    container:{flex:1, padding:15, backgroundColor:"white"},
    sep:{
        flexDirection:"row",
        borderRadius:5,
    },
    sepTap:{
        backgroundColor:"#fff",
        borderWidth:1,
        borderColor:"#ddd",
        flexDirection:"row",
        justifyContent:"center",
        alignItems:"center",
        textAlign:"center",
        borderRadius:8,
        flex:1,
    },
    sepTxt:{
        fontFamily: "SUIT-Medium",
        color:"#999",
        fontSize:16,
    },
    sepSelected:{
        backgroundColor:"#FFFFFF", 
        borderColor:theme.primary,
        borderWidth:1,
        color:"#111",
    },
    sepSelectedText:{
        fontFamily:"SUIT-Bold",
        color:theme.primary
    },
    inputContainer:{
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:15,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
    },
    btn:{
        marginTop:4,
        backgroundColor:"white",
        padding:8,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        borderColor:"#ddd",
        borderRadius:8
    },
    weekLine:{
        flexDirection:"row",
        justifyContent:"space-evenly"
    },
    weekLine2:{
        flexDirection:"column",
    },
    weekBox:{
        width:40,
        height:40,
        borderRadius:5,
        borderWidth:1,
        borderColor:"#DDD",
        justifyContent:"center",
        alignItems:"center"
    },
    weekBox2:{flex:1, marginHorizontal:15, height:50, alignItems:"flex-end", paddingHorizontal:10,},
    sel:{
        borderColor:theme.primary,
        backgroundColor:theme.primary,
    },
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
    row:{flexDirection:"row"},
    tap:{
        marginHorizontal:8,
        alignItems:"center",
        flex:1,
        padding:8,
        borderRadius: 10,
        borderWidth: 1,
    }
});
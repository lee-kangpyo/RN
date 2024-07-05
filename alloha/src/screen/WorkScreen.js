
import { StyleSheet, Animated, Text, View, TouchableOpacity, Keyboard, Switch, Alert, Dimensions, SafeAreaView, ScrollView, Image, Platform } from 'react-native';
import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import { useSelector, useDispatch } from 'react-redux';
import { setAlbaList } from '../../redux/slices/schedule';
import axios from 'axios';
import { URL } from "@env";
import { useIsFocused } from '@react-navigation/native';
import { convertTime, getWeekList } from '../util/moment';
import { setAlba, nextWeek, prevWeek, setWorkAlbaInfo, moveWeek, disabledEditing, moveWeekDown, } from '../../redux/slices/work';
import WorkAlba from './../components/work/WorkAlba';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlbaModal, ModifyTimeModal } from '../components/common/customModal';
import HeaderControl from '../components/common/HeaderControl';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import CustomBottomSheet, { NumberBottomSheet } from '../components/common/CustomBottomSheet';
import { theme } from '../util/color';
import { CustomBottomSheet2 } from '../components/common/CustomBottomSheet2';
import ChangeWorkTime2 from '../components/bottomSheetContents/ChangeWorkTime2';
import { HTTP } from '../util/http';

export default function WorkScreen({navigation}) {
    //TODO 여기서 알바가 요청하는 근무 수정 페이지 이동
    const userId = useSelector((state) => state.login.userId);
    const weekNumber = useSelector((state)=>state.work.weekNumber);
    const week = useSelector((state)=>state.work.week)
    const weekList = getWeekList(week);
    const albas = useSelector((state)=>state.work.albas);
    const workInfo = useSelector((state)=>state.work.workAlbaInfo);
    const cstCo = useSelector((state)=>state.common.cstCo);

    const owrBadge = useSelector((state) => state.owner.reqAlbaChangeCnt);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [modifyTimeShow, setModifyTimeShow] = useState(false);
    

    const getWeekSchedule = async (callback) => {
        const param = {cls:"WeekWorkSearch", cstCo:cstCo, userId:userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), jobCl:"", jobDure:0};
        await axios.get(URL+`/api/v1/work/workChedule`, {params:param})
        .then((res)=>{
            dispatch(setAlba({data:res.data.result}));
            if(callback) callback();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    const getAlbaList = async()=>{
        const response = await axios.post(URL+'/api/v1/easyAlbaMng', {
            cls:"CstAlbaSearch", cstCo:cstCo, userName: "", hpNo:"", email:""
        });
        dispatch(setAlbaList({albaList:response.data.result}));
    }
    
    const isFocused = useIsFocused();
    
    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") getWeekSchedule();
        }
    }, [isFocused, cstCo, week]);



    useEffect(()=>{
        // navigation.setOptions({
        //     headerShown:false,
        //     title:"근무 결과", 
        //     headerStyle: {
        //         backgroundColor: "#FFDFDF",
        //     },
        //     headerTintColor: "black",
        // })
    }, [navigation])

    const [ShowDelBtn, setShowDelBtn] = useState(false);
    //const widthValue = new Animated.Value(100);
    const toggleWidth = () => {
        if(!ShowDelBtn){
            showDelBtn()
        }else{
            hideDelBtn()
        }
        setShowDelBtn(!ShowDelBtn);
      };
      
      const widthValue = useRef(new Animated.Value(Dimensions.get('window').width - 22)).current;
      
      const showDelBtn = () => {
        Animated.timing(widthValue, {
          toValue: (Dimensions.get('window').width-22) - 50,
          duration: 500,
          useNativeDriver: false,
        }).start();
      };
    
      const hideDelBtn = () => {
        Animated.timing(widthValue, {
          toValue: Dimensions.get('window').width - 22,
          duration: 500,
          useNativeDriver: false,
        }).start();
      };
      
      const [timeModalParams, setTimeModalParams] = useState([])
      const onConfrimModifyTime = async (val) => {
        timeModalParams.jobDure = val;
        await axios.post(URL+`/api/v1/work/workChedule`, timeModalParams)
        .then((res)=>{
            getWeekSchedule()
            dispatch(moveWeekDown())
            setModifyTimeShow(false);;
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })

      }

    //###############################################################
    //const windowHeight = Dimensions.get('window').height;
    // // // 바텀 시트 몇번째인지
    // const [bottomSheetIndex, setBottomSeetIndex] = useState(-1)
    // // //바텀시트ref
    // const sheetRef = useRef(null);
    // // // 바터시트 움직이는거
    // const handleSnapPress = useCallback((index) => {
    //   sheetRef.current.snapToIndex(index);
    //   Keyboard.dismiss();
    // }, []);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedAlba, setSelectedAlba] = useState([]);
    const onAlbaTap = (info, item) => {
        const it = item ?? [];
        const it2 = it.reduce((result, el) => {
            const rlt = [...result, {startTime:convertTime(el.STARTTIME, {format:"HH:mm"}), endTime:convertTime(el.ENDTIME, {format:"HH:mm"}), "brkDure": el.BRKDURE, "cstCo": cstCo, "cstNa": "",  "jobCl": el.JOBCL, "userId": info.userId, "ymd": info.ymd}];
            return rlt;
        }, []);

        // 타입이 G와 S인지 확인하는 변수 초기화
        let hasG = false;
        let hasS = false;        

        // 리스트를 순회하면서 타입 확인
        for (let obj of it2) {
            if (obj.jobCl === "G") {
                hasG = true;
            } else if (obj.jobCl === "S") {
                hasS = true;
            }
        }
        // G 타입이 없으면 추가
        if (!hasG) it2.push({startTime:"09:00", endTime:"16:00", "brkDure": 0, "cstCo": cstCo, "cstNa": "",  "jobCl": "G", "userId": info.userId, "ymd": info.ymd});
        // S 타입이 없으면 추가
        if (!hasS) it2.push({startTime:"09:00", endTime:"16:00", "brkDure": 0, "cstCo": cstCo, "cstNa": "",  "jobCl": "S", "userId": info.userId, "ymd": info.ymd});

        setSelectedAlba(it2);
        dispatch(setWorkAlbaInfo({data:info}));
        setIsOpen(true);
    }

    const addAlba = () => {
        setModalVisible(false)
        navigation.push("registerAlba", { data: getTmpAlbaInfo() });
    }

    const selectAlba = async (alba) => {
        await axiosPost("AlbaSave", alba.USERID)
        .then((res)=>{
            getWeekSchedule();
        }).catch(function (error) {
            console.log(error);
        })
        setModalVisible(false);
    }

    const axiosPost = async (cls, userID)=>{
        const param = {cls:cls, cstCo:cstCo, userId:userID, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), jobCl:"", jobDure:0};
        return await axios.post(URL+`/api/v1/work/workChedule`, param)
    }
    
    const delAlba = (userId, userNa) => {
        Alert.alert("일정 삭제", userNa+"님의 이번주 일정이 모두 삭제 됩니다. 진행하시겠습니까?",
            [
                {text:"네", 
                    onPress:()=>{
                        axiosPost("AlbaDelete", userId)
                        .then((res)=>{
                            getWeekSchedule();
                        }).catch(function (error) {
                            console.log(error);
                        })
                        sheetRef.current.close();
                    }
                },
                {text:"아니오", onPress:()=>console.log("취소")},
            ]
        )
    }

    const getTmpAlbaInfo = () => {
        var params = {cls:"AlbaSave", ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), jobCl:"", jobDure:0}
        return {screen:"work", url:"/api/v1/work/workChedule", params:params};
    }

    //근무 결과 입력
    const onConfirm = async (params) => {
        console.log(params);
        await HTTP("POST", "/api/v2/commute/JumjuJobSave", params)
        .then((res)=>{
            getWeekSchedule();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    //###############################################################
    return (
        <SafeAreaView style={styles.container}>
            <GestureHandlerRootView style={{paddingHorizontal:16, paddingTop:10}}>
                <StoreSelectBoxWithTitle titleText={""} titleflex={0} selectBoxFlex={8} />
                <View style={{...styles.card, padding:5, marginTop:20}}>
                <HeaderControl title={`${weekNumber.month}월 ${weekNumber.number}주차`} onLeftTap={()=> dispatch(prevWeek())} onRightTap={()=> dispatch(nextWeek())} />
                    {(false)?
                    <>
                    <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5,}}>
                        <View style={{flexDirection:"row"}}>
                            <TouchableOpacity style={{marginRight:5}} onPress={()=>navigation.push("reqChangeWork")}>
                                <View style={{...styles.btnMini, paddingVertical:0, paddingHorizontal:5, borderColor:(owrBadge > 0)?theme.error:theme.link}}>
                                    <Text style={[styles.btnText, {color:(owrBadge > 0)?theme.error:theme.link}]}>알바수정요청보기</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={toggleWidth}>
                                <View style={{...styles.btnMini, paddingVertical:0, paddingHorizontal:5, borderColor:theme.link}}>
                                    <Text style={styles.btnText}>편집</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {
                            (false)?
                                <TouchableOpacity onPress={()=>dispatch(setAlba(alba))}>
                                    <Text>지난 시간표 가져오기</Text>
                                </TouchableOpacity>
                            :
                                null
                        }
                    </View>
                    </>
                    : null}
                    <Animated.View style={{width:widthValue, paddingTop:20, marginBottom:5}}>
                        <WeekDate sBlank={1.3} eBlank={1} week={week}/>
                    </Animated.View>
                    <ScrollView contentContainerStyle={{paddingBottom:0, }}>
                        {
                            (albas.length == 0)?
                                <View style={{alignItems:"center", padding:5}}>
                                    <Text style={fonts.add}>데이터가 없습니다.</Text>
                                </View>
                            :
                                albas.map((item, idx)=>{
                                    return (
                                        <View key={idx} style={{flexDirection:"row"}}>
                                            <Animated.View style={{width:widthValue}} >
                                                <WorkAlba alba={item} week={week} onTap={onAlbaTap} onDel={()=>delAlba(item.userId, item.userNa)} />
                                            </Animated.View>
                                            <TouchableOpacity onPress={()=>delAlba(item.userId, item.userNa)} style={{...styles.btnMini, alignItems:"center", backgroundColor:"red", justifyContent:"center", width:50}}>
                                                <Text style={{color:"white"}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                        }
                        <TouchableOpacity onPress={()=>{setModalVisible(true);}} style={{marginTop:12}}>
                            <View style={{...styles.box, width:Dimensions.get('window').width - 22, flexDirection:"row",}}>
                                <Image source={require('../../assets/icons/cross.png')} style={styles.crossIcon} />
                                <Text style={fonts.add}>추가하기</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <AlbaModal
                    execptAlbaId={albas.map(item => item.userId)}
                    isShow={modalVisible} 
                    onClose={()=>setModalVisible(false)} 
                    onShow={()=>getAlbaList()}
                    addAlba={addAlba} 
                    selectAlba={selectAlba} 
                />



                {/* 숫자패드 바텀시트 */}
                {/* <NumberBottomSheet 
                    style={botsheet.topContainer}
                    sheetRef = {sheetRef}
                    onBottomSheetChanged = {(idx)=>setBottomSeetIndex(idx)}
                    onClose={()=>dispatch(disabledEditing())}
                    Content = {
                        <BtnSet selectedAlba={selectedAlba} workInfo={workInfo} cstCo={cstCo} refresh={(callback) => getWeekSchedule(callback)} onDelete={delAlba} onClose={()=>sheetRef.current.close()} 
                            onTypingModalShow={(param)=>{
                                setTimeModalParams(param)
                                setModifyTimeShow(true)
                            }
                        }/>
                    }
                /> */}
               
                <ModifyTimeModal isShow={modifyTimeShow} onClose={()=>setModifyTimeShow(false)} onConfirm={(val)=>{onConfrimModifyTime(val)}} onShow={()=>console.log("onShow")} />
            </GestureHandlerRootView>
            {
                (Object.keys(selectedAlba).length > 0)?
                    <CustomBottomSheet2
                        isOpen={isOpen} 
                        onClose={()=>setIsOpen(false)}
                        content={<ChangeWorkTime2 dayJobInfo={selectedAlba} setIsOpen={setIsOpen} onConfirm={onConfirm}/>}
                    />
                :
                    null
            }
        </SafeAreaView>
        

    );
    
}
function BtnSet({ selectedAlba, workInfo, cstCo, refresh, onDelete, onClose, onTypingModalShow, }){
    const [isEnabled, setIsEnabled] = useState(false);
    const [isFncRunning, setIsFncRunning] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const dispatch = useDispatch()
    const onBtnTap = async (num) => {
        if (isFncRunning) return;
        const type = (isEnabled)?"S":"G"
        const param = {cls:"WeekAlbaWorkSave", cstCo, userId:workInfo.userId, ymdFr:workInfo.ymd, ymdTo:"", jobCl:type, jobDure:num}
        await axios.post(URL+`/api/v1/work/workChedule`, param)
        .then((res)=>{
            refresh(()=>{

                dispatch(moveWeekDown())
                setIsFncRunning(false);
            })
            
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            setIsFncRunning(false);
        })
    }
    const onBtnPress = (num) => {
        if(!isFncRunning){
            setIsFncRunning(true)
            onBtnTap(num)
        };
    }

    const renderNumBox = (num, idx)=>{
        const jobCl = (isEnabled)?"S":"G";
        const selectInfo = selectedAlba.find(el => el.JOBCL == jobCl);
        const selected = (selectInfo && selectInfo.JOBDURE == num)?true:false;
        const box = (selected)?{backgroundColor: "#3479EF"}:{};
        const text = (selected)?{color:"white"}:{};
        return (
            <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={[styles.numberBox, box]}>
                <Text style={[fonts.boxText, text]}>{num}</Text>
            </TouchableOpacity>
        )
    }
    return(
        <View style={botsheet.container}>
            <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between", marginHorizontal:15, marginBottom:(Platform.OS == "ios")?8:0}}>
                <View style={[styles.row, {alignItems:"baseline"}]}>
                    <Text style={[fonts.botYmd, {marginRight:5}]}>{workInfo.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}</Text>
                    <Text style={fonts.botName}>{workInfo.userNa}</Text>
                </View>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <Text style={fonts.ge}>일반</Text>
                    <Switch
                        style={{marginHorizontal:8,}}
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3479EF"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={fonts.sp}>특근</Text>
                </View>
            </View>
            <View style={{paddingHorizontal:15,  marginBottom:10, alignItems:"flex-end"}}>
                <TouchableOpacity style={{}} onPress={()=>{
                    const type = (isEnabled)?"S":"G"
                    const param = {cls:"WeekAlbaWorkSave", cstCo, userId:workInfo.userId, ymdFr:workInfo.ymd, ymdTo:"", jobCl:type, jobDure:0}
                    onTypingModalShow(param);
                }}>
                    <Text style={fonts.btnText}>직접입력</Text>
                </TouchableOpacity>
            </View>
            <View style={{paddingHorizontal:10,  marginBottom:20}}>
                <View style={{flexDirection:"row",}}>
                    {
                        [3, 4, 5, 6, 7, 8, 9, 0].map(renderNumBox)
                    }
                </View>
                <View style={{flexDirection:"row"}}>
                    {
                        [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5].map(renderNumBox)
                    }
                    
                </View>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:15}}>
                <TouchableOpacity style={{...styles.btn, backgroundColor:"#999999",marginRight:5}} onPress={()=>onClose()}>
                    <Text style={fonts.btnTextWhite}>닫기</Text>
                </TouchableOpacity>
                {
                    (false)?
                    <TouchableOpacity style={{...styles.btn, marginRight:5}} onPress={()=>onDelete(workInfo.userId, workInfo.userNa)}>
                        <Text>일정삭제</Text>
                    </TouchableOpacity>
                    :null
                }
                <TouchableOpacity style={[styles.btn, {backgroundColor:"#3479EF"}]} onPress={()=>dispatch(moveWeekDown())}>
                    <Text style={fonts.btnTextWhite}>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

// 숫자 패드 입력 버전.
// function BtnSet({ selectedAlba, workInfo, cstCo, refresh, onDelete, onClose, onTypingModalShow, }){
//     const [isEnabled, setIsEnabled] = useState(false);
//     const [isFncRunning, setIsFncRunning] = useState(false);
//     const toggleSwitch = () => setIsEnabled(previousState => !previousState);
//     const dispatch = useDispatch()
//     const onBtnTap = async (num) => {
//         if (isFncRunning) return;
//         const type = (isEnabled)?"S":"G"
//         const param = {cls:"WeekAlbaWorkSave", cstCo, userId:workInfo.userId, ymdFr:workInfo.ymd, ymdTo:"", jobCl:type, jobDure:num}
//         await axios.post(URL+`/api/v1/work/workChedule`, param)
//         .then((res)=>{
//             refresh(()=>{

//                 dispatch(moveWeekDown())
//                 setIsFncRunning(false);
//             })
            
//         }).catch(function (error) {
//             console.log(error);
//             alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
//             setIsFncRunning(false);
//         })
//     }
//     const onBtnPress = (num) => {
//         if(!isFncRunning){
//             setIsFncRunning(true)
//             onBtnTap(num)
//         };
//     }

//     const renderNumBox = (num, idx)=>{
//         const jobCl = (isEnabled)?"S":"G";
//         const selectInfo = selectedAlba.find(el => el.JOBCL == jobCl);
//         const selected = (selectInfo && selectInfo.JOBDURE == num)?true:false;
//         const box = (selected)?{backgroundColor: "#3479EF"}:{};
//         const text = (selected)?{color:"white"}:{};
//         return (
//             <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={[styles.numberBox, box]}>
//                 <Text style={[fonts.boxText, text]}>{num}</Text>
//             </TouchableOpacity>
//         )
//     }
//     return(
//         <View style={botsheet.container}>
//             <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between", marginHorizontal:15, marginBottom:(Platform.OS == "ios")?8:0}}>
//                 <View style={[styles.row, {alignItems:"baseline"}]}>
//                     <Text style={[fonts.botYmd, {marginRight:5}]}>{workInfo.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}</Text>
//                     <Text style={fonts.botName}>{workInfo.userNa}</Text>
//                 </View>
//                 <View style={{flexDirection:"row", alignItems:"center"}}>
//                     <Text style={fonts.ge}>일반</Text>
//                     <Switch
//                         style={{marginHorizontal:8,}}
//                         trackColor={{false: '#767577', true: '#81b0ff'}}
//                         thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
//                         ios_backgroundColor="#3479EF"
//                         onValueChange={toggleSwitch}
//                         value={isEnabled}
//                     />
//                     <Text style={fonts.sp}>특근</Text>
//                 </View>
//             </View>
//             <View style={{paddingHorizontal:15,  marginBottom:10, alignItems:"flex-end"}}>
//                 <TouchableOpacity style={{}} onPress={()=>{
//                     const type = (isEnabled)?"S":"G"
//                     const param = {cls:"WeekAlbaWorkSave", cstCo, userId:workInfo.userId, ymdFr:workInfo.ymd, ymdTo:"", jobCl:type, jobDure:0}
//                     onTypingModalShow(param);
//                 }}>
//                     <Text style={fonts.btnText}>직접입력</Text>
//                 </TouchableOpacity>
//             </View>
//             <View style={{paddingHorizontal:10,  marginBottom:20}}>
//                 <View style={{flexDirection:"row",}}>
//                     {
//                         [3, 4, 5, 6, 7, 8, 9, 0].map(renderNumBox)
//                     }
//                 </View>
//                 <View style={{flexDirection:"row"}}>
//                     {
//                         [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5].map(renderNumBox)
//                     }
                    
//                 </View>
//             </View>
//             <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:15}}>
//                 <TouchableOpacity style={{...styles.btn, backgroundColor:"#999999",marginRight:5}} onPress={()=>onClose()}>
//                     <Text style={fonts.btnTextWhite}>닫기</Text>
//                 </TouchableOpacity>
//                 {
//                     (false)?
//                     <TouchableOpacity style={{...styles.btn, marginRight:5}} onPress={()=>onDelete(workInfo.userId, workInfo.userNa)}>
//                         <Text>일정삭제</Text>
//                     </TouchableOpacity>
//                     :null
//                 }
//                 <TouchableOpacity style={[styles.btn, {backgroundColor:"#3479EF"}]} onPress={()=>dispatch(moveWeekDown())}>
//                     <Text style={fonts.btnTextWhite}>다음</Text>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     )
// }
const botsheet = StyleSheet.create({
    topContainer:{
        borderWidth:1.5,
        borderRadius:20,
        borderColor:"#aaa",
        overflow:"hidden",
    },
    container:{
        flex:1, 
        justifyContent:"center",
    },

})
const fonts = StyleSheet.create({
    add:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        fontWeight: "500",
        color: "#777777"
    },
    botYmd:{
        fontFamily: "SUIT-Medium",
        fontSize: 16,
        fontWeight: "500",
        color: "#777777"
    },
    botName:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        fontWeight: "700",
        color: "#111111"
    },
    ge:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        color: "#3479EF"
    },
    sp:{
        fontFamily: "SUIT-Medium",
        fontSize: 15,
        fontWeight: "500",
        fontStyle: "normal",
        color: "#999999"
    },
    btnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        fontWeight: "700",
        color: "#28B49A"
    },
    btnTextWhite:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        fontStyle: "normal",
        color: "#FFFFFF"
    },
    boxText:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 15,
        fontWeight: "800",
        color: "#999999"  
    },

})
const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5, backgroundColor:"#FFFFFF"},
    card:{
        flex:1,
    },
    box:{
        justifyContent:"center",
        alignItems:"center",
        height: 36,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    },
    numberBox:{
        flex:1, 
        height:52,
        margin:3,
        backgroundColor:"white", 
        alignItems:"center",
        justifyContent:"center",
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    },
    btn:{
        flex:1,
        paddingHorizontal:10,
        paddingVertical:15, 
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignSelf:"center",
        alignItems:"center", 
        marginBottom:10, 
    },
    btnMini:{borderWidth:1, borderColor:"grey", borderRadius:5, padding:1,  verticalAlign:"middle", padding:4},
    title:{alignSelf:"center", fontSize:20, marginBottom:15},
    user:{
        marginBottom:5,
        justifyContent:"space-between",
        flexDirection:"row",
        padding:20,
        borderWidth:0.5,
        borderColor:"gray",
    },
    bottomContainer:{
        flex:1
    },
    btnText:{
        color:theme.link
    },
    crossIcon:{
        width:12,
        height:12,
        marginRight:2,
    },
    row:{flexDirection:"row"}
});
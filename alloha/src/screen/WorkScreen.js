
import { StyleSheet, Animated, Text, View, TouchableOpacity, Keyboard, Switch, Alert, Dimensions, StatusBar, SafeAreaView, ScrollView } from 'react-native';
import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import { useSelector, useDispatch } from 'react-redux';
import { setAlbaList } from '../../redux/slices/schedule';
import axios from 'axios';
import { URL } from "@env";
import { useIsFocused } from '@react-navigation/native';
import { getWeekList } from '../util/moment';
import { setAlba, nextWeek, prevWeek, setWorkAlbaInfo, moveWeek, disabledEditing, moveWeekDown, } from '../../redux/slices/work';
import WorkAlba from './../components/work/WorkAlba';

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlbaModal, ModifyTimeModal } from '../components/common/customModal';
import HeaderControl from '../components/common/HeaderControl';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';
import CustomBottomSheet, { NumberBottomSheet } from '../components/common/CustomBottomSheet';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { theme } from '../util/color';

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
            //console.log(res.data.result)
            dispatch(setAlba({data:res.data.result}))
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
            console.log('근무결과 화면이 활성화됨');
            if(cstCo != "") getWeekSchedule();
        }
    }, [isFocused, cstCo, week]);



    useEffect(()=>{
        navigation.setOptions({
            headerShown:false,
            title:"근무 결과", 
            headerStyle: {
                backgroundColor: "#FFDFDF",
            },
            headerTintColor: "black",
        })
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
    // // 바텀 시트 몇번째인지
    const [bottomSheetIndex, setBottomSeetIndex] = useState(-1)
    // //바텀시트ref
    const sheetRef = useRef(null);
    // // 바터시트 움직이는거
    const handleSnapPress = useCallback((index) => {
      sheetRef.current.snapToIndex(index);
      Keyboard.dismiss();
    }, []);
  
    const onAlbaTap = (info, item) => {
        dispatch(setWorkAlbaInfo({data:info}));
        handleSnapPress(0)
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
        setModalVisible(false)
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

    //###############################################################
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <GestureHandlerRootView >
                <StoreSelectBoxWithTitle titleText={"근무 결과"} titleflex={4} selectBoxFlex={8} />
                <View style={{...styles.card, padding:5}}>
                    <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                        <HeaderControl title={`${weekNumber.month}월 ${weekNumber.number}주차`} onLeftTap={()=> dispatch(prevWeek())} onRightTap={()=> dispatch(nextWeek())} />
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
                    <Animated.View style={{width:widthValue}}>
                        <WeekDate sBlank={2} eBlank={2} week={week}/>
                    </Animated.View>
                    <ScrollView contentContainerStyle={{paddingBottom:(bottomSheetIndex == -1)?0:Dimensions.get('window').height * 0.3, }}>
                        {
                            (albas.length == 0)?
                                <View style={{alignItems:"center", borderWidth:1, borderColor:"grey", padding:5}}>
                                    <Text>데이터가 없습니다.</Text>
                                </View>
                            :
                                albas.map((item, idx)=>{
                                    return (
                                        <View key={idx} style={{flexDirection:"row"}}>
                                            <Animated.View style={{width:widthValue}} >
                                                <WorkAlba alba={item} week={week} onTap={onAlbaTap} onDel={getWeekSchedule} />
                                            </Animated.View>
                                            <TouchableOpacity onPress={()=>delAlba(item.userId, item.userNa)} style={{...styles.btnMini, alignItems:"center", backgroundColor:"red", justifyContent:"center", width:50}}>
                                                <Text style={{color:"white"}}>삭제</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })
                        }
                        <TouchableOpacity onPress={()=>{setModalVisible(true);}}>
                            <View style={{...styles.box, width:Dimensions.get('window').width - 22}}>
                                <Text style={{fontSize:24}}>+</Text>
                            </View>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
                <View>
                    <Text>시간표의 (+)버튼을 클릭하면 시간표 일별 등록으로 이동합니다.</Text>
                    <Text>등록된 시간표는 이름을 클릭하여 수정할수 있습니다.</Text>
                    <Text>등록된 알바를 삭제하기 원하는 경우(-)버튼을 클릭하여 등록된 시간을 삭제할수 있습니다.</Text>
                </View>
                <AlbaModal
                    execptAlbaId={albas.map(item => item.userId)}
                    isShow={modalVisible} 
                    onClose={()=>setModalVisible(false)} 
                    onShow={()=>getAlbaList()}
                    addAlba={addAlba} 
                    selectAlba={selectAlba} 
                />
                <NumberBottomSheet 
                    sheetRef = {sheetRef}
                    onBottomSheetChanged = {(idx)=>setBottomSeetIndex(idx)}
                    onClose={()=>dispatch(disabledEditing())}
                    Content = {
                        <BtnSet workInfo={workInfo} cstCo={cstCo} refresh={(callback) => getWeekSchedule(callback)} onDelete={delAlba} onClose={()=>sheetRef.current.close()} 
                            onTypingModalShow={(param)=>{
                                setTimeModalParams(param)
                                setModifyTimeShow(true)
                            }
                        }/>
                    }
                />
               
                <ModifyTimeModal isShow={modifyTimeShow} onClose={()=>setModifyTimeShow(false)} onConfirm={(val)=>{onConfrimModifyTime(val)}} onShow={()=>console.log("onShow")} />
            </GestureHandlerRootView>
        </SafeAreaView>
        

    );
    
}
function BtnSet({ workInfo, cstCo, refresh, onDelete, onClose, onTypingModalShow, }){
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
    return(
        <View style={{flex:1, justifyContent:"center"}}>
            <View style={{ flexDirection:"row", alignItems:"center",justifyContent:"space-between", height:30, marginHorizontal:15, marginBottom:10}}>
                <Text>{workInfo.ymd.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')} [{workInfo.userNa}]</Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <TouchableOpacity style={{marginRight:5}} onPress={()=>{
                        const type = (isEnabled)?"S":"G"
                        const param = {cls:"WeekAlbaWorkSave", cstCo, userId:workInfo.userId, ymdFr:workInfo.ymd, ymdTo:"", jobCl:type, jobDure:0}
                        onTypingModalShow(param);
                    }}>
                        <Text style={styles.btnMini}>직접입력</Text>
                    </TouchableOpacity>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Text style={{marginLeft:-3}}>{(isEnabled)?"특근":"일반"}</Text>
                </View>
            </View>
            <View style={{paddingHorizontal:10,  marginBottom:10}}>
                <View style={{flexDirection:"row",}}>
                    {
                        [3, 4, 5, 6, 7, 8, 9, 0].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                </View>
                <View style={{flexDirection:"row"}}>
                    {
                        [2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 8.5, 9.5].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                    
                </View>
            </View>
            <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", paddingHorizontal:15}}>
                <TouchableOpacity style={{...styles.btn, marginRight:5}} onPress={()=>onClose()}>
                    <Text>닫기</Text>
                </TouchableOpacity>
                {
                    (false)?
                    <TouchableOpacity style={{...styles.btn, marginRight:5}} onPress={()=>onDelete(workInfo.userId, workInfo.userNa)}>
                        <Text>일정삭제</Text>
                    </TouchableOpacity>
                    :null
                }
                <TouchableOpacity style={styles.btn} onPress={()=>dispatch(moveWeekDown())}>
                    <Text>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', padding:5},
    card:{
        flex:1,
        borderWidth: 1, // 테두리 두께
        borderColor: 'black', // 테두리 색상
        borderRadius: 10, // 테두리 모서리 둥글게 
    },
    box:{
        backgroundColor:"#D7E5CA",
        paddingVertical:10,
        margin:1,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
    },
    numberBox:{
        flex:1, 
        height:40,
        margin:3,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        backgroundColor:"white", 
        alignItems:"center",
        justifyContent:"center"
    },
    btn:{
        flex:1,
        backgroundColor:"#FFCD4B", 
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
    }
});

import { StyleSheet, Animated, Text, View, TouchableOpacity, Keyboard, Switch, Alert, Dimensions} from 'react-native';
import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import { useSelector, useDispatch } from 'react-redux';
import { setAlbaList } from '../../redux/slices/schedule';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { URL } from "@env";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getWeekList } from '../util/moment';
import { setAlba, nextWeek, prevWeek, setWorkAlbaInfo, moveWeek, disabledEditing, } from '../../redux/slices/work';
import WorkAlba from './../components/work/WorkAlba';

import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AlbaModal, ModifyTimeModal } from '../components/common/customModal';
import { setOwnerCstco, setOwnerStoreList } from '../../redux/slices/common';
import StoreSelectBox from '../components/common/StoreSelectBox';
import CustomModal from '../components/CustomModal';
import HeaderControl from '../components/common/HeaderControl';

export default function WorkScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const weekNumber = useSelector((state)=>state.work.weekNumber);
    const week = useSelector((state)=>state.work.week)
    const weekList = getWeekList(week);
    const albas = useSelector((state)=>state.work.albas);
    const workInfo = useSelector((state)=>state.work.workAlbaInfo);
    
    const cstCo = useSelector((state)=>state.common.cstCo);
    
    
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
            dispatch(moveWeek())
            setModifyTimeShow(false);;
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })

      }

    //###############################################################
    const [bottomSheetIndex, setBottomSeetIndex] = useState(-1)
    const sheetRef = useRef(null);
    const snapPoints = useMemo(() => ["35%"], []);
    
    const handleSnapPress = useCallback((index) => {
      sheetRef.current.snapToIndex(index);
      Keyboard.dismiss();
    }, []);
  
    const closesheet = useCallback(() => {
      sheetRef.current.close();
    });
  
    const renderBackdrop = useCallback(
      props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={1}
          pressBehavior={'none'}
        />
      ),
      []
    );

    const onAlbaTap = (info, item) => {
        dispatch(setWorkAlbaInfo({data:info}));
        handleSnapPress(0)
    }

    const addAlba = () => {
        setModalVisible(false)
        navigation.push("registerAlba");
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



    //###############################################################
    return (
        <GestureHandlerRootView style={styles.container}>
            <StoreSelectBox />
            <View style={{...styles.card, padding:5, width:"100%"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <HeaderControl title={`${weekNumber.month}월 ${weekNumber.number}주차 일정표`} onLeftTap={()=> dispatch(prevWeek())} onRightTap={()=> dispatch(nextWeek())} />
                    <TouchableOpacity onPress={toggleWidth}>
                        <View style={{...styles.btnMini, paddingVertical:0, paddingHorizontal:5}}>
                            <Text>편집</Text>
                        </View>
                    </TouchableOpacity>
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
                <ScrollView>
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
                    {
                        <TouchableOpacity onPress={()=>{setModalVisible(true);}}>
                            <View style={{...styles.box, marginBottom:(bottomSheetIndex == -1)?0:150}}>
                                <Text style={{fontSize:24}}>+</Text>
                            </View>
                        </TouchableOpacity>
                    }
                    
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
            <BotSheet 
                
                onBottomSheetChanged={(idx)=>setBottomSeetIndex(idx)}
                sheetRef={sheetRef} 
                snapPoints={snapPoints} 
                renderBackdrop={renderBackdrop} 
                handleSnapPress={handleSnapPress}
                Content={<BtnSet workInfo={workInfo} cstCo={cstCo} refresh={(callback) => getWeekSchedule(callback)} onDelete={delAlba} onClose={closesheet} 
                    onTypingModalShow={(param)=>{
                        setTimeModalParams(param)
                        setModifyTimeShow(true)
                    }
                }/>}
            />
            <ModifyTimeModal isShow={modifyTimeShow} onClose={()=>setModifyTimeShow(false)} onConfirm={(val)=>{onConfrimModifyTime(val)}} onShow={()=>console.log("onShow")} />
        </GestureHandlerRootView>
        

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
                dispatch(moveWeek())
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
        <View style={{height:"100%", justifyContent:"center"}}>
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
                        [1, 2, 3, 4, 5, 6, 7, 8].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                </View>
                <View style={{flexDirection:"row"}}>
                    {
                        [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 0].map((num, idx)=>{
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
                <TouchableOpacity style={styles.btn} onPress={()=>dispatch(moveWeek())}>
                    <Text>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

// 바텀 시트
const BotSheet = ({sheetRef, snapPoints, renderBackdrop, handleSnapPress, Content, onBottomSheetChanged}) => {

    const dispatch = useDispatch()
    return (
      <>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={()=>dispatch(disabledEditing())}
          index={-1}
          onChange={onBottomSheetChanged}
          //backdropComponent={renderBackdrop}
        >
          <BottomSheetView>
            {Content}     
          </BottomSheetView>
        </BottomSheet>
      </>
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
    sampleImage:{width:"100%", height:"100%"},
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
    }
});

import { StyleSheet, Modal, Text, View, TouchableOpacity, Keyboard, Switch} from 'react-native';
import React, {useState, useEffect, useCallback, useRef, useMemo} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import WeekAlba from '../components/schedule/WeekAlba';
import { useSelector, useDispatch } from 'react-redux';
import { initTimeBox,  setAlbaList, setScheduleCstCo, setScheduleStoreList } from '../../redux/slices/schedule';
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

export default function WorkScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const weekNumber = useSelector((state)=>state.work.weekNumber);
    const week = useSelector((state)=>state.work.week)
    const weekList = getWeekList(week);
    const albas = useSelector((state)=>state.work.albas);
    const workInfo = useSelector((state)=>state.work.workAlbaInfo);
    
    const cstCo = useSelector((state)=>state.schedule.cstCo);
    const storeList = useSelector((state)=>state.schedule.storeList);

    
    
    
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    

    const getWeekSchedule = async (callback) => {
        await axios.get(URL+`/api/v1/work/workChedule`, {params:{cls:"WeekWorkSearch", cstCo:cstCo, userId:userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), jobCl:"", jobDure:0}})
        .then((res)=>{
            dispatch(setAlba({data:res.data.result}))
            if(callback) callback();
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }
    const getStoreList = async () => {
        await axios.get(URL+`/api/v1/getStoreList`, {params:{userId:userId,}})
        .then((res)=>{
            dispatch(setScheduleStoreList({storeList:res.data.result}));
        }).catch(function (error) {
            console.log(error);
            alert("점포를 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
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
            console.log('화면이 활성화됨');
            if(cstCo != "") getWeekSchedule();
        }
    }, [isFocused, cstCo, week]);


    useEffect(()=>{
        getStoreList();
    }, [])


    useEffect(()=>{
        navigation.setOptions({
            title:"근무 결과", 
            headerStyle: {
                backgroundColor: "#FFDFDF",
            },
            headerTintColor: "black",
        })
    }, [navigation])



    //###############################################################
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



    //###############################################################
    return (
        <GestureHandlerRootView style={styles.container}>
            <View style = {{width: "100%",height: 60, borderWidth:1, borderColor:"black", borderRadius:10, marginBottom:10}}>
                <Picker
                    selectedValue = {cstCo}
                    onValueChange = {(cstCo) => dispatch(setScheduleCstCo({cstCo:cstCo}))}
                >
                    {
                        storeList.map((el, idx)=>{
                            return <Picker.Item key={idx} label={el.CSTNA} value={el.CSTCO}/>
                        })
                    }
                </Picker>
            </View>
            <View style={{...styles.card, padding:5, width:"100%"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:15}}>
                    <View style={{flexDirection:"row"}}>
                        <TouchableOpacity onPress={()=> dispatch(prevWeek())}>
                            <Ionicons name="caret-back-outline" size={20} color="black" />
                        </TouchableOpacity>
                        <Text>{weekNumber.month}월 {weekNumber.number}주차 일정표</Text>
                        <TouchableOpacity onPress={()=> dispatch(nextWeek())}>
                            <Ionicons name="caret-forward-outline" size={20} color="black" />
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
                <WeekDate sBlank={2} eBlank={2} week={week}/>
                <ScrollView>
                    {
                        (albas.length == 0)?
                            <View style={{alignItems:"center", borderWidth:1, borderColor:"grey", padding:5}}>
                                <Text>데이터가 없습니다.</Text>
                            </View>
                        :
                            albas.map((item, idx)=>{
                                return <WorkAlba key={idx} alba={item} week={week} onTap={onAlbaTap} onDel={getWeekSchedule} />
                            })
                    }
                    {
                        <TouchableOpacity onPress={()=>{dispatch(initTimeBox());setModalVisible(true);}}>
                            <View style={styles.box}>
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
            <BotSheet 
                sheetRef={sheetRef} 
                snapPoints={snapPoints} 
                renderBackdrop={renderBackdrop} 
                handleSnapPress={handleSnapPress}
                Content={<BtnSet workInfo={workInfo} cstCo={cstCo} refresh={(callback) => getWeekSchedule(callback)}/>}
            />
        </GestureHandlerRootView>
        

    );
}
function BtnSet({workInfo, cstCo, refresh}){
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
        <View style={{height:"100%"}}>
            <View style={{flex:1, flexDirection:"row", alignItems:"center",justifyContent:"flex-end", marginHorizontal:15}}>
                <Switch
                    trackColor={{false: '#767577', true: '#81b0ff'}}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
                <Text>{(isEnabled)?"특근":"일반"}</Text>
            </View>
            <View style={{flex:3, padding:10}}>
                <View  style={{flex:1, flexDirection:"row"}}>
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                </View>
                <View style={{flex:1, flexDirection:"row"}}>
                    {
                        [1.5, 2.5, 3.5, 4.5, 5.5, 6.5, 7.5, 0].map((num, idx)=>{
                            return <TouchableOpacity key={idx} onPress={()=>onBtnPress(num)} style={styles.numberBox}><Text>{num}</Text></TouchableOpacity>
                        })
                    }
                    
                </View>
            </View>
            <View style={{flex:2}}>
                <TouchableOpacity style={{...styles.btn, marginBottom:10}} onPress={()=>dispatch(moveWeek())}>
                    <Text>다음</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

// 바텀 시트
const BotSheet = ({sheetRef, snapPoints, renderBackdrop, handleSnapPress, Content}) => {

    const dispatch = useDispatch()
    return (
      <>
        <BottomSheet
          ref={sheetRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onClose={()=>dispatch(disabledEditing())}
          index={-1}
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
        paddingVertical:10,
        margin:3,
        borderWidth: 0.5, // 테두리 두께
        borderColor: 'gray', // 테두리 색상
        borderRadius: 0, // 테두리 모서리 둥글게 
        alignItems:"center",
        backgroundColor:"white", 
        alignSelf:"center"
    },
    btn:{
        backgroundColor:"#FFCD4B", 
        paddingHorizontal:100,
        paddingVertical:15, 
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignSelf:"center",
    },
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
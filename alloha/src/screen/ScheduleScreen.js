
import { StyleSheet, Modal, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import WeekAlba from '../components/schedule/WeekAlba';
import { useSelector, useDispatch } from 'react-redux';
import { initTimeBox, nextWeek, prevWeek, setAlba, setAlbaList, setScheduleCstCo, setScheduleStoreList } from '../../redux/slices/schedule';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { URL } from "@env";
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { getWeekList } from '../util/moment';
import { AlbaModal } from '../components/common/AlbaModal';

export default function ScheduleScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const albas = useSelector((state)=>state.schedule.albas);
    const weekNumber = useSelector((state)=>state.schedule.weekNumber);
    const cstCo = useSelector((state)=>state.schedule.cstCo);
    const storeList = useSelector((state)=>state.schedule.storeList);
    const isScheduleEditable = useSelector((state)=>state.schedule.week == state.schedule.eweek);
    const week = useSelector((state)=>state.schedule.week)
    const weekList = getWeekList(week);
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);

    const getWeekSchedule = async () => {
        await axios.get(URL+`/api/v1/getWeekSchedule`, {params:{cls:"WeekScheduleSearch", cstCo:cstCo, userId:userId, ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD"), wCnt:"0",}})
        .then((res)=>{
            dispatch(setAlba({data:res.data.result}))
        }).catch(function (error) {
            console.log(error);
            alert("알바 일정을 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
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
            if(cstCo != "") getWeekSchedule();
        }
    }, [isFocused, cstCo, week]);

    // useEffect(()=>{
    //     if(cstCo != "") getWeekSchedule();
    // }, [cstCo, week])

    useEffect(()=>{
        getStoreList();
    }, [])

    useEffect(()=>{
        navigation.setOptions({
            title:"근무 계획",
            headerStyle: {
                backgroundColor: "#A0E9FF",
            },
            headerTintColor: "black",
        })
    }, [navigation])
    
    return (
        <View style={styles.container}>
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
                        (false && isScheduleEditable)?
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
                                return <WeekAlba key={idx} alba={item} week={week} onDel={getWeekSchedule} />
                            })
                    }
                    {
                        (isScheduleEditable)?
                            <TouchableOpacity onPress={()=>{dispatch(initTimeBox());setModalVisible(true);}}>
                                <View style={styles.box}>
                                    <Text style={{fontSize:24}}>+</Text>
                                </View>
                            </TouchableOpacity>

                        :
                            null
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
                addAlba={()=>{
                    setModalVisible(false)
                    dispatch(initTimeBox());
                    navigation.push("registerAlba");
                }}
                selectAlba={(alba)=>{
                    setModalVisible(false)
                    navigation.navigate("scheduleModify", {alba:alba})
                }}
            />
        </View>
    );
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
    btn:{
        marginTop:20,
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
    }
});
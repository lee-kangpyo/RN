
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import React, {useState, useEffect} from 'react';
import WeekDate from '../components/schedule/WeekDate';
import WeekAlba from '../components/schedule/WeekAlba';
import { useSelector, useDispatch } from 'react-redux';
import { initTimeBox, nextWeek, prevWeek, setAlba, setAlbaList } from '../../redux/slices/schedule';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { URL } from "@env";
import { useIsFocused } from '@react-navigation/native';
import { getWeekList } from '../util/moment';
import { AlbaModal } from '../components/common/customModal';
import HeaderControl from '../components/common/HeaderControl';
import StoreSelectBoxWithTitle from '../components/common/StoreSelectBoxWithTitle';

export default function ScheduleScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const albas = useSelector((state)=>state.schedule.albas);
    const weekNumber = useSelector((state)=>state.schedule.weekNumber);
    const cstCo = useSelector((state)=>state.common.cstCo);
    // [v] 이걸 풀어주면 근무 계획에서 다음 주만 + 가 추가됨.
    //const isScheduleEditable = useSelector((state)=>state.schedule.week == state.schedule.eweek);
    const isScheduleEditable = true
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

    const getAlbaList = async()=>{
        const response = await axios.post(URL+'/api/v1/easyAlbaMng', {
            cls:"CstAlbaSearch", cstCo:cstCo, userName: "", hpNo:"", email:""
        });
        dispatch(setAlbaList({albaList:response.data.result}));
    }
    
    const getTmpAlbaInfo = () => {
        var params = {cls:"AlbaSave", ymdFr:weekList[0].format("yyyyMMDD"), ymdTo:weekList[6].format("yyyyMMDD")}
        return {screen:"schedule", url:'/api/v1/saveAlba', params:params};
    }

    const isFocused = useIsFocused();
    
    useEffect(() => {
        if (isFocused) {
            if(cstCo != "") getWeekSchedule();
        }
    }, [isFocused, cstCo, week]);

    useEffect(()=>{
        navigation.setOptions({
            headerShown:false,
            title:"근무 계획",
            headerStyle: {
                backgroundColor: "#A0E9FF",
            },
            headerTintColor: "black",
        })
    }, [navigation])
    
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar />
            <StoreSelectBoxWithTitle titleText={"근무 계획"} titleflex={4} selectBoxFlex={8} />
            <View style={{...styles.card, padding:5, width:"100%"}}>
                <View style={{flexDirection:"row", justifyContent:"space-between", marginBottom:5}}>
                    <HeaderControl title={`${weekNumber.month}월 ${weekNumber.number}주차 근무 계획`} onLeftTap={()=> dispatch(prevWeek())} onRightTap={()=> dispatch(nextWeek())} />
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
            <View style={{width:"100%", padding:5}}>
                <Text>(+)버튼을 클릭하여 알바생 등록 또는 기존 알바생 근무계획을 작성합니다.</Text>
                <Text>근무 계획에 등록된 알바를 클릭하면 수정 또는 삭제 할 수 있습니다.</Text>
            </View>
            <AlbaModal
                execptAlbaId={albas.map(item => item.userId)}
                isShow={modalVisible} 
                onClose={()=>setModalVisible(false)} 
                onShow={()=>getAlbaList()}
                addAlba={()=>{
                    setModalVisible(false)
                    dispatch(initTimeBox());
                    navigation.push("registerAlba", { data: getTmpAlbaInfo() });
                }}
                selectAlba={(alba)=>{
                    setModalVisible(false)
                    navigation.navigate("scheduleModify", {alba:alba})
                }}
            />
        </SafeAreaView>
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
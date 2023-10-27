
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import { getWeekNumber } from '../util/moment';
import WeekDate from '../components/schedule/WeekDate';
import WeekAlba from '../components/schedule/WeekAlba';
import { useSelector, useDispatch } from 'react-redux';
import { initTimeBox, nextWeek, prevWeek, setAlba, setScheduleCstCo, setScheduleStoreList } from '../../redux/slices/schedule';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { URL } from "@env";

export default function ScheduleScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const albas = useSelector((state)=>state.schedule.albas);
    const weekNumber = useSelector((state)=>state.schedule.weekNumber);
    const cstCo = useSelector((state)=>state.schedule.cstCo);
    const storeList = useSelector((state)=>state.schedule.storeList);
    const isScheduleEditable = useSelector((state)=>state.schedule.week == state.schedule.eweek)
    const dispatch = useDispatch();


    const getStoreList = async () => {
        await axios.get(URL+`/api/v1/getStoreList`, {params:{userId:userId,}})
        .then((res)=>{
            dispatch(setScheduleStoreList({storeList:res.data.result}));
        }).catch(function (error) {
            console.log(error);
            alert("점포를 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }
    useEffect(()=>{
        getStoreList();
    }, [])

    useEffect(()=>{
        navigation.setOptions({title:"시간표"})
    }, [navigation])
    
    const alba = [
        {
            id:"0",
            name:"이하나2", 
            sum:"14.0",
            sumSub:"1.5",
            "list":[
                {"day":"1029", "txt":"-", "subTxt":""},
                {"day":"1030", "txt":"3.5", "subTxt":""},
                {"day":"1031", "txt":"3.5", "subTxt":""},
                {"day":"1101", "txt":"3.5", "subTxt":"1.5"},
                {"day":"1102", "txt":"3.5", "subTxt":""},
                {"day":"1103", "txt":"-", "subTxt":""},
                {"day":"1104", "txt":"-", "subTxt":""},        
            ]
        },
        {
            id:"1",
            name:"갑을병2", 
            sum:"14.0",
            sumSub:"",
            "list":[
                {"day":"1022", "txt":"-", "subTxt":""},
                {"day":"1023", "txt":"4.0", "subTxt":""},
                {"day":"1024", "txt":"3.5", "subTxt":""},
                {"day":"1025", "txt":"3.5", "subTxt":""},
                {"day":"1026", "txt":"3.5", "subTxt":""},
                {"day":"1027", "txt":"-", "subTxt":""},
                {"day":"1028", "txt":"-", "subTxt":""},        
            ]
        },
    ];
    const [category, setCategory] = useState(1003);
    return (
        <View style={styles.container}>
            <Picker
                selectedValue = {cstCo}
                onValueChange = {(itemValue, itemIndex) => 
                    dispatch(setScheduleCstCo({cstCo:value}))
                }
                style = {{
                    width: 200,
                    height: 50,
                }}>
                {
                    storeList.map((el, idx)=>{
                        console.log("ASdfsadf");
                        console.log(el);
                        return <Picker.Item key={idx} label={el.ADDR} value={el.CSTCO}/>
                    })
                }
            </Picker>
           
            
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
                        (isScheduleEditable)?
                            <TouchableOpacity onPress={()=>dispatch(setAlba(alba))}>
                                <Text>지난 시간표 가져오기</Text>
                            </TouchableOpacity>

                        :
                            null
                    }
                </View>
                <WeekDate sBlank={2} eBlank={2}/>
                <ScrollView>
                    {albas.map((item, idx)=>{
                        return <WeekAlba key={idx} alba={item} />
                    })}

                    {
                        (isScheduleEditable)?
                            <TouchableOpacity onPress={()=>{
                                    dispatch(initTimeBox());
                                    navigation.push("scheduleAdd");
                                }}>
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
});
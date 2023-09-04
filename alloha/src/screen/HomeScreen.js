
import { Platform, StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import { theme } from '../util/color';

import * as Location from 'expo-location';
import CommuteRecordCard from '../components/CommuteRecordCard';
import { URL } from "@env";

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import CommuteTask from '../components/CommuteTask';
import CommuteRecord from '../components/CommuteRecord';
import Loading from '../components/Loding';
//import GoogleMap from '../components/GoogleMap';

import * as TaskManager from 'expo-task-manager';


export default function HomeScreen() {
    //console.log(Platform.OS);
    const navigation = useNavigation();
    const userId = useSelector((state) => state.login.userId);    

    const scrollViewRef = useRef(null);
    const handleScrollToEnd = () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };
    const [isLoading, setLoading] = useState(true);                     // 초기 점포 불러왔는지 체크
    const [isChangePickerLoad, setChangePickerLoad] = useState(false);  // 픽커 변경 여부 확인
    const [selCstCo, setSelCstco] = useState();
    const [selectedStore, setSelectedStore] = useState({});             // 선택된 점포
    const [selectedStoreLogs, setSelectedStoreLogs] = useState([]);     // 선택된 점포의 출퇴근 기록
    const [totalJobTime, setTotalJobTime] = useState("");               // 선택된 점포의 출퇴근 시각
    const [myStores, setmyStores] = useState([]);                       // 내 알바 점포들
    const [myPosition, setmyPosition] = useState();                     // 현재 내위치
    const [distance, setdistance] = useState();                         // 선택된 점포와 내위치의 거리 아마 안쓸껄?
    const [inOutBtnTxt, setInOutBtnTxt] = useState("")

    // 내가 요청한 점포는 어떻게 할지 결정해야함.
    // 점주가 승인한 점포는 셀렉트 박스로 선택할수 있게 해야함.
    // 여기서 필요한것은 위치 정보를 기반으로 근처에 갔는지 체크 후 출근, 퇴근 입력 가능하게...
    // 더 나아가서 매 10분 단위로 체크할수있을까??? 배터리 광탈 이슈...
    // 지오 펜스를 사용하면?????? 어떻게 될까? (이건 시간이 걸리니 추후 생각해야함.)
    // 상단에 선택한 커피숍 보여줘야함.
    // 또한 이번에 api 서버 배포 하고 앱도 포팅해봐함.

    const getCurTime = () => {
        const now = new Date();	// 현재 날짜 및 시간
        const YYYY = now.getFullYear();
        const mm = now.getMonth() + 1;
        const dd = now.getDate();
        const hour = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        return `${YYYY}-${mm}-${dd} ${hour}:${minutes}:${seconds}`;
    }

    const getDay = () => {
        const day = new Date().getDay();
        let result = ""
        switch (day) {
            case 1:
                result = "MON";
                break;
            case 2:
                result = "TUE";
                break;
            case 3:
                result = "WEN";
                break;
            case 4:
                result = "THR";
                break;
            case 5:
                result = "FRI";
                break;
            case 6:
                result = "SAT";
                break;
            case 0:
                result = "SUN";
                break;
            default:
                break;
        }
        return result
    }

    const onPressInOutBtn = async () => {
        // 거리 체크
        if(distance < 50){
            // console.log("출퇴근 버튼 클릭")
            // 현재 내가 출근을 해야하는지? 퇴근을 해야하는지 체크가 필요...
            // DB에 출근/퇴근 했을을 전달
            const jobYn = (inOutBtnTxt === "출근")?"Y":"N"
            await axios.post(URL+"/api/v1/insertJobChk", {userId:userId, cstCo:selectedStore.CSTCO, day:getDay(), lat:myPosition.latitude, lon:myPosition.longitude, jobYn:jobYn, apvYn:"N"})
            .then((res)=>{
                if(res.data.resultCode === "00"){
                    Alert.alert("알림", inOutBtnTxt + "기록 입력 완료.");
                }else{
                    Alert.alert("알림", "출퇴근 기록 입력 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.")
                }
            }).catch(function (error) {
                console.error(error);
                Alert.alert("오류", "출퇴근 기록 입력 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
            
            // 데이터 가져와서 최신화...
            getSelStoreRecords();

            if(inOutBtnTxt === "출근"){
                setInOutBtnTxt("퇴근")
            }else{
                setInOutBtnTxt("출근")
            }
        }else{
            Alert.alert("알림", "점포와 너무 멀리 떨어져있어서 출 퇴근 기록을 할수 없습니다.");
        }
    }
    const getLocationAsync = async() => {
        let loc = await Location.watchPositionAsync({
            accuracy: Location.Accuracy.BestForNavigation,
            timeInterval: 10000,
            distanceInterval : 20
        }, (newLocation) => {
            setmyPosition(newLocation.coords); 
        });
    };

    const getDistanceFromLatLon = (lat1,lng1,lat2,lng2) => {
        const deg2rad = (deg) => deg * (Math.PI/180)
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lng2-lng1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return Math.round(d * 1000);
    }

    function convertMinToHours(min) {
        if (min === 0 || min === null) {
            return "0분";
        }
        const hours = Math.floor(min / 60);
        const minutes = min % 60;
        const hoursText = hours === 1 ? '시간' : '시간';
        const minutesText = minutes === 1 ? '분' : '분';
        let result = '';
        if (hours > 0) {
            result += `${hours} ${hoursText} `;
        }
        if (minutes > 0) {
            result += `${minutes} ${minutesText}`;
        }
        return result.trim();
    }

    const getSelStoreRecords = async () =>{
        setChangePickerLoad(true)
        await axios.get(URL+"/api/v1/getSelStoreRecords", {params:{userId:userId, cstCo:selectedStore.CSTCO}})
        .then((res)=>{
            if(res.data.resultCode === "00"){
                setSelectedStoreLogs(res.data.result);
                setTotalJobTime(convertMinToHours(res.data.totalJobMin));
                handleScrollToEnd();
            }else{
                Alert.alert("알림", "현재 점포 출퇴근 기록 호출 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.")
            }
        }).catch(function (error) {
            console.error(error);
            Alert.alert("오류", "현재 점포 출퇴근 기록 호출 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        }).finally(function () {
            setChangePickerLoad(false);
        });
    }

    const searchMyAlbaList = async (init) => {
        await axios.get(URL+"/api/v1/searchMyAlbaList", {params:{userId:userId}})
            .then((res)=>{
                if(res.data.resultCode === "00"){
                    setmyStores(res.data.result);
                    if(res.data.result.length > 0 && init == true){
                        setSelectedStore(res.data.result[0]);
                        setSelCstco(res.data.result[0].CSTCO);
                    }
                    setLoading(false);
                }else{
                    Alert.alert("알림", "내 알바 리스트 요청 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "알바 리스트 요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
    }


    useEffect(()=>{
        navigation.setOptions({title:"출퇴근"})
    }, [navigation])

    useEffect(() => {
        searchMyAlbaList(true);
        getLocationAsync()
    }, [])


    useEffect(() => {
        //여기서 현재 기록 가져오기
        setChangePickerLoad("true");
        if(selectedStore && selectedStore.RTCL === "N"){
            getSelStoreRecords();
        }
        //그리고 출퇴근 상태 가져오기??(어쩌면 asyncstorage로 처리해야될수도있음..)
        //그리고 승인 대기 중이면 하단에 출근 없애기(완료)
    }, [selectedStore])

    useFocusEffect(
        useCallback(() => { // Do something when the screen is focused
            searchMyAlbaList(false);
            if(selectedStore && selectedStore.RTCL === "N"){
                getSelStoreRecords();
            }
            return () => { /* Do something when the screen is unfocused (cleanup functions)*/};
        }, [])
    )
    return (
        <>
            {
                (myStores.length > 0)?
                    <View style={{paddingHorizontal:20, marginTop:8, flexDirection:"row", justifyContent:"space-between"}}>
                        <CommuteTask/>
                        <TouchableOpacity style={{borderWidth:1, padding:2, borderRadius:5}} onPress={() => {
                            setChangePickerLoad("true");
                            if(selectedStore.RTCL === "N"){
                                getSelStoreRecords();
                            }
                        }}>
                            <Text>리로드</Text>
                        </TouchableOpacity>
                    </View>
                :
                    null
            }
            {
                
                (isLoading)
                ?
                    <View style={styles.center}>
                        <ActivityIndicator size="large" color={theme.primary}/>
                    </View>
                : (myStores.length > 0 )?
                        <View style={styles.container}>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    style={{fontSize:"16"}}
                                    selectedValue={selCstCo}
                                    onValueChange={ (itemValue, itemIndex) =>{
                                        setSelectedStore(myStores.filter((el)=>{return el.CSTCO === itemValue})[0]);
                                        setSelCstco(itemValue)
                                    }
                                    }
                                    >
                                    {
                                    myStores.map((el, idx)=>{
                                            return (el.RTCL === "N")
                                                ?
                                                    <Picker.Item key={idx} label={el.CSTNA} value={el.CSTCO}/>
                                                :(el.RTCL === "R")?
                                                    <Picker.Item key={idx} label={el.CSTNA + "(승인 대기 중)"} value={el.CSTCO}/>
                                                :  
                                                    null;
                                        })
                                    }
                                    
                                </Picker>
                            </View>
                            {
                                (selectedStore.RTCL === "N")?
                                    <>
                                    {
                                        (false)?
                                        <TouchableOpacity onPress={onPressInOutBtn} style={styles.in_out_btn}>
                                            <Text style={styles.in_out_btn_txt}>{inOutBtnTxt}</Text>
                                        </TouchableOpacity>
                                        :
                                        null
                                        
                                    }
                                    {
                                        (isChangePickerLoad)?
                                                <Loading/>
                                            :   
                                            (selectedStoreLogs.length > 0)?
                                                <>
                                                    <ScrollView ref={scrollViewRef} style={{width:"100%"}}>
                                                        {
                                                            selectedStoreLogs.map((row, idx)=> <CommuteRecord key={idx} record={row} btntxt={"승인요청"} onButtonPressed={()=>{Alert.alert("승인요청", "이 버튼은 개발중입니다.")}} /> ) 
                                                        }
                                                    </ScrollView>
                                                    <View style={{width:"100%"}}>
                                                        <Text style={{fontSize:16}}>총 근무시간 : {totalJobTime}</Text>
                                                    </View>
                                                </>
                                            :
                                            <View>
                                                <Text>출퇴근 기록이 없습니다.</Text>
                                            </View>
                                    }
                                    </>
                                :
                                    <View>
                                        <Text>해당 점포는 아직 승인 대기중 입니다.</Text>
                                    </View>
                            }
                        </View>
                :
                    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                        <Text style={{fontSize:16}}>등록된 점포 없음</Text>
                        <Text style={{color:theme.grey}}>점포 검색 탭에서 점포 검색 후 지원해주세요</Text>
                    </View>
            }
            
        </>
    );
}


const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:16 },
    center:{flex:1, justifyContent:"center", alignItems:"center"},
    in_out_btn:{
        backgroundColor:"grey",
        width:150,
        height:150,
        borderRadius:100,
        justifyContent:"center",
        alignItems:"center",
        marginBottom:16
        
    },
    in_out_btn_txt:{
        fontSize:30
    },
    pickerContainer:{borderWidth:1, borderRadius:8, borderColor:theme.purple, width:"100%", marginBottom:16}
});


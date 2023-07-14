
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import { theme } from '../util/color';

//import GoogleMap from '../components/GoogleMap';

export default function HomeScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);    
    const url = useSelector((state) => state.config.url);

    const [myAlba, setMyAlba] = useState([]);
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

    const onPressInOutBtn = () => {
        //console.log("출퇴근 버튼 클릭")
        // DB에 출근/퇴근 했을을 전달
        if(inOutBtnTxt === "출근"){
            setInOutBtnTxt("퇴근")
            setTrackingList([...trackingList, {content:"출근", time:getCurTime()}])
        }else{
            setInOutBtnTxt("출근")
            setTrackingList([...trackingList, {content:"퇴근", time:getCurTime()}])
        }
    }
    //DB에서 가져옴 => aixous => => 출근 상태를 확인하고  
    const [inOutBtnTxt, setInOutBtnTxt] = useState("")
    const [trackingList, setTrackingList] = useState([{content:"췰퇴근 기록리스트 샘플 1", time:"2023-06-04 17:50"}, {content:"췰퇴근 기록리스트 샘플 1", time:"2023-06-04 18:50"}])

    useEffect(()=>{
        navigation.setOptions({title:"출퇴근"})
    }, [navigation])

    useEffect(() => {
        // axios로 출퇴근 상태 체크
        async function searchMyAlbaList() {
            console.log(url)
            await axios.get(url+"/api/v1/searchMyAlbaList", {params:{userId:userId}})
            .then((res)=>{
                if(res.data.resultCode === "00"){
                    setMyAlba(res.data.resultCode)
                }else{
                    Alert.alert("알림", "내 알바 리스트 요청 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.")
                }
            }).catch(function (error) {
                console.log(error);
                Alert.alert("오류", "알바 리스트 요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
            })
        }
        searchMyAlbaList();
        setInOutBtnTxt("출근")
    }, [])

    return (
        <>
        {
            (myAlba.length === 0 )?
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <Text style={{fontSize:16}}>등록된 알바 없음</Text>
                    <Text style={{color:theme.grey}}>점포 검색 탭에서 점포 검색 후 지원해주세요</Text>
                </View>
            :
            <View style={styles.container}>

                // 여기에 셀렉트 박스

                <TouchableOpacity onPress={onPressInOutBtn} style={styles.in_out_btn}>
                    <Text style={styles.in_out_btn_txt}>{inOutBtnTxt}</Text>
                </TouchableOpacity>
                <ScrollView>
                    {
                        trackingList.map((row, idx)=>{
                            return(
                                <Text key={idx}>{row.time}{row.content}</Text>
                            )
                        }) 
                    }

                </ScrollView>
            </View>
        }
        </>
    );
}


const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:16 },
    in_out_btn:{
        backgroundColor:"grey",
        width:150,
        height:150,
        borderRadius:100,
        justifyContent:"center",
        alignItems:"center"
    },
    in_out_btn_txt:{
        fontSize:30
    }
});
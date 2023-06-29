
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, {useState, useEffect} from 'react';
//import GoogleMap from '../components/GoogleMap';

export default function HomeScreen({navigation}) {
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
        setInOutBtnTxt("출근")
    }, [])

    return (
        <View style={styles.container}>
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
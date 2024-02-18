
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import CommuteDetail from '../components/commuteCheck/CommuteDetail';
import CommuteInfo from '../components/commuteCheck/CommuteInfo';
import CustomButton from '../components/common/CustomButton';

export default function CommuteCheckDetailScreen({navigation, route}) {
    const { ymd } = route.params;
    const [YYYYMMDD, setYYYYMMDD] = useState(ymd);
    const userId = useSelector((state)=>state.login.userId);
    const [dayJobInfo, setDayJobInfo] = useState({})
    const [btnShow, setBtnShow] = useState(false);
    useEffect(()=>{
        if(Object.keys(dayJobInfo).length > 0){
            setBtnShow(true)
        }
    },[dayJobInfo])
    useEffect(()=>{
        navigation.setOptions({title:"근무내역"})
    }, [navigation])

    const onModifyBtnpressed = () => {
        const reqStat = dayJobInfo.reqStat;
        if(reqStat == "D"){
            confirm("거절됨", "이미 거절된 건입니다. 다시 요청 하시겠습니까?", ()=>{navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo})})
        }else if(reqStat == "A"){
            confirm("승인됨", "이미 근무 기록이 변경 승인된 건입니다. 다시 변경 요청 하시겠습니까?", ()=>{navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo})})
        }else if(reqStat == "R"){
            confirm("요청중", "이미 요청중인 건입니다. 다시 변경 요청 하시겠습니까?", ()=>{navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo})})
        }else if(reqStat == "N"){
            navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo});
        }
    }

    const confirm = (title, msg, onConfirm) => {
        Alert.alert( title, msg,
            [
              {
                text: '확인', // 버튼 텍스트
                onPress: onConfirm,
              },
              {
                text: '취소', // 버튼 텍스트
                onPress: () => console.log("취소"),
              },
            ],
          );
    }

    return (
        <View style={styles.container}>
            <CommuteInfo day = {YYYYMMDD} dayJobInfo={dayJobInfo} setDayJobInfo={setDayJobInfo} />
            <CommuteDetail day = {YYYYMMDD}/>
            {
                (btnShow)?
                    <CustomButton onClick={onModifyBtnpressed} text={"근무기록변경"} style={styles.btn}/>
                :
                    null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:10 },
    btn:{alignSelf:"flex-end"},
});
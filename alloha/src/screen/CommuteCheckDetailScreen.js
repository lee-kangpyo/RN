
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import CommuteDetail from '../components/commuteCheck/CommuteDetail';
import CommuteInfo from '../components/commuteCheck/CommuteInfo';
import CustomButton from '../components/common/CustomButton';
import { CustomBottomSheet2 } from '../components/common/CustomBottomSheet2';
import ChangeWorkTime from '../components/bottomSheetContents/ChangeWorkTime';
import { HTTP } from '../util/http';
import { useAlert } from '../util/AlertProvider';

export default function CommuteCheckDetailScreen({navigation, route}) {
    const { showAlert } = useAlert();
    const { ymd } = route.params;
    const [YYYYMMDD, setYYYYMMDD] = useState(ymd);
    const userId = useSelector((state)=>state.login.userId);
    const [dayJobInfo, setDayJobInfo] = useState({});
    const [btnShow, setBtnShow] = useState(false);
    useEffect(()=>{
        if(Object.keys(dayJobInfo).length > 0){
            setBtnShow(true);
        }
    },[dayJobInfo]);

    const [isOpen, setIsOpen] = useState(false); 

    const onModifyBtnpressed = () => {
        // const reqStat = dayJobInfo.reqStat;
        // if(reqStat == "D"){
        //     confirm("거절됨", "이미 거절된 건입니다. 다시 요청 하시겠습니까?", ()=>{navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo})})
        // }else if(reqStat == "A"){
        //     confirm("승인됨", "이미 근무 기록이 변경 승인된 건입니다. 다시 변경 요청 하시겠습니까?", ()=>{navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo})})
        // }else if(reqStat == "R"){
        //     confirm("요청중", "이미 요청중인 건입니다. 다시 변경 요청 하시겠습니까?", ()=>{navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo})})
        // }else if(reqStat == "N"){
        //     navigation.push("CommuteCheckChange", { dayJobInfo: dayJobInfo});
        // }
        setIsOpen(true);
    }

    
    const onConfirm = async (params) => {
        console.log(params);
        await HTTP("POST", "/api/v2/commute/AlbaJobSave", params)
        //exec PR_PLYC03_JOBCHECK 'AlbaJobSave', '20240605', '', 1015, 'Chaewonp3306', '09:00', '14:30', 'G', 0.5
        // await HTTP("POST", "/api/v2/daily/JumjoWorkSave", params)
        .then((res)=>{
            console.log(res.data);            
            if(res.data.resultCode == "00"){
                showAlert("근무 기록", '입력 되었습니다.');
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    return (
        <View style={styles.container}>
            {
                (isOpen)?null:
                <>
                    <CommuteInfo day = {YYYYMMDD} dayJobInfo={dayJobInfo} setDayJobInfo={setDayJobInfo} />
                    <View style={{width:"100%", flex:1}}>
                        <CommuteDetail day = {YYYYMMDD}/>
                    </View>
                    {
                        (btnShow)?
                            <CustomButton onClick={onModifyBtnpressed} text={"근무 기록 입력하기"} style={styles.btn} fontStyle={fonts.btn}/>
                        :
                            null
                    }
                </>

            }
            <CustomBottomSheet2 
                isOpen={isOpen} 
                onClose={()=>setIsOpen(false)}
                content={<ChangeWorkTime dayJobInfo={dayJobInfo} setIsOpen={setIsOpen} onConfirm={onConfirm}/>}
            />
        </View>
    );
}



const fonts = StyleSheet.create({
    btn:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        fontStyle: "normal",
        color: "#3479EF"
    }
})
const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'center', padding:10, backgroundColor:"#F6F6F8" },
    btn:{
        alignItems:"center",
        borderRadius: 10,
        backgroundColor: "#DAE5F9",
        width:"100%"
    },
});
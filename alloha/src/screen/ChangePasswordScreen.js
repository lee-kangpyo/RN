
import { StyleSheet, Text, View } from 'react-native';
import React, {useState, useEffect} from 'react';
import { useSelector } from 'react-redux';
import CustomInput from '../components/common/CustomInput';
import CustomStandardBtn from '../components/common/CustomStandardBtn';
import { useNavigation } from '@react-navigation/native';
import { HTTP } from '../util/http';
import { useAlert } from '../util/AlertProvider';

export default function ChangePasswordScreen({navigation}) {
    const userId = useSelector((state)=>state.login.userId);
    const [step, setStep] = useState(1);
    console.log(userId);
    return (
        <View style={styles.container}>
            {
                (step == 1)?
                    <CurPasswordCheck setStep={setStep}/>
                :(step == 2)?
                    <NewPassword setStep={setStep}/>
                :(step == 3)?
                    <Complete />
                :
                    null
            }
        </View>
    );
}

const Complete = () => {
    const navigate = useNavigation();
    return (
        <>
            <Text style={fonts.main}>비밀번호 변경이 완료</Text>
            <Text style={fonts.main}>되었습니다.</Text>
            <View style={{height:30}} />
            <View style={{width:"100%"}}>
                <CustomStandardBtn text={"기타 페이지로 돌아가기"} onPress={()=>navigate.pop()}/>
            </View>
        </>
    )
}

const NewPassword = ({setStep}) => {
    const userId = useSelector((state)=>state.login.userId);
    const { showAlert } = useAlert();
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const validate = () => {
        if(password != password2){
            showAlert("알림", "비밀번호와 비밀번호확인에 입력한 값이 일치하지 않습니다.");
            return false;
        }
        
        // 비밀번호 길이 확인
        if (password.length < 8 || password.length > 20) {
            showAlert("알림", "비밀번호는 8자리 이상 20자리 이하이어야 합니다.");
            return false;
        }

        // 비밀번호 구성 확인
        const num = password.search(/[0-9]/g);
        const eng = password.search(/[a-z]/ig);
        const spe = password.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
        if (num < 0 || eng < 0 || spe < 0) {
            showAlert("알림", "비밀번호는 영문, 숫자, 특수문자를 혼합해서 입력해주세요.");
            return false;
        }

        // 모든 조건을 통과한 경우
        return true;
    }
    const changePw = async () => {
        const isValid = validate();
        if(isValid){
            await HTTP("POST", "/api/v1/main/changePw", {userId, hpNo:"", changePw:password})
            .then((res)=>{
                if(res.data.resultCode == "00"){
                    setStep(3);
                }else{
                    showAlert("비밀번호 변경", "비밀번호 변경에 실패했습니다. 잠시후 다시 시도해 주세요.");
                }
            }).catch(function (error) {
                showAlert("오류 발생", "비밀번호 변경 요청 중 알수없는 오류가 발생했습니다.")
                console.log(error);
            })
        }
    }
    return(
        <>
            <Text style={fonts.main}>변경할 비밀번호를</Text>
            <Text style={fonts.main}>입력하세요</Text>
            <View style={{height:30}} />
            <CustomInput placeholderText={"비밀번호"} value={password} setInputValue={setPassword} secure={true}/>
            <CustomInput placeholderText={"비밀번호 확인"} value={password2} setInputValue={setPassword2} secure={true}/>
            <View style={{height:30}} />
            <View style={{width:"100%"}}>
                <CustomStandardBtn text={"비밀번호 변경"} onPress={()=>changePw()}/>
            </View>
        </>
    )
}

const CurPasswordCheck = ({setStep}) => {
    const userId = useSelector((state)=>state.login.userId);
    const { showAlert } = useAlert();
    const [password, setPassword] = useState("");
    const checkPw = async () => {
        if(password == ""){
            showAlert("현재 비밀번호", "현재 사용하는 비밀번호를 입력해 주세요");
        }else{
            await HTTP("POST", "/api/v1/main/checkPw", {password, userId})
            .then((res)=>{
                if(res.data.resultCode == "00"){
                    if(res.data.result == 1){
                        setStep(2);
                    }else{
                        showAlert("알림", "입력하신 비밀번호가 일치하지 않습니다.")
                    }
                }else{
                    showAlert("오류 발생", "비밀번호 체크 중 알수없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요")             
                }
            }).catch(function (error) {
                showAlert("오류 발생", "비밀번호 체크 중 알수없는 오류가 발생했습니다. 잠시 후 다시 시도해 주세요")
                console.log(error);
            })
        }
    }
    return(
        <>
            <Text style={fonts.main}>현재 비밀번호를</Text>
            <Text style={fonts.main}>입력하세요</Text>
            <View style={{height:30}} />
            <CustomInput placeholderText={"비밀번호"} value={password} setInputValue={setPassword} secure={true}/>
            <View style={{height:30}} />
            <View style={{width:"100%"}}>
                <CustomStandardBtn text={"다음"} onPress={()=>checkPw()}/>
            </View>
        </>
    )
}

const fonts = StyleSheet.create({
    main:{
        alignSelf:"flex-start",
        fontFamily:"SUIT-Bold",
        fontSize:20,
        color:"#111",
        marginBottom:10,
    }
})

const styles = StyleSheet.create({
    container:{ flex: 1, paddingHorizontal:16, paddingVertical:24, alignItems: 'center', backgroundColor:"#fff"},
    sampleImage:{width:"100%", height:"100%"}
});
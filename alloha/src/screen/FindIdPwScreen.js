

import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import CustomTap from '../components/common/CustomTap';
import CustomInput from '../components/common/CustomInput';
import CustomButton from '../components/common/CustomButton';
import CustomBtn from '../components/CustomBtn';
import CustomStandardBtn from '../components/common/CustomStandardBtn';
import Loading from '../components/Loding';
import { HTTP } from '../util/http';
import { useAlert } from '../util/AlertProvider';
import Message from '../components/common/Message';
import { useNavigation } from '@react-navigation/native';
import { generateSecureRandomPassword } from '../util/PassWord';

export default function FindIdPwScreen({navigation}) {
    

    useEffect(()=>{
        navigation.setOptions({title:"아이디/비밀번호",
          headerShadowVisible: false, 
        })
    }, [navigation])
    const [selectedKey, setSelectedKey] = useState(0);
    return (
        <>
        <CustomTap data={[{key:0, name:"아이디 찾기"}, {key:1, name:"임시 비밀번호 발급"}]} selectedKey={selectedKey} setSelectedKey={setSelectedKey}/>
        <View style={styles.container}>
            {
                (selectedKey == 0)?
                    <FindId />
                :
                    <FindPw />
            }
            
        </View>
        </>
    );
}

const FindId = () => {
    const navigator = useNavigation()
    const { showAlert } = useAlert();

    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [name, setName] = useState("");
    const [hpNo, setHpNo] = useState("");
    const [id, setId] = useState("");
    const findId = async () => {
        if(name == "" || hpNo == ""){
            showAlert("필수값 입력 필요", "이름 또는 전화번호를 입력해 주세요");
        }else{
            setIsLoading(true);
            await HTTP("GET", "/api/v1/main/findId", {userNa:name, hpNo})
            .then((res)=>{
                if(res.data.resultCode == "00"){
                    setIsLoading(false);
                    setId(res.data.result.USERID);
                    setStep(2);
                }else{
                    setIsLoading(false);
                    showAlert("아이디 찾기 실패", res.data.resultMsg)
                }
            }).catch(function (error) {
                setIsLoading(false);
                showAlert("오류 발생", "아이디 찾기 요청 중 알수없는 오류가 발생했습니다.")
                console.log(error);
            })
        }
    }
    return(
        (isLoading)?
            <Loading />
        :(step == 1)?
            <>
                <CustomInput placeholderText={"이름"} value={name} setInputValue={setName}/>
                <View style={{height:4}}/>
                <CustomInput placeholderText={"전화번호(숫자만 입력)"} value={hpNo} setInputValue={setHpNo} keyboardType='numeric'/>
                <View style={{height:16}}/>
                <CustomStandardBtn text={"아이디 찾기"} onPress={()=>findId()}/>
            </>
        :(step == 2)?
            <>
                <Text style={fonts.title}>아이디 찾기 완료</Text>
                <View style={[styles.row, {justifyContent:"center", marginBottom:24, alignItems:"center"}]}>
                    <Text style={fonts.content}>회원님의 아이디는 </Text>
                    <Text style={[fonts.content, {fontWeight:"bold"}]} selectable={true}>{id}</Text>
                    <Text style={fonts.content}> 입니다.</Text>
                </View>
                <CustomStandardBtn text={"로그인 하러가기"} onPress={()=>navigator.pop()}/>
            </>
        :
            null
    )
}
const FindPw = () => {
    const [id, setId] = useState("");
    const [hpNo, setHpNo] = useState("");
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [tmpPw, setTmpPw] = useState(generateSecureRandomPassword(12));
    const findPw = async () => {
        if(id == "" || hpNo == ""){
            showAlert("필수값 입력 필요", "아이디 또는 전화번호를 입력해 주세요");
        }else{
            setIsLoading(true);
            await HTTP("POST", "/api/v1/main/changePw", {userId:id, hpNo, changePw:tmpPw})
            .then((res)=>{
                if(res.data.resultCode == "00"){
                    setIsLoading(false);
                    setStep(2);
                }else{
                    setIsLoading(false);
                    showAlert("임시 비밀번호 발급 실패", "임시 비밀번호 발급에 실패했습니다. 잠시후 다시 시도해 주세요.");
                }
            }).catch(function (error) {
                setIsLoading(false);
                showAlert("오류 발생", "임시 비밀번호 발급 요청 중 알수없는 오류가 발생했습니다.")
                console.log(error);
            })
        }
    }

    return(
        (isLoading)?
            <Loading />
        :(step == 1)?
            <>
                <CustomInput placeholderText={"아이디"} value={id} setInputValue={setId}/>
                <View style={{height:4}}/>
                <CustomInput placeholderText={"전화번호(숫자만 입력)"} value={hpNo} setInputValue={setHpNo} keyboardType='numeric'/>
                <View style={{height:16}}/>
                <CustomStandardBtn text={"임시 비밀번호 발급"} onPress={()=>findPw()}/>
            </>
        :(step == 2)?
            <>
                <Text style={fonts.title}>임시 비밀번호 발급 완료</Text>
                <View style={[styles.row, {justifyContent:"center", marginBottom:4, alignItems:"center"}]}>
                    <Text style={fonts.content}>회원님의 임시 비밀번호는 </Text>
                    <Text style={[fonts.content, {fontWeight:"bold"}]} selectable={true}>{tmpPw}</Text>
                    <Text style={fonts.content}> 입니다.</Text>
                </View>
                <Text style={[fonts.content, {alignSelf:"center", marginBottom:24, alignItems:"center"}]}>보안을 위해 로그인해서 비밀번호를 변경해주세요</Text>
                
                <CustomStandardBtn text={"로그인 하러가기"} onPress={()=>navigator.pop()}/>
            </>
        :
            null
    )
}

const fonts = StyleSheet.create({
    title:{
        marginVertical:15,
        alignSelf:"center",
        fontFamily: "SUIT-SemiBold",
        fontSize: 20,
        color: "#111"
    },
    content:{
        fontFamily: "SUIT-Regular",
        fontSize: 16,
        color: "#111"
    }
})

const styles = StyleSheet.create({
    container:{ flex: 1, padding:16, backgroundColor:"#fff"},
    sampleImage:{width:"100%", height:"100%"},
    row:{flexDirection:"row"}
});
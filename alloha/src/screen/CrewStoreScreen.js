
import { StyleSheet, Text, View, Image, ScrollView, Alert, TextInput } from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import StoreCard from '../components/StoreCard';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { theme } from '../util/color';
import SearchBar from '../components/SearchBar';

import { URL } from "@env";
import { Confirm } from '../util/confirm';
import CustomSwitch from '../components/common/CustomSwitch';
import CustomStandardBtn from '../components/common/CustomStandardBtn';
import { HTTP } from '../util/http';
import { useAlert } from '../util/AlertProvider';

// 알바가 임시 생성 점포를 생성/수정 하는 페이지
// 맨처음 만들었을땐 생성만 고려해서 이름이 이상하게 되었다.
export default function CrewStoreScreen({route }) {
    const {mode, data} = route.params;
    const userId = useSelector((state) => state.login.userId);
    const navigation = useNavigation();
    const {showAlert} = useAlert()
    const [minWage, setMinWage] = useState("");
    const [validYear, setValidYear] = useState("");
    const getMinWage = async () => {
        await HTTP("GET", "/api/v2/common/getMinWage", {})
            .then((res)=>{
                if(res.data.resultCode == "00"){//저장된 정보있음
                    setMinWage(res.data.minWage);
                    setValidYear(res.data.yyyy);
                }
            }).catch(function (error) {
                console.log(error);
            });
    }
    
    
    const [wage, setWage] = useState(0);
    const [cstNa, setCstNa] = useState("");
    const [isWeekWage, setIsWeekWage] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(()=>{
        getMinWage()
        console.log(mode);
        if(mode == "update") {
            setCstNa(data.CSTNA);
            setWage(data.BASICWAGE||0);
            setIsWeekWage((data.WEEKWAGEYN == "Y")?true:(data.WEEKWAGEYN == "N")?false:true);
        }
    }, [])

    const add = async () => {
        if(cstNa == "") {
            showAlert("필수값 누락", "점포명을 입력해 주세요.")
        }else if (wage == 0) {
            showAlert("필수값 누락", "기본 시급을 입력해 주세요.");
        }else{
            setLoading(true);
            if(mode == "update"){
                await HTTP("POST", "/api/v2/crew/updateTmpStore", {cstCo:data.CSTCO, wage, cstNa, isWeekWage, userId, jobType:"H", mealAllowance:0, isSch:false})
                .then((res)=>{
                    if(res.data.resultCode == "00"){//저장된 정보있음
                        showAlert("임시 점포 수정", "수정 되었습니다.")
                        navigation.pop();
                    }else if(res.data.resultCode == "-01"){
                        showAlert("임시 점포 수정", "임시 점포 수정 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요")
                    }
                }).catch(function (error) {
                    showAlert("임시 점포 수정", "임시 점포 수정 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요")
                }).finally(function (){
                    setLoading(false);
                })
            }else if(mode == "create"){
                await HTTP("POST", "/api/v2/crew/createTmpStore", {wage, cstNa, isWeekWage, userId, jobType:"H", mealAllowance:0, isSch:false})
                .then((res)=>{
                    if(res.data.resultCode == "00"){//저장된 정보있음
                        showAlert("임시 점포 추가", "추가 되었습니다.")
                        navigation.pop();
                    }else if(res.data.resultCode == "-01"){
                        showAlert("임시 점포 추가", "임시 점포 추가 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요")
                    }
                }).catch(function (error) {
                    showAlert("임시 점포 추가", "임시 점포 추가 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요")
                }).finally(function (){
                    setLoading(false);
                })
            }
            
        };
    }
    return (
        <View style={styles.container}>
            <BlockContent label={"점포명"} component={<CommonInput value={cstNa} onChangeText={(v)=>{setCstNa(v)}}/>}/>
            <BlockContent label={"기본시급"} subLabel={(minWage)?`${validYear}년 최저 임금 ${minWage.toLocaleString()}원`:""} component={<WageInput value={wage} onChangeText={(v)=>{setWage(v)}} />}/>
            <SwitchContent label={"주휴 수당 여부"} isOn={isWeekWage} setIsOn={setIsWeekWage}/>
            <CustomStandardBtn style={{flex:1}} text={"추가 하기"} onPress={add}/>
        </View>
    );
}


const BlockContent = ({label, subLabel, subComponent=null, component}) => {
    return (
        <View style={{marginBottom:20}}>
            <View style={{flexDirection:'row', justifyContent:"space-between"}}>
                <Text style={fonts.label}>{label}</Text>
                {(subLabel != "")? <Text style={fonts.label}>{subLabel}</Text> : null}
                {(subComponent)?subComponent : null}
            </View>
            {component}
        </View>
    )
}
const SwitchContent = ({label, isOn, setIsOn}) => {
    const handleToggle = () => {
      setIsOn(prevState => !prevState);
    };
    return (
        <View style={{marginBottom:20, flexDirection:'row', justifyContent:"space-between", alignItems:"center", paddingVertical:5}}>
            <Text style={fonts.switchLabel}>{label}</Text>
            <CustomSwitch onToggle={handleToggle} isOn={isOn}  />
        </View>
    )
}
const CommonInput = ({value, onChangeText}) => {
    const [txt, setTxt] = useState(value);
    useEffect(()=>{
        setTxt(value);
    }, [value]);
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[fonts.input, {flex:1, textAlign:"right", marginRight:8}]}
                onChangeText={(value) => {
                    //const valNum = Number(value.replaceAll(",", ""));
                    setTxt(value.trim());
                    onChangeText(value.trim());
                }}
                value={txt}
            />
        </View>
    )
}
const WageInput = ({value, onChangeText}) => {
    const [txt, setTxt] = useState(value.toLocaleString());
    useEffect(()=>{
        setTxt(value.toLocaleString());
    }, [value]);
    return (
        <View style={styles.inputContainer}>
            <TextInput
                style={[fonts.input, {flex:1, textAlign:"right", marginRight:8}]}
                keyboardType='number-pad'
                onChangeText={(value) => {
                    const valNum = Number(value.replaceAll(",", ""));
                    setTxt(valNum.toLocaleString());
                    onChangeText(valNum);
                }}
                value={txt}
            />
            <Text style={fonts.input}>원</Text>
        </View>
    )
}

const fonts = StyleSheet.create({
    title:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        color: "#111111"
    },
    content:{
        fontFamily: "SUIT-Medium",
        fontSize: 13,
        fontWeight: "500",
        color: "#777777"
    },
    label:{
        fontFamily:"SUIT-Regular",
        fontSize:10,
        color:"#555",
        marginBottom:12,
    },
    switchLabel:{
        fontFamily:"SUIT-Bold",
        fontSize:16,
        color:"#111",
    },
    input:{
        fontFamily:"SUIT-Bold",
        fontSize:16,
        color:"#111",
    }
})
const styles = StyleSheet.create({
    container:{ flex: 1, paddingHorizontal:16, backgroundColor:"white", padding:20},
    sampleImage:{width:"100%", height:"100%"}, 
    scrollArea:{
        width:"100%"
    },
    totText:{
        marginHorizontal:16,
        marginVertical:12,
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        color: "#555"
    },
    inputContainer:{
        flexDirection:"row",
        alignItems:"center",
        paddingHorizontal:15,
        height: 50,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
    }
});
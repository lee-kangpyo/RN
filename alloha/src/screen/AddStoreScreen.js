import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, {useState, useRef} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../util/color';
import CustomBtn from '../components/CustomBtn';

import { useSelector } from 'react-redux';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { URL } from "@env";

export default function AddStoreScreen ({ route }) {
    const { setRefresh } = route.params;
    //const url = useSelector((state) => state.config.url);

    const [data, setData] = useState({taxNo:"", cstNa:"", detailAddress:""});
    const [isValidTaxNo, setValidTaxNo] = useState("");
    const detailAddress = useRef();
    const navigation = useNavigation();

    const setAdress = (transferData) => {
        setData({...transferData, ...data});
    }

    useFocusEffect(
        React.useCallback(() => {
            if(data.zoneCode && data.address){
                setTimeout(() => {
                    detailAddress.current.focus();        
                }, 500);
            }   
            return () => {};
        }, [data.address, data.zoneCode])
    );
   
    const checkTaxNo = async () => {
        await axios.get(URL+`/api/v1/checkTaxNo`, {params:{ taxNo: data.taxNo }})
        .then(function (response) {
            if(response.data.result.b_stt_cd){
                setValidTaxNo(true);
            }else{
                setValidTaxNo(false);
                alert("사업자 번호 유효성 검사에 실패하였습니다.")
            }
        }).catch(function (error) {
            console.log(error)
        });
    }

    const submitData = async () => {
        
        const userId = await AsyncStorage.getItem('id');
        const userNa = await AsyncStorage.getItem('userNa');

        const keys = Object.keys(data)
        
        const isValid = keys.every(key => data[key] !== "");

        if (!isValid) {
          Alert.alert("알림", "모든 항목을 입력해주세요");
          return;
        }
        
        if(isValidTaxNo){
        //if(true){
            await axios.post(URL+`/api/v1/addStore`, {...data, userId:userId, userNa:userNa})
            .then(function (response) {
                if(response.data.result == 2 && response.data.resultCode == "00"){
                    Alert.alert("점포 추가", "점포 추가가 완료 되었습니다.");
                    setRefresh(true);
                    navigation.goBack();
                }
            }).catch(function (error) {
                console.log(error)
            });
        }else{
            Alert.alert("사업자 번호 조회", "사업자 번호 유효성 조회를 통과해야 합니다.")
        }
    }

    return(
        <View style={{backgroundColor:"white", padding:20, height:"100%"}}>
            <ScrollView>
                <View style={{...styles.bi_row, flexDirection:"row", marginBottom:(isValidTaxNo === "")?8:0}}>
                    <View style={{...styles.address_box, flex:4, marginRight:8}}>
                        <TextInput
                            maxLength={10}
                            value={data.taxNo}
                            onChangeText={(txt)=>{
                                setData({...data, taxNo:txt});
                                setValidTaxNo("");
                            }} 
                            style={{fontSize:16,}}
                            placeholder={"사업자 번호"}
                            placeholderTextColor={theme.grey}
                            keyboardType='number-pad'
                        />
                    </View>

                    <TouchableOpacity activeOpacity={0.8} style={{...styles.address_box, flex:2, backgroundColor:"orange", justifyContent:"center"}} 
                        onPress={checkTaxNo}>
                        <Text style={styles.text_btn_dig}>사업자번호 조회</Text>
                    </TouchableOpacity>
               
                </View>
                {
                    isValidTaxNo === "" ? 
                            null 
                        :
                        isValidTaxNo ?
                            <View style={styles.taxChkMsg}><Text style={{color:"blue"}}>사업자 번호 확인됨</Text></View>
                        :
                            <View style={styles.taxChkMsg}><Text style={{color:"red"}}>사업자 번호를 확인해주세요</Text></View>

                }
                <View style={styles.bi_row}>
                    <View style={styles.address_box}>
                        <TextInput
                            value={data.cstNa}
                            onChangeText={(txt)=>setData({...data, cstNa:txt})}
                            style={{fontSize:16,}}
                            placeholder={"상호명"}
                            placeholderTextColor={theme.grey}
                        />
                    </View>
                </View>
                <View style={{...styles.bi_row, flexDirection:"row"}}>
                    <View style={{...styles.address_box, flex:4, marginRight:8,}}>
                        <Text style={{...styles.text_dig, color:(data.zoneCode)?"black":theme.grey}}>{(data.zoneCode)?data.zoneCode:"우편번호"}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={{...styles.address_box, flex:2, backgroundColor:"orange", justifyContent:"center"}} 
                        onPress={()=>{
                            navigation.navigate('SearchAddress', 
                                {setAdress:(data) => {
                                    setAdress(data)
                                }
                            })
                        }
                    }>
                        <Text style={styles.text_btn_dig}>우편번호 찾기</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.bi_row}>
                    <View style={styles.address_box}>
                        <Text style={{...styles.text_dig, color:(data.address)?"black":theme.grey}}>{(data.address)?data.address:"주소"}</Text>
                    </View>
                </View>
                <View style={styles.bi_row}>
                    <View style={styles.address_box}>
                        <TextInput
                            ref={detailAddress}
                            value={data.detailAddress}
                            onChangeText={(txt)=>setData({...data, detailAddress:txt})}
                            style={{fontSize:16,}}
                            placeholder={"상세주소"}
                            placeholderTextColor={theme.grey}
                        />
                    </View>
                </View>

                <View style={styles.bi_row}>
                    <CustomBtn txt="저장하기" onPress={submitData} style={styles.next} color='white'/>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    bi_row:{
        marginBottom:8,
        width:"100%",
        padding:4,
        textAlign:"center",
    },
    address_box:{
        padding:8,
        borderColor:theme.grey,
        borderWidth:1,
        borderRadius:5,
    },
    text_dig:{
        color:theme.grey,
        fontSize:16,
    },
    text_btn_dig:{
        textAlign:"center",
    },
    taxChkMsg:{
        paddingTop:0,
        padding:8
    }

});

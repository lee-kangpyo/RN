import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import React, {useState, useRef} from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { theme } from '../util/color';
import CustomBtn from '../components/CustomBtn';

import { useSelector } from 'react-redux';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { URL } from "@env";
import { Transition } from 'react-native-reanimated';
import CustomModal from '../components/CustomModal';

export default function ModifyStoreScreen ({ route }) {
    const userId = useSelector((state) => state.login.userId);
    const { store } = route.params;
    
    const [data, setData] = useState({
        taxNo:store.TAXNO.replaceAll("-", ""), cstNa:store.CSTNA, address: store.ZIPADDR,detailAddress:store.ADDR,
        lat:store.LAT, lon:store.LON, zoneCode:store.ZIPNO,
    });
    const [isValidTaxNo, setValidTaxNo] = useState(true);
    const detailAddress = useRef();
    const navigation = useNavigation();
    const setAdress = (transferData) => {
        setData({...transferData, ...data});
    };
    const [showModifyTaxNo, setModifyTaxNo] = useState(false);

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
        try {
            const response = await axios.get(URL+`/api/v1/checkTaxNo`, {params:{ taxNo: data.taxNo }});
            if (response.data.result.b_stt_cd) {
                //setValidTaxNo(true);
                return true;
            } else {
                alert("사업자 번호 유효성 검사에 실패하였습니다.")
                //setValidTaxNo(false);
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const submitData = async () => {
        
        const userId = await AsyncStorage.getItem('id');

        const keys = Object.keys(data)
        
        const isValid = keys.every(key => data[key] !== "");

        if (!isValid) {
          Alert.alert("알림", "모든 항목을 입력해주세요");
          return;
        }
        await axios.post(URL+`/api/v1/modifyStore`, {...data, userId:userId, cstCo:store.CSTCO})
            .then(function(rlt){
                if(rlt.data.result == 1) {
                    alert("점포 정보가 수정되었습니다.");
                }
            })
        
    }

    const openModifyTaxNo = () => {
        setData({...data, taxNo:store.TAXNO.replaceAll("-", "")});
        //setValidTaxNo(true);
        setModifyTaxNo(true);
    }
    const saveTaxNo = async () => {
        const check = await checkTaxNo();
        if(check){
            await axios.post(URL+`/api/v1/saveTaxNo`, {taxNo:data.taxNo, cstCo:store.CSTCO, userId:userId})
            .then(function(rlt){
                if(rlt.data.result == 1){
                    var cngTaxNo = data.taxNo;
                    store.TAXNO = cngTaxNo.slice(0, 3)+"-"+cngTaxNo.slice(3, 5)+"-"+cngTaxNo.slice(5, 10);
                    alert("사업자 번호가 수정되었습니다.");
                }
            })
            setModifyTaxNo(false)
        }
    }
    
    return(
        <>
        <View style={{backgroundColor:"white", padding:20, height:"100%"}}>
            <ScrollView>
                <View style={{...styles.bi_row, flexDirection:"row", marginBottom:(isValidTaxNo === "")?8:0}}>
                    <View style={{...styles.address_box, flexDirection:"row", borderWidth:0, flex:4, marginRight:8}}>
                        <Text>사업자 번호 : </Text>
                        <Text>{store.TAXNO}</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.8} style={{...styles.address_box, flex:2, backgroundColor:"orange", justifyContent:"center"}} 
                        onPress={openModifyTaxNo}>
                        <Text style={styles.text_btn_dig}>사업자번호 수정</Text>
                    </TouchableOpacity>
               
                </View>
                <View style={styles.bi_row}>
                    <View style={styles.address_box}>
                        <TextInput
                            value={data.cstNa}
                            onChangeText={(txt)=>setData({...data, cstNa:txt})}
                            style={{fontSize:16, width:120}}
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
                    <CustomBtn txt="수정하기" onPress={submitData} style={styles.next} color='white'/>
                </View>
            </ScrollView>
            <CustomModal 
                visible={showModifyTaxNo} 
                title={"사업자 번호 수정"} 
                confBtnTxt={"수정"} 
                confirm={()=>saveTaxNo()}
                cBtnTxt={"취소"}  
                onCancel={()=>setModifyTaxNo(false)} 
                onclose={()=>{}}
                body={
                        <>
                            <View style={{...styles.bi_row, flexDirection:"row", marginBottom:(isValidTaxNo === "")?8:0}}>
                                <View style={{...styles.address_box, flexDirection:"row", borderWidth:0, flex:4, marginRight:8, borderWidth:1}}>
                                <TextInput
                                    maxLength={10}
                                    value={data.taxNo}
                                    onChangeText={(txt)=>{
                                        setData({...data, taxNo:txt});
                                        
                                    }} 
                                    style={{fontSize:16,}}
                                    placeholder={"사업자 번호"}
                                    placeholderTextColor={theme.grey}
                                    keyboardType='number-pad'
                                    //onSubmitEditing={() => {checkTaxNo()}}
                                    //onBlur={checkTaxNo}
                                />
                                </View>
                      
                            </View>
                        </>
                    } 
            />
        </View>
        </>
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

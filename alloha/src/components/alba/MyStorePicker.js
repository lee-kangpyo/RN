import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text, Alert, Image } from 'react-native';
import { theme } from '../../util/color';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { URL } from "@env";
import { useDispatch, useSelector } from 'react-redux';
import { setMyStores, setSelectedStore } from '../../../redux/slices/alba';
import { Platform } from 'react-native';


export default function MyStorePicker({width="100%", borderColor=theme.selectBox, userId, isComplete}) {
    //const [selCstCo, setSelCstco] = useState();
    //const [selectedStore, setSelectedStore] = useState({});             // 선택된 점포
    //const [myStores, setmyStores] = useState([]);                       // 내 알바 점포들
    const sCstCo = useSelector((state)=>state.alba.sCstCo)
    const myStores = useSelector((state)=>state.alba.myStores)

    const dispatch = useDispatch();
    const searchMyAlbaList = async (init) => {
        await axios.get(URL+"/api/v1/searchMyAlbaList", {params:{userId:userId}})
        .then((res)=>{
            if(res.data.resultCode === "00"){
                dispatch(setMyStores({data:res.data.result}));
                if(res.data.result.length > 0 && init == true){
                    dispatch(setSelectedStore({data:res.data.result[0]}));
                }
                if(isComplete) isComplete();
             }else{
                Alert.alert("알림", "내 알바 리스트 요청 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.")
            }
        }).catch(function (error) {
            console.log(error);
            Alert.alert("오류", "알바 리스트 요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    useEffect(()=>{
        searchMyAlbaList(true);
    }, [])

  return (
    (sCstCo > 0)?
        <View style={[styles.container, {width:width}]}>
            <View style={[styles.border, {borderColor:borderColor,}]}>
                {
                    (Platform.OS === 'android')?
                    <>
                        <Picker
                            selectedValue={sCstCo}
                            onValueChange={ (itemValue, itemIndex) =>{
                                const data = myStores.filter((el)=>{return el.CSTCO == itemValue})[0];
                                dispatch(setSelectedStore({data:data}));
                            }}
                            dropdownIconColor="white"
                        >
                            {
                                myStores.map((el, idx)=>{
                                    return (el.RTCL === "N")
                                        ?
                                            <Picker.Item key={idx} label={el.CSTNA} value={el.CSTCO} style={styles.pickerText}/>
                                        :(el.RTCL === "R")?
                                            <Picker.Item key={idx} label={el.CSTNA + "(승인 대기 중)"} value={el.CSTCO}/>
                                        :  
                                            null;
                                })
                            }
                            
                        </Picker>
                        <Image source={require('../../../assets/icons/dropDown.png')} style={styles.dropdownIcon} />
                    </>
                    :
                    <>
                        <Text>구휘커피 ios는 추가개발 필요</Text>
                        <Text style={{position:"absolute", right:20}}>a</Text>
                    </>
                }
                
            </View>
        </View>
    :
        null
  );
};

const styles = StyleSheet.create({
    container: {
        textAlign:"center", 
        
    },
    border:{
        height: 50,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)",
        justifyContent:"center",
    },
    pickerText:{
        fontFamily: "SUIT-Regular",
        fontSize: 15,
        fontWeight: "400",
        color: "#111111"
    },
    dropdownIcon:{position:"absolute", right:15, width:18, height:18, resizeMode:"contain"}
  });
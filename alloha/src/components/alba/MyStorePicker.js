import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert, Image, Modal } from 'react-native';
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
    const sCstCo = useSelector((state)=>state.alba.sCstCo);
    const myStores = useSelector((state)=>state.alba.myStores);
    const [iosPickerVisible, setIosPickerVisible] = useState(false);

    const dispatch = useDispatch();
    const searchMyAlbaList = async (init) => {
        await axios.get(URL+"/api/v1/searchMyAlbaList", {params:{userId:userId}})
        .then((res)=>{
            if(res.data.resultCode === "00"){
                const mystore = res.data.result.filter(el => ["R", "N"].includes(el.RTCL));
                if(mystore.length > 0 && init == true){
                    dispatch(setSelectedStore({data:mystore[0]}));
                }
                dispatch(setMyStores({data:mystore}));
                if(isComplete) isComplete();
             }else{
                Alert.alert("알림", "내 알바 리스트 요청 중 오류가 발생했습니다. 잠시후 다시 시도해 주세요.");
            }
        }).catch(function (error) {
            console.log(error);
            Alert.alert("오류", "알바 리스트 요청 중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }

    useEffect(()=>{
        searchMyAlbaList(true);
    }, [])
  return (
    (myStores.length > 0)?
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
                            <TouchableOpacity onPress={()=>setIosPickerVisible(true)} style={{height:"100%", justifyContent:"center"}}>
                                <Text style={{paddingLeft:20}}>{myStores.filter(el => el.CSTCO == sCstCo)[0].CSTNA}</Text>
                                <Image source={require('../../../assets/icons/dropDown.png')} style={styles.dropdownIcon} />
                            </TouchableOpacity>
                            <Modal
                                animationType="fade"
                                transparent={true}
                                visible={iosPickerVisible}
                                onRequestClose={() => {
                                    setIosPickerVisible(false);
                                }}
                            >
                                <View style={modal.modalContainer}>
                                    <View style={modal.modalContent}>
                                        {/* 모달 내용 */}
                                        {
                                            myStores.map((el, idx)=>{
                                                return (el.RTCL === "N")
                                                    ?
                                                        <TouchableOpacity key={idx} style={modal.item} onPress={()=>{
                                                            const data = myStores.filter((el2)=>{return el2.CSTCO == el.CSTCO})[0];
                                                            dispatch(setSelectedStore({data:data}));
                                                            setIosPickerVisible(false)
                                                        }}>
                                                            <Text key={idx} label={el.CSTNA} value={el.CSTCO} style={styles.pickerText}>{el.CSTNA}</Text>
                                                        </TouchableOpacity>
                                                    :(el.RTCL === "R")?
                                                        <View  key={idx} style={modal.item}>
                                                            <Text key={idx} label={el.CSTNA + "(승인 대기 중)"} value={el.CSTCO}>{el.CSTNA + "(승인 대기 중)"}</Text>
                                                        </View>
                                                    :  
                                                        null;
                                            })
                                        }
                                    </View>
                                </View>
                            </Modal>
                    </>
                }
                
            </View>
        </View>
    :
        <Text>등록된 점포가 없습니다.</Text>
  );
};

const modal = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    touchableText: {
      fontSize: 18,
      color: 'blue',
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent 회색 배경
      
    },
    modalContent: {
      width:"90%", 
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
    },
    item:{
        width:"100%",
        paddingVertical:15,
        paddingHorizontal:10,
    },
    closeButton: {
      marginTop: 10,
      color: 'blue',
    },
  });

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
import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setOwnerCstco, setOwnerStoreList } from '../../../redux/slices/common';
import axios from 'axios';
import { URL } from "@env";

export default function StoreSelectBox({flex}) {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const storeList = useSelector((state)=>state.common.storeList);
    const dispatch = useDispatch();
    const [iosPickerVisible, setIosPickerVisible] = useState(false);

    const getStoreList = async () => {
        await axios.get(URL+`/api/v1/getStoreList`, {params:{userId:userId,}})
        .then((res)=>{
                dispatch(setOwnerStoreList({storeList:res.data.result}));
        }).catch(function (error) {
            console.log(error);
            alert("점포를 조회하는중 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
        })
    }

    var viewWidth = (flex)?{flex:flex}:{width:"100%"};
    useEffect(()=>{
        getStoreList();
    }, [])

    return (
        <View style = {[styles.container, viewWidth]}>
            {
                (cstCo == "")?
                <View style={{alignSelf:"center", justifyContent:"center", height:"100%"}}>
                    <Text style={[fonts.text, ]}>등록된 점포가 없습니다.</Text>
                </View>
                :
                (Platform.OS === 'android')?
                <Picker
                    selectedValue = {cstCo}
                    onValueChange = {(cstCo) => dispatch(setOwnerCstco({cstCo:cstCo}))}
                    >
                    {
                        storeList.map((el, idx)=>{
                            return <Picker.Item style={styles.item} key={idx} label={el.CSTNA} value={el.CSTCO}/>
                        })
                    }
                </Picker>
                :
                <>
                <TouchableOpacity onPress={()=>setIosPickerVisible(true)} style={{height:"100%", justifyContent:"center", flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
                    <Text style={[fonts.text, {paddingLeft:20}]}>{storeList.filter(el => el.CSTCO == cstCo)[0].CSTNA}</Text>
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
                        <ScrollView style={{width:"90%", backgroundColor: 'white', borderRadius:10}} contentContainerStyle={modal.modalContent}>
                            {/* 모달 내용 */}
                            {
                                storeList.map((el, idx)=>{
                                    return (
                                            <TouchableOpacity key={idx} style={modal.item} onPress={()=>{
                                                //const data = myStores.filter((el2)=>{return el2.CSTCO == el.CSTCO})[0];
                                                //dispatch(setSelectedStore({data:data}));
                                                dispatch(setOwnerCstco({cstCo:el.CSTCO}))
                                                setIosPickerVisible(false)
                                            }}>
                                                <Text key={idx} label={el.CSTNA} value={el.CSTCO} style={styles.pickerText}>{el.CSTNA}</Text>
                                            </TouchableOpacity>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>
                </Modal>
                </>
            }
            
        </View>
    );
};

const fonts = StyleSheet.create({
    text:{
        fontFamily: "SUIT-Regular",
        fontSize: 15,
        fontWeight: "400",
        fontStyle: "normal",
        color: "#111111"
    }
})

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
      paddingVertical:200,
    },

    modalContent: {
      
      
      padding: 20,
      borderRadius: 10,
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
        height:50,
        borderRadius: 10,
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        borderColor: "rgba(221, 221, 221, 1.0)"
    },
    item:{
        fontSize:13,
    },
    dropdownIcon:{position:"absolute", right:15, width:18, height:18, resizeMode:"contain"}
});
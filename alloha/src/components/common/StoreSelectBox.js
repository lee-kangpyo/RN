import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setOwnerCstco, setOwnerStoreList } from '../../../redux/slices/common';
import axios from 'axios';
import { URL } from "@env";

export default function StoreSelectBox({flex}) {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const storeList = useSelector((state)=>state.common.storeList);
    const dispatch = useDispatch();

    

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
                <Text style={{alignSelf:"center"}}>등록된 점포가 없습니다.</Text>
                :
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
            }
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent:"center",
        height:40,
        borderWidth:1, 
        borderColor:"black", 
        borderRadius:10, 
    },
    item:{
        fontSize:13,
    }
});
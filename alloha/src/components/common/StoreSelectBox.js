import { Picker } from '@react-native-picker/picker';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setOwnerCstco, setOwnerStoreList } from '../../../redux/slices/common';
import axios from 'axios';
import { URL } from "@env";

export default function StoreSelectBox() {
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

    useEffect(()=>{
        getStoreList();
    }, [])

    return (
        <View style = {{width: "100%",height: 60, borderWidth:1, borderColor:"black", borderRadius:10, marginBottom:10}}>
            <Picker
                selectedValue = {cstCo}
                onValueChange = {(cstCo) => dispatch(setOwnerCstco({cstCo:cstCo}))}
                >
                {
                    storeList.map((el, idx)=>{
                        return <Picker.Item key={idx} label={el.CSTNA} value={el.CSTCO}/>
                    })
                }
            </Picker>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
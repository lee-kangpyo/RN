
import { StyleSheet, Text, View, ScrollView, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from 'axios'

import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/slices/login';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { initAlbaSlice } from '../../redux/slices/alba';

export default function ComunityScreen({navigation}) {
    const dispatch = useDispatch();

    useEffect(()=>{
        navigation.setOptions({title:"커뮤니티"})
    }, [navigation])

    const logOut = async () => {
        //로그아웃 실행.
        // dispatch(initAlbaSlice());
        // dispatch(setUserInfo({isLogin:false, userId:""}));
        // await SecureStore.setItemAsync("uuid", "");
        // TaskManager.unregisterAllTasksAsync();
    }

    return (
        <ScrollView style={{height:500}}>
            <View style={styles.container}>
                    <Text style={styles.image_txt}>이 페이지는 준비중입니다.</Text>
            </View>
            <TouchableOpacity style={{padding:16}} onPress={logOut}>
                <Text>로그아웃</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'center', alignItems: 'center', padding:16, height:Dimensions.get('window').height},
    image:{flex:1, justifyContent:"center", resizeMode:"contain", width:"100%", height:"100%"},
    image_txt:{
        backgroundColor:"red", 
        textAlign:"center", 
        alignSelf:"center", 
        padding:16, 
        borderRadius:8, 
        color:"white",
        fontSize:16,
    }
});
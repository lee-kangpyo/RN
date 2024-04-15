
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { theme } from '../../util/color';
import { useDispatch, useSelector } from 'react-redux';
import { initAlbaSlice } from '../../../redux/slices/alba';
import { setUserInfo } from '../../../redux/slices/login';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { HTTP } from '../../util/http';

export default function DelUser({isVisible, setIsVisible}) {

    // const delUser = async () => {
    //     await HTTP("POST", "/api/v1/delUser", {userId:userId});
    //     dispatch(initAlbaSlice());
    //     dispatch(setUserInfo({isLogin:false, userId:""}));
    //     await SecureStore.setItemAsync("uuid", "");
    //     TaskManager.unregisterAllTasksAsync();
    // }
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.login.userId);
    const [phoneNum, setPhoneNum] = useState("");
    const key = 'r#9t1u4J5FVcPd_h#s6cQVIlf_R!!4x6dRK1AC#qPMz3CVox7zOdF4vxuRI$JvUJaNmeKvGmJ1OvAzK8Dx6moy1fbn';
    const proceed = async () => {
        //삭제 요청
        const result = await HTTP("GET", "/api/v1/delUser", {userId, key, hpNo:phoneNum.replaceAll("-", "")});
        console.log(result.data);
        if(result.data.resultCode == "-03"){
            alert(result.data.msg);
        }else if(result.data.resultCode == "00"){
            alert("탈퇴 완료었습니다.")
            await HTTP("POST", "/api/v1/logOut", {userId});
            dispatch(initAlbaSlice());
            dispatch(setUserInfo({isLogin:false, userId:""}));
            await SecureStore.setItemAsync("uuid", "");
            TaskManager.unregisterAllTasksAsync();
        }
    }

    const init = () => {
        setPhoneNum("");
        setIsVisible(false);
    }
    
    return(
        <>
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={init}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <View style={{ margin: 20, width:"80%", backgroundColor: 'white', borderRadius: 20, padding: 35, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, elevation: 5 }}>
                <Text style={fonts.title}>회원 탈퇴</Text>
                <Text style={fonts.content}>회원 탈퇴를 진행하시려면 아래 입력창에 본인 전화번호를 입력해주세요</Text>
                <TextInput style={styles.input} placeholder='01011112222' value={phoneNum} onChange={(e)=>{console.log(e.nativeEvent.text);setPhoneNum(e.nativeEvent.text);}}/>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.btn} onPress={proceed}>
                        <Text style={fonts.btnText}>탈퇴요청</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btn} onPress={init}>
                        <Text style={[fonts.btnText, {color:theme.primary}]}>취소</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </View>
        </Modal>
        </>
    )

}

const fonts = StyleSheet.create({
    title:{
        fontFamily:"SUIT-Bold",
        fontSize:18,
        marginBottom:5
    },
    content:{
        fontFamily:"SUIT-Medium",
        fontSize:13,
        marginBottom:5
    },
    btnText:{
        fontFamily:"SUIT-Medium",
        fontSize:15,
        color:"#111"
    }
})

const styles = StyleSheet.create({
    input:{
        borderColor:theme.primary,
        borderWidth:1,
        width:"100%",
        borderRadius:10,
        marginVertical:15,
        padding:10
    },
    btn:{
        padding:5,
        borderRadius:10,
    },
    row:{
        flexDirection:"row",
        alignSelf:"flex-end"
    }
});
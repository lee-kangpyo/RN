
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign   } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../redux/slices/login';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { color } from 'react-native-reanimated';
import { initAlbaSlice } from '../../redux/slices/alba';
import { HTTP } from '../util/http';

export default function EtcCrewScreen({navigation}) {
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.login.userId);
    useEffect(()=>{
        navigation.setOptions({title:"기타"})
    }, [navigation])

    const logOut = async () => {
        await HTTP("POST", "/api/v1/logOut", {userId:userId});
        dispatch(initAlbaSlice());
        dispatch(setUserInfo({isLogin:false, userId:""}));
        await SecureStore.setItemAsync("uuid", "");
        TaskManager.unregisterAllTasksAsync();
        
    }

    return (
        <View style={{padding:15}}>
            <View style={[styles.container, {flexDirection:"row"}]}>
                <GridBox
                    color="red"
                    text={"로그아웃"}
                    onPress={logOut}
                    icon={{type:"MaterialCommunityIcons", name:"logout", size:48, color:"red"}}
                />
                <GridBox
                    text={"준비중"}
                    onPress={()=>null}
                    icon={{type:"AntDesign", name:"appstore-o", size:48, color:"black"}}
                />
                <GridBox
                    text={"준비중"}
                    onPress={()=>null}
                    icon={{type:"AntDesign", name:"appstore-o", size:48, color:"black"}}
                />
            </View>
        </View>
    );
}

function GridBox({color = "black", text, onPress, icon}){
    return(
        <TouchableOpacity onPress={onPress} style={styles.grid}>
            {
                (icon)?
                    (icon.type == "FontAwesome5")?
                        <FontAwesome5 name={icon.name} size={icon.size} color={color} />
                    :(icon.type == "MaterialCommunityIcons")?
                        <MaterialCommunityIcons name={icon.name} size={icon.size} color={color}/>
                    :(icon.type == "Ionicons")?
                        <Ionicons name={icon.name} size={icon.size} color={color}/>
                    :(icon.type == "AntDesign")?
                        <AntDesign name={icon.name} size={icon.size} color={color}/>
                    :    null
                :
                    null
            }
            <Text style={[styles.gridTxt, {color:color}]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container:{ justifyContent: 'center', alignItems: 'center',},
    grid:{
        flex:1,
        margin:5,
        padding:20,
        borderWidth:1,
        borderColor:"grey",
        borderRadius:5,
        alignItems:"center"
    },
    gridTxt:{
        marginTop:10,
        fontSize:16
    }
});
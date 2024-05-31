
import { StyleSheet, Text, View, TouchableOpacity, Modal, Button, TextInput, Linking} from 'react-native';
import React, {useState, useEffect} from 'react';
import { FontAwesome5, MaterialCommunityIcons, Ionicons, AntDesign, Octicons, MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../redux/slices/login';
import * as SecureStore from 'expo-secure-store';
import * as TaskManager from 'expo-task-manager';
import { color } from 'react-native-reanimated';
import { initAlbaSlice } from '../../redux/slices/alba';
import { HTTP } from '../util/http';
import { MODE } from "@env";
import DelUser from './../components/common/DelUser';

export default function EtcCrewScreen({navigation}) {
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.login.userId);
    useEffect(()=>{
        navigation.setOptions({title:"기타"})
    }, [navigation])

    const logOut = async () => {
        if(MODE == "DEV"){
            dispatch({ type: 'LOGOUT' });
            await SecureStore.setItemAsync("uuid", "");
            TaskManager.unregisterAllTasksAsync();
        }else{
            await HTTP("POST", "/api/v1/logOut", {userId:userId});
            dispatch({ type: 'LOGOUT' });
            //dispatch(initAlbaSlice());
            //dispatch(setUserInfo({isLogin:false, userId:""}));
            await SecureStore.setItemAsync("uuid", "");
            TaskManager.unregisterAllTasksAsync();
        }
    }

    const [checkDelUserModalmodalVisible, setCheckDelUserModalVisible] = useState(false);
    checkDelUser = () => {
        setCheckDelUserModalVisible(true)
    }


    return (
        <>
        <View style={{padding:15}}>
            <View style={[styles.container, {flexDirection:"row"}]}>
                <GridBox
                    text={"문의하기"}
                    onPress={()=>navigation.push("question")}
                    icon={{type:"Octicons", name:"paper-airplane", size:48, color:"black"}}
                />
                <GridBox
                    text={"매뉴얼"}
                    onPress={()=>Linking.openURL("https://www.notion.so/f3112ad5877e4d05a08cc441b90a3eb8")}
                    icon={{type:"AntDesign", name:"book", size:48, color:"black"}}
                />
                <GridBox
                    color="red"
                    text={"로그아웃"}
                    onPress={logOut}
                    icon={{type:"MaterialCommunityIcons", name:"logout", size:48, color:"red"}}
                />
            </View>
            <View style={[styles.container, {flexDirection:"row"}]}>
                <GridBox
                    text={"비밀번호"}
                    onPress={()=>navigation.push("changePassword")}
                    icon={{type:"MaterialIcons", name:"password", size:48, color:"black"}}
                />
                <GridBox
                    // text={"커뮤니티"}
                    // onPress={()=>navigation.push("Comunity")}
                    // icon={{type:"Ionicons", name:"people-sharp", size:48, color:"black"}}
                    text={"회원탈퇴"}
                    onPress={checkDelUser}
                    icon={{type:"FontAwesome5", name:"user-slash", size:48, color:"red"}}
                />
                
                <GridBox
                    text={"준비중"}
                    onPress={()=>null}
                    icon={{type:"AntDesign", name:"appstore-o", size:48, color:"black"}}
                />

            </View>
        </View>
        <DelUser isVisible = {checkDelUserModalmodalVisible} setIsVisible = {setCheckDelUserModalVisible}/>
        </>
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
                    :(icon.type == "Octicons")?    
                        <Octicons name={icon.name} size={icon.size} color={color} />
                    :(icon.type == "MaterialIcons")?    
                        <MaterialIcons name={icon.name} size={icon.size} color={color} />
                    :
                        null
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
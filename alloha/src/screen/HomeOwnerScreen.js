
import { ActivityIndicator, Linking, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';

import { StatusBar, setStatusBarStyle } from 'expo-status-bar';
import { theme } from '../util/color';

import { useDispatch, useSelector } from 'react-redux';
import { HTTP } from '../util/http';
import HomeHeader from '../components/home/HomeHeader';
import TodayAlba from '../components/home/owner/TodayAlba';
import { useFocusEffect } from '@react-navigation/native';
import { setOwnerCstco } from '../../redux/slices/common';
import StoreChange from '../components/home/owner/StoreChange';
import { isEqual } from 'lodash';
import IconBtn from '../components/home/IconBtn';


export default function HomeOwnerScreen({navigation}) {
    const dispatch = useDispatch();
    const userId = useSelector((state)=>state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);
    const [curStore, setCurStore] = useState({CSTCO:""});
    const [datas, setDatas] = useState({});
    useFocusEffect(
        useCallback(() => {
            getMainINfo();
        }, [cstCo]),
    )

    const onChangeBtnTap = (cstCo) => {
        const storeList = datas.storeList;
        dispatch(setOwnerCstco({cstCo:cstCo}))
        setCurStore(storeList.find(el => el.CSTCO == cstCo));
    }
    
    const getMainINfo = async () => {
        await HTTP("GET", "/api/v1/main/owner", {userId, cstCo:cstCo})
        .then((res)=>{
            if(res.data.resultCode == "00"){
                const data = res.data.result;
                if(data.storeList.length == 0){
                    if(!isEqual(curStore, {CSTCO:""})) setCurStore({CSTCO:""});
                }else if(!isEqual(curStore, data.storeList.find(el => el.CSTCO == data.cstCo))){
                    setCurStore(data.storeList.find(el => el.CSTCO == data.cstCo));
                }
                setDatas(data);
            }else{
                alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");    
            }
        }).catch(function (error) {
            console.log(error);
            alert("서버 통신 중 오류가 발생했습니다. 잠시후 다시 시도해주세요.");
        })
    }
    /*
                <GridBox 
                text={"점포관리"} 
                onPress={()=>navigation.push("storeList")} 
                icon={{type:"FontAwesome5", name:"store", size:48, color:"black"}} 
            />   
            <GridBox 
                text={"알바관리"} 
                onPress={()=>navigation.push("ManageCrew")}
                icon={{type:"MaterialCommunityIcons", name:"badge-account-horizontal", size:48, color:"black"}}
            />  
    */
    return (
        (Object.keys(datas).length == 0)?
        <View style={{flex:1, justifyContent:"center"}}>
            <ActivityIndicator color={"black"}/>
        </View>
        :
        <View style={styles.container}>
            <StatusBar style='dark'/>
            <HomeHeader 
                data={datas.top} 
                leftIcons={[
                    <IconBtn text={"점포관리"} onPress={()=>navigation.push("storeList")} icon={{type:"FontAwesome5", name:"store"}}/>,
                    <IconBtn text={"알바관리"} onPress={()=>navigation.push("ManageCrew")} icon={{type:"MaterialCommunityIcons", name:"badge-account-horizontal"}}/>,
                    <IconBtn text={"문의"} onPress={()=>Linking.openURL('http://pf.kakao.com/_mxmjLG/chat')} icon={{type:"MaterialCommunityIcons", name:"chat-question"}}/>
                ]} 
            />
            {
                (datas.storeList.length > 0)?
                <ScrollView style={styles.container2}>
                    <StoreChange curStore={curStore} storeList={datas.storeList} onChangeBtnTap={(cstCo)=>onChangeBtnTap(cstCo)}/>
                    <TodayAlba todayAlba={datas.todayAlba} storeList={datas.storeList} curStore={curStore}/>
                </ScrollView>
                :
                <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
                    <Text style={fonts.notStore}>먼저 점포 생성을 해주세요</Text>
                </View>
            }
            
        </View>
    )
}
const fonts = StyleSheet.create({
    notStore:{
        fontFamily: "SUIT-Bold",
        fontSize: 14,
        color: "#333333",
    }
})
const styles = StyleSheet.create({
    container:{flex:1, backgroundColor:"#F6F6F8"},
    container2:{paddingHorizontal:16, paddingBottom:20},
    top:{paddingTop:60, padding:30, flexDirection:"row", borderBottomLeftRadius:15, borderBottomRightRadius:15, justifyContent:"space-between"},
    circle:{backgroundColor:"white", borderRadius:50, marginRight:15, width:50, height:50, justifyContent:"center", alignItems:"center"},
    font_Medium:{fontFamily:"SUIT-Medium"},
    font_Bold:{fontFamily:"SUIT-Bold"},
    topColor:{color:theme.white, },
    body:{padding:20, paddingHorizontal:16},

});
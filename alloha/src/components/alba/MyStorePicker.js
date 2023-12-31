import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../../util/color';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { URL } from "@env";
import { useDispatch, useSelector } from 'react-redux';
import { setMyStores, setSelectedStore } from '../../../redux/slices/alba';

export default function MyStorePicker({width="100%", borderColor=theme.purple, userId}) {
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
            <View style={[styles.border, {borderColor:borderColor, height:35, justifyContent:"center", overflow:'hidden'}]}>
                <Picker
                    style={{fontSize:"16",}}
                    selectedValue={sCstCo}
                    onValueChange={ (itemValue, itemIndex) =>{
                        dispatch(setSelectedStore({data:myStores.filter((el)=>{return el.CSTCO === itemValue})[0]}));
                    }
                    }
                    >
                    {
                    myStores.map((el, idx)=>{
                            return (el.RTCL === "N")
                                ?
                                    <Picker.Item key={idx} label={el.CSTNA} value={el.CSTCO}/>
                                :(el.RTCL === "R")?
                                    <Picker.Item key={idx} label={el.CSTNA + "(승인 대기 중)"} value={el.CSTCO}/>
                                :  
                                    null;
                        })
                    }
                    
                </Picker>
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
        borderWidth:1,
        borderRadius:5,
        padding:5,
    },
  });
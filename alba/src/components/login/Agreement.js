import { Feather , AntDesign  } from '@expo/vector-icons'; 
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Checkbox from 'expo-checkbox';
import { theme } from '../../util/color';
import { color } from 'react-native-reanimated';

export default function Agreement({closesheet, navigation}){
    const [isTotChecked, setTotChecked] = useState(false);
    const [isUseChecked, setUseChecked] = useState(false);
    const [isPrivChecked, setPrivChecked] = useState(false);
    const [isenvtChecked, setenvtChecked] = useState(false);
    
    const setTotCheckBox = (bool) => {
        setTotChecked(bool);
        setUseChecked(bool);
        setPrivChecked(bool);
        setenvtChecked(bool);
    }
    useEffect(() => {
        if(isTotChecked && (!isUseChecked || !isPrivChecked || !isenvtChecked)){
            setTotChecked(false);
        }else if (!isTotChecked && (isUseChecked && isPrivChecked && isenvtChecked)){
            setTotChecked(true);
        }
    }, [isUseChecked, isPrivChecked, isenvtChecked])

    const agrList=[
        {
            text:"[필수] 이용 약관 동의",
            state:isUseChecked,
            setState:setUseChecked,
            detail:<view><text>1</text></view>
        },
        {
            text:"[필수] 개인 정보 처리방침 동의",
            state:isPrivChecked,
            setState:setPrivChecked,
            detail:<view><text>2</text></view>
        },
        {
            text:"[선택] 이벤트 및 마케팅 활용 동의",
            state:isenvtChecked,
            setState:setenvtChecked,
            detail:<view><text>3</text></view>
        },
    ]

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>closesheet()}>
                    <Feather name="x" size={36} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>약관 동의</Text>
                <Feather name="x" size={36} color="black" style={{opacity:0}} />
            </View>
            <View style={{...styles.totAgr, borderColor:(isTotChecked)?theme.primary:theme.grey}}>
                <Checkbox style={styles.checkbox} value={isTotChecked} onValueChange={setTotCheckBox} color={(isTotChecked)?theme.primary:theme.grey} />
                <Text style={{...styles.txt_dig, fontWeight:500,}}>전체 동의</Text>
            </View>

            {
                agrList.map((item, idx)=>{
                    return(
                        <View key={idx} style={styles.agree_comp}>
                            <View style={styles.agree_cont}>
                                <TouchableOpacity onPress={() => item.setState(!item.state)}>
                                    <AntDesign name="check" size={24} color={(item.state)?theme.primary:theme.grey} />
                                </TouchableOpacity>
                                <Text style={styles.txt_dig}>{item.text}</Text>
                            </View>
                            <TouchableOpacity onPress={() => navigation.navigate('TermsDetail')}>
                                <Feather name="chevron-right" size={24} color="black" />
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
          
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")} disabled={!(isUseChecked && isPrivChecked)} style={{...styles.btn, backgroundColor:(isUseChecked && isPrivChecked)?theme.primary:theme.grey}}>
                <Text style={styles.btnTxt}>동의하고 계속하기</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container:{
        padding:16,
        flexDirection:"column",
        justifyContent:"space-between"
    },
    header:{
        flexDirection:"row",
        justifyContent:"space-between",
        marginBottom:24,
        paddingBottom:8,
        borderBottomWidth:1,
        borderBottomColor:"black",
    },
    title:{
        fontSize:24,
        fontWeight:500,
    },
    checkbox: {
        margin: 8,
        width:24,
        height:24,
    },
    totAgr:{
        flexDirection:"row",
        alignItems:'center',
        padding:8,
        borderWidth:2,
        marginBottom:16,
        borderRadius:8
    },
    agree_comp:{flexDirection:"row", justifyContent:"space-between"},
    agree_cont:{
        flexDirection:"row",
        marginBottom:8
    },
    txt_dig:{
        fontSize:16,
        fontWeight:400,
        marginLeft:8
    },
    btn:{
        padding:16,
        alignItems:"center",
        marginTop:20,
    },
    btnTxt:{
        color:"white",
        fontSize:20,
        fontWeight:500,
    }

})
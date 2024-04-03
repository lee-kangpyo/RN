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
            detail:<view><text>1</text></view>,
            termId:"1001"
        },
        {
            text:"[필수] 개인 정보 처리방침 동의",
            state:isPrivChecked,
            setState:setPrivChecked,
            detail:<view><text>2</text></view>,
            termId:"1002"
        },
        {
            text:"[선택] 이벤트 및 마케팅 활용 동의",
            state:isenvtChecked,
            setState:setenvtChecked,
            detail:<view><text>3</text></view>,
            termId:"1003"
        },
    ]

    return(
        <View style={styles.container}>
            <View style={{flex:1}}>
                <View style={styles.header}>
                    <Text style={font.title}>이용약관에 동의해주세요</Text>
                </View>
                <View style={{...styles.totAgr, borderColor:(isTotChecked)?theme.primary:theme.grey}}>
                    <Checkbox style={styles.checkbox} value={isTotChecked} onValueChange={setTotCheckBox} color={(isTotChecked)?theme.primary:theme.grey} />
                    <Text style={font.allAgree}>전체동의</Text>
                </View>

                {
                    agrList.map((item, idx)=>{
                        return(
                            <View key={idx} style={styles.agree_comp}>
                                <View style={styles.agree_cont}>
                                    <Checkbox style={styles.subCheckbox} value={item.state} onValueChange={()=>item.setState(!item.state)} color={(item.state)?theme.primary:theme.grey} />
                                    <Text style={font.subAgree}>{item.text}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('TermsDetail', {termId:item.termId})}>
                                    <Feather name="chevron-right" size={24} color="#AAAAAA" />
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
            <TouchableOpacity onPress={()=>{navigation.navigate("SignIn");}} disabled={!(isUseChecked && isPrivChecked)} style={{...styles.btn, backgroundColor:(isUseChecked && isPrivChecked)?theme.primary:theme.grey}}>
                <Text style={styles.btnTxt}>동의하고 계속하기</Text>
            </TouchableOpacity>
        </View>
    )
}

const font = StyleSheet.create({
    title:{
        fontFamily: "SUIT-ExtraBold",
        fontSize: 24,
        fontWeight: "800",
        color: "#111111"
    },
    allAgree:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        fontWeight: "700",
        fontStyle: "normal",
        letterSpacing: -1,
        color: "#111111"
    },
    subAgree:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        fontStyle: "normal",
        letterSpacing: 0.5,
        color: "#111111"
    }
})

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:16,
        backgroundColor:"#FFFFFF"
    },
    header:{
        paddingTop:18,
        paddingBottom:30,
        paddingHorizontal:4,
    },

    checkbox: {
        width:22,
        height:22,
        borderRadius: 6,
        marginRight:10
    },
    subCheckbox:{
        width:18,
        height:18,
        borderRadius: 6,
        marginRight:10
    },
    totAgr:{
        flexDirection:"row",
        alignItems:'center',
        padding:16,
        borderRadius: 10,
        backgroundColor: "#F3F7FF",
        marginBottom:10
    },
    agree_comp:{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:15},
    agree_cont:{
        flexDirection:"row",
        alignItems:"center"
    },
    txt_dig:{
        fontSize:16,
        fontWeight:"400",
        marginLeft:8
    },
    btn:{
        height:52,
        padding:16,
        alignItems:"center",
        marginTop:20,
        borderRadius: 10,
        backgroundColor: theme.primary
    },
    btnTxt:{
        fontFamily: "SUIT-Bold",
        fontSize: 15,
        fontWeight: "700",
        color: "#FFFFFF"
    }

})







// export function Agreement_old({closesheet, navigation}){
//     const [isTotChecked, setTotChecked] = useState(false);
//     const [isUseChecked, setUseChecked] = useState(false);
//     const [isPrivChecked, setPrivChecked] = useState(false);
//     const [isenvtChecked, setenvtChecked] = useState(false);
    
//     const setTotCheckBox = (bool) => {
//         setTotChecked(bool);
//         setUseChecked(bool);
//         setPrivChecked(bool);
//         setenvtChecked(bool);
//     }
//     useEffect(() => {
//         if(isTotChecked && (!isUseChecked || !isPrivChecked || !isenvtChecked)){
//             setTotChecked(false);
//         }else if (!isTotChecked && (isUseChecked && isPrivChecked && isenvtChecked)){
//             setTotChecked(true);
//         }
//     }, [isUseChecked, isPrivChecked, isenvtChecked])

//     const agrList=[
//         {
//             text:"[필수] 이용 약관 동의",
//             state:isUseChecked,
//             setState:setUseChecked,
//             detail:<view><text>1</text></view>,
//             termId:"1001"
//         },
//         {
//             text:"[필수] 개인 정보 처리방침 동의",
//             state:isPrivChecked,
//             setState:setPrivChecked,
//             detail:<view><text>2</text></view>,
//             termId:"1002"
//         },
//         {
//             text:"[선택] 이벤트 및 마케팅 활용 동의",
//             state:isenvtChecked,
//             setState:setenvtChecked,
//             detail:<view><text>3</text></view>,
//             termId:"1003"
//         },
//     ]

//     return(
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={()=>closesheet()}>
//                     <Feather name="x" size={36} color="black" />
//                 </TouchableOpacity>
//                 <Text style={styles.title}>약관 동의</Text>
//                 <Feather name="x" size={36} color="black" style={{opacity:0}} />
//             </View>
//             <View style={{...styles.totAgr, borderColor:(isTotChecked)?theme.primary:theme.grey}}>
//                 <Checkbox style={styles.checkbox} value={isTotChecked} onValueChange={setTotCheckBox} color={(isTotChecked)?theme.primary:theme.grey} />
//                 <Text style={{...styles.txt_dig, fontWeight:"500",}}>전체 동의</Text>
//             </View>

//             {
//                 agrList.map((item, idx)=>{
//                     return(
//                         <View key={idx} style={styles.agree_comp}>
//                             <View style={styles.agree_cont}>
//                                 <TouchableOpacity onPress={() => item.setState(!item.state)}>
//                                     <AntDesign name="check" size={24} color={(item.state)?theme.primary:theme.grey} />
//                                 </TouchableOpacity>
//                                 <Text style={styles.txt_dig}>{item.text}</Text>
//                             </View>
//                             <TouchableOpacity onPress={() => navigation.navigate('TermsDetail', {termId:item.termId})}>
//                                 <Feather name="chevron-right" size={24} color="black" />
//                             </TouchableOpacity>
//                         </View>
//                     )
//                 })
//             }
          
//             <TouchableOpacity onPress={()=>{closesheet();navigation.navigate("SignIn");}} disabled={!(isUseChecked && isPrivChecked)} style={{...styles.btn, backgroundColor:(isUseChecked && isPrivChecked)?theme.primary:theme.grey}}>
//                 <Text style={styles.btnTxt}>동의하고 계속하기</Text>
//             </TouchableOpacity>
//         </View>
//     )
// }


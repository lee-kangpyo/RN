
import { StyleSheet, Text, View, ScrollView, TextInput, Linking } from 'react-native';
import React, {useState, useEffect} from 'react';
import sampleImage from '../../assets/community.png';
import { HTTP } from '../util/http';
import { useSelector } from 'react-redux';
import { TouchableOpacity, Keyboard  } from 'react-native';
import { AntDesign, FontAwesome  } from '@expo/vector-icons'; 
import { useRef } from 'react';
import { theme } from '../util/color';

export default function QnAScreen({navigation}) {
    const userId = useSelector((state) => state.login.userId);
    const cstCo = useSelector((state)=>state.common.cstCo);

    useEffect(()=>{
 
    }, [navigation])
    
 
    return (
        <View style={styles.container}>
            <Text style={[fonts.info,]}>카카오톡으로 문의를 받고 있습니다.</Text>
            <Text style={[fonts.info,]}>아래 텍스트 버튼을 클릭하여</Text>
            <Text style={[fonts.info,]}>카카오톡으로 문의해주세요</Text>
            <View style={{flex:1, justifyContent:"center"}}>
                <TouchableOpacity onPress={ () => Linking.openURL('http://pf.kakao.com/_mxmjLG/chat')} style={styles.btn}>
                    <Text style={fonts.btnText}>카카오톡 문의하기</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
const fonts = StyleSheet.create({
    info:{
        fontFamily: "SUIT-Medium",
        fontSize: 16,
        paddingVertical:5
    },
    btnText:{
        fontFamily: "SUIT-Bold",
        fontSize: 16,
        color: theme.primary,
        textDecorationLine:"underline",
    }
})
const styles = StyleSheet.create({
    container:{ flex: 1, alignItems: 'center', backgroundColor:"white"},
    btn:{borderColor:"#ddd", padding:16, borderRadius:10},
    centerContainer:{flex:1, justifyContent:"center"},
    mainContainer:{flexGrow: 1, width:"100%"},
    bottomInputContainer:{
        borderWidth:0, 
        borderColor:"grey", 
        width:"100%", 
        padding:10, 
        flexDirection:"row", 
        alignItems:"space-between",
        backgroundColor:"white",
        justifyContent:"space-between",
    },
    input:{fontSize: 16, flex:1},
    chatBox:{borderWidth:1, borderRadius:5, padding:10, marginBottom:8, marginHorizontal:10, maxWidth:"80%"}
});
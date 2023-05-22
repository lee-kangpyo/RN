import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Dimensions, TouchableWithoutFeedback, TextInput } from "react-native";
import { theme } from '../util/color';

import React, {useState} from 'react';

const windowWidth = Dimensions.get('window').width;

export default function SignInScreen({navigation}) {
    const[userType, setUserType] = useState(0)
    const onClickSeq = (sep) => {
        setUserType(sep)
    }
    return(
        <View style={styles.container}>
            <StatusBar style="auto" />
            <View style={styles.sep}>
                <TouchableWithoutFeedback onPress={()=>setUserType(0)}>
                    <Text style={[styles.sepTxt, userType === 0 && styles.sepSelected]}>사장님</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>setUserType(1)}>
                    <Text style={[styles.sepTxt, userType === 1 && styles.sepSelected]}>알바님</Text>
                </TouchableWithoutFeedback>
            </View>
            <InputEl label="이메일" placeholder={"이메일 입력"} keyboardType='email-address'/>
            
            <Text>여기는 회원 가입 페이지</Text>
        </View>
    );
}

const InputEl = ({label, placeholder, keyboardType="default", onChangeText}) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return(
        <View style={styles.inputBox}>
            <Text style={styles.labelTxt}>{label}</Text>
            <TextInput
                style={[styles.input, isFocused && styles.inputFocused]}
                onChangeText={onChangeText}
                value={""}
                placeholder={placeholder}
                keyboardType={keyboardType}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </View>
    )
}



const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        alignItems:"center",
        width:windowWidth,
    },
    sep:{
        flexDirection:"row",
        backgroundColor:"#C4C4C4",
        borderRadius:5,
        margin:16,
        padding:5,
        width:"50%",
        
        
    },
    sepTxt:{
        textAlign:"center",
        paddingVertical:8,
        borderRadius:5,
        color:"#DBDCE1",
        fontSize:16,
        fontWeight:500,
        width:"50%",
    },
    sepSelected:{
        backgroundColor:"#FFFFFF", 
        color:theme.purple
    },
    inputBox:{width:windowWidth, paddingHorizontal:24, paddingVertical:12,},
    input:{
        height: 40,
        marginBottom:16,
        borderWidth: 1,
        padding: 10,
        borderBottomColor:theme.grey,
        borderColor:"white",
    },
    inputFocused:{
        borderBottomColor:"black"
    },
    labelTxt:{
        color:theme.grey,
    }

})
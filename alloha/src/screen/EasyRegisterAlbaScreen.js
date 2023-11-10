import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import { theme } from '../util/color'
import { URL } from "@env";import { useSelector } from 'react-redux';
;

export default function EasyRegisterAlbaScreen({navigation, route}) {
    const cstCo = useSelector((state)=>state.common.cstCo);
    const {prev} = route.params;
    useEffect(()=>{
        navigation.setOptions({title:"알바 등록 / 관리"})
    }, [navigation])

    const InputEl = ({label, placeholder, keyboardType="default", onChangeText, onBlur, value, errorMsg, secure=false, option=false}) => {
        const [isFocused, setIsFocused] = useState(false);
        const handleFocus = () => setIsFocused(true);
        const handleBlur = () => {
            setIsFocused(false);
            onBlur
        };

        return(
            <View style={styles.viewContainer}>
                <View style={{flexDirection:"row"}}>
                    <Text style={styles.labelTxt}>{label}</Text>
                    {
                        (option)?<Text style={{ fontSize:10, marginBottom:3, verticalAlign:"middle"}}> (선택)</Text>:null
                    }
                </View>
                <TextInput
                    style={[styles.input, errorMsg && styles.error, !errorMsg && isFocused && styles.inputFocused,]}
                    onChangeText={onChangeText}
                    value={value}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    returnKeyType='go'
                    secureTextEntry={secure}
                />
                {errorMsg && <Text style={styles.error}>{errorMsg}</Text>}
            </View>
        )
    }

    
    const validationSchema = yup.object().shape({
        userName: yup.string().required('이름을 입력해주세요.')
            .test('nameUnique', '등록된 이름 입니다.', async (value) => {
                try {
                    const response = await axios.post(URL+'/api/v1/easyAlbaMng', {
                        cls:"AlbaNameChk", cstCo:cstCo, userName: value, hpNo:"", email:""
                    });
                    //console.log(response.data.result)
                    if (response.data.result[0].ChkYn == "Y") {
                        return false;
                    }
                } catch (error) {
                    console.error('이름 중복 체크 실패:', error);
                }
            return true;
        }),
        hpNo: yup.string().matches(/^[0-9]+$/, '숫자만 입력하세요')
            .min(10, "휴대폰 번호는 10-11 자리입니다.").max(11, "휴대폰 번호는 10-11 자리입니다."),
        email: yup.string()
            .email('유효한 이메일을 입력해주세요.')
      });

      const handleFormSubmit = async (params) => {
        params["cstNa"] = prev;
        console.log(params)
        const response = await axios.post(URL+'/api/v1/easyAlbaMng', params);
        navigation.goBack();
      };



    return(
        <View style={styles.container}>
            <KeyboardAwareScrollView style={{width:"100%"}} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true}>
                <Formik
                    initialValues={{ userName: '', hpNo: '', cls:"AlbaTmpIns", cstCo:cstCo}}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                        <InputEl 
                            label="이름" 
                            placeholder={"이름"} 
                            onChangeText={handleChange('userName')}
                            onBlur={handleBlur("userName")}
                            value={values.userName}
                            errorMsg={errors.userName} 
                        />
                        <InputEl 
                            label="전화 번호" 
                            option={true}
                            placeholder={"전화번호"} 
                            keyboardType='number-pad'
                            onChangeText={handleChange('hpNo')}
                            onBlur={handleBlur('hpNo')}
                            value={values.hpNo}
                            errorMsg={errors.hpNo}
                        />
                        <InputEl 
                            label="이메일" 
                            option={true}
                            placeholder={"이메일 입력"} 
                            keyboardType='email-address'
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            value={values.email}
                            errorMsg={errors.email}                
                        />
                        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
                            <Text style={styles.btnTxt}>등록</Text>
                        </TouchableOpacity>
                        </>
                    )}

                </Formik>
            </KeyboardAwareScrollView>
        </View>
    )

    return (
        <View style={styles.container}>
            <View style={{height:15}} />
            <View style={styles.inputComp}>
                <Text style={styles.label}>성명</Text>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={(text) => console.log(text)}
                    placeholder="이름"
                />
            </View>
            <View style={styles.inputComp}>
                <Text style={styles.label}>전화번호 입력(선택)</Text>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={(text) => console.log(text)}
                    placeholder="전화번호(숫자만 입력)"
                />
            </View>
            <View style={styles.inputComp}>
                <Text style={styles.label}>이메일 주소(선택)</Text>
                <TextInput 
                    style={styles.textInput}
                    onChangeText={(text) => console.log(text)}
                    placeholder="이메일"
                />
            </View>
            <TouchableOpacity style={styles.btn} onPress={()=>console.log("등록")}>
                <Text style={styles.btnTxt}>등록</Text>
            </TouchableOpacity>
        </View>
    );

        

}



const styles = StyleSheet.create({
    container:{ flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start'},
    btn:{
        marginTop:20,
        backgroundColor:"yellow", 
        paddingHorizontal:100,
        paddingVertical:15, 
        borderRadius: 10, // 테두리 모서리 둥글게 
        alignSelf:"center"
    },
    btnTxt:{
        fontSize:16,
    },
    inputComp:{
        width:"100%",
        paddingHorizontal:15,
        paddingVertical:5
    },
    textInput: {
        marginBottom: 10,
        paddingHorizontal: 10,
        height: 50,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1
    },
    label:{
        marginLeft:15,
        marginBottom:5
    }, 


    viewContainer:{width:"100%", paddingHorizontal:24, paddingVertical:8,},
    input:{
        paddingHorizontal: 10,
        height: 60,
        borderRadius: 10,
        borderColor: 'gray',
        borderWidth: 1
    },
    inputFocused:{
        borderColor:"black"
    },
    labelTxt:{
        marginLeft:15,
        marginBottom:5
    },
    error:{
        color:theme.error,
        borderColor:theme.error,
    },

});
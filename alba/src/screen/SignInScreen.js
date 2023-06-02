import { StatusBar } from 'expo-status-bar';
import { Text, View, StyleSheet, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TextInput } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { theme } from '../util/color';

import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

import React, {useState, useEffect} from 'react';
//import { setUserInfo } from '../../redux/slices/login';
import { useSelector } from 'react-redux';

import CustomBtn from '../components/CustomBtn';

const windowWidth = Dimensions.get('window').width;

export default function SignInScreen({navigation}) {
    const url = useSelector((state) => state.config.url);    
    const [step, setStep] = useState(1)
    const [userInfo, setUserInfo] = useState({});
    const updateState = (step, inputObj) => {
        setUserInfo({...userInfo, ...inputObj});
        setStep(step);
    }

    const saveUser = async () => {
        console.log("saveUser")
        console.log(userInfo)
        const response = await axios.post(url+'/api/v1/saveUser', userInfo);
        console.log(response.data.result);
        if(response.data.result){
            setStep(4);
        }else{
            Alert.alert("회원가입 실패", "알수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            setStep(1);
        }
    }
    
    //첫번째 page
        //헤더
    useEffect(()=>{
        navigation.setOptions({title:`회원가입 (${step} / 4)`})
        if(step === 3){
            saveUser();
        }
    }, [navigation, step])

    return(
        <>
        <TouchableOpacity onPress={()=>console.log(userInfo)}>
            <Text>useInfo</Text>
        </TouchableOpacity>
        {
            step == 1?
                <Step1 updateState={updateState} />
            :step == 2?
                <Step2 updateState={updateState} />
            :step == 3?
                <Step3 />
            :step == 4?
                <Step4 navigation={navigation} />
            :null
        
        }
        </>
    );
}
const SelectUserType = ({userType, setUserType}) => {
    // <SelectUserType userType={userType} setUserType={setUserType}/>
    return(
        <View style={styles.sep}>
            <TouchableWithoutFeedback onPress={()=>setUserType(0)}>
                <Text style={[styles.sepTxt, userType === 0 && styles.sepSelected]}>사장님</Text>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback onPress={()=>setUserType(1)}>
                <Text style={[styles.sepTxt, userType === 1 && styles.sepSelected]}>알바님</Text>
            </TouchableWithoutFeedback>
        </View>
    )
}
const Step1 = ({updateState}) => {
    const url = useSelector((state) => state.config.url);
    console.log(url)
    const[userType, setUserType] = useState(0)

    const validationSchema = yup.object().shape({
        id:yup.string().required("아이디를 입력해주세요.")
            .test('id-unique', '이미 사용 중인 아이디입니다.', async (value) => {
                try {
                    const response = await axios.post(url+'/api/v1/isIdDuplicate', {
                      id: value,
                    });
                    if (response.data.isDuplicate) {
                      return false;
                    }
                } catch (error) {
                    console.error('아이디 중복 체크 실패:', error);
                }
            return true;
        }),
        userName: yup.string().required('이름을 입력해주세요.'),
        hpNo: yup.string().required("휴대폰 번호를 입력해주세요").min(10, "휴대폰 번호는 10-11 자리입니다.").max(11, "휴대폰 번호는 10-11 자리입니다."),
      });
    
      const handleFormSubmit = (values) => {
        // 유효성 검사 통과 후 실행되는 함수
        updateState(2, {...values, userType:userType})
      };

    return(
        <View style={{flex:1, backgroundColor:"white", alignItems:"center"}}>
            <StatusBar style="auto" />
            
            <KeyboardAwareScrollView contentContainerStyle={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true}>
                <Formik
                    initialValues={{ userName: '', hpNo: '', id:'' }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                        <InputEl 
                            label="아이디" 
                            placeholder={"아이디"} 
                            onChangeText={handleChange('id')}
                            onBlur={handleBlur('id')}
                            value={values.id}
                            errorMsg={errors.id} 
                        />
                        <InputEl 
                            label="이름" 
                            placeholder={"이름"} 
                            onChangeText={handleChange('userName')}
                            onBlur={handleBlur('userName')}
                            value={values.userName}
                            errorMsg={errors.userName} 
                        />
                        <InputEl 
                            label="전화 번호" 
                            placeholder={"전화번호"} 
                            keyboardType='number-pad'
                            onChangeText={handleChange('hpNo')}
                            onBlur={handleBlur('hpNo')}
                            value={values.hpNo}
                            errorMsg={errors.hpNo}
                        />
                        <View style={styles.viewContainer}>
                            <CustomBtn txt="다음" onPress={handleSubmit} style={styles.next} color='white'/>
                        </View>
                        </>
                    )}

                </Formik>
            </KeyboardAwareScrollView>
        </View>
    )

    
}


const Step2 = ({ updateState }) => {
    const validationSchema = yup.object().shape({
        password: yup.string().required('비밀번호를 입력해주세요.'),
        confirmPassword: yup.string().oneOf([yup.ref('password'), null], '비밀번호가 일치하지 않습니다.').required('비밀번호 확인을 입력해주세요.'),
      });
    
      const handleFormSubmit = async (values) => {
        // 유효성 검사 통과 후 실행되는 함수
        updateState(3, values)
      };
    return (
        <View style={{flex:1, backgroundColor:"white", alignItems:"center"}}>
            <StatusBar style="auto" />
            <KeyboardAwareScrollView contentContainerStyle={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true}>
                <Formik
                    initialValues={{ password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <InputEl 
                                label="비밀번호" 
                                placeholder={"비밀번호"} 
                                onChangeText={handleChange('password')}
                                onBlur={handleBlur('password')}
                                value={values.password}
                                errorMsg={errors.password} 
                                secure={true}
                            />
                            <InputEl 
                                label="비밀번호 확인" 
                                placeholder={"비밀번호 확인"} 
                                onChangeText={handleChange('confirmPassword')}
                                onBlur={handleBlur('confirmPassword')}
                                value={values.confirmPassword}
                                errorMsg={errors.confirmPassword}
                                secure={true}
                            />
                            <View style={styles.viewContainer}>
                                <CustomBtn txt="가입하기" onPress={handleSubmit} style={styles.next} color='white'/>
                            </View>
                        </>
                    )}
                </Formik>
            </KeyboardAwareScrollView>
        </View>
    )
}

const Step3 = () => {
    return(
        <>
            <Text>가입 중입니다. 잠시만 기달려주세요.</Text>
        </>
    )
}

const Step4 = ({navigation}) => {

    return(
        <>
            <Text>가입을 환영합니다 고객님</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('Login')}>
                <Text>로그인 하러가기</Text>    
            </TouchableOpacity>
        </>
    )
}

const emailCheck = ({ updateState }) => {
    
    const[userType, setUserType] = useState(0)
    const[isSend, setIsSend] = useState(false);

    const validationSchema = yup.object().shape({
        email: yup.string()
            .email('유효한 이메일을 입력해주세요.')
            .required('이메일을 입력해주세요.')
            .test('email-unique', '이미 사용 중인 이메일입니다.', async (value) => {
                try {
                    // 서버로 이메일 중복 체크 요청을 보내고 응답을 받아옴
                    //const response = await axios.post('/api/check-email', {
                    //  email: value,
                    //});
            
                    // 중복된 이메일인 경우 유효성 검사 실패
                    //if (response.data.isDuplicate) {
                    //  return false;
                    //}
                  } catch (error) {
                    console.error('이메일 중복 체크 실패:', error);
                  }
            
                return true; // 중복되지 않은 이메일인 경우 유효성 검사 통과
            }),
        emailCheckNumber: yup.string().required('인증번호를 입력해주세요.').min(6, '6자리 숫자를 입력해주세요.').max(6, '6자리 숫자를 입력해주세요.'),
      });
    
      const handleFormSubmit = (values) => {
        updateState(2, {...values, userType:userType})
      };
      const sendEmail = () => {
        console.log("서버에서 이메일 전송 로직 필요")
        //이메일 전송이 성공했다면
        setIsSend(true);
      }
    return (
        <View style={{flex:1, backgroundColor:"white", alignItems:"center"}}>
            <StatusBar style="auto" />
            <View style={styles.sep}>
                <TouchableWithoutFeedback onPress={()=>setUserType(0)}>
                    <Text style={[styles.sepTxt, userType === 0 && styles.sepSelected]}>사장님</Text>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={()=>setUserType(1)}>
                    <Text style={[styles.sepTxt, userType === 1 && styles.sepSelected]}>알바님</Text>
                </TouchableWithoutFeedback>
            </View>
            <KeyboardAwareScrollView contentContainerStyle={styles.container} resetScrollToCoords={{ x: 0, y: 0 }} scrollEnabled={true}>
                <Formik
                    initialValues={{ email: '', emailCheckNumber:'' }}
                    validationSchema={validationSchema}
                    onSubmit={handleFormSubmit}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <>
                            <InputEl 
                                label="이메일" 
                                placeholder={"이메일 입력"} 
                                keyboardType='email-address'
                                onChangeText={handleChange('email')}
                                onBlur={handleBlur('email')}
                                value={values.email}
                                errorMsg={errors.email}                
                            />

                            {
                            isSend?
                            <>
                                <View style={styles.viewContainer}>
                                    <TouchableOpacity onPress={sendEmail}>
                                        <Text style={styles.emailReSend}>인증번호 재전송 (남은 횟수 4회)</Text>
                                    </TouchableOpacity>
                                </View>
                                <InputEl 
                                    label="인증번호 6자리" 
                                    placeholder={""} 
                                    keyboardType='number-pad'
                                    onChangeText={handleChange('emailCheckNumber')}
                                    onBlur={handleBlur('emailCheckNumber')}
                                    value={values.emailCheckNumber}
                                    errorMsg={errors.emailCheckNumber}                
                                />
                                <View style={styles.viewContainer}>
                                    <CustomBtn txt="다음" onPress={(handleSubmit)} style={styles.next} color='white'/>
                                </View>
                            </>
                            :
                            <View style={styles.viewContainer}>
                                <TouchableOpacity onPress={sendEmail}>
                                    <Text style={styles.emailSend} >인증번호 전송</Text>
                                </TouchableOpacity>
                                <View style={styles.txt_sm_cont}>
                                    <Text style={styles.txt_sm}>인증번호 발송에는 시간이 소요되며 하루 최대 5회까지 전송할 수 있습니다.</Text>
                                    <Text style={styles.txt_sm}>인증번호는 <Text style={{fontWeight:800}}>입력한 이메일 주소</Text>로 발송됩니다. 수신하지 못했다면 스팸함 또는 해당 이메일 서비스의 설정을 확인해주세요</Text>
                                </View>
                            </View>
                            }
                        </>
                    )}
                </Formik>
                
            </KeyboardAwareScrollView>
        </View>
    )
}


const InputEl = ({label, placeholder, keyboardType="default", onChangeText, onBlur, value, errorMsg, secure=false}) => {
    const [isFocused, setIsFocused] = useState(false);
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => {
        setIsFocused(false);
        onBlur
    };

    return(
        <View style={styles.viewContainer}>
            <Text style={styles.labelTxt}>{label}</Text>
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



const styles = StyleSheet.create({
    container:{
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
    viewContainer:{width:windowWidth, paddingHorizontal:24, paddingVertical:8,marginBottom:16,},
    input:{
        height: 40,
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
    },
    error:{
        color:theme.error,
        borderBottomColor:theme.error,
    },
    txt_sm:{
        fontSize:8,
        color:"#949494",
    },
    txt_sm_cont:{
        marginTop:24,
    },
    emailSend:{
        width:"100%",
        padding:4,
        color:theme.primary,
        textAlign:"center",
        borderColor:theme.primary,
        borderWidth:1,
        borderRadius:5,
    },
    emailReSend:{
        width:"100%",
        padding:4,
        textAlign:"center",
        borderColor:theme.grey,
        borderWidth:1,
        borderRadius:5,
    },
    next:{
        backgroundColor:theme.purple,
    }
})
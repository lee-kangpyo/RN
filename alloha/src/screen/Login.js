import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Dimensions, TouchableOpacity, TextInput, Image, Keyboard } from 'react-native';
import CustomBtn from '../components/CustomBtn';

import React, {useCallback, useRef, useState, useMemo} from 'react';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Agreement from '../components/login/Agreement';

import { useDispatch, useSelector } from 'react-redux';
import { setUserInfo } from '../../redux/slices/login';

import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { URL, MODE } from "@env";

import uuid from 'react-native-uuid';
import * as SecureStore from 'expo-secure-store';
import { setOwnerCstco } from '../../redux/slices/common';
import PushTest from '../components/test/PushTest';
import { theme } from '../util/color';


const windowWidth = Dimensions.get('window').width;


export default function Login({ navigation, route }) {
  const sheetRef = useRef(null);
  const [isOpen, setIsOpen] = useState(true);
  const snapPoints = useMemo(() => ["48%"], []);
  
  const handleSnapPress = useCallback((index) => {
    sheetRef.current.snapToIndex(index);
    setIsOpen(true);
    Keyboard.dismiss();
  }, []);

  const closesheet = useCallback(() => {
    sheetRef.current.close();
    setIsOpen(false)
  });

  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
        pressBehavior={'none'}
      />
    ),
    []
  );

  return (
    <View style={styles.container}>
      <GestureHandlerRootView style={{}}>
          <View style={styles.titleArea}>
              <PushTest />
              <Text style={font.title}>ALOHA</Text>
              <Text style={font.version}>Ver {route.params.version}</Text>
          </View>
          <LoginForm navigation={navigation}/>
          <View style={{flex:0.5}}>
            <View style={{margin:8}}/>
            <TouchableOpacity  onPress={() => navigation.push("Agreement")} style={{}}>
              <Text style={font.createAcc}>회원가입</Text>
            </TouchableOpacity>
            <View style={{margin:6}}/>
            <TouchableOpacity  onPress={() => navigation.push("FindIdPw")} style={{}}>
              <Text style={font.createAcc}>아이디 / 비밀번호 찾기</Text>
            </TouchableOpacity>
          </View>  
      </GestureHandlerRootView>
      
    </View>
  );
}

const LoginForm = ({navigation}) => {
  const dispatch = useDispatch();
  const [id, onChangeId] = useState('');
  const [password, onChangePassWord] = useState('');

  const [loginInfo, setLoginInfo] = useState({id:"", password:""})
  const [isLoginButtonDisabled, setLoginButtonDisabled] = useState(false);

  //const pushToken = useSelector((state) => state.push.token);
  
  
  const saveUserInfo = async ({ownrYn, crewYn, mnrgYn, userNa, uuid}) => {
    try {
      await AsyncStorage.setItem('id', loginInfo.id);
      await AsyncStorage.setItem('userNa', userNa);
      await AsyncStorage.setItem('ownrYn', ownrYn);
      await AsyncStorage.setItem('crewYn', crewYn);
      await AsyncStorage.setItem('mnrgYn', mnrgYn);
      await SecureStore.setItemAsync("uuid", uuid);
      return true;
    } catch (e) {
      console.log(e)
      return false;
    }
  }
  const loginAction = async () => {
    //밸리데이션 -> 지금은 아이디 패스워드 공백 체크만 함
    console.log("loginaction");
    if(loginInfo.id && loginInfo.password){
      console.log(loginInfo);
      dispatch(setOwnerCstco({cstCo:""}));
      setLoginButtonDisabled(true);
      const uid = uuid.v4();
      const pushToken = await SecureStore.getItemAsync("pushToken");
      const param = {...loginInfo, uuid:uid, pushToken:pushToken, mode:MODE};
      await axios.post(URL+'/api/v1/loginUser', param, {timeout:5000})
      .then( function  (response) {
        if(response.data.result === 1){
          saveUserInfo({...response.data.info, "uuid":uid})
          .then((result)=>{
            if(result){
              dispatch(setUserInfo({isLogin:true, userId:loginInfo.id}));
            }else{
              Alert.alert("로그인 실패", "로그인에 실패하셨습니다. 다시 시도해주세요");
            }
          })
          // asyncstorage에 아이디 저장
          // jwt 세션이든 auth든 해야됨.
          // 서비스키가되었던.
          // http 요청이니깐 앱에서 요청하는지 포스트맨이던 다른데서 요청하는지 체크
          // 성공시 메인 페이지 이동.
        }else{
          // 실패 시 오류 알림.
          Alert.alert("로그인 실패", "로그인에 실패하셨습니다.");
        }
      }).catch(function (error) {
          //console.log(error.name + " " + error.message);
          //console.log(JSON.stringify(error.toJSON()))
          //console.error(error)
          if(axios.isAxiosError(error) && error.message.includes('timeout')){
            Alert.alert("타임아웃", "서버와 연결이 원할하지 않습니다.")
          }else{
            Alert.alert("오류", "요청중 알수없는 오류가 발생했습니다. 잠시후 다시 시도해주세요.")
          }
      }).finally(function(){
        setLoginButtonDisabled(false);
      });
    }else{
      Alert.alert("로그인 실패", "아아디 비밀번호를 입력해주세요");
    }
  }

  const idRef = useRef(null);
  const pwRef = useRef(null);
  return (
    <View style={styles.btnGrp}>
      <TouchableOpacity onPress={()=>idRef.current.focus()} style={styles.inputContainer} activeOpacity={1}>
        <TextInput
          ref={idRef}
          style={[styles.input, font.inputLabel]}
          onChangeText={(id) => setLoginInfo({...loginInfo, id })}
          value={loginInfo.id}
          placeholder="아이디를 입력해주세요"
          placeholderTextColor={"#999999"}
        />
        <Image source={require('../../assets/icons/user.png')} style={styles.inputIcon} />
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>pwRef.current.focus()} style={styles.inputContainer} activeOpacity={1}>
        <TextInput
          ref={pwRef}
          style={[styles.input, font.inputLabel]}
          onChangeText={(password) => setLoginInfo({...loginInfo, password })}
          value={loginInfo.password}
          secureTextEntry={true}
          placeholder="비밀번호를 입력해 주세요"
          placeholderTextColor={"#999999"}
        />
        <Image source={require('../../assets/icons/Lock.png')} style={styles.inputIcon} />
      </TouchableOpacity>
      <CustomBtn txt="로그인" onPress={loginAction} style={styles.btn} textStyle={font.btn} color='white' disabled={isLoginButtonDisabled}/>
    </View>
  )
}

const font = StyleSheet.create({
  title:{
    fontFamily: "Tium",
    fontSize: 40,
    textAlign: "center",
    color: theme.primary,
    marginBottom:4
  },
  version:{
    fontFamily: "SUIT-Regular",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: "#999999"
  },
  inputLabel:{
    fontFamily: "SUIT-Regular",
    fontSize: 15,
    fontWeight: "400",
    color: "#999999"
  },
  btn:{
    fontFamily: "SUIT-Bold",
    fontSize: 15,
    fontWeight: "700",
    fontStyle: "normal",
    letterSpacing: -1,
    textAlign: "center",
    color: "#FFFFFF"
  },
  createAcc:{
    fontFamily: "SUIT-Bold",
    fontSize: 15,
    fontWeight: "700",
    fontStyle: "normal",
    lineHeight: 15,
    letterSpacing: -1,
    textAlign: "center",
    color: "#555555",
    textDecorationLine:'underline',
  },
})

const styles = StyleSheet.create({
  container: {
    width:windowWidth,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleArea:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
  },
  
  btnGrp:{
    paddingHorizontal:37,
    width:windowWidth,
    flex:1,
  },
  btn:{
    height: 52,
    borderRadius: 10,
    backgroundColor: "#3479EF",
    marginTop:10,
  },  
        
  inputContainer:{
    flexDirection:"row",
    alignItems:"center",
    padding:15,
    marginBottom:10,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(221, 221, 221, 1.0)",
  },
  input: {
    flex:1,
    
    
  },
  inputIcon:{
    width:18,
    height:18,
  },
});
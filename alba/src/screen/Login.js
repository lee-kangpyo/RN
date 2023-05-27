import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, Dimensions, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import CustomBtn from '../components/CustomBtn';

import React, {useCallback, useRef, useState, useMemo} from 'react';
import BottomSheet, {BottomSheetView, BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Agreement from '../components/login/Agreement';

import { useDispatch } from 'react-redux';
import { setUserInfo } from '../../redux/slices/login';

const windowWidth = Dimensions.get('window').width;


export default function Login({ navigation }) {
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
    <GestureHandlerRootView style={{flex:1}}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.titleArea}>
            <Text style={styles.title}>알바관리</Text>
            <Text>Ver 0.01</Text>
        </View>
        <LoginForm navigation={navigation}/>
        <BotSheet 
          sheetRef={sheetRef} 
          snapPoints={snapPoints} 
          renderBackdrop={renderBackdrop} 
          setIsOpen={setIsOpen}
          handleSnapPress={handleSnapPress}
          Content={<Agreement closesheet={closesheet} navigation={navigation}/>}
        />
      </View>
    </GestureHandlerRootView>
  );
}

const LoginForm = ({navigation}) => {
  const dispatch = useDispatch();
  const [id, onChangeId] = useState('');
  const [password, onChangePassWord] = useState('');

  const [loginInfo, setLoginInfo] = useState({id:"", password:""})

  const loginAction = () => {
    console.log(loginInfo);
    //밸리데이션 -> 지금은 아이디 패스워드 공백 체크만 함
    if(loginInfo.id && loginInfo.password){
      // api 서버 요청 -> axios로 요청할예정
      
      if(true){
        // 성공시 메인 페이지 이동.
        dispatch(setUserInfo({isLogin:true, userId:loginInfo.id}));
      }else{
        // 실패 시 오류 알림.
        Alert.alert("로그인 실패", "로그인에 실패하셨습니다.");
      }
    }
  }
  return (
    <View style={styles.btnGrp}>
      <TextInput
        style={styles.input}
        onChangeText={(id) => setLoginInfo({...loginInfo, id })}
        value={loginInfo.id}
        placeholder="아이디를 입력해주세요"
      />
      <TextInput
        style={styles.input}
        onChangeText={(password) => setLoginInfo({...loginInfo, password })}
        value={loginInfo.password}
        secureTextEntry={true}
        placeholder="비밀번호를 입력해 주세요"
      />
      <CustomBtn txt="로그인" onPress={loginAction} style={styles.btn} color='black'/>
      <CustomBtn txt="구글 로그인" onPress={()=>{Alert.alert("알림", "준비중입니다.")}} style={styles.btn} color='black'/>
    </View>
  )
}

// 바텀 시트
const BotSheet = ({sheetRef, snapPoints, renderBackdrop, setIsOpen, handleSnapPress, Content}) => {
  return (
    <>
      <TouchableOpacity  onPress={() => handleSnapPress(0)}>
        <Text style={styles.createAcc}>계정 만들기</Text>
      </TouchableOpacity>
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={()=>setIsOpen(false)}
        index={-1}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          {Content}     
        </BottomSheetView>
      </BottomSheet>
    </>
  )
}

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
  title:{
    fontSize:40,
    fontWeight:"400"
  },
  btnGrp:{
    width:windowWidth,
    flex:1,
  },
  btn:{
    height: 43,
    backgroundColor: "#D9D9D9",
    marginHorizontal:12,
    marginBottom:16,
  },  
  createAcc:{
    textDecorationLine:'underline',
    color:"grey",
    fontSize:16,
    textAlign:"center",
    marginBottom:32,
    paddingTop:60
  },
  input: {
    height: 40,
    marginHorizontal: 12,
    marginBottom:16,
    borderWidth: 1,
    padding: 10,
  },
});
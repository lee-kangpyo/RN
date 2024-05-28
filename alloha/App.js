
import { StyleSheet, Text, View, AppState, Alert, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
//import React, {useEffect, useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useEffect, useState, useRef} from 'react';
import { Provider, useSelector } from 'react-redux';
import store from '../alloha/redux/store';
import Login from '../alloha/src/screen/Login';
import TermsDetailScreen from '../alloha/src/screen/TermsDetailScreen';
import MainScreen from '../alloha/src/screen/MainScreen';
import SignInScreen from '../alloha/src/screen/SignInScreen';

import SearchAddress from '../alloha/src/components/SearchAddress';
import * as Font from "expo-font";

import { URL, TASK_URL, LOCATION_TASK, MODE } from "@env";
import { useDispatch } from 'react-redux';
import { setUserInfo } from './redux/slices/login';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './src/components/Loding';

import * as TaskManager from 'expo-task-manager';
import Notification from './src/components/Notification';

import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { config } from './src/util/deepLink';
import Agreement from './src/components/login/Agreement';
import { headerTitleStyle } from './src/util/utils';
import { HTTP } from './src/util/http';
import Message, { CONFIRM_POSITION, Confirm, DayOfWeek, test11 } from './src/components/common/Message';
import { theme } from './src/util/color';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import FindIdPwScreen from './src/screen/FindIdPwScreen';

// 태스크 매니저
TaskManager.defineTask(LOCATION_TASK,  async ({ data, error } ) => {
  const getCurrentTimeWithDate = () => {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const day = String(currentDate.getDate()).padStart(2, '0');
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const seconds = String(currentDate.getSeconds()).padStart(2, '0');

      const currentTimeWithDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      return currentTimeWithDate;
  };

  if (error) {
      return;
  }
  if(data){
      const id = await AsyncStorage.getItem("id")
      const uid = await SecureStore.getItemAsync("uuid");
      const { locations } = data;
      //태스크 매니저 작동 중지
      // await axios.get(TASK_URL+"/api/v1/task/checkStoreLocation", {params:{id:id, uuid:uid, lat:locations[0].coords.latitude, lon:locations[0].coords.longitude, ymd:getCurrentTimeWithDate()}})
      // .then(async (res)=>{
      //   if(res.data.resultCode === "-2"){
      //     console.log("기기 변경됨")
      //     if( TaskManager.isTaskDefined(LOCATION_TASK)){
      //       await TaskManager.unregisterTaskAsync(LOCATION_TASK)
      //     }
      //   }
      // })
      // .catch(async (err)=>{
      //   console.log(err)
      //   console.log("다른 에러 발생")
      //   //testLog(err);
      //   //await TaskManager.unregisterTaskAsync(LOCATION_TASK)
      // })
  }
});

const prefix = Linking.createURL('/');
const Stack = createNativeStackNavigator();
const linking = {
  prefixes: [prefix],
  config: config,
  async getInitialURL() {
    let url = await Linking.getInitialURL();
    if (url != null) { return url; };
    const response = await Notifications.getLastNotificationResponseAsync();
    url = response?.notification.request.content.data.url;
    return url;
  },
  subscribe(listener) {
    const onReceiveURL = ({url : url}) => listener(url);
    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);
    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;
      //listener(prefix + "room"); // 우선 최초화면으로 먼저 이동합니다. 이렇게 하지 않으면, 변수만 다른(:roomId) 동일한 화면이(ChatRoom) 이미 열려있던 경우, deep link로 인한 화면이동이 발생하지 않습니다.
      listener(prefix + url); // 원하는 화면으로 이동합니다.
    });
    return () => {
      // Clean up the event listeners
      //Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
};

function Index({version}) {
  const pushToken = useSelector((state) => state.push.token);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);


  const dispatch = useDispatch();
  const [isReg, setReg] = useState(true);
  
  const saveUserInfo = async ({ownrYn, crewYn, mnrgYn, userNa}) => {
    try {
      await AsyncStorage.setItem('userNa', userNa);
      await AsyncStorage.setItem('ownrYn', ownrYn);
      await AsyncStorage.setItem('crewYn', crewYn);
      await AsyncStorage.setItem('mnrgYn', mnrgYn);
    } catch (e) {
      console.error(e)
    }
  }

  const autoLogin = async (flag)=>{
    try {
      
        const isAvailable = await SecureStore.isAvailableAsync()
        const uid = await SecureStore.getItemAsync("uuid");
        const userId = await AsyncStorage.getItem("id");
        
        if(uid && userId){
          await axios.post(URL+'/api/v1/autoLogin', {uuid:uid, userId:userId, pushToken:pushToken, flag:flag},  { timeout: 3000 })
          .then(async function (response) {
            if(response.data.resultCode === "00"){
              if(flag == "start") await TaskManager.unregisterAllTasksAsync();
              dispatch(setUserInfo({isLogin:true, userId:userId}));
            }else{
              TaskManager.unregisterAllTasksAsync();
              dispatch(setUserInfo({isLogin:false, userId:""}));
            }
          }).catch(function (error) {
              console.error(error.message)
              if(axios.isAxiosError(error) && error.message.includes('timeout')){
                Alert.alert("타임아웃", "서버와 연결이 원할하지 않습니다.")
              }
          }).finally(() => {
            setReg(false);
          });
        }else{
          setReg(false);
        }  
      
    } catch (error) {
      setReg(false);
    }
  }

  const checkDev = async () => {
    const userId = await AsyncStorage.getItem("id");
    if(MODE == "DEV"){
      dispatch(setUserInfo({isLogin:true, userId:userId}));
      setReg(false);
    }else{
      autoLogin("start");
    }
  }

  useEffect(() => {
    checkDev()
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        autoLogin("foreground")
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, [setAppStateVisible]);
  
  const isLoggedIn = useSelector((state) => state.login.isLogin);
  // const headerTitleStyle = {
  //   fontFamily: "SUIT-Bold",
  //   fontSize: 16,
  //   fontWeight: "700",
  //   lineHeight: 16,
  //   color: "#111111"
  // }
  return (
    <NavigationContainer linking={linking} >
      <Stack.Navigator>
        {
          isReg ?
            <Stack.Screen  name="loding" component={Loading} options={{headerShown: false}}/>
          : 
          isLoggedIn ? (
            <>
              <Stack.Screen  name="main" component={MainScreen} options={{headerShown: false}}/>
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={Login} options={{headerShown: false}} initialParams={{ version: version }}/>
              <Stack.Screen name="FindIdPw" component={FindIdPwScreen} options={{title:"아이디 비밀번호 찾기", headerTitleAlign:"center", headerTitleStyle: headerTitleStyle,}}/>
              <Stack.Screen name="Agreement" component={Agreement} options={{title:"약관 동의", headerTitleAlign:"center", headerTitleStyle: headerTitleStyle,}}/>
              <Stack.Screen name="SignIn" component={SignInScreen} options={{title:"회원 가입", headerTitleAlign:"center", headerTitleStyle: headerTitleStyle,}}/>
              <Stack.Screen  name="TermsDetail" component={TermsDetailScreen} options={{title:"약관 상세", headerTitleAlign:"center", headerTitleStyle: headerTitleStyle,}}/>
              <Stack.Screen  name="SearchAddress" component={SearchAddress} options={{title:"주소 검색", headerTitleAlign:"center", headerTitleStyle: headerTitleStyle,}}/>
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function App(){
  const version = '1.0.5';
  // loading -> 로딩중 P -> 버전 일치 , D -> 버전이 안맞음 링크로 안내
  const [versionInfo, setVersionInfo] = useState("loading");
  const [versionData, setVersionData] = useState({});
  const [isFont, setIsFont] = useState(false);
  const loadFonts = async () => {
    await Font.loadAsync({
        "SUIT-Bold": require('./assets/fonts/SUIT-Bold.otf'),
        "SUIT-Medium": require('./assets/fonts/SUIT-Medium.otf'),
        "SUIT-ExtraBold": require('./assets/fonts/SUIT-ExtraBold.otf'),
        "SUIT-SemiBold": require('./assets/fonts/SUIT-SemiBold.otf'),
        "SUIT-Regular": require('./assets/fonts/SUIT-Regular.otf'),
        "Tium": require('./assets/fonts/Tium.ttf'),
      });
      setIsFont(true);
  }
  
  
  const versionCheck = async () => {
    await HTTP("GET", "/api/v1/main/versionCheck", {platForm:Platform.OS})
    .then((res)=>{
        const datas = res.data.result;
        const matchVersion = datas.find(el => el.VERSION == version) ?? ( datas.length > 0 ? datas[0] : {VERSION:"unKnown"} );
        if(matchVersion.VERSION == version){
          setVersionInfo("P");
        }else{
          setVersionData(matchVersion)
          setVersionInfo("D");
        }
    }).catch(function (error) {
        setVersionInfo("E");
        console.log(error);
    })

  }
  useEffect(() => {
    versionCheck();
    loadFonts();
  },[]);


  return (
      <Provider store={store}>
        <Notification >
        {
          (isFont && !["D", "loading"].includes(versionInfo))?
            <Index version={version} />
        :
          (isFont && versionInfo == "D")?
            <VersionView version={version} versionData={versionData}/>
        // :
        //   (versionInfo == "E")?
        //     <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
        //       <Text>버전체크가 실패했습니다.</Text>
        //       <Text>앱을 다시 시작해주세요.</Text>
        //     </View>
        :
          <ActivityIndicator/>
        }
        </Notification>
      </Provider>
  );
}

const VersionView = ({version, versionData}) => {
  const goInstallPage = () => {
    const url = versionData.URL;
    const manualUrl = versionData.MANUAL;
    if(Platform.OS == 'ios'){
      Linking.openURL(url);
    }else if(Platform.OS == 'android'){
      if(url){
        Linking.openURL(url);
      }else{
        Confirm("매뉴얼 열기", "메뉴얼에서 해당 버전을 다운받을수 있습니다.\n메뉴얼을 여시겠습니까??", {confirmPosOrder:CONFIRM_POSITION.RIGHT, confirm:()=>{Linking.openURL(manualUrl)}})  
      }
    }
  }
  const openMenual = () => {
    Linking.openURL(versionData.MANUAL);
  }
  return (
    <>
    <View style={{flex:1, justifyContent:"center", alignItems:"center",}}>
      <View style={styles.titleArea}>
        <Text style={styles.title}>ALOHA</Text>
        <View style={{flexDirection:"row", alignItems:"center", marginVertical:20}}>
          <Text style={styles.version}>Ver {version}</Text>
          <MaterialCommunityIcons name="ray-start-arrow" size={24} color="#999999" />
          <Text style={styles.version}>Ver {versionData.VERSION}</Text>
        </View>
        <Text style={styles.descrpition}>최신 버전이 아닙니다.</Text>
        <Text style={styles.descrpition}>최신 버전을 설치해주세요</Text>
        <View style={{flexDirection:"row"}}>
          <TouchableOpacity onPress={openMenual} style={[styles.btn, styles.btn2, {marginRight:16}]}>
            <Text style={[styles.btnText, styles.btnText2]}>매뉴얼 열기</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={goInstallPage} style={styles.btn}>
            <Text style={styles.btnText}>설치하러 가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  titleArea:{
    flex:1,
    alignItems:"center",
    justifyContent:"center",
  },
  title:{
    fontFamily: "Tium",
    fontSize: 40,
    textAlign: "center",
    color: theme.primary,
    marginBottom:4
  },
  version:{
    marginHorizontal:8,
    fontFamily: "SUIT-Regular",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    color: "#999999"
  },
  descrpition:{
    fontFamily: "SUIT-Bold",
    fontSize: 14,
    color: "#777"
  },
  btn:{
    alignItems:"center",
    marginTop:20,
    borderRadius: 10,
    backgroundColor: "#3479EF",
    paddingVertical:16,
    width:150,
  },
  btnText:{
    fontFamily: "SUIT-Bold",
    fontSize: 15,
    color: "#FFFFFF"
  },
  btn2:{
    backgroundColor:"white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(221, 221, 221, 1.0)"
  },
  btnText2:{
    color: "#999999"
  },

})

export default App;
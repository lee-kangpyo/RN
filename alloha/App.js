
import { StyleSheet, Text, View, AppState, Alert } from 'react-native';
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


import { URL, TASK_URL, LOCATION_TASK } from "@env";
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
      Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
};

function Index() {
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
        await axios.post(URL+'/api/v1/autoLogin', {uuid:uid, userId:userId, flag:flag},  { timeout: 3000 })
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

  useEffect(() => {
    autoLogin("start");
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
              <Stack.Screen name="Login" component={Login} options={{headerShown: false}}/>
              <Stack.Screen name="SignIn" component={SignInScreen} options={{title:"회원 가입"}}/>
              <Stack.Screen  name="TermsDetail" component={TermsDetailScreen} options={{title:"약관 상세"}}/>
              <Stack.Screen  name="SearchAddress" component={SearchAddress} options={{title:"주소 검색"}}/>
            </>
          )
        }
      </Stack.Navigator>
    </NavigationContainer>
  );
}


function App(){
  //<GetLocationPermission Grant={Index}/>
  //<LocationPermissionBack Grant ={Index}/>
  //<PushPermission/>
  return (
    <Provider store={store}>
      <Notification >
        <Index />
      </Notification>
    </Provider>
  );
}

export default App;
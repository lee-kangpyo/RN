
import { StyleSheet, Text, View } from 'react-native';
//import React, {useEffect, useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, {useEffect, useState} from 'react';
import { Provider, useSelector } from 'react-redux';
import store from '../alloha/redux/store';
import Login from '../alloha/src/screen/Login';
import TermsDetailScreen from '../alloha/src/screen/TermsDetailScreen';
import MainScreen from '../alloha/src/screen/MainScreen';
import SignInScreen from '../alloha/src/screen/SignInScreen';
import GetLocationPermission from '../alloha/src/components/LocationPermission';

import SearchAddress from '../alloha/src/components/SearchAddress';

import Geofencing from './src/screen/GeofencingTestScreen'

import { URL } from "@env";
import { useDispatch } from 'react-redux';
import { setUserInfo } from './redux/slices/login';
import axios from "axios"
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from './src/components/Loding';

const Stack = createNativeStackNavigator();

function Index() {
  const dispatch = useDispatch();
  const [isReg, setReg] = useState(true);
  const saveUserInfo = async ({ownrYn, crewYn, mnrgYn, userNa}) => {
    try {
      await AsyncStorage.setItem('userNa', userNa);
      await AsyncStorage.setItem('ownrYn', ownrYn);
      await AsyncStorage.setItem('crewYn', crewYn);
      await AsyncStorage.setItem('mnrgYn', mnrgYn);
    } catch (e) {
      console.log(e)
    }
  }


  useEffect(() => {
    (async () => {
      const uid = await SecureStore.getItemAsync("uuid");
      const userId = await AsyncStorage.getItem("id");
      if(uid && userId){
        await axios.post(URL+'/api/v1/autoLogin', {uuid:uid, userId:userId})
        .then( function  (response) {
          console.log(response.data)
          if(response.data.resultCode === "00"){
            dispatch(setUserInfo({isLogin:true, userId:userId}));
          }
        }).catch(function (error) {
            console.log(error)
        });
      }
      setReg(false);
    })();
  }, []);
  const isLoggedIn = useSelector((state) => state.login.isLogin);
  return (
    <NavigationContainer>
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



function backGroundLocationTest() {
  return (
    <Provider store={store}>
      <Geofencing/>
    </Provider>
  );
}

function App(){
  //<GetLocationPermission Grant={Index}/>
  //<LocationPermissionBack Grant ={Index}/>
  return (
    <Provider store={store}>
      <Index/>
    </Provider>
  );
}


export default App;
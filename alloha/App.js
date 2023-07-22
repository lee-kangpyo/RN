
//import { StyleSheet, Text, View } from 'react-native';
//import React, {useEffect, useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider, useSelector } from 'react-redux';
import store from '../alloha/redux/store';
import Login from '../alloha/src/screen/Login';
import TermsDetailScreen from '../alloha/src/screen/TermsDetailScreen';
import MainScreen from '../alloha/src/screen/MainScreen';
import SignInScreen from '../alloha/src/screen/SignInScreen';
import GetLocationPermission from '../alloha/src/components/LocationPermission';

import SearchAddress from '../alloha/src/components/SearchAddress';

import Geofencing from './src/screen/GeofencingTestScreen'

const Stack = createNativeStackNavigator();

function Index() {
  const isLoggedIn = useSelector((state) => state.login.isLogin);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {
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
  return (
    <Provider store={store}>
      <Index/>
    </Provider>
  );
}


export default backGroundLocationTest;

//import { StyleSheet, Text, View } from 'react-native';
//import React, {useEffect, useState} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider, useSelector } from 'react-redux';
import store from '../alba/redux/store';
import Login from '../alba/src/screen/Login';
import TermsDetailScreen from '../alba/src/screen/TermsDetailScreen';
import MainScreen from '../alba/src/screen/MainScreen';
import SignInScreen from '../alba/src/screen/SignInScreen';
import GetLocationPermission from '../alba/src/components/LocationPermission';

import SearchAddress from '../alba/src/components/SearchAddress';

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



function App() {
  return (
    <Provider store={store}>
      <GetLocationPermission Grant={Index}/>
    </Provider>
  );
}


export default App;
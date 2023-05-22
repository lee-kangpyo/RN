
import { StyleSheet, Text, View } from 'react-native';
import React, {useState} from 'react';


import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import Login from './src/screen/Login';
import TermsDetailScreen from './src/screen/TermsDetailScreen';
import MainScreen from './src/screen/MainScreen';
import SignInScreen from './src/screen/SignInScreen';

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
              <Stack.Screen name="SignIn" component={SignInScreen} options={{title:"계정 생성"}}/>
              <Stack.Screen  name="TermsDetail" component={TermsDetailScreen} options={{title:"약관 상세"}}/>
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
      <Index/>
    </Provider>
  );
}


export default App;
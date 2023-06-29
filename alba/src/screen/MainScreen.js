//import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import SettingsScreen from './SettingsScreen';
import BoardScreen from './BoardScreen';
import ManageStoreScreen from './ManageStoreScreen';
import AddStoreScreen from './AddStoreScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import { color } from 'react-native-reanimated';
import SearchAddress from '../components/SearchAddress';
import { useNavigation } from '@react-navigation/native';



const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainScreen() {
  const [userInfo, setUserInfo] = useState({})

  const loadData = async () => {
    if(!userInfo.id){
      const id = await AsyncStorage.getItem('id');
      const ownrYn = await AsyncStorage.getItem('ownrYn');
      const crewYn = await AsyncStorage.getItem('crewYn');
      if(!(id && ownrYn && crewYn)){
        //여기선 얼럿 후 로그인 창으로 이동
        console.log("잘못된 접근")
      }
      setUserInfo({id:id, ownrYn:ownrYn, crewYn:crewYn})
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  return (
    <View style={{flex:1, justifyContent:"center"}}> 
    {
      (userInfo.crewYn == 'Y')?
        <CrewScreen/>
      :
      (userInfo.ownrYn == "Y")?
        <OwnrScreen userInfo={userInfo}/>
      :  
        null
    }
    </View>  
    
  );
}



function OwnrScreen({userInfo}){
  const [refresh, setRefresh] = useState("false")
  const navigation = useNavigation();
  const storeOption = () => {
    return(
      {
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('addStore', { setRefresh }) }
            style={styles.header_btn}
          >
            <MaterialCommunityIcons name="store-plus" size={24} color="black" />
            <Text style={styles.header_txt}>추가</Text>
          </TouchableOpacity>
        ),
        
      }
    )
  }

  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => setTabBarIcon(focused, color, size, route.name),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '출퇴근' }}/>
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: '세팅' }}/>
      <Tab.Screen name="community" component={BoardScreen} options={{ tabBarLabel: '커뮤니티' }}/>
      <Tab.Screen name="manageStore" options={{ headerShown: false, tabBarLabel: '점포관리' }} >
        {() => (
          <Stack.Navigator>
            <Stack.Screen name="storeList" options={storeOption} backBehavior={"none"}>
              {() => <ManageStoreScreen type={"ownr"} refresh={refresh} setRefresh={setRefresh} />}
            </Stack.Screen>
            <Stack.Screen name="addStore" component={AddStoreScreen} options={{ title: '점포추가' }}/>
            <Stack.Screen  name="SearchAddress" component={SearchAddress} options={{title:"주소 검색"}}/>
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}



function CrewScreen(){
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => setTabBarIcon(focused, color, size, route.name),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="community" component={BoardScreen} />
      <Tab.Screen name="manageStore" backBehavior={"none"}>
        {() => <ManageStoreScreen type={"crew"} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}


const setTabBarIcon = (focused, color, size, name) =>{
  let iconName;
  let icon;
  if (name === 'Home') {
    iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
    icon = "Ionicons"
  } else if (name === 'Settings') {
    iconName = focused ? 'ios-list-circle' : 'ios-list-circle-outline';
    icon = "Ionicons"
  } else if (name === 'community'){
    iconName = focused ? 'ios-people-sharp' : 'ios-people-outline';
    icon = "Ionicons"
  }else if (name === 'manageStore'){
    iconName = focused ? 'store' : 'store-outline';
    icon = "MaterialCommunityIcons"
  }

  if (icon == "Ionicons"){
    return <Ionicons name={iconName} size={size} color={color} />;
  }else if(icon == "MaterialCommunityIcons"){
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }
}


const styles = StyleSheet.create({
  header_btn:{marginRight:16},
  header_txt:{fontSize:10, textAlign:"center"}
});
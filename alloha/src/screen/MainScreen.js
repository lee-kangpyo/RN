//import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Button } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons   } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './HomeScreen';
import SettingsScreen from './ComunityScreen';
import BoardScreen from './BoardScreen';
import ManageStoreScreen from './ManageStoreScreen';
import AddStoreScreen from './AddStoreScreen';
import SearchStoreScreen from './SearchStoreScreen';
import ManageCrewScreen from './ManageCrewScreen';
import LocationPermission from '../components/LocationPermissionBack'

import AsyncStorage from '@react-native-async-storage/async-storage';

import React, {useEffect, useState} from 'react';
import { color } from 'react-native-reanimated';
import SearchAddress from '../components/SearchAddress';
import { useNavigation } from '@react-navigation/native';
import WageScreen from './WageScreen';
import WageDetailScreen from './WageDetailScreen';
import ComunityScreen from './ComunityScreen';
import ModifyStoreScreen from './ModifyStoreScreen';
import EtcScreen from './EtcScreen';
import ScheduleScreen from './ScheduleScreen';
import ScheduleModifyScreen from './ScheduleModifyScreen';
import ScheduleViewScreen from './ScheduleViewScreen';
import EasyRegisterAlbaScreen from './EasyRegisterAlbaScreen';
import WorkScreen from './WorkScreen';
import ResultScreen from './ResultScreen';
import ResultDetailScreen from './ResultDetailScreen';
import ProfitAndLossScreen from './ProfitAndLossScreen';
import CustomerServiceScreen from './CustomerServiceScreen';
import QnAScreen from './QnAScreen';
import ModifyCrewScreen from './ModifyCrewScreen';
import ScheduleTimeLineScreen from './ScheduleTimeLineScreen';
import ScheduleScreenToAlba from './ScheduleScreenToAlba';
import CommuteCheckScreen from './CommuteCheckScreen';
import CommuteCheckInfoScreen from './CommuteCheckInfoScreen';
import CommuteCheckDetailScreen from './CommuteCheckDetailScreen';
import EtcCrewScreen from './EtcCrewScreen';

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
      <Tab.Screen name="schedule" component={ScheduleStack} options={{ headerShown:false, tabBarLabel: '근무계획'}}/>
      <Tab.Screen name="work" component={WorkStack} options={{ headerShown:false, tabBarLabel: '근무결과'}}/>
      <Tab.Screen name="result" component={ResultStack} options={{ headerShown:false, tabBarLabel: '결과현황표'}}/>
      <Tab.Screen name="profitAndLoss" component={ProfitAndLossScreen} options={{ tabBarLabel: '매출현황' }}/>
      <Tab.Screen name="qna" component={QnAScreen} options={{ tabBarLabel: '질문' }}/>
      
      <Tab.Screen name="etc" options={{ headerShown: false, }}>
        {() => (
          <Stack.Navigator initialRouteName="etc3">
            <Stack.Screen name="etc3" component={EtcScreen} options={{ tabBarLabel: '기타' }}/>
            <Stack.Screen name="ManageCrew" component={ManageCrewScreen} options={{ tabBarLabel: '알바관리' }}/>
            <Stack.Screen name="modifyCrew" component={ModifyCrewScreen} options={{ tabBarLabel: '알바수정' }}/>
            <Stack.Screen name="storeList" options={storeOption} backBehavior={"none"}>
              {() => <ManageStoreScreen type={"ownr"} refresh={refresh} setRefresh={setRefresh} />}
            </Stack.Screen>
            <Stack.Screen name="addStore" component={AddStoreScreen} options={{ title: '점포추가' }}/>
            <Stack.Screen name="modifyStore" component={ModifyStoreScreen} options={{ title: '점포수정' }}/>
            <Stack.Screen  name="SearchAddress" component={SearchAddress} options={{title:"주소 검색"}}/>
            <Stack.Screen  name="community" component={ComunityScreen} options={{title:"커뮤니티"}}/>
            <Stack.Screen  name="customerService" component={CustomerServiceScreen} options={{title:"채팅테스트"}}/>
            {() => ( // 안쓰는 급여 페이지
              <Stack.Navigator>
                <Stack.Screen name="WageList" component={WageScreen} options={{ title: '급여' }} initialParams={{userType:"owner"}} />
                <Stack.Screen  name="WageDetail" component={WageDetailScreen} options={{title:"급여 상세"}}/>
              </Stack.Navigator>
            )}
          </Stack.Navigator>
        )}
      </Tab.Screen>

    </Tab.Navigator>
  )
}
function ResultStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="resultMain" component={ResultScreen} />
      <Stack.Screen name="resultDetail" component={ResultDetailScreen} />
    </Stack.Navigator>
  )
}

function WorkStack(){
  return(
  <Stack.Navigator>
    <Stack.Screen name="workMain" component={WorkScreen} />
    <Stack.Screen name="registerAlba" component={EasyRegisterAlbaScreen} />
  </Stack.Navigator>
  )
}

function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="scheduleMain" component={ScheduleScreen} 
        // options={
        //   {
        //     headerRight: () => (
        //       <TouchableOpacity onPress={() => navigation.navigate("scheduleView")}>
        //         <Ionicons name="reader-outline" size={24} color="black" />
        //       </TouchableOpacity>
        //     ),
        //   }
        // }
      />
      <Stack.Screen name="scheduleModify" component={ScheduleModifyScreen} />
      <Stack.Screen name="scheduleView" component={ScheduleViewScreen} />
      <Stack.Screen name="scheduleTimeLine" component={ScheduleTimeLineScreen} />
      <Stack.Screen name="registerAlba" component={EasyRegisterAlbaScreen} />
    </Stack.Navigator>
  );
}
//<Ionicons name="download-outline" size={32} color="black" />

function CrewScreen(){
  return(
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => setTabBarIcon(focused, color, size, route.name),
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="schedule" component={ScheduleScreenToAlba} options={{ tabBarLabel: '주간근무계획' }}/>
      <Tab.Screen name="CommuteCheck" component={CommuteCheckStack} options={{ headerShown:false, tabBarLabel: '근무 현황' }}/>
      {/* <Tab.Screen name="Home" options={{ tabBarLabel: '출퇴근(구버전)' }} >
        {() => (
          <LocationPermission Grant={HomeScreen}/>
        )}
      </Tab.Screen> */}
      <Tab.Screen name="Wage" options={{ headerShown: false, tabBarLabel: '급여' }} >
        {() => (
          <Stack.Navigator>
            <Stack.Screen name="WageList" component={WageScreen} options={{ title: '급여' }} initialParams={{userType:"crew"}}/>
            <Stack.Screen  name="WageDetail" component={WageDetailScreen} options={{title:"급여 상세"}}/>
          </Stack.Navigator>
        )}
      </Tab.Screen>
      <Tab.Screen name="community" component={ComunityScreen} options={{ tabBarLabel: '커뮤니티' }}/>
      <Tab.Screen name="manageStore" component={SearchStoreScreen} backBehavior={"none"} options={{ tabBarLabel: '점포검색' }} />
      <Tab.Screen name="etc" options={{ headerShown: false, }}>
        {() => (
          <Stack.Navigator initialRouteName="etc2">
            <Stack.Screen name="etc2" component={EtcCrewScreen} options={{ tabBarLabel: '기타' }}/>
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
//<Tab.Screen name="community" component={BoardScreen} options={{ tabBarLabel: '커뮤니티' }}/>
function CommuteCheckStack(){
  return(
  <Stack.Navigator>
    <Stack.Screen name="CommuteCheckMain" component={CommuteCheckScreen} />
    <Stack.Screen name="CommuteCheckInfo" component={CommuteCheckInfoScreen} />
    <Stack.Screen name="CommuteCheckDetail" component={CommuteCheckDetailScreen} />
  </Stack.Navigator>
  )
}
const setTabBarIcon = (focused, color, size, name) =>{
  let iconName;
  let icon;
  if (name === 'Home' || name === 'CommuteCheck') {
    iconName = focused ? 'coffee' : 'coffee-outline';
    icon = "MaterialCommunityIcons"
  }else if (name === 'ManageCrew'){
    iconName = 'user-cog';
    icon = "FontAwesome5"
  } else if (name === 'result') {
    iconName = 'file-invoice-dollar';
    icon = "FontAwesome5"
  } else if (name === 'community'){
    iconName = focused ? 'ios-people-sharp' : 'ios-people-outline';
    icon = "Ionicons"
  }else if (name === 'manageStore'){
    iconName = focused ? 'store' : 'store-outline';
    icon = "MaterialCommunityIcons"
  }else if(name === "etc"){
    iconName = focused ? 'ellipsis-vertical-sharp' : 'ellipsis-vertical-outline';
    icon = "Ionicons"
  }else if (name === "schedule"){
    iconName = focused ? 'ios-timer' : 'ios-timer-outline';
    icon = "Ionicons"
  }else if(name === "work"){
    iconName = 'running';
    icon = "FontAwesome5"
  }else if(name ==="profitAndLoss"){
    iconName = 'payments';
    icon = "MaterialIcons"
  }else if(name === "qna"){
    iconName = 'chat-question';
    icon = "MaterialCommunityIcons"
  }
  

  if (icon == "Ionicons"){
    return <Ionicons name={iconName} size={size} color={color} />;
  }else if(icon == "MaterialCommunityIcons"){
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }else if(icon == "FontAwesome5"){
    return <FontAwesome5 name={iconName} size={size} color={color} />;
  }else if(icon == "MaterialIcons"){
    return <MaterialIcons name={iconName} size={size} color={color} />;
  }
  
}

const styles = StyleSheet.create({
  header_btn:{marginRight:16},
  header_txt:{fontSize:10, textAlign:"center"}
});
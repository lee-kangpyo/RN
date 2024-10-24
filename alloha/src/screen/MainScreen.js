//import * as React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Button, Image, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5, MaterialIcons, FontAwesome   } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator, TransitionPresets } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useRef, useState} from 'react';
import SearchAddress from '../components/SearchAddress';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ScheduleScreenToAlba from './ScheduleScreenToAlba';
import EtcCrewScreen from './EtcCrewScreen';
import { useDispatch, useSelector } from 'react-redux';
import { useCommuteChangeList } from '../hooks/useReqCommuteList';
import NotificationListener from '../components/common/NotificationListener';

import ManageStoreScreen from './ManageStoreScreen';
import AddStoreScreen from './AddStoreScreen';
import SearchStoreScreen from './SearchStoreScreen';
import ManageCrewScreen from './ManageCrewScreen';
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
import CommuteCheckScreen from './CommuteCheckScreen';
import CommuteCheckInfoScreen from './CommuteCheckInfoScreen';
import CommuteCheckDetailScreen from './CommuteCheckDetailScreen';
import CommuteCheckChangeScreen from './CommuteCheckChangeScreen';
import ReqChangeWorkScreen from './ReqChangeWorkScreen';
import DailyReportScreen from './DailyReportScreen';
import DailyReportDetilaScreen from './DailyReportDetilaScreen';
import HomeCrewScreen from './HomeCrewScreen';
import { headerLeftComponent, headerTitleStyle } from '../util/utils';
import HomeOwnerScreen from './HomeOwnerScreen';
import QuestionScreen from './QuestionScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import { theme } from '../util/color';
import ScheduleCreateScreen from './ScheduleCreateScreen';
import ManageCrewUpdateScreen from './ManageCrewUpdateScreen';
import MyStoreScreen from './MyStoreScreen';
import CrewStoreScreen from './CrewStoreScreen';
import ProfitCategoryScreen from './ProfitCategoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function MainScreen() {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({});
  const dispatch = useDispatch();

  const loadData = async () => {
    if(!userInfo.id){
      const id = await AsyncStorage.getItem('id');
      const ownrYn = await AsyncStorage.getItem('ownrYn');
      const crewYn = await AsyncStorage.getItem('crewYn');
      if(!(id && ownrYn && crewYn)){
        //여기선 얼럿 후 로그인 창으로 이동
        console.log("잘못된 접근!!")
        dispatch({ type: 'LOGOUT' });
        await SecureStore.setItemAsync("uuid", "");
        TaskManager.unregisterAllTasksAsync();
      }
      setUserInfo({id:id, ownrYn:ownrYn, crewYn:crewYn})
    }
  }

  useEffect(() => {
    loadData()
  }, [])
  

  return (
    <View style={{flex:1, justifyContent:"center"}}> 
      <NotificationListener />
      {
        (userInfo.crewYn == 'Y')?
          <CrewScreen/>
        :
        (userInfo.ownrYn == "Y")?
          <OwnrScreen userInfo={userInfo} />
        :  
          null
      }
    </View>
  );
}

function OwnrScreen({}){
  const owrBadge = useSelector((state) => state.owner.reqAlbaChangeCnt);
  const [refresh, setRefresh] = useState("false")
  const userId = useSelector((state) => state.login.userId);
  const navigation = useNavigation();
  const getChageList = useCommuteChangeList(userId)

  useEffect(()=>{
    getChageList();
  }, [])

  const storeOption = () => {
    return(
      {
        headerLeft:()=>headerLeftComponent("점포관리"), title:"",
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
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="home" component={HomeOwnerStack} options={{ headerShown:false, tabBarLabel: '홈'}}/>
      {/* <Tab.Screen name="daylyReport" component={DailyStack} options={{ headerShown:false, tabBarLabel: '일일보고서', tabBarBadge: owrBadge,}}/> */}
      <Tab.Screen name="schedule" component={ScheduleStack} options={{ headerShown:false, tabBarLabel: '근무계획'}}/>
      <Tab.Screen name="work" component={WorkStack} options={{ headerShown:false, tabBarLabel: '근무결과' }}/>
      <Tab.Screen name="result" component={ResultStack} options={{ headerShown:false, tabBarLabel: '급여'}}/>
      {/* <Tab.Screen name="profitAndLoss" component={ProfitAndLossScreen} options={{ tabBarLabel: '매출현황' }}/> 
      <Tab.Screen name="qna" component={QnAScreen} listeners={{tabPress: () => Linking.openURL('http://pf.kakao.com/_mxmjLG/chat'),}} options={{headerTitleAlign: 'center', headerTitleStyle:headerTitleStyle, title:"문의하기"}}/>
      */}
      <Tab.Screen name="etc" options={{ headerShown: false, tabBarLabel: '기타'}}>
        {() => (
          <Stack.Navigator initialRouteName="etcScreen">
            <Stack.Screen name="etcScreen" component={EtcScreen} options={{ tabBarLabel: '기타' }}/>
            <Stack.Screen name="ManageCrew" component={ManageCrewScreen} options={{ headerLeft:()=>headerLeftComponent("알바관리"), title:"" }}/>
            <Stack.Screen name="ManageCrewUpdate" component={ManageCrewUpdateScreen} />
            <Stack.Screen name="modifyCrew" component={ModifyCrewScreen} options={{ tabBarLabel: '알바수정' }}/>
            <Stack.Screen name="storeList" options={storeOption} backBehavior={"none"}>
              {() => <ManageStoreScreen type={"ownr"} refresh={refresh} setRefresh={setRefresh} />}
            </Stack.Screen>
            <Stack.Screen name="addStore" component={AddStoreScreen} options={{ headerLeft:()=>headerLeftComponent("점포추가"), title:"" }}/>
            <Stack.Screen name="modifyStore" component={ModifyStoreScreen} options={{ title: '점포수정' }}/>
            <Stack.Screen  name="SearchAddress" component={SearchAddress} options={{title:"주소 검색"}}/>
            <Stack.Screen  name="community" component={ComunityScreen} options={{title:"커뮤니티"}}/>
            <Stack.Screen  name="customerService" component={CustomerServiceScreen} options={{title:"채팅테스트"}}/>
            <Stack.Screen  name="qna" component={QnAScreen} options={{title:"채팅테스트"}}/>
            <Stack.Screen name="changePassword" component={ChangePasswordScreen} options={{headerLeft:()=>headerLeftComponent("비밀번호 변경"), title:""}}/>
            {() => ( // 안쓰는 급여 페이지
              <Stack.Navigator>
                <Stack.Screen name="WageList" component={WageScreen} options={{ title: '급여' }} initialParams={{userType:"owner"}} />
                <Stack.Screen  name="WageDetail" component={WageDetailScreen} options={{title:"급여 상세"}}/>
              </Stack.Navigator>
            )}
            <Stack.Screen name="DailyReport" component={DailyReportScreen} options={{headerLeft:()=>headerLeftComponent("일일보고서"), title:""}} />
            <Stack.Screen name="DailyReportDetail" component={DailyReportDetilaScreen} />
            <Stack.Screen name="profitAndLoss" component={ProfitAndLossScreen} options={{headerLeft:()=>headerLeftComponent("매출현황"), title:""}}/>
            <Stack.Screen name="ProfitCategory" component={ProfitCategoryScreen} options={{ headerShown: false, tabBarVisible: false}}/>
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

function HomeOwnerStack () {
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState("false")
  const storeOption = () => {
    return(
      {
        headerLeft:()=>headerLeftComponent("점포관리"), title:"",
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
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeOwnerScreen} options={{headerShown:false}}/>
      <Stack.Screen name="ManageCrew" component={ManageCrewScreen} options={{ headerLeft:()=>headerLeftComponent("알바관리"), title:"" }}/>
      <Stack.Screen name="ManageCrewUpdate" component={ManageCrewUpdateScreen} />
      <Stack.Screen name="modifyCrew" component={ModifyCrewScreen} options={{ tabBarLabel: '알바수정' }}/>
      <Stack.Screen name="storeList" options={storeOption} backBehavior={"none"}>
        {() => <ManageStoreScreen type={"ownr"} refresh={refresh} setRefresh={setRefresh} />}
      </Stack.Screen>
      <Stack.Screen name="addStore" component={AddStoreScreen} options={{ headerLeft:()=>headerLeftComponent("점포추가"), title:"" }}/>
      <Stack.Screen name="modifyStore" component={ModifyStoreScreen} options={{ title: '점포수정' }}/>
      <Stack.Screen  name="SearchAddress" component={SearchAddress} options={{title:"주소 검색"}}/>
    </Stack.Navigator>
  )
}
function DailyStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="DailyReport" component={DailyReportScreen} options={{headerTitleAlign: 'center', headerTitleStyle:headerTitleStyle, title:"근무계획"}} />
      <Stack.Screen name="DailyReportDetail" component={DailyReportDetilaScreen} />
    </Stack.Navigator>
  )
}
function ResultStack(){
  return(
    <Stack.Navigator>
      <Stack.Screen name="resultMain" component={ResultScreen} options={{headerTitleAlign: 'center', headerTitleStyle:headerTitleStyle, title:"급여"}}/>
      {/* resultDetail은 안씀 */}
      <Stack.Screen name="resultDetail" component={ResultDetailScreen} options={{headerLeft:()=>headerLeftComponent("결과 상세 보기"), title:""}} />
      <Stack.Screen  name="WageResultDetail" component={WageDetailScreen} options={{title:""}}/>
    </Stack.Navigator>
  )
}

function WorkStack(){
  return(
  <Stack.Navigator>
    <Stack.Screen name="workMain" component={WorkScreen} options={{headerTitleAlign: 'center', headerTitleStyle:headerTitleStyle, title:"근무결과",}}/>
    <Stack.Screen name="reqChangeWork" component={ReqChangeWorkScreen} />
    <Stack.Screen name="registerAlba" component={EasyRegisterAlbaScreen} />
    
  </Stack.Navigator>
  )
}

function ScheduleStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="scheduleView" component={ScheduleViewScreen} options={{headerTitleAlign: 'center', headerTitleStyle:headerTitleStyle, title:"근무계획"}} />
      <Stack.Screen name="scheduleInsert" component={ScheduleScreen}  options={{headerLeft:()=>headerLeftComponent("근무 계획 입력"), title:""}} />
      <Stack.Screen name="scheduleModify" component={ScheduleModifyScreen} />
      <Stack.Screen name="scheduleTimeLine" component={ScheduleTimeLineScreen} options={{headerLeft:()=>headerLeftComponent("근무 계획"), title:""}}/>
      <Stack.Screen name="registerAlba" component={EasyRegisterAlbaScreen} />
    </Stack.Navigator>
  );
}
//<Ionicons name="download-outline" size={32} color="black" />

function CrewScreen(){
  return(
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => setTabBarIcon(focused, color, size, route.name),
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="schedule" component={ScheduleCrewStack} options={{ tabBarLabel: '계획', headerShown: false,}}/>
      <Tab.Screen name="CommuteCheck" component={CommuteCheckScreen} options={{headerTitleStyle:headerTitleStyle, headerTitleAlign:"center", tabBarLabel:"출퇴"}}/>
      <Tab.Screen name="Home" component={HomeCrewStack} options={{ headerShown:false, tabBarLabel: '홈'}}/>
      {/* <Tab.Screen name="CommuteCheckInfo" component={CommuteCheckStack} options={{ headerShown:false, tabBarLabel: '근무정보'}}/> */}
      
      {/* <Tab.Screen name="Home" options={{ tabBarLabel: '출퇴근(구버전)' }} >
        {() => (
          <LocationPermission Grant={HomeScreen}/>
        )}
      </Tab.Screen> */}
      
      <Tab.Screen name="Wage" options={{ headerShown: false, tabBarLabel: '급여'}} >
        {() => (
          <Stack.Navigator>
            <Stack.Screen name="WageList" component={WageScreen} options={{ title: '급여', headerTitleStyle:headerTitleStyle, headerTitleAlign:"center" }} initialParams={{userType:"crew"}}/>
            {/* resultDetail은 안씀 */}
            <Stack.Screen name="WageDetail" component={ResultDetailScreen} options={{title:""}} />
            <Stack.Screen  name="WageResultDetail" component={WageDetailScreen} options={{title:""}}/>
          </Stack.Navigator>
        )}
      </Tab.Screen>
      {/* 
      <Tab.Screen name="qna" component={QnAScreen} listeners={{tabPress: () => Linking.openURL('http://pf.kakao.com/_mxmjLG/chat'),}} options={{headerTitleAlign: 'center', headerTitleStyle:headerTitleStyle, title:"문의하기"}}/>
      <Tab.Screen name="manageStore" component={SearchStoreScreen} backBehavior={"none"} options={{ tabBarLabel: '점포검색', headerTitleStyle:headerTitleStyle, headerTitleAlign:"center"}} /> */}
      <Tab.Screen name="etc" options={{ headerShown: false, tabBarLabel: '기타'}}>
        {() => (
          <Stack.Navigator initialRouteName="etc2">
            <Stack.Screen name="etc2" component={EtcCrewScreen} options={{ tabBarLabel: '기타', headerTitleStyle:headerTitleStyle, headerTitleAlign:"center"}}/>
            <Stack.Screen name="Comunity" component={ComunityScreen} options={{headerLeft:()=>headerLeftComponent("커뮤니티"), title:""}}/>
            <Stack.Screen name="question" component={QuestionScreen} options={{headerLeft:()=>headerLeftComponent("문의하기"), title:""}}/>
            <Stack.Screen name="changePassword" component={ChangePasswordScreen} options={{headerLeft:()=>headerLeftComponent("비밀번호 변경"), title:""}}/>
            <Stack.Screen name="myStore" component={MyStoreScreen} options={{headerLeft:()=>headerLeftComponent("내점포"), title:"",}}/>
            <Stack.Screen name="manageStore" component={SearchStoreScreen} options={{headerLeft:()=>headerLeftComponent("점포검색"), title:""}}/>
            <Stack.Screen name="createCrewStore" component={CrewStoreScreen} options={{headerLeft:()=>headerLeftComponent("점포추가"), title:""}}/>
          </Stack.Navigator>
        )}
      </Tab.Screen>
    </Tab.Navigator>
  )
}
function ScheduleCrewStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="ScheduleScreenToAlba" component={ScheduleScreenToAlba} options={{ title: '계획', headerTitleStyle:headerTitleStyle, headerTitleAlign:"center" }}/>
      <Stack.Screen name="ScheduleCreateScreen" component={ScheduleCreateScreen} options={{headerLeft:()=>headerLeftComponent("계획입력하기"), title:""}}/>
    </Stack.Navigator>
    
  )
}
function HomeCrewStack(){
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeCrewScreen} options={{headerShown:false}}/>
      <Stack.Screen name="CommuteCheckDetail" component={CommuteCheckDetailScreen} options={{headerLeft:()=>headerLeftComponent("근무내역"), title:""}}/>
      <Stack.Screen name="myStore" component={MyStoreScreen} options={{headerLeft:()=>headerLeftComponent("내점포"), title:"",}}/>
      <Stack.Screen name="manageStore" component={SearchStoreScreen} options={{headerLeft:()=>headerLeftComponent("점포검색"), title:""}}/>
      <Stack.Screen name="createCrewStore" component={CrewStoreScreen} options={{headerLeft:()=>headerLeftComponent("점포추가"), title:""}}/>
    </Stack.Navigator>
  )
}
//<Tab.Screen name="community" component={BoardScreen} options={{ tabBarLabel: '커뮤니티' }}/>
function CommuteCheckStack(){
  const navigation = useNavigation();
  const headerLeft = (props) => {
    return(
      <TouchableOpacity                
          onPress={() => navigation.pop()}
      >
      <Image source={require('../../assets/icons/goBack.png')} style={{width:13, height:22, marginRight:20}} />
      </TouchableOpacity>
    )
  }

  return(
  <Stack.Navigator>
    <Stack.Screen name="CommuteCheckInfoM" component={CommuteCheckInfoScreen} options={{headerTitleStyle:headerTitleStyle, headerTitleAlign:"center", title:"근무 정보"}}/>
    <Stack.Screen name="CommuteCheckDetail" component={CommuteCheckDetailScreen} options={{headerLeft:()=>headerLeftComponent("근무내역"), title:""}}/>
    <Stack.Screen name="CommuteCheckChange" component={CommuteCheckChangeScreen} options={{headerLeft:()=>headerLeftComponent("근무기록변경"), title:""}}/>
  </Stack.Navigator>
  )
}

const setTabBarIcon = (focused, color, size, name) =>{
  let iconName;
  let icon;
  if (name === 'Home') {
    iconName = 'calendar-alt';
    icon = "FontAwesome5"
  }else if (name === 'CommuteCheck'){
    iconName = 'touch-app';
    icon = "MaterialIcons"
  }else if (name === 'ManageCrew'){
    iconName = 'user-cog';
    icon = "FontAwesome5"
  } else if (name === 'result') {
    iconName = 'file-invoice-dollar';
    icon = "FontAwesome5"
  } else if (name === 'community'){
    iconName = focused ? 'people-sharp' : 'people-outline';
    icon = "Ionicons"
  }else if (name === 'manageStore'){
    iconName = focused ? 'store' : 'store-outline';
    icon = "MaterialCommunityIcons"
  }else if(name === "etc"){
    iconName = focused ? 'ellipsis-vertical-sharp' : 'ellipsis-vertical-outline';
    icon = "Ionicons"
  }else if (name === "schedule"){
    iconName = focused ? 'timer' : 'timer-outline';
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
  }else if(name ==='Wage'){
    iconName = 'dollar-sign';
    icon = "FontAwesome5"
  }else if (name == "daylyReport"){
    iconName = focused ? 'file-text' : 'file-text-o';
    icon = "FontAwesome"
  }else if (name == "CommuteCheckInfo"){
    iconName = focused ? 'clipboard-text' : 'clipboard-text-outline';
    icon = "MaterialCommunityIcons"
  }else if(name == "home"){
    iconName = focused ? 'home' : 'home';
    icon = "FontAwesome"
  }
  

  if (icon == "Ionicons"){
    return <Ionicons name={iconName} size={size} color={color} />;
  }else if(icon == "MaterialCommunityIcons"){
    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  }else if(icon == "FontAwesome5"){
    return <FontAwesome5 name={iconName} size={size} color={color} />;
  }else if(icon == "MaterialIcons"){
    return <MaterialIcons name={iconName} size={size} color={color} />;
  }else if(icon == "FontAwesome"){
    return <FontAwesome name={iconName} size={size} color={color} />;
  }
  
}

const styles = StyleSheet.create({
  header_btn:{marginRight:16},
  header_txt:{fontSize:10, textAlign:"center"}
});
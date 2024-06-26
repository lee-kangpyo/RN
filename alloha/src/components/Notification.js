import { useState, useEffect, useRef, } from 'react';
import { Platform, Alert, Linking, AppState } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Loading from './Loding';
import Constants from 'expo-constants';
import { setToken } from '../../redux/slices/push';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../util/token';
import * as SecureStore from 'expo-secure-store';

Notifications.setNotificationHandler({
  handleNotification: async ({ request }) => {
    const data = request.content.data;
    if(data.type == "owner-badge"){
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    }
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});


export default function Notification({ children }) {
  const [isShowChildComponent, setShowChildComponent] = useState(false);
  const pushToken = useSelector((state) => state.push.token);
  const dispatch = useDispatch();




  useEffect(() => {
    //registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    registerForPushNotificationsAsync().then( async token => {
      await SecureStore.setItemAsync("pushToken", token);
      dispatch(setToken(token));
    });
    

    //const appState = useRef(AppState.currentState);
    // if (Platform.OS === 'ios') {
    //   registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    // }
   
    // const handleAppStateChange = (nextAppState) => {
    //   if ( nextAppState === 'active') {
    //     // 앱이 다시 활성화된 경우에 실행할 코드
    //     registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
    //   }
    // }

    // AppState.addEventListener('change', handleAppStateChange);
    // // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
    // return () => {
    //   AppState.removeEventListener('change', handleAppStateChange);
    // };
    
  }, []); // useEffect는 한 번만 실행
 

  async function registerForPushNotificationsAsync() {
    let token;
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        if(!isShowChildComponent){
          Alert.alert('알림 허용', '푸시 알림을 설정하시명 알로하의 기능 업데이트, 이벤트 소식을 받아보실 수 있습니다. 현재 알림이 차단된 상태입니다. 알림을 허용하시겠습니까?', [
              {
              text: '아니오',
              onPress: () => {setShowChildComponent(true);},
              style: 'cancel',
              },
              {text: '네', onPress: () => {Linking.openSettings();setShowChildComponent(true);}},
          ]);
        }
        return;
      }else{
        setShowChildComponent(true);
      }
      token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      })).data;

      token = await getToken(token); 

    } else {
      alert('Must use physical device for Push Notifications');
      setShowChildComponent(true);
    }

    return token;
  }

  

  return (
    <>
      
    {
      
      (isShowChildComponent)?
        children
        :
        <>
          <Loading/>
        </>
    }
    </>
  );

    

}


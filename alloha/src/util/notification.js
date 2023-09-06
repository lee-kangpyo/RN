import * as Notifications from 'expo-notifications';
import { Platform, Linking, Alert  } from 'react-native';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  
// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { someData: 'goes here' },
    };
  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    console.log(existingStatus);
    if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    }
    if (finalStatus !== 'granted') {
    Alert.alert('알림 허용', '푸시 알림을 설정하시명 알로하의 기능 업데이트, 이벤트 소식을 받아보실 수 있습니다. 현재 알림이 차단된 상태입니다. 알림을 허용하시겠습니까?', [
        {
        text: '아니오',
        onPress: () => {},
        style: 'cancel',
        },
        {text: '네', onPress: () => Linking.openSettings()},
    ]);

    return;
    }

    token = (await Notifications.getExpoPushTokenAsync({ projectId: '0dd79bb6-37ee-41de-ab18-ae35b01e55a2' })).data;
    console.log(token);

  
    return token;
  }



  export {registerForPushNotificationsAsync, sendPushNotification};
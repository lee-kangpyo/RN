import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export const getToken = async () => {
    const token = (await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
    })).data;
    const compressed = tokenCompression(token)
    
    return compressed;
}



  const tokenCompression = (token) => {
    const match = token.match(/\[(.*?)\]/);
    if (match) {
      const randomString = match[1]; // 22개의 무작위 문자열
      return randomString
    } else {
      console.log("토큰 형식이 아닙니다.");
    }
  };
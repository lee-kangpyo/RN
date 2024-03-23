import { Text, TouchableOpacity, View } from "react-native";
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';

export default function PushTest(){
    const prefix = Linking.createURL("/"); // path 앞부분
    return (
        <View>
        <TouchableOpacity
            onPress={() => {
            Notifications.scheduleNotificationAsync({
                content: {
                title: "Deep Link Test",
                body: 'Deep Link Test',
                data: {
                    url: `/owner/ManageCrew`, // 여기가 path를 설정하는 부분입니다.
                },
                },
                trigger: {
                    seconds: 1,
                },
            });
            }}
        >
            <Text>{prefix}/owner/ManageCrew</Text>
        </TouchableOpacity>
      </View>
    )
}
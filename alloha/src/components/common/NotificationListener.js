import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { useSelector } from 'react-redux';
import { useCommuteChangeList } from '../../hooks/useReqCommuteList';

function NotificationListener() {
    const userId = useSelector((state) => state.login.userId);
    const getChageList = useCommuteChangeList(userId);
    const notificationListener = useRef();
    useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        const data = notification.request.content.data;
        if(data.type == "owner-badge"){
            getChageList();
        }
    });
    notificationListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        const data = response.notification.request.content.data;
        if(data.type == "owner-badge"){
            getChageList();
        }
    });
    // Clean-up function
    return () => {
        if (notificationListener.current) {
            Notifications.removeNotificationSubscription(notificationListener.current);
        }
    };
    }, []);

  // JSX 반환 없이 null 반환
  return null;
}

export default NotificationListener;

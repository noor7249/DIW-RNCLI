import { useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

const checkApplicationPermission = async () => {
    if (Platform.OS === 'android') {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Notification permission granted');
            } else {
                console.log('Notification permission denied');
            }
        } catch (error) {
            console.error('Permission request failed:', error);
        }
    }
};

const RemoteNotification = () => {
    useEffect(() => {
        checkApplicationPermission();

        PushNotification.getChannels((channelIds) => {
            channelIds.forEach((id) => {
                PushNotification.deleteChannel(id);
            });
        });

        PushNotification.configure({
            onRegister: (token) => {
                console.log('FCM Token:', token);
            },

            onNotification: (notification) => {
                const { message, title, id }:any = notification;

                // Handle the notification data
                const strTitle = title ? title : 'No title';
                const strBody:any = message ? message : 'No message';
                const channelId = id ? id.toString() : 'default-channel-id';

                PushNotification.createChannel(
                    {
                        channelId: channelId,
                        channelName: 'remote-message',
                        channelDescription: 'Notification for remote messages', // Channel description
                        importance: 4,
                        vibrate: true,
                    },
                    (created) => console.log(`Channel created: ${created}`)
                );

                PushNotification.localNotification({
                    channelId: channelId,
                    title: strTitle,
                    message: strBody,
                });

                console.log('Remote notification received:', notification);
            },

            requestPermissions: true,
        });

        return () => {
            PushNotification.removeAllDeliveredNotifications();
        };
    }, []);

    return null; 
};

export default RemoteNotification;

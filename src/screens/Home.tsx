/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Button, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View, PermissionsAndroid, Platform, BackHandler, ToastAndroid } from 'react-native';
import { fetchAppUsers } from '../services/appUser';
import { Color, FontFamily } from '../GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Icon from 'react-native-vector-icons/FontAwesome';

// import { eye } from 'react-icons-kit/icomoon/eye';
// import { pencil } from 'react-icons-kit/icomoon/pencil';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;


const Home = () => {
    const navigation = useNavigation<NavigationProps>();
    const [appUsers, setAppUsers] = useState<any>();
    const backPressCount = useRef(0);

    messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
    });


    useEffect(() => {
        const backAction = () => {
            console.log('Back button pressed');
            if (backPressCount.current === 0) {
                backPressCount.current = 1;
                ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
                setTimeout(() => {
                    backPressCount.current = 0;
                }, 2000);
                return true;
            } else {
                BackHandler.exitApp();
                return true;
            }
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction
        );

        return () => {
            console.log('BackHandler removed');
            backHandler.remove();
        };
    }, []);

    useEffect(() => {
        fetchAppUsers().then(data => {
            console.log(data);
            setAppUsers(data);
        }).catch(er => {
            console.log(er);

        })

    }, []);

    const handleShare = () => {
        Share.open({
            message: 'Hello from React Native!',
        })
            .then((res: any) => {
                console.log('Share Success:', res);
            })
            .catch((err: any) => {
                if (err && err.message) {
                    console.error('Share Error:', err.message);
                }
            });
    };

    // const handleWhatsAppShare = () => {
    //     const message = 'Hello, this is react native!✡️✡️✡️';
    //     const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    //     Linking.canOpenURL(url)
    //         .then((supported) => {
    //             if (!supported) {
    //                 Alert.alert('Error', 'WhatsApp is not installed on this device.');
    //             } else {
    //                 return Linking.openURL(url);
    //             }
    //         })
    //         .catch((err) => console.error('An error occurred', err));
    // };

    const handleWhatsAppShare = () => {
        const dynamicLink = `https://www.amazon.com`; // Example Amazon product URL
        const message = ` Hello, this is react native!✡️✡️✡️
         Check out this amazing product on Amazon: ${dynamicLink}`;
        const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
        Linking.openURL(whatsappUrl).catch((err) => {
            Alert.alert('Error', 'WhatsApp could not be opened.');
            console.error('An error occurred', err);
        });
    };
    useEffect(() => {
        requestNotificationPermission();
        createNotificationChannel();
    }, []);

    const requestNotificationPermission = async () => {
        if (Platform.OS === 'android' && Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
                {
                    title: 'Notification Permission',
                    message: 'This app needs notification permissions to send you alerts.',
                    buttonNeutral: 'Ask Me Later',
                    buttonNegative: 'Cancel',
                    buttonPositive: 'OK',
                }
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                console.warn('Notification permission denied');
            }
        }
    };

    const createNotificationChannel = () => {
        PushNotification.createChannel(
            {
                channelId: "local-message",
                channelName: "Local Message",
                importance: 4,
                vibrate: true,
            },
            (created) => console.log(`createChannel returned '${created}'`)
        );
    };

    const LocalNotification = () => {
        PushNotification.localNotification({
            channelId: "local-message",
            title: "Local Notification",
            message: "This is a test notification! from react native",
            playSound: true,
            soundName: "default",
            importance: "high",
            vibrate: true,
        });
    };

    const renderAppUser = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require('../assest/images/farmer.png')}
                />
            </View>
            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('AppUserView', { id: item.id })}>
                    <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="eye" size={24} color="black" />
                        <Text>View</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate('AppUserEdit', { id: item.id })}>
                    <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="pencil" size={24} color="black" />
                        <Text>Edit</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={styles.iconContainer}>
                <TouchableOpacity onPress={() => handleShare()}>
                    <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="share-variant" size={24} color="black" />
                        <Text>Share</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleWhatsAppShare}>
                    <View style={styles.iconTextContainer}>
                        <MaterialCommunityIcons name="whatsapp" size={24} color="green" />
                        <Text>WhatsApp</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.details}>
                <View >
                    <Text style={styles.name} >{item.name}</Text>
                    <Text style={styles.name} >{item.role}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1} >{item.emailId}</Text>
            </View>
        </View>
    );

    return (
        <><View style={styles.con}>
            <FlatList
                data={appUsers}
                renderItem={renderAppUser}
                numColumns={2} />
        </View><View style={{ justifyContent: 'center', alignItems: 'center' }}>
                <Text>Push Notification!!</Text>
                <Button title={'Click Here'} onPress={LocalNotification} />
            </View></>
    );
};

const styles = StyleSheet.create({
    con: {
        flex: 1,
        padding: 20,
    },
    card: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Color.border,
        borderStyle: 'solid',
        backgroundColor: '#ffffff',
        margin: 5,
        width: '47.5%',
        gap: 10,
    },
    imageContainer: {
        height: 100,
        alignSelf: 'stretch',
        justifyContent: 'center',
        zIndex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    details: {
        padding: 20,
        paddingTop: 0,
    },
    name: {
        textAlign: 'left',
        fontFamily: FontFamily.poppinsMedium,

    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // marginLeft: 10,
        paddingHorizontal: 10,
    },
    iconTextContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },

});

export default Home;

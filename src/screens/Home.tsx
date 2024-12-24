import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { fetchAppUsers } from '../services/appUser';
import { Color, FontFamily } from '../GlobalStyles';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { Icon } from 'react-icons-kit';
// import { eye } from 'react-icons-kit/icomoon/eye';
// import { pencil } from 'react-icons-kit/icomoon/pencil';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Home'>;


const Home = () => {
    const navigation = useNavigation<NavigationProps>();
    const [appUsers, setAppUsers] = useState<any>();

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
          .then((res:any) => {
            console.log('Share Success:', res);
          })
          .catch((err:any) => {
            if (err && err.message) {
              console.error('Share Error:', err.message);
            }
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
                    {/* <Icon icon={eye} size={24} style={styles.icon} /> */}
                    <Text>
                        View
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('AppUserEdit', { id: item.id })}>
                    {/* <Icon icon={pencil} size={24} style={styles.icon} /> */}
                    <Text>
                        Edit
                    </Text>
                </TouchableOpacity>
            </View>
                <TouchableOpacity onPress={() => handleShare()}>
                    {/* <Icon icon={pencil} size={24} style={styles.icon} /> */}
                    <Text>
                        share
                    </Text>
                </TouchableOpacity>
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
        <View style={styles.con} >
            <FlatList
                data={appUsers}
                renderItem={renderAppUser}
                numColumns={2}
            />
        </View>
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
        marginLeft: 10,
    },
    icon: {
        color: 'green',
    },

});

export default Home;

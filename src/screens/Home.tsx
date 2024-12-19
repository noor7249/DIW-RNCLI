import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { fetchAppUsers } from '../services/appUser';
import { Color, FontFamily } from '../GlobalStyles';


const Home = () => {
    const [appUsers, setAppUsers] = useState<any>();

    useEffect(() => {
        fetchAppUsers().then(data => {
            console.log(data);
            setAppUsers(data);
        }).catch(er => {
            console.log(er);

        })

    }, []);

    const renderAppUser = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require('../assest/images/farmer.png')}
                />
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
});

export default Home;

import React, { useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { fetchBillingAddress, fetchBuyOrderAddress } from '../services/BillingAddress';

export default function List() {
    const [appUserId, setAppUserId] = useState<any>('');
    const [UserId, setUserId] = useState<any>('');
    const [firstName, setFirstName] = useState<any>('');
    const [addresslist, setAddresslist] = useState<any>([]);
    const [buyOrder, setBuyOrder] = useState([]);
    const [billingAddress, setBillingAddress] = useState([]);

    const fetchAddresses = async () => {
        try {
            console.log('appUserId:', appUserId);
            const res = await fetchBillingAddress(appUserId, 'val');
            console.log('res:', res);
            setAddresslist(res);
        } catch (error) {
            console.error('Error fetching billing addresses:', error);
        }
    };

    const fetchBuyAddresses = async () => {
        try {
            console.log('appUserId:', appUserId);
            const res = await fetchBuyOrderAddress(UserId, firstName);
            console.log('res:', res);
            setBillingAddress(res.billingAddress);
            setBuyOrder(res.buyOrder);
        } catch (error) {
            console.error('Error fetching billing addresses:', error);
        }
    };

    const renderAddressItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
        </View>
    );

    const renderBillingAddressItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.title}>Name: {item.name}</Text>
            <Text>Email: {item.emailId}</Text>
            <Text>Mobile: {item.mobile}</Text>
            <Text>Address: {item.address}, {item.city}, {item.state}, {item.pinCode}</Text>
        </View>
    );

    const renderBuyOrderItem = ({ item }: any) => (
        <View style={styles.card}>
            <Text style={styles.title}>Order ID: {item.orderId}</Text>
            <Text>Order Status: {item.orderStatus}</Text>
            <Text>City: {item.billingCity}</Text>
            <Text>State: {item.billingState}</Text>
            <Text>Total Amount: ₹{item.orderTotalAmt}</Text>
        </View>
    );

    return (
        <ScrollView>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={appUserId}
                    onChangeText={(text) => setAppUserId(text)}
                    placeholder="Enter User ID"
                    keyboardType="default"
                    maxLength={100} />
                <TouchableOpacity style={styles.button} onPress={fetchAddresses}>
                    <Text style={styles.buttonText}>Get</Text>
                </TouchableOpacity>

                <FlatList
                    data={addresslist}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAddressItem}
                    contentContainerStyle={styles.list} />
            </View>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    value={UserId}
                    onChangeText={(text) => setUserId(text)}
                    placeholder="Enter User ID"
                    keyboardType="default"
                    maxLength={100} />
                <TextInput
                    style={styles.input}
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                    placeholder="Enter User name"
                    keyboardType="default"
                    maxLength={100} />
                <TouchableOpacity style={styles.button} onPress={fetchBuyAddresses}>
                    <Text style={styles.buttonText}>Get</Text>
                </TouchableOpacity>

                <Text style={styles.heading}>Billing Address</Text>
                <FlatList
                    data={billingAddress}
                    renderItem={renderBillingAddressItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                />

                <Text style={styles.heading}>Buy Orders</Text>
                <FlatList
                    data={buyOrder}
                    renderItem={renderBuyOrderItem}
                    keyExtractor={(item) => item.id.toString()}
                    style={styles.list}
                />

            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 10,
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    list: {
        marginTop: 20,
    },
    card: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#555',
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

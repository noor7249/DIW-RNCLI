import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
// import { useLinkTo, useRoute } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Color, FontFamily } from '../GlobalStyles';
// import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { getByIdBillingAddres, addBillingAddress,UpdateBillingAddress } from '../services/BillingAddress';







export default function Add() {
    const route = useRoute<any>(); // Access the route prop
    const { id } = route.params || {};
    const [addressValues, setaddressValues] = useState({
        id: '',
        name: '',
        firstName: '',
        lastName: '',
        emailId: '',
        mobile: '',
        address: '',
        addressLine2: '',
        pinCode: '',
        state: '',
        district: '',
        city: '',
        isDefaultAddress: false,

    });

    useEffect(() => {
        if (id) {
            const fetchData = async () => {
                try {
                    const addressResponse = await getByIdBillingAddres(id);
                    console.log('address', addressResponse);
                    if (addressResponse && addressResponse.length > 0) {
                        const address = addressResponse[0];
                        setaddressValues({
                            id: id,
                            firstName: address.firstName,
                            lastName: address.lastName,
                            emailId: address.emailId,
                            mobile: address.mobile,
                            address: address.address,
                            addressLine2: address.addressLine2,
                            pinCode: address.pinCode,
                            state: address.state,
                            district: address.district,
                            city: address.city,
                            isDefaultAddress: address.isDefaultAddress,
                            name: '',
                        });
                    } else {
                        console.warn('No address found');
                    }
                } catch (error) {
                    console.error('Error fetching billing address:', error);
                }
            };

            fetchData();

        }
    }, [id]);







    const save = async () => {


        try {
            addressValues.name = addressValues.firstName + ' ' + addressValues.lastName;
            const response = await addBillingAddress(addressValues);
        } catch (error) {
            console.error('not add', error);
        }
    }

    // 

    const update = async () => {

        try {
            addressValues.name = addressValues.firstName + ' ' + addressValues.lastName;
            const response = await UpdateBillingAddress(addressValues);
        } catch (error) {
            console.error('not update', error);
        }


    }

    const handelSave = () => {
        if (id) {
            update();
        }
        else {
            save();
        }
    };


    const handleFirstNameChange = (text: string) => {
        setaddressValues({ ...addressValues, firstName: text });


    };

    const handleLastNameChange = (text: string) => {
        setaddressValues({ ...addressValues, lastName: text });
    };

    const handleEmailChange = (text: string) => {
        setaddressValues({ ...addressValues, emailId: text });
    };

    const handleMobileChange = (text: string) => {
        setaddressValues({ ...addressValues, mobile: text });

    };

    const handlAdd1Change = (text: string) => {
        setaddressValues({ ...addressValues, address: text });


    };

    const handlAdd2Change = (text: string) => {
        setaddressValues({ ...addressValues, addressLine2: text });

    };

    const handlPinCodeChange = (text: string) => {

        setaddressValues({ ...addressValues, pinCode: text });

    };

    const handlStateChange = (text: string) => {
        setaddressValues({ ...addressValues, state: text });


    };

    const handlDistrictChange = (text: string) => {
        setaddressValues({ ...addressValues, district: text });

    };

    const handlCityChange = (text: string) => {
        setaddressValues({ ...addressValues, city: text });

    };



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.AddressEdit}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>First Name</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.firstName}
                            onChangeText={handleFirstNameChange}
                            placeholder="First Name"
                            keyboardType="default"
                            maxLength={100} />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Last Name</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.lastName}
                            onChangeText={handleLastNameChange}
                            placeholder="Last Name"
                            keyboardType="default"
                            maxLength={100} />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email Id</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.emailId}
                            onChangeText={handleEmailChange}
                            placeholder="Email Id"
                            keyboardType="email-address"
                            maxLength={100} />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Mobile</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.mobile}
                            onChangeText={handleMobileChange}
                            placeholder="Mobile"
                            keyboardType="numeric"
                            maxLength={10} />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Address Line 1</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            value={addressValues.address}
                            onChangeText={handlAdd1Change}
                            placeholder="Address"
                            keyboardType="default"
                            maxLength={250}
                            multiline />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Address Line 2</Text>
                        <TextInput
                            style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                            value={addressValues.addressLine2}
                            onChangeText={handlAdd2Change}
                            placeholder="Address Line 2"
                            keyboardType="default"
                            maxLength={250}
                            multiline />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Pin Code</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.pinCode}
                            onChangeText={handlPinCodeChange}
                            // onBlur={() => {
                            //     fetchStateDistrict(addressValues.pinCode);
                            // }}
                            placeholder="Pin Code"
                            keyboardType="numeric"
                            maxLength={6}
                        // onChange={fetchStateDistrict(addressValues.pinCode)}
                        />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>State</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.state}
                            // onFocus={() => fetchStateDistrict(addressValues.pinCode)}
                            onChangeText={handlStateChange}
                            placeholder="State"
                            keyboardType="default"
                            maxLength={100}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>District</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.district}
                            onChangeText={handlDistrictChange}
                            placeholder="District"
                            keyboardType="default"
                            maxLength={100} />

                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>City</Text>
                        <TextInput
                            style={styles.input}
                            value={addressValues.city}
                            onChangeText={handlCityChange}
                            placeholder="City"
                            keyboardType="default"
                            maxLength={100} />
                    </View>
                    {/* <View style={[styles.formGroup, styles.flexFormGroup]}>
                        <CheckBox
                            checked={CheckedInstructions}
                            onPress={() => setCheckedInstructions(!CheckedInstructions)}
                            containerStyle={styles.checkboxContainer}
                        />
                        <Text style={styles.checkboxLabel}>Make Default Address</Text>
                    </View> */}
                </View>
            </ScrollView>
            <View style={styles.footer}>
                <View style={[styles.primaryBtn, !addressValues.firstName || !addressValues.lastName || !addressValues.emailId || !addressValues.mobile || !addressValues.address || !addressValues.addressLine2 || !addressValues.pinCode || !addressValues.state || !addressValues.district || !addressValues.city ? styles.buttonDisabled : styles.buttonActive]}>
                    <TouchableOpacity onPress={handelSave} disabled={!addressValues.firstName || !addressValues.lastName || !addressValues.emailId || !addressValues.mobile || !addressValues.address || !addressValues.addressLine2 || !addressValues.pinCode || !addressValues.state || !addressValues.district || !addressValues.city}>
                        <Text style={styles.btnText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>

    );
};

const styles = StyleSheet.create({
    AddressEdit: {
        padding: 20,
        backgroundColor: '#fff'
    },
    formGroup: {
        marginBottom: 10,

    },
    label: {
        fontFamily: FontFamily.poppinsSemiBold,
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: Color.border,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        fontSize: 16,
        height: 50,
        marginBottom: 10,
        fontFamily: FontFamily.poppinsMedium,
    },
    flexFormGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginRight: 30,
    },
    checkboxLabel: {
        fontSize: 16,
        fontFamily: FontFamily.poppinsMedium,
    },
    primaryBtn: {
        backgroundColor: Color.primary,
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,

    },
    footer: {
        borderTopWidth: 1,
        padding: 20,
        paddingBottom: 0,
        borderColor: Color.border,
        backgroundColor: '#fff'


    },
    btnText: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
    },
    successContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: 350,
        maxWidth: 360,
        width: 360,
    },
    closeIcon: {
        position: 'absolute',
        top: 15,
        right: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#dc3545',
        borderRadius: 20,

    },
    close: {
        backgroundColor: '#dc3545',
        borderRadius: 20,

    },
    successIcon: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    successMessage: {
        fontFamily: FontFamily.poppinsSemiBold,
        fontSize: 22,
        textAlign: 'center',
    },
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    checkboxContainer: {
        padding: 0,
        margin: 0,
    },
    errorText: {
        color: '#ff0000',
        fontFamily: FontFamily.poppinsSansSerif,
        bottom: 5,
    },
    buttonActive: {
        backgroundColor: Color.primary,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },

});
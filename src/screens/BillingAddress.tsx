/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getBillingAddres, deleteBillingAddress } from '../services/BillingAddress';
import { Color, FontFamily, FontSize } from '../GlobalStyles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'BillingAddress'>;


const BillingAddress = () => {
  const navigation = useNavigation<NavigationProps>();

  const [addresslist, setAddresslist] = useState<any>();


  const fetchData = async () => {
    const addlist = await getBillingAddres();
    setAddresslist(addlist);
  };

  const renderItem = ({ item }: { item: any }) => {
    const handleEdit = () => {
      // Navigate to the Add screen with the item's id as a parameter
      // navigation.navigate('Add', { id: item.id });
    };
    return (
      <View style={[styles.billingAddressCard, item.isDefaultAddress]}>
        <View style={styles.billingCardHeader}>
          <View>
            <TouchableOpacity>
              <Text style={styles.name}>{item.name}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionIcon}>
            <TouchableOpacity onPress={handleEdit}>
              <View style={styles.icon}>
                <Text>Edit</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteBillingAddress(item)}>
              <View style={[styles.trashIcon]} >
                <Text>Delete</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.billingCardBody}>
          <Text style={styles.address}>
            {item.address ? `${item.address}, ` : ''}
            {item.city ? `${item.city}, ` : ''}
            {item.district ? `${item.district}, ` : ''}
            {item.state ? `${item.state} - ` : ''}
            {item.pinCode ? item.pinCode : ''}
          </Text>
        </View>
      </View>
    );
  };


  return (
    <View>
      <TouchableOpacity
        // eslint-disable-next-line react-native/no-inline-styles
        style={styles.button}
        onPress={() => fetchData()}

      >
        <Text>Get</Text>
      </TouchableOpacity>
      <FlatList
        data={addresslist}
        renderItem={renderItem}
      />
      {/* <View > */}
        <TouchableOpacity style={styles.addAddress}>
          <Text style={styles.addIcon} onPress={() => navigation.navigate('Add')}>
            +
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{
          position: 'absolute',
          bottom: 20,
          // right: 0,
          left: 20,
          width: 50,
          height: 50,
          // borderRadius: 25,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'black',
        }} onPress={() => navigation.navigate('List')}>
          <Text >
            get List
          </Text>
        </TouchableOpacity>
      {/* </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  billingAddressCard: {
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Color.border,
  },
  billingCardHeader: {
    borderBottomWidth: 1,
    borderBottomColor: Color.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    flex: 1,
  },
  address: {
    fontFamily: FontFamily.poppinsSansSerif,
    fontSize: 16,
    padding: 10,
    color: Color.dark,
  },
  name: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsSemiBold,
    color: Color.dark,
    left: 10,
    top: 2,

  },
  actionIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  icon: {
    right: 20,
  },
  trashIcon: {
    right: 5,

  },
  billingCardBody: {
    padding: 10,
  },
  noProductFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCenter: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  primaryBtn: {
    backgroundColor: Color.primary,
    borderWidth: 1,
    borderColor: Color.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    width: '100%',
  },
  addAddress: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Color.primary,
  },
  addIcon: {
    fontSize: 24,
    color: '#3f51b5',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
  noFoundImage: {
    width: 300,
    height: 300,

  },
  goToHomeText: {
    fontSize: FontSize.size_xs,
    fontFamily: FontFamily.poppinsSansSerif,
    textAlign: 'center',
    fontWeight: '500',
    color: '#ffffff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },

});

export default BillingAddress;

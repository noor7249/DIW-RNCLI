import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Splash'>;

const { width, height } = Dimensions.get('window');

const Splash = () => {
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    // Navigate to Login after 3 seconds
    const timeout = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timeout); // Clear timeout if component unmounts
  }, [navigation]);

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assest/lottiefiles/Animation - 1735041427600.json')}
        style={styles.lottie}
        autoPlay
        // loop={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    // borderWidth: 1,
    // resizeMode:'contain',

  },
  lottie: {
    width: width + 10,
    height: height,
    // resizeMode:'contain',
  },
});

export default Splash;

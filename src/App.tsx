import React from 'react';
import { SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import Login from './screens/login';
import Home from './screens/Home';
import Add from './screens/add';
import List from './screens/List';
import BillingAddress from './screens/BillingAddress';
import Register from './screens/register';
import AppUserView from './screens/appUser/appUserView';
import AppUserEdit from './screens/appUser/appUserEdit';
import Splash from './screens/splash';

enableScreens();

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Home: undefined;
  Add: undefined;
  List: undefined;
  BillingAddress: undefined;
  Register: undefined;
  AppUserView: { id: string | number };
  AppUserEdit: { id: string | number };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): React.JSX.Element => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    flex: 1,
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={backgroundStyle}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash" >
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="BillingAddress" component={BillingAddress} />
            <Stack.Screen name="Add" component={Add} />
            <Stack.Screen name="List" component={List} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="AppUserView" component={AppUserView} />
            <Stack.Screen name="AppUserEdit" component={AppUserEdit} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default App;

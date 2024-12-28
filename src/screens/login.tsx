/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ImageBackground, Image, TextInput, Modal, Button, Alert} from 'react-native';
import { Color, FontFamily } from '../GlobalStyles';
import appUserStore from '../store/store';
import { mobileSchema } from '../validationSchemas';
import { sendLoginOtp, validateOtplogin, loginMobile } from '../services/loginService';
// import OrImage from '../../src/assest/images/or.svg';
// import GoogleIcon from '../../src/assets/images/google-icon.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import Register from '../components/register/register';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
// import { getBillingAddres, getByIdBillingAddres, fetchBillingAddress } from '../services/BillingAddress';
import ReactNativeBiometrics from 'react-native-biometrics';



type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Login'>;


const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const Login = () => {
  const navigation = useNavigation<NavigationProps>();
  const [step, setStep] = useState(0);
  const [ShowOtpScreen, setShowOtpScreen] = useState(false);
  const { AppUserValues, setAppUserValues } = appUserStore();
  const [mobileError, setMobileError] = useState<string>('');
  const [otpSent, setOtpSent] = useState(false);
  const [timerCounter, setTimerCounter] = useState(60);
  const [ErrorMsg, setErrorMsg] = useState('');
  const [errorModal, setErrorModal] = useState(false);
  const [notRegistered, setNotRegistered] = useState(false);
  const [approval, setApproval] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const rnBiometrics = new ReactNativeBiometrics();
 


  useEffect(() => {
    let timer: any;
    if (otpSent && timerCounter > 0) {
      timer = setInterval(() => setTimerCounter(timerCounter - 1), 1000);
    }
    return () => clearInterval(timer);



  }, [otpSent, timerCounter]);

  useEffect(() => {
    setStep(0);
    checkAndClearStore();
    AsyncStorage.clear();
    // handleBiometricAuthentication();

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      checkAndClearStore();
    }, [])
  );





  // useEffect(() => {


  //   fetchData(); // Call the async function
  // }, []);

  // const fetchData = async () => {
  //   try {
  //     console.log('call');
  //     getBillingAddres()
  //       .then((res) => console.log('res', res))
  //       .catch((err) => console.error('Error in getBillingAddress:', err));

  //     getByIdBillingAddres()
  //       .then((rest) => console.log('rest', rest))
  //       .catch((err) => console.error('Error in getByIdBillingAddress:', err));

  //     fetchBillingAddress(1199, 'val')
  //       .then((restt) => console.log('restt', restt))
  //       .catch((err) => console.error('Error in fetchBillingAddress:', err));
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //   }
  // };


  const checkBiometricAvailability = () => {
    rnBiometrics.isSensorAvailable().then(({ available, biometryType }) => {
      if (available) {
        setIsBiometricSupported(true);
        console.log(`${biometryType} is supported.`);
      } else {
        setIsBiometricSupported(false);
        console.log('Biometrics not supported.');
      }
    });
  };

  // Function to handle biometric authentication
  const handleBiometricAuthentication = () => {
    rnBiometrics.simplePrompt({ promptMessage: 'Authenticate with Biometrics' })
      .then((result) => {
        if (result.success) {
          Alert.alert('Authentication Successful');
          // navigation.navigate('Home');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          Alert.alert('Authentication Failed');
        }
      })
      .catch((error) => {
        console.log('Authentication error:', error);
        Alert.alert('Authentication Failed');
      });
  };

  // Check biometric availability when the component mounts
  useEffect(() => {
    checkBiometricAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBiometricSupported]);

  const checkAndClearStore = () => {
    setMobileError('');
    const { AppUserValues, setAppUserValues } = appUserStore.getState();


    const hasValues = Object.values(AppUserValues).some(
      (value) => value !== '' && value !== null
    );

    if (hasValues) {

      setAppUserValues({
        id: '',
        name: '',
        firstName: '',
        lastName: '',
        mobile: '',
        mobileVerified: '',
        emailId: '',
        emailVerified: '',
        shopName: '',
        state: '',
        district: '',
        address: '',
        addressLine: '',
        verifyShop: '',
        gst: '',
        gstCertificate: '',
        photoShopFront: '',
        isActive: '',
        isAdmin: '',
        hasImpersonateAccess: '',
        role: '',
        roleLabel: '',
        publish: '',
        publishLabel: '',
        pinCode: '',
      });
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '')) {
      validateOtpLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp]);





  const handleMobileChange = (text: string) => {
    setAppUserValues({ mobile: text });
    const result = mobileSchema.safeParse(text);

    if (result.success) {
      setMobileError('');
    } else {
      setMobileError(result.error.errors[0].message);
    }

  };

  const sendOtpLogin = async () => {
    // setLoader(true)
    if (AppUserValues.mobile.length === 10) {
      try {
        const response = await sendLoginOtp(AppUserValues.mobile);
        console.log('response',response);
        if (response === 'OTP sent') {
          setOtpSent(true);
          setTimerCounter(60);
          setStep(1);
          setShowOtpScreen(true);
        } else if (response === 'Approval Pending') {
          setErrorModal(true);
          setApproval(true);
          setNotRegistered(false);

        } else if (response === 'Not Register') {
          setErrorModal(true);
          setNotRegistered(true);
          setApproval(false);
        }
        // setLoader(false)
      } catch (error) {
        console.error('Error sending OTP:', error);
      }
    } else {
      console.error('Invalid mobile number');
    }


  };


  const formatMobileNumber = (number: any) => {
    if (number.length < 10) {
      return number;
    }
    const start = number.slice(0, 4);
    const end = number.slice(-2);
    return `${start} XXXX ${end}`;
  };

  const inputRefs: React.RefObject<TextInput>[] = [
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
    useRef<TextInput>(null),
  ];

  const handleChangeText = (index: number, text: string) => {
    if (/^\d*$/.test(text)) {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      if (text.length === 1 && index < 3) {
        if (inputRefs[index + 1]?.current !== null) {
          inputRefs[index + 1]?.current?.focus();
        }
      } else if (text === '' && index > 0) {
        if (inputRefs[index - 1]?.current !== null) {
          inputRefs[index - 1]?.current?.focus();
        }
      }
    }
  };

  const handleKeyPress = (index: number, e: { nativeEvent: { key: string } }) => {
    if (e.nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
      inputRefs[index - 1]?.current?.focus();
    }
  };


  const validateOtpLogin = async () => {
    if (otp.every(num => num !== '') && AppUserValues.mobile.length === 10) {
      const otpString = otp.join('');

      try {
        const response = await validateOtplogin(AppUserValues.mobile, otpString);
        const [status, msg] = response.split(':');
        console.log('validateOtpLogin',response);
        if (status === 'success') {
          if (msg === 'Not Register') {
            // setLoader(false);
            setErrorMsg('User Not Exists');
            console.error('User Not Exists');
          } else {
            await login();
            setShowOtpScreen(false);
            setAppUserValues({ mobile: '' });
            setOtp(['', '', '', '']);
            setErrorModal(false);
            setNotRegistered(false);
            setApproval(false);
          }
        } else {
          // setOtpFail(true);
          // setLoader(false);
        }
      } catch (error) {
        // setLoader(false);
        console.error('Error validating OTP:', error);
      }
    }
  };

  const login = async () => {
    // setLoader(true);

    try {
      const response = await loginMobile(AppUserValues.mobile, otp.join(''));
      // const response = await loginMobile("8308698826", '9999');
      console.log('response',response);
      if (response === 'Not Register') {
        // alert('User Not Exists');
      } else {
        await storeLoginData(response);
        // navigation.navigate('Home');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      // setLoader(false);
      setTimeout(() => {
        setStep(0);
      }, 5000);
    }
  };

  const storeLoginData = async (data: any) => {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
        console.log('data.token',data.token);
      }

      await Promise.all([
        data.token && AsyncStorage.setItem('token', String(data.token)),
        data.expireDate && AsyncStorage.setItem('expireDate', String(data.expireDate)),
        data.userInfo && AsyncStorage.setItem('userInfo', JSON.stringify(data.userInfo)),
      ]);

    } catch (error) {
      console.error('Error storing login data:', error);
    }
  };

  const resendOtp = () => {
    sendOtpLogin();
    setTimerCounter(60);
  };

  return (
    <>
      <ImageBackground source={require('../../src/assest/images/login-bg.jpg')} style={styles.backgroundImage}>

        {step === 0 && (<View style={styles.authSection}>
          <View style={styles.authHeader}>
            <View style={styles.logo}>
              <Image
                source={require('../../src/assest/images/logo.png')}
                style={styles.logoImage}
                resizeMode="contain" />
            </View>
            <View style={styles.heading}>
              <Text style={styles.headingText}>Get Started with your</Text>
              <Text style={styles.headingTitle}>Mobile Number</Text>
              <Text style={styles.headingSubtitle}>
                An OTP would be delivered to your phone via Text or WhatsApp Message
              </Text>
            </View>
          </View>

          <View style={styles.authForm}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mobile No.</Text>
              <View style={styles.mobileInput}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                  style={styles.formControl}
                  keyboardType="numeric"
                  placeholder=""
                  maxLength={10}
                  value={AppUserValues.mobile}
                  onChangeText={handleMobileChange} />
              </View>
              {mobileError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
            </View>
            <TouchableOpacity
              style={[styles.button, styles.buttonWide, !!mobileError || AppUserValues.mobile.length <= 9 ? styles.buttonDisabled : styles.buttonActive]}
              // onPress={()=>(navigation.navigate('Splash'))}
              onPress={sendOtpLogin}
              // onPress={login}

            >
              <Text style={styles.buttonText}>Get OTP</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            style={{ borderWidth: 1 }}
            onPress={() => fetchData()}

          >
            <Text style={styles.buttonText}>Get</Text>
          </TouchableOpacity> */}
          </View>

          <View style={styles.authFooter}>
            {/* <OrImage
          style={styles.orImage}
        /> */}
            <Image
              source={require('../../src/assest/images/or.png')}
              style={styles.orImage}
              resizeMode="contain" />
            <TouchableOpacity style={[styles.googleBtn]}>
              {/* <GoogleIcon
          style={styles.googleIcon}
        /> */}
              <Image
                source={require('../../src/assest/images/google-icon.png')}
                style={styles.googleIcon}
                resizeMode="contain" />
              <Text style={styles.googleBtnText} allowFontScaling={false}>Continue with Google</Text>
            </TouchableOpacity>
            <Text style={styles.footerText}>
              Don't have an account?{' '}
              <Text style={[styles.textPrimary, styles.registerLink]} onPress={() => { checkAndClearStore(); navigation.navigate('Register'); }}>
                Register Now
              </Text>
            </Text>
          </View>
        </View>)}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Login Page</Text>
          {isBiometricSupported ? (
            <Button
              title="Biometric Login"
              onPress={handleBiometricAuthentication}
            />
          ) : (
            <Text>Biometric authentication is not supported on this device.</Text>
          )}
        </View>

        {ShowOtpScreen && step !== 2 && step === 1 && (
          <View style={styles.oauthSection}>
            <View style={styles.oauthHeader}>
              <View style={styles.oheading}>
                <Text style={styles.oheadingText}>Verify OTP</Text>
                <Text style={styles.osmallText}>
                  We have sent a code to
                </Text>
                <Text style={styles.mobileNo}>+91<Text>{formatMobileNumber(AppUserValues.mobile)}</Text></Text>
                <TouchableOpacity>
                  <Text style={styles.otextPrimary} onPress={() => setStep(0)}>Change Mobile Number</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.oauthForm}>
              <View style={styles.oformGroup}>
                <Text style={styles.label}>Enter OTP</Text>
                <View style={styles.otpScreen}>
                  <View style={styles.otpInput}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={inputRefs[index]}
                        style={[
                          styles.oformControl,
                          focusedIndex === index && styles.activeInput
                        ]}
                        keyboardType="numeric"
                        maxLength={1}
                        value={digit}
                        onChangeText={(text) => handleChangeText(index, text)}
                        onKeyPress={(e) => handleKeyPress(index, e)}
                        onFocus={() => setFocusedIndex(index)}
                        onBlur={() => setFocusedIndex(null)}
                        autoFocus={index === 0} />
                    ))}
                  </View>
                </View>
                {ErrorMsg ? (
                  <View>
                    <Text>{ErrorMsg}</Text>
                    <Text style={[styles.textPrimary, styles.registerLink]} onPress={() => setStep(0)}>
                      Register Now
                    </Text>
                  </View>
                ) : null}
              </View>
              <TouchableOpacity
                style={styles.verifyButton}
                onPress={validateOtpLogin}
                disabled={otp.some((digit) => digit === '' || timerCounter <= 0)}
              >
                <Text style={styles.verifyButtonText}>Verify</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.authFooter}>
              <Text style={styles.footerText}>Didn't receive code?{' '}
                <Text style={[styles.rtextPrimary, styles.Link]} onPress={resendOtp} disabled={timerCounter > 0}>
                  Resend
                </Text>
              </Text>
              <Text
                style={[
                  styles.rtextPrimary,
                  (timerCounter <= 20 || timerCounter <= 0) && styles.redText
                ]}
              >
                {timerCounter > 0 ? `OTP Expiring in ${timerCounter} seconds` : 'OTP expired'}
              </Text>
            </View>
          </View>
        )}

      </ImageBackground>
      {/* {step === 2 && (<Register setStep={setStep} />)} */}

      <Modal visible={errorModal} animationType="slide" transparent onRequestClose={() => setErrorModal(false)}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={() => setErrorModal(false)} style={styles.closeIcon}>
              <Icon name="close" size={22} color="#ffff" style={styles.close} />
            </TouchableOpacity>
            {/* <NotRegistered
              height={200}
              width={200} /> */}
            <Image
              source={require('../../src/assest/images/not-registered.png')}
              style={{ height: 200, width: 200 }}
              resizeMode="contain" />
            <View>
              {notRegistered && !approval && (
                <><Text style={styles.modalText}>Oops!!!</Text><Text style={styles.modalSmallText}>User not Found. Please Register!!!</Text>
                  <TouchableOpacity style={styles.modalButton} onPress={() => { setStep(2); setErrorModal(false); }}>
                    <Text style={styles.modalButtonText}>Register Now!!!</Text>
                  </TouchableOpacity></>
              )}
              {approval && !notRegistered && (
                <><Text style={styles.modalText}> Your Account Verification is Pending</Text>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal></>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: screenHeight,
    width: screenWidth,
  },
  authSection: {

    // backgroundColor: '#ffffff',
    // height: '100%',
    // minHeight: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    // flexDirection: 'column',
    // gap: 16,
    // maxWidth: 500,
    // margin: 'auto',
  },
  authHeader: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  logo: {
    height: 170,
    width: 170,
    marginBottom: -25,

  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  heading: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  headingText: {
    fontFamily: FontFamily.poppinsSansSerif,
    fontSize: 14,
    fontWeight: '400',
    textTransform: 'uppercase',
    textAlign: 'center',

  },
  headingTitle: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 16,
    textTransform: 'uppercase',
  },
  headingSubtitle: {
    fontFamily: FontFamily.poppinsSansSerif,
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
    textAlign: 'center',
  },
  highlight: {
    fontWeight: '600',
    color: '#000000',
  },
  authForm: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
    padding: 10,

  },
  formGroup: {
    width: '100%',
  },
  label:
  {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 16,
    marginBottom: 10,
  },
  mobileInput: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderColor: Color.border,
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',

  },
  countryCode: {
    fontSize: 18,
    lineHeight: 24,
    color: '#000000',
    marginRight: -15,

  },
  formControl: {
    flex: 1,
    lineHeight: 24,
    padding: 8,
    borderColor: 'rgba(0,0,0,0.0)',
    fontSize: 18,

  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonWide: {
    width: '100%',
    maxWidth: 400,
  },
  buttonActive: {
    backgroundColor: Color.primary,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  authFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  orImage: {
    width: 300,
    height: 50,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 16,
    // paddingHorizontal: 90,
    borderRadius: 8,
    borderColor: Color.border,
    borderWidth: 1,
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 23,
    height: 23,
  },
  googleBtnText: {
    fontSize: 14,
    color: '#000000',
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
    flexShrink: 1,
  },
  footerText: {
    fontFamily: FontFamily.poppinsSansSerif,
    fontSize: 16,
    lineHeight: 24,
  },
  textPrimary: {
    fontWeight: '600',
  },
  registerLink: {
    color: Color.primary,
    fontFamily: FontFamily.poppinsMedium,

  },
  oauthSection: {
    height: '100%',
    minHeight: '100%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    maxWidth: 500,
  },
  oauthHeader: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
  },
  oheading: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 6,
  },
  oheadingText: {
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: -50,
    fontFamily: FontFamily.poppinsSemiBold,

  },
  osmallText: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 18,
  },
  mobileNo: {
    fontWeight: 'bold',
    fontSize: 16,

  },
  otextPrimary: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 18,
    color: Color.primary,
    fontWeight: '400',
    marginTop: 8,
  },
  oauthForm: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  oformGroup: {
    width: '100%',
  },
  olabel: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  otpScreen: {
    width: '100%',
  },
  otpInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    width: '100%',
  },
  activeInput: {
    borderColor: 'black',
  },
  oformControl: {
    flex: 1,
    fontSize: 24,
    textAlign: 'center',
    padding: 0,
    margin: 0,
    minWidth: 60,
    maxWidth: 90,
    minHeight: 60,
    borderColor: Color.border,
    borderWidth: 1,
    borderRadius: 8,

  },
  oauthFooter: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  rtextPrimary: {
    fontWeight: '600',
    fontFamily: FontFamily.poppinsMedium,
    marginRight: 10,
  },
  redText: {
    color: 'red',
  },
  Link: {
    color: Color.primary,
    marginRight: 10,
  },
  verifyButton: {
    backgroundColor: Color.primary,
    width: '100%',
    padding: 10,
    borderRadius: 5,
  },
  verifyButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#ff0000',
    marginTop: 8,
    fontFamily: FontFamily.poppinsSansSerif,

  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    paddingBottom: 20,
    maxHeight: 370,
    maxWidth: 360,
    width: 360,
  },
  modalIcon: {
    width: 200,
    height: 200,
    // marginBottom: 10,
    // marginLeft: 110,
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
  modalText: {
    fontFamily: FontFamily.poppinsSemiBold,
    fontSize: 22,
    textAlign: 'center',
  },
  modalSmallText: {
    fontFamily: FontFamily.poppinsSansSerif,
    fontSize: 16,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: Color.primary,
    padding: 15,
    // height:40,
    width: 300,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,

  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,
  },
});

export default Login;

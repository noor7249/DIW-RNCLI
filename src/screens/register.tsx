/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import { useLinkTo, useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, StyleSheet, Dimensions, ScrollView, ImageBackground, Modal } from 'react-native';
import { CheckBox } from 'react-native-elements';
import { sendOtp, validateOtplogin, registerUser, loginMobile } from '../services/loginService'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Color, FontFamily } from '../GlobalStyles';
// import ShopVerification from '../components/register/shopVerification';
import appUserStore from '../store/store';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { mobileSchema, nameSchema } from '../validationSchemas';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';

// import OrImage from '../../assets/images/or.svg';
// import GoogleIcon from '../../assets/images/google-icon.svg';
// import Farmer from '../../assets/images/farmer.svg';
// import Dealer from '../../assets/images/dealer.svg';
// import SuccessIcon from '../../assets/images/success-icon.svg';
// import Loading from '../loding';
// import { router } from 'expo-router';
// import { useSignUp, useAuth } from '@clerk/clerk-expo'
// import { useRouter } from 'expo-router'









const { height: screenHeight, width: screenWidth } = Dimensions.get('window');
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const Register = () => {
    const navigation = useNavigation<NavigationProps>();
    const [selectedProfile, setSelectedProfile] = useState<string>('farmer');
    const [otp, setOtp] = useState(['', '', '', '']);
    const [CheckedInstructions, setCheckedInstructions] = useState(false);
    const [ShowOtpScreen, setShowOtpScreen] = useState(false);
    const [farmer, setfarmer] = useState('');
    const [delar, setdelar] = useState('');
    const [ShowVerification, setShowVerification] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timerCounter, setTimerCounter] = useState(60);
    const [otpFail, setOtpFail] = useState(false);
    const [passwordStatus, setPasswordStatus] = useState(false);
    const [registerFarmer, setRegisterFarmer] = useState(false);
    const [registerDealer, setRegisterDealer] = useState(false);
    const [dialog, setDialog] = useState(false);
    const [Otpres, setOtpres] = useState('');
    const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
    const { AppUserValues, setAppUserValues } = appUserStore();
    const [nameError, setNameError] = useState<string>('');
    const [mobileError, setMobileError] = useState<string>('');
    const [loader, setLoader] = useState(false);

    const changeProfile = (profile: string) => {
        setSelectedProfile(profile);
    };

    useEffect(() => {
        let timer: any;
        if (otpSent && timerCounter > 0) {
            timer = setInterval(() => setTimerCounter(timerCounter - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [otpSent, timerCounter]);

    useEffect(() => {
        if (otp.every(digit => digit !== '')) {
            verifyOtp();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [otp]);

    useEffect(() => {
        let timer: any;
        if (registerDealer) {
            timer = setTimeout(() => {
                setRegisterFarmer(false);
                setRegisterDealer(false);
                setDialog(false);
                setCheckedInstructions(false);
            }, 3000);
        } else if (registerFarmer) {
            timer = setTimeout(() => {
                setRegisterFarmer(false);
                setRegisterDealer(false);
                setDialog(false);
                setStep(0)
                setCheckedInstructions(false);
            }, 3000);

        }
        return () => clearTimeout(timer);
    }, [registerFarmer, registerDealer]);


    const sendOtpLogin = () => {
        setLoader(true);

        if (AppUserValues.mobile.length !== 10) {
            console.error('Invalid mobile number');
            setLoader(false);
            return;
        }

        sendOtp(AppUserValues.mobile)
            .then((response) => {
                if (response === 'Register-Farmer' || response === 'Register-Dealer') {
                    setDialog(true);
                    setOtpres(response);
                }

                if (response === 'OTP sent') {
                    setOtpSent(true);
                    setTimerCounter(60);
                    setShowOtpScreen(true);
                }
            })
            .catch((error) => {
                console.error('Error sending OTP:', error);
            })
            .finally(() => {
                setLoader(false);
            });
    };

    const verifyOtp = () => {
        setLoader(true);

        const otpCode = otp.join('');

        validateOtplogin(AppUserValues.mobile, otpCode)
            .then((response) => {
                if (response === 'success') {
                    return register();
                } else {
                    setOtpFail(true);
                }
            })
            .catch((error) => {
                console.error('Error verifying OTP:', error);
                setOtpFail(true);
            })
            .finally(() => {
                setLoader(false);
            });
    };

    const register = () => {
        setLoader(true);

        const names = AppUserValues.name.split(' ');
        AppUserValues.firstName = names[0];
        AppUserValues.lastName = names.slice(1).join(' ');

        const model = {
            district: 0,
            emailVerified: false,
            firstName: names[0],
            hasImpersonateAccess: true,
            isActive: true,
            isAdmin: false,
            lastName: names.slice(1).join(' '),
            mobile: AppUserValues.mobile,
            name: AppUserValues.name,
            publish: selectedProfile === 'farmer' ? 'Submit' : 'Draft',
            publishLabel: selectedProfile === 'farmer' ? 'Submit' : 'Draft',
            role: selectedProfile === 'dealer' ? 'Dealer' : 'Farmer',
            roleLabel: selectedProfile === 'dealer' ? 'Dealer' : 'Farmer',
            state: 0,
            emailId: '',
        };

        model.hasImpersonateAccess = selectedProfile === 'dealer';
        registerUser(model)
            .then((data) => {

                if (data === 'success') {
                    return login();
                }
            })
            .catch((error) => {
                console.error('Error registering user:', error);
            })
            .finally(() => {
                setPasswordStatus(false);
                setLoader(false);
            });
    };

    const login = () => {
        setLoader(true);

        loginMobile(AppUserValues.mobile, otp.join(''))
            .then((response) => {
                if (response === 'Not Register') {
                } else {
                    if (selectedProfile === 'dealer') {
                        setDialog(true);
                        setRegisterDealer(true);
                        setShowVerification(true);
                    } else if (selectedProfile === 'farmer') {
                        setDialog(true);
                        setRegisterFarmer(true);
                        navigation.navigate('Home');
                    }

                    storeLoginData(response);

                }
            })
            .catch((error) => {
                console.error('Error logging in:', error);
            })
            .finally(() => {
                setLoader(false);
            });
    };


    const storeLoginData = (data: any) => {
        if (typeof data === 'string') {
            try {
                data = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing data:', parseError);
                return Promise.reject(parseError);
            }
        }

        const token = data.token ? String(data.token) : null;
        const expireDate = data.expireDate ? String(data.expireDate) : null;
        const userInfo = data.userInfo ? JSON.stringify(data.userInfo) : null;

        return Promise.all([
            token && AsyncStorage.setItem('token', token),
            expireDate && AsyncStorage.setItem('expireDate', expireDate),
            userInfo && AsyncStorage.setItem('userInfo', userInfo),
        ])
            .catch((error) => {
                console.error('Error storing login data:', error);
            });
    };


    const resendOtp = () => {
        sendOtpLogin;
        setTimerCounter(60);
    };
    const googleAuth = async () => {
        // if (!signUp) {
        //   Alert.alert('Error', 'SignUp object is undefined.')
        //   return
        // }

        // try {
        //   const { createdSessionId } = await signUp.create({
        //     strategy: 'oauth_google',
        //     redirectUrl: 'your-app://callback', // Replace with your app's callback URL
        //   })
        //   if (createdSessionId) {
        //     Alert.alert('Success', 'You are now registered with Google!')
        //     // Log user data after successful authentication
        //     // navigation.replace('/');  // Redirect to home page after successful login
        //   } else {
        //     Alert.alert('Error', 'Google authentication failed.')
        //   }
        // } catch (error: any) {
        //   console.error('Google authentication error:', error)
        //   Alert.alert('Error', error.message || 'An error occurred during authentication.')
        // }
    };

    const deviceWidth = Dimensions.get('window').width;
    const imageWidth = deviceWidth * 0.4;
    const imageHeight = (imageWidth * 420) / 880;

    const linkTo = useLinkTo();
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

    const formatMobileNumber = (number: any) => {
        if (number.length < 10) {
            return number;
        }
        const start = number.slice(0, 4);
        const end = number.slice(-2);
        return `${start}XXXX${end}`;
    };

    const handleNameChange = (text: string) => {
        setAppUserValues({ ...AppUserValues, name: text });

        const result = nameSchema.safeParse(text);
        if (!result.success) {
            setNameError(result.error.errors[0].message);
        } else {
            setNameError('');
        }
    };


    const handleMobileChange = (text: string) => {
        setAppUserValues({ ...AppUserValues, mobile: text });


        const result = mobileSchema.safeParse(text);
        if (!result.success) {
            setMobileError(result.error.errors[0].message);
        } else {
            setMobileError('');
        }
    };

    // if (loader) {
    //     return <Loading />
    // }



    return (

        <>
            {/* {ShowVerification && (
                <ShopVerification setStep={setStep} />
            )} */}

            {ShowOtpScreen && !ShowVerification ? (<ImageBackground source={require('../assest/images/login-bg.jpg')} style={styles.backgroundImage}>
                <View style={styles.oauthSection}>
                    <View style={styles.oauthHeader}>
                        <View style={styles.oheading}>
                            <Text style={styles.oheadingText}>Verify OTP</Text>
                            <Text style={styles.osmallText}>
                                We have sent a code to
                            </Text>
                            <Text style={styles.mobileNo}>+91<Text>{formatMobileNumber(AppUserValues.mobile)}</Text></Text>
                            <TouchableOpacity>
                                <Text style={styles.otextPrimary} onPress={() => { setShowOtpScreen(false); }}>Change Mobile Number</Text>
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
                                                focusedIndex === index && styles.activeInput,
                                            ]}
                                            keyboardType="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChangeText={(text) => handleChangeText(index, text)}
                                            onKeyPress={(e) => handleKeyPress(index, e)}
                                            onFocus={() => setFocusedIndex(index)}
                                            onBlur={() => setFocusedIndex(null)} />
                                    ))}
                                </View>
                            </View>

                        </View>
                        <TouchableOpacity
                            style={styles.verifyButton}
                            onPress={() => verifyOtp()}
                            disabled={otp.some((digit) => digit === '' || timerCounter <= 0)}
                        >
                            <Text style={styles.verifyButtonText}>Verify</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.oauthFooter}>
                        <Text style={styles.footerText}>Didn't receive code?{' '}
                            <Text style={[styles.rtextPrimary, styles.Link]} onPress={resendOtp}>
                                Resend
                            </Text>
                        </Text>
                        <Text
                            style={[
                                styles.rtextPrimary,
                                (timerCounter <= 20 || timerCounter <= 0) && styles.redText,
                            ]}
                        >
                            {timerCounter > 0 ? `OTP Expiring in ${timerCounter} seconds` : 'OTP expired'}
                        </Text>
                    </View>
                </View>
            </ImageBackground>) : !ShowVerification && (

                <View style={styles.Register}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.authHeader}>
                            <View style={[styles.logo, { width: imageWidth, height: imageHeight }]}>
                                <Image source={require('../assest/images/logo.png')} style={styles.logoImage} />
                            </View>
                            <View style={styles.heading}>
                                <Text style={styles.spanText}>New Account</Text>
                                <Text style={styles.headingText}>Register</Text>
                                <Text style={styles.smallText}>An OTP would be delivered to your phone via Text or WhatsApp Message</Text>
                            </View>
                        </View>
                        <View style={styles.authForm}>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Select Your Profile</Text>
                                <View style={styles.selectRegisterProfile}>
                                    <TouchableOpacity style={[styles.selectProfile]} onPress={() => { changeProfile('farmer'); setfarmer('farmer'); }}>
                                        <View style={[styles.avatar, selectedProfile === 'farmer' && styles.active]}>
                                            <Image source={require('../assest/images/farmer.png')} style={styles.avatarImage} />
                                            {/* <Farmer
                                                    style={styles.avatarImage}
                                                    height={'100%'}
                                                    width={'100%'}
                                                /> */}
                                            {selectedProfile === 'farmer' && (
                                                <View style={styles.iconContainer}>
                                                    <Icon name="check-circle" size={20} color="green" />
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.name}>Farmer</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={[styles.selectProfile]} onPress={() => { changeProfile('dealer'); setdelar('dealer'); }}
                                    >
                                        <View style={[styles.avatar, selectedProfile === 'dealer' && styles.active]}>
                                            <Image source={require('../assest/images/dealer.png')} style={[styles.avatarImage]} />
                                            {/* <Dealer
                                                    style={styles.avatarImage}
                                                    height={'100%'}
                                                    width={'100%'}
                                                /> */}
                                            {selectedProfile === 'dealer' && (
                                                <View style={styles.iconContainer}>
                                                    <Icon name="check-circle" size={20} color="green" />
                                                </View>
                                            )}
                                        </View>
                                        <Text style={styles.name}>Dealer</Text>
                                    </TouchableOpacity>


                                </View>
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={AppUserValues.name}
                                    onChangeText={handleNameChange} placeholder="Name"
                                    maxLength={50} />
                                {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    value={AppUserValues.mobile}
                                    onChangeText={handleMobileChange} placeholder="Mobile"
                                    keyboardType="numeric"
                                    maxLength={10} />
                                {nameError ? <Text style={styles.errorText}>{mobileError}</Text> : null}
                            </View>
                            <View style={styles.inputGroup}>
                                <CheckBox
                                    checked={CheckedInstructions}
                                    onPress={() => setCheckedInstructions(!CheckedInstructions)}
                                    containerStyle={styles.checkboxContainer} />
                                <Text style={styles.checkboxText}>
                                    By continuing you are agreeing to Drip Irrigation World's
                                    <Text style={[styles.textPrimary, styles.checkboxText]} onPress={() => linkTo('/(termscondition)')}> Terms of Use </Text>
                                    <Text> and </Text>
                                    <Text style={[styles.textPrimary, styles.checkboxText]} onPress={() => linkTo('/(privacypolicy)')}> Privacy Policy</Text>
                                </Text>
                            </View>
                            <TouchableOpacity

                                style={[styles.button, styles.buttonWide, !!mobileError || !!nameError || AppUserValues.mobile.length <= 9 || !AppUserValues.name || !CheckedInstructions ? styles.buttonDisabled : styles.buttonActive]}
                                onPress={sendOtpLogin}
                                disabled={!!nameError || !!mobileError || !AppUserValues.name || !AppUserValues.mobile || !CheckedInstructions}

                            >
                                <Text style={styles.buttonText}>Get OTP</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity
                                    // style={[styles.btn, styles.primaryBtn]}
                                    style={[styles.button, styles.buttonWide, mobileError && nameError && !selectedProfile ? styles.buttonDisabled : styles.buttonActive]}
                                    onPress={() => setShowVerification(true)}
                                >
                                    <Text style={styles.buttonText}>Get OTP</Text>
                                </TouchableOpacity> */}

                        </View>
                        <View style={styles.authFooter}>
                            <View style={styles.or}>
                                {/* <OrImage
                                    style={styles.orImage}
                                /> */}
                                <Image
                                    source={require('../assest/images/or.png')}
                                    style={styles.orImage}
                                    resizeMode="contain" />
                            </View>
                            <TouchableOpacity style={styles.googleBtn} onPress={googleAuth}>
                                {/* <GoogleIcon
                                    style={styles.googleIcon}
                                /> */}
                                <Image
                                    source={require('../assest/images/google-icon.png')}
                                    style={styles.googleIcon}
                                    resizeMode="contain" />
                                <Text style={styles.googleBtnText}>Continue with Googleeee</Text>
                            </TouchableOpacity>

                            <View style={{ marginTop: 20, paddingBottom: 40 }}>
                                <Text style={styles.footerText}>
                                    Already have an account{' '}
                                    <Text style={[styles.textPrimary, styles.loginLink]} onPress={() => navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Login' }],
                                    })}>Login</Text>
                                </Text>
                            </View>
                        </View>

                    </ScrollView >
                </View >

            )}
            <Modal
                visible={dialog}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setDialog(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {Otpres === 'Register-Farmer' || Otpres === 'Register-Dealer' ? (
                            <TouchableOpacity onPress={() => {
                                setDialog(false);
                                // setStep(0);
                            }} style={styles.closeIcon}>
                                <Icon name="close" size={22} color="#fff" style={styles.close} />
                            </TouchableOpacity>
                        ) : null}

                        {/* <SuccessIcon
                            height={200}
                            width={200}
                            style={styles.successIcon}
                        /> */}
                        <Image
                            source={require('../assest/images/success-icon.png')}
                            style={{ height: 200, width: 200 }}
                            resizeMode="contain" />


                        {Otpres === 'Register-Farmer' && (
                            <Text style={styles.errorMessage}>You are already register as a farmer</Text>
                        )}

                        {Otpres === 'Register-Dealer' && (
                            <Text style={styles.errorMessage}> You are already register as a Dealer</Text>

                        )}

                        {registerFarmer && (

                            <><Text style={styles.errorMessage}>Successfully Register as a farmer </Text>
                                <Text style={styles.waitMessage}>Please wait a while... </Text></>

                        )}

                        {registerDealer && (
                            <>
                                <Text style={styles.errorMessage}>Successfully Register as a Dealer </Text>
                                <Text style={styles.waitMessage}>Please wait a while... </Text>
                            </>
                        )}

                    </View>
                </View>
            </Modal>
        </>



    );
};

const styles = StyleSheet.create({
    Register: {
        height: screenHeight,
        width: screenWidth,
        paddingRight: 20,
        paddingLeft: 20,

    },
    authHeader: {
        alignItems: 'center',
        marginBottom: 15,
        textAlign: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 16,
        marginTop: 20,
    },
    logo: {
        //    paddingTop:20,
    },
    logoImage: {
        width: '100%',
        height: '100%',
    },
    heading: {
        alignItems: 'center',
        marginBottom: 0,
    },
    spanText: {
        fontWeight: '600',
        fontFamily: FontFamily.poppinsMedium,
    },
    headingText: {
        fontSize: 20,
        textTransform: 'uppercase',
        marginBottom: 10,
        fontWeight: 'bold',
        fontFamily: FontFamily.poppinsSemiBold,
    },
    smallText: {
        fontFamily: FontFamily.poppinsMedium,
        fontSize: 16,
        fontWeight: '500',
        lineHeight: 20,
        textAlign: 'center',
    },
    selectRegisterProfile: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    selectProfile: {
        fontFamily: FontFamily.poppinsSemiBold,
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    active: {
        borderColor: Color.primary,
        borderWidth: 1,
        borderRadius: 30,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        // overflow: 'hidden',
        position: 'relative',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 30,

    },
    iconContainer: {
        position: 'absolute',
        bottom: -10,
        left: '50%',
        transform: [{ translateX: -10 }],
        zIndex: 1,
    },
    checkText: {
        color: Color.primary,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
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
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginRight: 30,
    },
    checkboxContainer: {
        padding: 0,
        margin: 0,
    },
    checkboxText: {
        fontFamily: FontFamily.poppinsSansSerif,
        fontSize: 14,
        lineHeight: 20,
        flex: 1,
    },
    btn: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Color.border,
        marginBottom: 15,
    },
    primaryBtn: {
        backgroundColor: Color.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#fff',
    },
    authFooter: {
        alignItems: 'center',
        height: '100%',
        width: '100%'
    },
    or: {
        marginVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',

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
        borderRadius: 8,
        borderColor: Color.border,
        borderWidth: 1,
        width: '100%',
        justifyContent: 'center'

    },
    googleIcon: {
        width: 23,
        height: 23,
    },
    googleBtnText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        textAlign: 'center',
        fontFamily: FontFamily.poppinsMedium,
    },
    footerText: {
        fontFamily: FontFamily.poppinsSansSerif,
        fontSize: 16,
        lineHeight: 24,
    },
    textPrimary: {
        color: Color.primary,
        marginRight: 10,
        fontFamily: FontFamily.poppinsSansSerif,
    },
    loginLink: {
        color: Color.primary,
        fontFamily: FontFamily.poppinsMedium,

    },
    authForm: {
        width: '100%',
        // height: '100%',
    },
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    oauthSection: {
        // flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 16,
        height: screenHeight,
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
        // flex:1,
        // // minHeight:'100%'
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
        marginRight: 10
    },
    redText: {
        color: 'red'
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
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
    errorMessage: {
        fontFamily: FontFamily.poppinsSemiBold,
        fontSize: 22,
        textAlign: 'center',
    },
    waitMessage: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: FontFamily.poppinsSansSerif,
    },
    errorText: {
        color: '#ff0000',
        fontFamily: FontFamily.poppinsSansSerif,

    },

});

export default Register;

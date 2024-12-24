/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Color, FontFamily } from '../../GlobalStyles';
import { fetchAppUsersById, fetchEnumDetailsData } from '../../services/appUser';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
// import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import CheckBox from '@react-native-community/checkbox';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateAppUser } from '../../services/appUser';
// import { Dropdown } from 'react-native-element-dropdown';
// import FileUploadComponent from '../components/fileUpload';
// import { BASE_URL_2 } from '../../config/config';


type AppUserEditRouteProp = RouteProp<RootStackParamList, 'AppUserEdit'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'AppUserEdit'>;



const AppUserEdit = ({ route }: { route: AppUserEditRouteProp }) => {
    const navigation = useNavigation<NavigationProps>();
    const { id } = route.params;
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        id: '', name: '', firstName: '', lastName: '', mobile: '', mobileVerified: false,
        emailId: '', emailVerified: false, shopName: '', password: '',
        pincode: '', state: '', district: '', address: '', addressLine: '',
        verifyShop: '', gst: '', gstCertificate: null, photoShopFront: null, visitingCard: null, cheque: null, gstOtp: '',
        isActive: false, isAdmin: false, hasImpersonateAccess: false, photoAttachment: null, role: '', publish: '', lastLogin: '',
        defaultLanguage: '', isPremiumUser: false, totalPlot: '',
    });
    const [verifyShops, setVerifyShops] = useState([]);
    const [selectedVerifyShops, setSelectedVerifyShops] = useState<any>(null);
    const [roles, setRoles] = useState([]);
    const [selectedRoles, setSelectedRoles] = useState<any>(null);
    const [publishes, setPublishes] = useState([]);
    const [selectedPublishes, setSelectedPublishes] = useState<any>(null);
    const [fileData, setFileData] = useState<any>([]);

    // const [fileData, setFileData] = useState({
    //     gstCertificate: [],
    //     photoShopFront: [],
    //     visitingCard: [],
    //     cheque: [],
    //     photoAttachment: [],
    // });


    useEffect(() => {
        getVerifyShopsData();
    }, []);

    const getVerifyShopsData = async () => {
        try {
            const data = await fetchEnumDetailsData();
            if (data) {
                const filterShops = data.filter((a: any) => a.section === 'VerifyType');
                setVerifyShops(filterShops);
                if (formData && formData.verifyShop) {
                    const selectedList = data.filter((a: any) => a.value === formData.verifyShop);
                    if (selectedList.length) {
                        setSelectedVerifyShops(selectedList[0].value);
                    }
                }

                const filterrole = data.filter((a: any) => a.section === 'RoleType');
                setRoles(filterrole);
                if (formData && formData.role) {
                    const selectedList = data.filter((a: any) => a.value === formData.role);
                    if (selectedList.length) {
                        setSelectedVerifyShops(selectedList[0].value);
                    }
                }

                const filterpublish = data.filter((a: any) => a.section === 'PublishType');
                setPublishes(filterpublish);
                if (formData && formData.publish) {
                    const selectedList = data.filter((a: any) => a.value === appUserData.publish);
                    if (selectedList.length) {
                        setSelectedPublishes(selectedList[0].value);
                    }
                }
            } else {
                throw new Error("No data found");
            }
        } catch (error) {
            console.error("Fetch error ", error);
        }
    };

    useEffect(() => {
        getAppUsersData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getAppUsersData = async () => {
        try {
            const data = await fetchAppUsersById(id);

            setFormData({
                ...data,
                lastLogin: data.lastLogin ? data.lastLogin.slice(0, 10) : '',
            });

        } catch (error) {
            console.error('Error fetching App Users data:', error);
        }
    };
    const stepItems = ['Access Deatails', 'Shop Details', 'Shop Address', 'Verify Shop'];
    const customStyles = {
        stepIndicatorSize: 25,
        currentStepIndicatorSize: 25,
        separatorStrokeWidth: 1,
        currentStepStrokeWidth: 1,
        stepStrokeCurrentColor: Color.primary, // Current step outline
        stepStrokeWidth: 1,
        stepStrokeFinishedColor: Color.border, // Finished steps outline
        stepStrokeUnFinishedColor: Color.border, // Unfinished steps outline
        separatorFinishedColor: Color.border, // Line color between finished steps
        separatorUnFinishedColor: Color.border, // Line color between unfinished steps
        stepIndicatorFinishedColor: '#ffff', // Background color of finished steps
        stepIndicatorUnFinishedColor: '#ffff', // Background color of unfinished steps
        stepIndicatorCurrentColor: Color.primary, // Background color of current step
        stepIndicatorLabelFontSize: 12,
        currentStepIndicatorLabelFontSize: 12,
        stepIndicatorLabelCurrentColor: '#ffff', // Text color of current step
        stepIndicatorLabelFinishedColor: Color.border, // Text color of finished steps
        stepIndicatorLabelUnFinishedColor: Color.border, // Text color of unfinished steps
        labelColor: Color.border, // Text color for labels under the steps
        labelSize: 10,
        currentStepLabelColor: Color.primary,
        labelFontFamily: FontFamily.poppinsSemiBold,
        stepLabelFontFamily: FontFamily.poppinsSansSerif,
    };

    const handleNext = () => {
        setStep(step => Math.min(step + 1, stepItems?.length - 1));
    };

    const handlePrevious = () => {
        setStep(step => Math.max(step - 1, 0));
    };
    const save = async () => {
        formData.isActive === true;
        formData.mobileVerified === true;
        formData.isAdmin === true;
        formData.hasImpersonateAccess === true;
        // const payload = {
        //     name: `${formData.firstName ? ' ' + formData.firstName : ''} ${formData.lastName ? ' ' + formData.lastName : ''}`,
        //     firstName: formData.firstName,
        //     lastName: formData.lastName,
        //     mobile: formData.mobile,
        //     mobileVerified: formData.mobileVerified,
        //     emailId: formData.emailId,
        //     emailVerified: formData.emailVerified,
        //     pincode: formData.pincode,
        //     password: formData.password,
        //     state: formData.state,
        //     district: formData.district,
        //     address: formData.address,
        //     addressLine: formData.addressLine,
        //     verifyShop: formData.verifyShop,
        //     gst: formData.gst,
        //     gstCertificate: JSON.stringify(fileData.gstCertificate),
        //     photoShopFront: JSON.stringify(fileData.photoShopFront),
        //     visitingCard: JSON.stringify(fileData.visitingCard),
        //     cheque: JSON.stringify(fileData.cheque),
        //     gstOtp: formData.gstOtp,
        //     isActive: formData.isActive,
        //     isAdmin: formData.isAdmin,
        //     hasImpersonateAccess: formData.hasImpersonateAccess,
        //     photoAttachment: JSON.stringify(fileData.photoAttachment),
        //     role: formData.role,
        //     roleLabel: formData.role,
        //     publish: formData.publish,
        //     publishLabel: formData.publish,
        //     lastLogin: formData.lastLogin,
        //     defaultLanguage: formData.defaultLanguage,
        //     isPremiumUser: formData.isPremiumUser,
        //     totalPlot: formData.totalPlot,
        // };
        const response = await updateAppUser(formData);
        navigation.navigate('Home');
        console.log('response', response);
    };

    const handleFileUpload = (fileData: any) => {
        setFileData(fileData);
    };

    return (
        <View style={styles.container}><View style={styles.StepIndicator}>
            <StepIndicator
                customStyles={customStyles}
                currentPosition={step}
                labels={stepItems}
                stepCount={4} />
        </View>

            {step === 0 && (
                <View style={styles.vsauthForm}>
                    <Text style={styles.vlabel}> Name</Text>
                    <TextInput
                        style={styles.vsinput}
                        value={formData.name}
                        onChangeText={text => setFormData({ ...formData, name: text })}
                        placeholder="Name"
                    />
                    <Text style={styles.vlabel}>First Name</Text>
                    <TextInput
                        style={styles.vsinput}
                        value={formData.firstName}
                        onChangeText={text => setFormData({ ...formData, firstName: text })}
                        placeholder="First Name"
                    />
                    <Text style={styles.vlabel}>Last Name</Text>
                    <TextInput
                        style={styles.vsinput}
                        value={formData.lastName}
                        onChangeText={text => setFormData({ ...formData, lastName: text })}
                        placeholder="First Name"
                    />
                    <Text style={styles.vlabel}>Mobile</Text>
                    <TextInput
                        style={styles.vsinput}
                        value={formData.mobile}
                        onChangeText={text => setFormData({ ...formData, mobile: text })}
                        placeholder="First Name"
                    />
                    <Text style={styles.vlabel}>Mobile Verified</Text>
                    <CheckBox
                        value={formData.mobileVerified}
                        onValueChange={value => setFormData({ ...formData, mobileVerified: value })}
                    />
                </View>
            )}
            {step === 1 && (
                <View style={styles.vsauthForm}>
                    <View>
                        <Text style={styles.vlabel}> Email</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.emailId}
                            onChangeText={text => setFormData({ ...formData, emailId: text })}
                            placeholder="Email"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Shop name</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.shopName}
                            onChangeText={text => setFormData({ ...formData, shopName: text })}
                            placeholder="Shop name"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Password</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.password}
                            onChangeText={text => setFormData({ ...formData, password: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Email Verified</Text>
                        <CheckBox
                            value={formData.emailVerified}
                            onValueChange={value => setFormData({ ...formData, emailVerified: value })}
                        />
                    </View>
                </View>
            )}
            {step === 2 && (
                <View style={styles.vsauthForm}>
                    <View>
                        <Text style={styles.vlabel}>Pincode</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.pincode}
                            onChangeText={text => setFormData({ ...formData, pincode: text })}
                            placeholder="Pincode"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>State</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.state}
                            onChangeText={text => setFormData({ ...formData, state: text })}
                            placeholder="State"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>District</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.district}
                            onChangeText={text => setFormData({ ...formData, district: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Address Line 1</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.address}
                            onChangeText={text => setFormData({ ...formData, address: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Address Line 2</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.addressLine}
                            onChangeText={text => setFormData({ ...formData, addressLine: text })}
                            placeholder="Password"
                        />
                    </View>
                </View>
            )}
            {step === 3 && (
                <View style={styles.vsauthForm}>
                    <View>
                        <Text style={styles.vlabel}>VerifyShop</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.verifyShop}
                            onChangeText={text => setFormData({ ...formData, verifyShop: text })}
                            placeholder="Pincode"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>GST Number</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.gst}
                            onChangeText={text => setFormData({ ...formData, gst: text })}
                            placeholder="State"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>GstCertificate</Text>
                        {/* <TextInput
                            style={styles.vsinput}
                            value={formData.gstCertificate}
                            onChangeText={text => setFormData({ ...formData, GstCertificate: text })}
                            placeholder="Password"
                        /> */}
                        <FileUploadComponent
                            uploadUrl={`${BASE_URL_2}/AppUser/FileUpload`}
                            onFileUpload={handleFileUpload}
                            multiple={true}
                            fileTypes={['image/jpeg', 'image/png']} />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Photo Shop From Front</Text>
                        {/* <TextInput
                            style={styles.vsinput}
                            value={formData.address}
                            onChangeText={text => setFormData({ ...formData, address: text })}
                            placeholder="Password"
                        /> */}
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Cheque
                        </Text>
                        {/* <TextInput
                            style={styles.vsinput}
                            value={formData.addressLine}
                            onChangeText={text => setFormData({ ...formData, addressLine: text })}
                            placeholder="Password"
                        /> */}
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Gst Otp</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.gstOtp}
                            onChangeText={text => setFormData({ ...formData, gstOtp: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Active</Text>
                        <CheckBox
                            value={formData.isActive}
                            onValueChange={value => setFormData({ ...formData, isActive: value })}
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Is Admin</Text>
                        <CheckBox
                            value={formData.isAdmin}
                            onValueChange={value => setFormData({ ...formData, isAdmin: value })}
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Has Impersonate Access</Text>
                        <CheckBox
                            value={formData.hasImpersonateAccess}
                            onValueChange={value => setFormData({ ...formData, hasImpersonateAccess: value })}
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Photo</Text>
                        {/* <TextInput
                            style={styles.vsinput}
                            value={formData.addressLine}
                            onChangeText={text => setFormData({ ...formData, addressLine: text })}
                            placeholder="Password"
                        /> */}
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Role</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.role}
                            onChangeText={text => setFormData({ ...formData, role: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Publish</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.publish}
                            onChangeText={text => setFormData({ ...formData, publish: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>Last Login</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.lastLogin}
                            onChangeText={text => setFormData({ ...formData, lastLogin: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>DefaultLanguage</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.defaultLanguage}
                            onChangeText={text => setFormData({ ...formData, defaultLanguage: text })}
                            placeholder="Password"
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>IsPremiumUser</Text>
                        <CheckBox
                            value={formData.isPremiumUser}
                            onValueChange={value => setFormData({ ...formData, isPremiumUser: value })}
                        />
                    </View>
                    <View>
                        <Text style={styles.vlabel}>TotalPlot</Text>
                        <TextInput
                            style={styles.vsinput}
                            value={formData.totalPlot}
                            onChangeText={text => setFormData({ ...formData, totalPlot: text })}
                            placeholder="Password"
                        />
                    </View>
                </View>
            )}
            <View style={styles.buttonContainer}>
                {step === 0 && (
                    <TouchableOpacity style={styles.Backbutton}
                        onPress={() => navigation.navigate('Home')}>
                        <Text style={styles.BackbuttonText}>Back</Text>
                    </TouchableOpacity>
                )}
                {step !== 0 && (
                    <TouchableOpacity style={styles.Backbutton} onPress={handlePrevious}>
                        <Text style={styles.BackbuttonText}>Previous</Text>
                    </TouchableOpacity>
                )}


                {step !== 3 && (
                    <TouchableOpacity
                        style={[styles.vbutton]}
                        onPress={handleNext}
                    >
                        <Text style={[styles.vbuttonText]}>Next</Text>
                    </TouchableOpacity>
                )}
                {step === 3 && (
                    <TouchableOpacity style={[styles.vbutton]}
                        onPress={() => save()}
                    >
                        <Text style={styles.vbuttonText}>Save</Text>
                    </TouchableOpacity>
                )}
            </View>

        </View>

    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 1,
    },
    StepIndicator: {
        padding: 10,
    },
    buttonContainer: {
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderColor: Color.border,
        borderWidth: 1,
    },
    Backbutton: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        borderColor: Color.primary,
        borderWidth: 1,
    },
    vbutton: {
        flex: 1,
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: Color.primary,
    },
    BackbuttonText: {
        color: Color.primary,
        fontSize: 15,
        fontFamily: FontFamily.poppinsMedium,
    },
    vbuttonText: {
        color: 'white',
        fontSize: 15,
        fontFamily: FontFamily.poppinsMedium,
    },
    vsauthForm: {
        width: '100%',
        padding: 20,
        height: '83%',
        paddingBottom: 40,
    },
    vlabel: {
        fontFamily: FontFamily.poppinsSemiBold,
        fontSize: 16,
        marginBottom: 5,
    },
    vsinput: {
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
});

export default AppUserEdit;

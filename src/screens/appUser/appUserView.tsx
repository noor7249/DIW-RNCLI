/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import StepIndicator from 'react-native-step-indicator';
import { Color, FontFamily } from '../../GlobalStyles';
import { fetchAppUsersById } from '../../services/appUser';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../App';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type AppUserViewRouteProp = RouteProp<RootStackParamList, 'AppUserView'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'AppUserView'>;



const AppUserView = ({ route }: { route: AppUserViewRouteProp }) => {
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
    const [gstCertificatePreview, setGstCertificatePreview] = useState([]);
    const [photoShopFrontPreview, setPhotoShopFrontPreview] = useState([]);
    const [visitingCardPreview, setVisitingCardPreview] = useState([]);
    const [chequePreview, setChequePreview] = useState([]);
    const [PhotoAttachmentPreview, setPhotoAttachmentPreview] = useState([]);

    const parseImageAndSetPreview = (jsonString: any, setImagePreview: any) => {
        try {
            const imgFiles = JSON.parse(jsonString);
            if (imgFiles && imgFiles.length > 0) {
                const fileNames = imgFiles.map((imgFile: any) => imgFile.fileName);
                setImagePreview(fileNames);
            }
        } catch (error) {
            console.error('Failed to parse image data:', error);
        }
    };
    useEffect(() => {
        getAppUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[id]);

    const getAppUsersData = async () => {
        try {
            const data = await fetchAppUsersById(id);
            console.log('data', data);
            if (data.gstCertificate) {
                parseImageAndSetPreview(data.gstCertificate, setGstCertificatePreview);
            }
            if (data.photoShopFront) {
                parseImageAndSetPreview(data.photoShopFront, setPhotoShopFrontPreview);
            }
            console.log('data.visitingCard', data.visitingCard);
            if (data.visitingCard) {
                parseImageAndSetPreview(data.visitingCard, setVisitingCardPreview);
            }

            if (data.cheque) {
                parseImageAndSetPreview(data.cheque, setChequePreview);
            }

            if (data.photoAttachment) {
                parseImageAndSetPreview(data.photoAttachment, setPhotoAttachmentPreview);
            }

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
    return (
        <View style={styles.container}>
            <View style={styles.StepIndicator}>
                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={step}
                    labels={stepItems}
                    stepCount={4}
                />
            </View>
            {step === 0 && (
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Name</Text>
                        <Text style={styles.value}>{formData.name}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>First Name</Text>
                        <Text style={styles.value}>{formData.firstName}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Last Name</Text>
                        <Text style={styles.value}>{formData.lastName}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Mobile</Text>
                        <Text style={styles.value}>{formData.mobile}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Mobile Verified</Text>
                        <Text style={styles.value}>{formData.mobileVerified ? 'Yes' : 'No'}</Text>
                    </View>
                </View>
            )}
            {step === 1 && (
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Email Id</Text>
                        <Text style={styles.value}>{formData.emailId}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> Email Verified</Text>
                        <Text style={styles.value}>{formData.emailVerified ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Shop Name</Text>
                        <Text style={styles.value}>{formData.shopName}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Password</Text>
                        <Text style={styles.value}>{formData.password}</Text>
                    </View>
                </View>
            )}
            {step === 2 && (
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.label}>Pincode</Text>
                        <Text style={styles.value}>{formData.pincode}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> State</Text>
                        <Text style={styles.value}>{formData.state}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>District</Text>
                        <Text style={styles.value}>{formData.district}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Address Line 1</Text>
                        <Text style={styles.value}>{formData.address}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Address Line 2</Text>
                        <Text style={styles.value}>{formData.addressLine}</Text>
                    </View>
                </View>
            )}
            {step === 3 && (
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <Text style={styles.label}> GST Number</Text>
                        <Text style={styles.value}>{formData.gst}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>GstCertificate</Text>
                        {gstCertificatePreview.map((fileName: string, index: number) => (
                            <Image key={index} source={{ uri: fileName }} />
                        ))}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>  Photo Shop From Front</Text>
                        {photoShopFrontPreview.map((fileName: string, index: number) => (
                            <Image key={index} source={{ uri: fileName }} />
                        ))}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> VisitingCard</Text>
                        {visitingCardPreview.map((fileName: string, index: number) => (
                            <Image key={index} source={{ uri: fileName }} />
                        ))}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> Cheque</Text>
                        {chequePreview.map((fileName: string, index: number) => (
                            <Image key={index} source={{ uri: fileName }} />
                        ))}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Gst Otp</Text>
                        <Text style={styles.value}>{formData.gstOtp}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Active</Text>
                        <Text style={styles.value}>{formData.isActive ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Is Admin</Text>
                        <Text style={styles.value}>{formData.isAdmin ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>Has Impersonate Access</Text>
                        <Text style={styles.value}>{formData.hasImpersonateAccess ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>  Photo</Text>
                        {PhotoAttachmentPreview.map((fileName: string, index: number) => (
                            <Image key={index} source={{ uri: fileName }} />
                        ))}
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> Last Login</Text>
                        <Text style={styles.value}>{formData.lastLogin ? moment(formData.lastLogin).format('MMMM DD, YYYY') : ''}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> DefaultLanguage</Text>
                        <Text style={styles.value}>{formData.defaultLanguage}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}>IsPremiumUser</Text>
                        <Text style={styles.value}>{formData.isPremiumUser ? 'Yes' : 'No'}</Text>
                    </View>
                    <View style={styles.card}>
                        <Text style={styles.label}> DefaultLanguage</Text>
                        <Text style={styles.value}>{formData.totalPlot}</Text>
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
                    onPress={() => navigation.navigate('AppUserEdit', { id: formData.id })}
                    >
                        <Text style={styles.vbuttonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    cardContainer: {
        flex: 1,
        flexWrap: 'wrap',
        padding: 20,
        flexDirection: 'row',
        gap: 10,


    },
    card: {
        borderWidth: 1,
        width: '48%',
        borderColor: Color.border,
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#ffff',
        justifyContent: 'space-between',
        gap: 10,
    },
    label: {
        fontSize: 16,
        fontFamily: FontFamily.poppinsSemiBold,
    },
    value: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsMedium,

    },
});

export default AppUserView;

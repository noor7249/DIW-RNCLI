/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from 'react';
import { View, Text,TouchableOpacity, TextInput, StyleSheet, ScrollView, Modal } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { verificationDetails, SearchAppUserDetails } from '../../services/loginService';
import StepIndicator from 'react-native-step-indicator';
import { Color, FontFamily } from '../../GlobalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FileUploadComponent from '../fileUpload';
import { emailSchema, requiredSchema, pincodeSchema, requiredASchema, gstSchema } from '../../validationSchemas';
import { Icon } from 'react-native-elements';
// import { searchPincode } from '../../services/loginService';
import { BASE_URL } from '../../config/config';
import appUserStore from '../../store/store';
// import SuccessIcon from '../../../assets/images/success-icon.svg';
// import Loading from '../loding';



type RegisterProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>;
};
const ShopVerification: React.FC<RegisterProps> = ({ setStep }) => {
    const [vstep, setVStep] = useState(0);
    const [profileStep, setProfileStep] = useState(0);
    const [classActive, setClassActive] = useState('');
    const [showDialog, setshowDialog] = useState(false);
    const [appUserdetails, setAppUserdetails] = useState<any>();
    const { AppUserValues, setAppUserValues } = appUserStore();
    const [gstCertificate, setGstCertificate] = useState<any>([]);
    const [photoShop, setPhotoShop] = useState<any>([]);
    const [visitingCard, setVisitingCard] = useState<any>([]);
    const [passbook, setPassbook] = useState<any>([]);
    const [shopNameError, setShopNameError] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');
    const [pinError, setPinError] = useState<string>('');
    const [stateError, setStateError] = useState<string>('');
    const [districtError, setDistrictError] = useState<string>('');
    const [add1Error, setAdd1Error] = useState<string>('');
    const [add2Error, setAdd2Error] = useState<string>('');
    const [gstError, setGSTError] = useState<string>('');
    const [loader, setLoader] = useState(false);




    useEffect(() => {
        const SearchData = async () => {
            try {
                const Data = await SearchAppUserDetails();
                setAppUserdetails(Data)


            } catch (error) {
                console.error('Error ', error);
            }
        };
        SearchData();
    }, []);




    const handleNext = () => {
        setVStep(step => Math.min(step + 1, stepItems.length - 1));
    };

    const handlePrevious = () => {
        setVStep(step => Math.max(step - 1, 0));
    };



    // const handleStepChange = (newStep: React.SetStateAction<number>) => {
    //     setVStep(newStep);
    //     setProfileStep(0);
    // };

    // const handleProfileStepChange = (newProfileStep: React.SetStateAction<number>) => {
    //     setProfileStep(newProfileStep);
    // };

    const addActiveClass = (className: React.SetStateAction<string>) => {
        setClassActive(className);
    };

    const handleGstCertificateUpload = (fileData: any) => {
        setGstCertificate(fileData);
    }

    const handlePhotoShopUpload = (fileData: any) => {
        setPhotoShop(fileData);
    }

    const handleVisitingCardUpload = (fileData: any) => {
        setVisitingCard(fileData);
    }

    const handlePassbookUpload = (fileData: any) => {
        setPassbook(fileData);
    }

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

    const save = async () => {
        setLoader(true)
        const names = appUserdetails[0].name.split(' ');
        const firstName = names[0];
        const lastName = names.slice(1).join(' ');
        const formattedGstCertificate = gstCertificate.map((file: any) => ({
            fileName: file.fileName,
            filePath: file.filePath,
            type: 'AppUser',
        }));

        const formattedPhotoShop = photoShop.map((file: any) => ({
            fileName: file.fileName,
            filePath: file.filePath,
            type: 'AppUser',
        }));

        const formattedVisitingCard = visitingCard.map((file: any) => ({
            fileName: file.fileName,
            filePath: file.filePath,
            type: 'AppUser',
        }));

        const formattedPassbook = passbook.map((file: any) => ({
            fileName: file.fileName,
            filePath: file.filePath,
            type: 'AppUser',
        }));

        const model = {
            address: AppUserValues.address,
            addressLine: AppUserValues.addressLine,
            cheque: passbook ? JSON.stringify(formattedPassbook) : null,
            district: AppUserValues.district,
            emailId: AppUserValues.emailId,
            emailVerified: false,
            firstName: firstName,
            gst: AppUserValues.gst,
            gstCertificate: gstCertificate ? JSON.stringify(formattedGstCertificate) : null,
            hasImpersonateAccess: true,
            id: appUserdetails[0].id,
            isActive: false,
            isAdmin: false,
            lastName: lastName,
            mobile: appUserdetails[0].mobile,
            mobileVerified: false,
            photoShopFront: photoShop ? JSON.stringify(formattedPhotoShop) : null,
            name: appUserdetails[0].name,
            pinCode: AppUserValues.pinCode,
            publish: 'Draft',
            publishLabel: 'Draft',
            role: appUserdetails[0].role,
            roleLabel: appUserdetails[0].roleLabel,
            shopName: AppUserValues.shopName,
            state: AppUserValues.state,
            verifyShop: classActive,
            visitingCard: visitingCard ? JSON.stringify(formattedVisitingCard) : null,
        };

        try {
            const response = await verificationDetails(model);
            setLoader(false);
            setshowDialog(true);


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
            // setStep(0);
        }
        catch (e) {
            console.error('save error', e);
        }



    };


    const stepItems = ['Shop Details', 'Address ', 'verifying Shop', 'varification'];

    const handleShopChange = (text: string) => {
        setAppUserValues({ ...AppUserValues, shopName: text });
        const result = requiredSchema.safeParse(text);

        if (result.success) {
            setShopNameError('');
        } else {
            setShopNameError(result.error.errors[0].message.replace('Name', 'Shop Name'));
        }
    };

    const handlEmailChange = (text: string) => {

        setAppUserValues({ ...AppUserValues, emailId: text });
        const result = emailSchema.safeParse(text);

        if (result.success) {
            setEmailError('');
        } else {
            setEmailError(result.error.errors[0].message);
        }

    };

    const handlPinCodeChange = (text: string) => {

        setAppUserValues({ ...AppUserValues, pinCode: text });
        const result = pincodeSchema.safeParse(text);

        if (result.success) {
            setPinError('');
        } else {
            setPinError(result.error.errors[0].message);
        }

    };

    const fetchStateDistrict = async (pincode: any) => {
        try {
            const data = await searchPincode(pincode);

            if (data && data.length > 0) {
                let result = data[0];
                setAppUserValues({
                    ...AppUserValues,
                    state: result.stateName,
                    district: result.districtName,
                });
            } else {
                setAppUserValues({
                    ...AppUserValues,
                    state: null,
                    district: null,
                    pinCode: null,
                });
            }
        } catch (error) {
            console.error('Error fetching result:', error);
        };
    }

    const handlStateChange = (text: string) => {
        setAppUserValues({ ...AppUserValues, state: text });
        const result = requiredASchema.safeParse(text);

        if (result.success) {
            setStateError('');
        } else {
            setStateError(result.error.errors[0].message.replace('Name', 'State'));
        }

    };

    const handlDistrictChange = (text: string) => {
        setAppUserValues({ ...AppUserValues, district: text });
        const result = requiredASchema.safeParse(text);

        if (result.success) {
            setDistrictError('');
        } else {
            setDistrictError(result.error.errors[0].message.replace('Name', 'District'));
        }

    };

    const handlAdd1Change = (text: string) => {
        setAppUserValues({ ...AppUserValues, address: text });
        const result = requiredSchema.safeParse(text);

        if (result.success) {
            setAdd1Error('');
        } else {
            setAdd1Error(result.error.errors[0].message.replace('Name', 'Address line 1'));
        }

    };

    const handlAdd2Change = (text: string) => {
        setAppUserValues({ ...AppUserValues, addressLine: text });
        const result = requiredSchema.safeParse(text);

        if (result.success) {
            setAdd2Error('');
        } else {
            setAdd2Error(result.error.errors[0].message.replace('Name', 'Address line 2'));
        }

    };

    const handlGStChange = (text: string) => {
        setAppUserValues({ ...AppUserValues, gst: text });
        const result = gstSchema.safeParse(text);

        if (result.success) {
            setGSTError('');
        } else {
            setGSTError(result.error.errors[0].message);
        }

    };


    // if (loader) {
    //     return <Loading />
    // }

    const isSubmitDisabled = () => {
        if (classActive === 'provideGST') {
            return !!gstError || !photoShop.length || !gstCertificate.length || !AppUserValues.gst;
        } else if (classActive === 'notGST') {
            return !photoShop.length || !passbook.length || !visitingCard.length;
        }
        return true;
    };

    const isNextDisabled = () => {
        if (vstep === 0) {
            return !!emailError || !!shopNameError || !AppUserValues.shopName || !AppUserValues.emailId;
        } else if (vstep === 1) {
            return !!pinError || !!stateError || !!districtError || !!add1Error || !!add2Error || !AppUserValues.pinCode || !AppUserValues.state || !AppUserValues.district || !AppUserValues.address || !AppUserValues.addressLine;
        } else if(vstep === 2){
            return !classActive;
        }
        return true;
    };

    return (
        <View style={{borderWidth:1,height:750}}>
            <View style={styles.vauthHeader} >
                <StepIndicator
                    customStyles={customStyles}
                    currentPosition={vstep}
                    labels={stepItems}
                    stepCount={4}
                />

            </View>
            {/* <ScrollView contentContainerStyle={styles.vauthForm}> */}
            {vstep === 0 && (
                <View style={styles.con} >
                    <View style={styles.vheading}>
                        <Text style={styles.vheadingText}>In order to process your authorization, we need your shop’s information</Text>
                    </View>

                    <View style={styles.vsauthForm}>
                        <View>
                            <Text style={styles.vlabel}>Shop Name</Text>
                            <TextInput
                                style={styles.vsinput}
                                value={AppUserValues.shopName}
                                onChangeText={handleShopChange}
                                placeholder="Shop Name"
                            />
                            {shopNameError ? <Text style={styles.errorText}>{shopNameError}</Text> : null}
                        </View>
                        <View>
                            <Text style={styles.vlabel}>Email Id</Text>
                            <TextInput
                                style={styles.vsinput}
                                value={AppUserValues.emailId}
                                onChangeText={handlEmailChange}
                                placeholder="Email Id"
                                keyboardType="email-address"
                            />
                            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                        </View>
                    </View>

                </View>
            )}
            {vstep === 1 && (
                <ScrollView style={styles.con} showsVerticalScrollIndicator={false}>
                    <View style={{ paddingBottom: 30}}>
                        <View style={styles.vheading}>
                            <Text style={[styles.heading]}> Shop Address</Text>
                            <Text style={styles.vheadingText}>
                                The details would be used for invoicing as well as material distribution
                            </Text>
                        </View>
                        <View style={styles.vsauthForm}>

                            <Text style={styles.vlabel}>Pin Code</Text>
                            <TextInput
                                style={styles.vsinput}
                                placeholder="Pin Code"
                                value={AppUserValues.pinCode}
                                onBlur={() => {
                                    fetchStateDistrict(AppUserValues.pinCode);
                                }}
                                onChangeText={handlPinCodeChange}
                                keyboardType="numeric"
                                maxLength={6}


                            />
                            {pinError ? <Text style={styles.errorText}>{pinError}</Text> : null}

                            <Text style={styles.vlabel}>State</Text>
                            <TextInput
                                style={styles.vsinput}
                                placeholder="State"
                                value={AppUserValues.state}
                                onChangeText={handlStateChange}
                                keyboardType="default"
                                maxLength={100}
                            />
                            {stateError ? <Text style={styles.errorText}>{stateError}</Text> : null}



                            <Text style={styles.vlabel}>District</Text>
                            <TextInput
                                style={styles.vsinput}

                                placeholder="District"
                                value={AppUserValues.district}
                                onChangeText={handlDistrictChange}
                                keyboardType="default"
                                maxLength={100}
                            />
                            {districtError ? <Text style={styles.errorText}>{districtError}</Text> : null}


                            <Text style={styles.vlabel}>Address Line 1</Text>
                            <TextInput
                                style={[styles.vsinput, { height: 80,textAlignVertical:'top' }]}
                                placeholder="Address"
                                value={AppUserValues.address}
                                onChangeText={handlAdd1Change}
                                keyboardType="default"
                                maxLength={250}
                                multiline={true}
                                numberOfLines={6}
                            />
                            {add1Error ? <Text style={styles.errorText}>{add1Error}</Text> : null}



                            <Text style={styles.vlabel}>Address Line 2</Text>
                            <TextInput
                                style={[styles.vsinput, { height: 80,textAlignVertical:'top' }]}
                                placeholder="Address Line 2"
                                value={AppUserValues.addressLine}
                                onChangeText={handlAdd2Change}
                                keyboardType="default"
                                maxLength={250}
                                multiline={true}
                                numberOfLines={3}

                            />
                            {add2Error ? <Text style={styles.errorText}>{add2Error}</Text> : null}

                        </View>
                    </View>
                </ScrollView>
            )}
            {vstep === 2 && (
                <View style={styles.con}>
                    <View style={styles.vheading}>
                        <Text style={styles.vheadingText}>
                            The details would be used for invoicing as well as material distribution
                        </Text >
                        <Text style={styles.vheadingText}>DIW's verification process must be completed in order to view dealer rates.</Text>
                    </View>

                    <View style={styles.vsauthForm}>
                        <View style={styles.vselectGst}>
                            <TouchableOpacity
                                onPress={() => addActiveClass('provideGST')}
                                style={[
                                    styles.vselectTab,
                                    classActive === 'provideGST' && styles.vactive,
                                ]}
                            >
                                <View style={styles.vleftSelectSection}>
                                    <RadioButton
                                        value="provideGST"
                                        status={classActive === 'provideGST' ? 'checked' : 'unchecked'}
                                        onPress={() => addActiveClass('provideGST')}
                                    />
                                </View>
                                <View style={styles.vrightSelectSection}>
                                    <Text style={styles.cheadingText}>I have a GST</Text>
                                    <Text style={styles.cText}><MaterialCommunityIcons name="square" size={8} color="#000" />  Requires uploading GST certificate</Text>
                                    {/* <Text style={styles.cText}><MaterialCommunityIcons name="square" size={8} color="#000" /> Usually take 2-3 hours</Text> */}
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => addActiveClass('notGST')}
                                style={[
                                    styles.vselectTab,
                                    classActive === 'notGST' && styles.vactive,
                                ]}
                            >
                                <View style={styles.vleftSelectSectionn}>
                                    <RadioButton
                                        value="notGST"
                                        status={classActive === 'notGST' ? 'checked' : 'unchecked'}
                                        onPress={() => addActiveClass('notGST')}
                                    />
                                </View>
                                <View style={styles.vrightSelectSection}>
                                    <Text style={styles.cheadingText}>I do not have GST</Text>
                                    <Text style={styles.cText}><MaterialCommunityIcons name="square" size={8} color="#000" />  Requires uploading photos for shop identity & address</Text>
                                    {/* <Text style={styles.cText}><MaterialCommunityIcons name="square" size={8} color="#000" /> Usually takes 2-3 hours</Text> */}
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            {vstep === 3 && (
                <ScrollView style={[styles.con, { paddingBottom: 100 }]} showsVerticalScrollIndicator={false}>
                    <Text style={styles.headingText}>Verification</Text>
                    <View style={styles.vsauthForm}>
                        {classActive === 'provideGST' && (
                            <><View>
                                <Text style={styles.vlabel}>Please enter your GST Number bellow</Text>
                                <TextInput
                                    style={styles.vsinput}

                                    placeholder="eg.36AAACH7409R1Z2"
                                    value={AppUserValues.gst}
                                    onChangeText={handlGStChange}
                                    keyboardType="default"
                                    maxLength={15} />
                                {gstError ? <Text style={styles.errorText}>{gstError}</Text> : null}

                            </View><View>
                                    <Text style={styles.vlabel}>GST Certificate</Text>
                                    {/* <FileUploadComponent
                                        uploadUrl={`${BASE_URL}/AppUser/FileUpload`}
                                        onFileUpload={handleGstCertificateUpload}
                                        multiple={false}
                                        fileTypes={['image/jpeg', 'image/png']} /> */}

                                </View></>

                        )}


                        <View style={{ paddingTop: 10}}>
                            <Text style={styles.vlabel}>photo-shop from front</Text>
                            <FileUploadComponent
                                uploadUrl={`${BASE_URL}/AppUser/FileUpload`}
                                onFileUpload={handlePhotoShopUpload}
                                multiple={false}
                                fileTypes={['image/jpeg', 'image/png']}
                            />

                        </View>
                        {classActive === 'notGST' && (
                            <><View style={{ paddingTop: 10}}>
                                <Text style={styles.vlabel}>Visiting Card Photo</Text>
                                {/* <FileUploadComponent
                                    uploadUrl={`${BASE_URL}/AppUser/FileUpload`}
                                    onFileUpload={handleVisitingCardUpload}
                                    multiple={false}
                                    fileTypes={['image/jpeg', 'image/png']} /> */}

                            </View><View style={{ paddingTop: 10}}>
                                    <Text style={styles.vlabel}>Shop's Passbook/Chequebook</Text>
                                    {/* <FileUploadComponent
                                        uploadUrl={`${BASE_URL}/AppUser/FileUpload`}
                                        onFileUpload={handlePassbookUpload}
                                        multiple={false}
                                        fileTypes={['image/jpeg', 'image/png']} /> */}

                                </View></>

                        )}



                    </View>
                </ScrollView>


            )}
            {/* </ScrollView> */}

            <View style={styles.buttonContainer}>
                {vstep !== 0 && (
                    <TouchableOpacity style={styles.vbutton} onPress={handlePrevious}>
                        <Text style={styles.vbuttonText}>Previous</Text>
                    </TouchableOpacity>
                )}


                { vstep !== 3 && (
                    <TouchableOpacity style={[styles.vbutton, isNextDisabled() ? styles.buttonDisabled : styles.buttonActive]}
                        onPress={handleNext}
                        disabled={isNextDisabled()}>
                        <Text style={[styles.vbuttonText]}>Next</Text>
                    </TouchableOpacity>
                )}
                {vstep === 3 && (
                    <TouchableOpacity
                        style={[styles.vbutton, isSubmitDisabled() ? styles.buttonDisabled : styles.buttonActive]}
                        disabled={isSubmitDisabled()}
                        onPress={save}
                    >
                        <Text style={styles.vbuttonText}>Submit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* {vstep === 0 && (
                <View style={styles.vbuttonContainer}>

                    <TouchableOpacity style={[styles.vcenterButton, !!emailError || !!shopNameError || !AppUserValues.shopName || !AppUserValues.emailId ? styles.buttonDisabled : styles.buttonActive]} onPress={handleNext} disabled={isNextDisabled()}>
                        <Text style={[styles.vbuttonText]}>Next</Text>
                    </TouchableOpacity>

                </View>
            )} */}
            <Modal
                visible={showDialog}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setshowDialog(false)}
            >
                <View style={styles.Vmodal}>
                    <View style={styles.vsuccessContent}>
                        <TouchableOpacity onPress={() => {
                            setshowDialog(false);
                            setStep(0);
                        }} style={styles.vcloseIcon}>
                            <Icon name="close" size={22} color="#fff" style={styles.close} />
                        </TouchableOpacity>
                        {/* <SuccessIcon
                            height={200}
                            width={200}
                            style={styles.VsuccessIcon}
                        /> */}
                        <Text style={styles.vsuccessMessage}>Verification under process</Text>
                        <Text style={styles.waitMessage}>Your DIW Dealer registration request is under review. we will update you on a request</Text>
                    </View>
                </View>
            </Modal>
        </View>

    );
};

const styles = StyleSheet.create({
    vauthHeader: {
        padding: 10,
        borderBottomWidth: 1,
        top: 0,
        backgroundColor: '#ffffff',
        zIndex: 1,
        borderColor: Color.border,

    },
    vactive: {
    },
    con: {
        padding: 20,
        flexDirection: 'column',
        flex: 1,
        // height: 100,
        // borderWidth:1,
    },
    vheading: {
        alignItems: 'center',
    },
    heading: {
        fontFamily: FontFamily.poppinsSemiBold,
        fontSize: 18,
        paddingTop: 30,
    },
    vheadingText: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 10,
        fontFamily: FontFamily.poppinsSansSerif,
    },
    cheadingText: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: FontFamily.poppinsSemiBold,
    },
    headingText: {
        fontSize: 18,
        marginTop: 10,
        fontFamily: FontFamily.poppinsSemiBold,
        textAlign: 'center',
    },
    cText: {
        fontSize: 14,
        fontFamily: FontFamily.poppinsSansSerif,
        lineHeight: 24,
    },
    vsauthForm: {
        width: '100%',
        paddingTop: 20,
        height: '100%',
        paddingBottom:40,
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
    vbuttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        paddingVertical: 12,
        borderTopWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        borderColor: Color.border,

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
        // flex:1,


    },
    vbutton: {
        flexGrow:1,
        marginHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
        backgroundColor: Color.primary,

    },
    buttonActive: {
        backgroundColor: Color.primary,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    vbuttonText: {
        color: 'white',
        fontSize: 15,
        fontFamily: FontFamily.poppinsMedium,
    },
    vcenterButton: {
        paddingVertical: 10,
        width: '100%',
        backgroundColor: Color.primary,
        borderRadius: 5,
        alignItems: 'center',
        borderStyle: 'solid',
    },
    vcenterContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    vselectGst: {
        flexDirection: 'column',
        marginBottom: 20,
    },

    vselectTab: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: Color.border,
        borderRadius: 5,
        padding: 10,
    },

    vleftSelectSection: {
        top: -10,
        right: 5,
    },
    vleftSelectSectionn: {
        top: -20,
        right: 5,
    },

    vrightSelectSection: {
        flex: 1,
    },
    vaheadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    vsuccessContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxHeight: 370,
        maxWidth: 360,
        width: 360,
    },
    vcloseIcon: {
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
    vcloseIconText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    VsuccessIcon: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    vsuccessMessage: {
        fontFamily: FontFamily.poppinsSemiBold,
        fontSize: 22,
        textAlign: 'center',
    },
    waitMessage: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: FontFamily.poppinsSansSerif,
    },
    Vmodal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    errorText: {
        color: '#ff0000',
        fontFamily: FontFamily.poppinsSansSerif,
        bottom: 5,

    },
    close: {
        backgroundColor: '#dc3545',
        borderRadius: 20,

    },
})

export default ShopVerification;
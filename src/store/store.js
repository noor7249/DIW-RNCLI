import { create } from 'zustand';

const appUserStore = create((set) => ({
    AppUserValues: {
        id: '',
        name: '',
        firstName: '',
        lastName:'',
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

    },
    setAppUserValues: (AppUserValues) => set(() => ({ AppUserValues })),
  }));

  export default appUserStore;

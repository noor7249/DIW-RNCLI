import { BASE_URL } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const sendLoginOtp = async (mobile: any) => {
    // const tokentemp = await AsyncStorage.getItem('token');
    // const token = tokentemp;
    const payload = { mobile };
    try {
      const response = await fetch(`${BASE_URL}/Login/SendLoginOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  export const sendOtp = async (mobileNo: any) => {  
    const payload = { mobileNo };
    try {
      const response = await fetch(`${BASE_URL}/Login/SendOtp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const text = await response.text();
      return text;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

export const validateOtplogin = async (mobileNo: any, otp: any) => {
  const payload = { mobileNo, otp };

  try {
    const response = await fetch(`${BASE_URL}/Login/ValidateOtp`, {
      method: 'POST',
      headers: {

        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const loginMobile = async (mobileNo: any, otp: any) => {
  const tokentemp = await AsyncStorage.getItem('token');
  const token = tokentemp;

  const payload = { mobile: mobileNo, otp:otp };

  try {
    const response = await fetch(`${BASE_URL}/Login/LoginMobile`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const validateOtp = async (mobile: any, otp: any) => {
  const tokentemp = await AsyncStorage.getItem('token');
  const token = tokentemp;

  const payload = { mobile, otp };

  try {
    const response = await fetch(`${BASE_URL}/Login/ValidateOtp`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

export const registerUser = async (model: any) => {
  const tokentemp = await AsyncStorage.getItem('token');
  const token = tokentemp;

  try {
    const response = await fetch(`${BASE_URL}/AppUser/Register`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    return text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};


export const SearchAppUserDetails = async () => {
  const [tokentemp, userInfo]:any = await Promise.all([AsyncStorage.getItem('token'), AsyncStorage.getItem("userInfo")]) ;
  const parsedUserInfo = JSON.parse(userInfo)[0];
  const token = tokentemp;
  const Payload = {
    form: null,
      condition: {
      Id:parsedUserInfo.id,
    },
    orderColumns: null,
  };

  try {
    const response = await fetch(`${BASE_URL}/AppUser/Search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(Payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.json();
    return text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
export const verificationDetails = async (model: any) => {
  const tokentemp = await AsyncStorage.getItem('token');
  const token = tokentemp;

  try {
    const response = await fetch(`${BASE_URL}/AppUser/Update`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(model),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.json();
    return text;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

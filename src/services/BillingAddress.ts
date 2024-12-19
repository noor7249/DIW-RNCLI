import { BASE_URL } from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';


const getBillingAddres = async () => {
    const tokentemp = await AsyncStorage.getItem('token');
    const token = tokentemp;
    try {
        const payload = {
            form: null,
            condition: null,
        };
        const response = await fetch(`${BASE_URL}/BillingAddress/Get`, {
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
        const data = await response.json();
        console.log(data);
        return data;
    } catch (err) {
        console.error("Fetch error: ", err);
    }
};


const getByIdBillingAddres = async (id: any) => {
    const tokentemp = await AsyncStorage.getItem('token');
    const token = tokentemp;
    try {
        const payload = {
            'form': null,
            'condition': {
                'Id': id,
            },
        };
        console.log('Sending payload:', payload);

        const response = await fetch(`${BASE_URL}/BillingAddress/Get`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Response:', response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('data:', data);

        return data;
    } catch (err) {
        console.error('Fetch error:', err);
    }
};
// const getByIdBillingAddres = async () => {
//     const tokentemp = await AsyncStorage.getItem('token');
//     const token = tokentemp;
//     try {
//         const payload = { Id: 37 };
//         console.log('Sending payload:', payload);

//         const response = await fetch(`${BASE_URL}/BillingAddress/GetById`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Bearer ${token}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(payload),
//         });

//         console.log('Response:', response);

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();
//         return data;
//     } catch (err) {
//         console.error('Fetch error:', err);
//     }
// };


const fetchBillingAddress = async (AppUserId: any, value: any) => {
    try {
        const payload = {
            AppUserId: AppUserId,
            value: value,
        };
        console.log('payload',payload);
        const response = await fetch(`${BASE_URL}/BillingAddress/GetBillingAddress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        return data; // Return the data to the caller
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};
const fetchBuyOrderAddress = async (AppUserId: any, FirstName: any) => {
    try {
        const payload = {
            AppUserId: AppUserId,
            FirstName: FirstName,
        };
        console.log('payload',payload);
        const response = await fetch(`${BASE_URL}/BillingAddress/GetAddressBuyOrderData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parse the JSON response
        return data; // Return the data to the caller
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
    }
};

const addBillingAddress = async (formData: any) => {
    const tokentemp = await AsyncStorage.getItem("token");
    const token = tokentemp;
    try {
        const response = await fetch(`${BASE_URL}/BillingAddress/InsertData`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:",);
        throw error;
    }
};

const deleteBillingAddress = async (form:any) => {
    const tokentemp = await AsyncStorage.getItem("token");
    const token = tokentemp;
    // const payload = {
    //     "Id": Id,
    // }

    try {
        const response = await fetch(`${BASE_URL}/BillingAddress/Remove`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:",);
        throw error;
    }
};

const UpdateBillingAddress = async (formData: any) => {
    const tokentemp = await AsyncStorage.getItem("token");
    const token = tokentemp;
    try {
        const response = await fetch(`${BASE_URL}/BillingAddress/UpdateData`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Fetch error:",);
      throw error;
    }
  };

export { getBillingAddres, getByIdBillingAddres, fetchBillingAddress, addBillingAddress,deleteBillingAddress,UpdateBillingAddress,fetchBuyOrderAddress };

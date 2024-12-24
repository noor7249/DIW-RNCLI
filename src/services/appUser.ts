import { BASE_URL_2 } from '../config/config';


const fetchAppUsers = async () => {
    const payload = {
        form: null,
        condition: null,
    };

    try {
        const response = await fetch(`${BASE_URL_2}/AppUser/Get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const fetchAppUsersById = async (appuserID: any) => {
    const payload = {
        'id': appuserID,
    };

    try {
        const response = await fetch(`${BASE_URL_2}/AppUser/GetById`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const getHomeCommonData = async () => {
    const payload = {
        type: 'default',
        pageType: 'admin',
        condition: null,
    };

    try {
        const response = await fetch(`${BASE_URL_2}/AppUser/GetHomeCommonData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const getHtmlData = async () => {
    const payload = {
        type: 'default',
        pageType: 'admin',
        language: 'en',
        condition: null,
    };

    try {
        const response = await fetch(`${BASE_URL_2}/AppUser/GetHtmlData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

const getHomeUserData = async () => {
    const payload = {
        type: 'default',
        pageType: 'admin',
        condition: null,
    };

    try {
        const response = await fetch(`${BASE_URL_2}/AppUser/GetHomeUserData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};
const updateAppUser = async (payload: any) => {

    try {
        const response = await fetch(`${BASE_URL_2}/AppUser/Update`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};
const fetchEnumDetailsData = async () => {
    const payload = {
        form: null,
        condition: null,
    };

    try {
        const response = await fetch(`${BASE_URL_2}/EnumDetail/Get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

export {fetchAppUsers,getHomeCommonData,getHtmlData,getHomeUserData,fetchAppUsersById,updateAppUser,fetchEnumDetailsData};

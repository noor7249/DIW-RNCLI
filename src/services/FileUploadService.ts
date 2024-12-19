// fileUploadService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const uploadFile = async (fileData: any, uploadUrl: string) => {
    const tokentemp = await AsyncStorage.getItem('token');
    const token = tokentemp;



    const formData = new FormData();


    const file: any = {
        uri: fileData.uri,
        type: fileData.type,
        name: fileData.fileName,
    };


    formData.append('file', file);

    try {
        const response = await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
            },
            body: formData,
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('File upload error:', error);
        throw error;
    }
};

export { uploadFile };


import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { uploadFile } from '../services/FileUploadService';
import { Color, FontFamily } from '../GlobalStyles';
import Icon from 'react-native-vector-icons/FontAwesome';

interface FileUploadComponentProps {
  uploadUrl: string;
  onFileUpload: (uploadedFiles: any[]) => void;
  multiple?: boolean;
  fileTypes?: string[];
}

const FileUploadComponent: React.FC<FileUploadComponentProps> = ({
  uploadUrl,
  onFileUpload,
  multiple,
  fileTypes = [],
}) => {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);

  const sanitizeFileName = (fileName: any) => fileName.replace(/[^\w.-]/g, '');

  const handleUploadFile = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: fileTypes.length > 0 ? fileTypes : [DocumentPicker.types.allFiles],
        allowMultiSelection: multiple || false,
      });

      const files = Array.isArray(result) ? result : [result];

      const newFiles = files.map((file) => ({
        fileName: sanitizeFileName(file.name),
        uri: file.uri,
        type: file.type,
      }));

      if (multiple) {
        setSelectedFiles((prevFiles) => [...prevFiles, ...newFiles]);
      } else {
        setSelectedFiles(newFiles);
      }

      const uploadedFiles = [];
      for (const file of newFiles) {
        const uploadedFile = await uploadFile(file, uploadUrl);

        if (uploadedFile && uploadedFile.fileName && uploadedFile.filePath) {
          uploadedFiles.push(uploadedFile);
        } else {
          Alert.alert('Upload failed. Please try again.');
          return;
        }
      }

      if (uploadedFiles.length > 0) {
        onFileUpload(uploadedFiles);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('File selection canceled.');
      } else {
        console.error('Error picking or uploading files:', err);
        Alert.alert('Error picking or uploading files. Please try again.');
      }
    }
  };

  const handleDeleteFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onFileUpload(updatedFiles);
  };

  const renderItem = (item: any, index: number) => (
    <View style={styles.imageContainer} key={index}>
      {item.type === 'application/pdf' ? (
        <Image source={require('../assest/images/pdf-icon.png')} style={styles.uploadedImage} />
      ) : (
        <Image source={{ uri: item.uri }} style={styles.uploadedImage} />
      )}
      <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteFile(index)}>
        <Text>
          <Icon name="trash" size={20} color="red" />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadFile}>
        <Text style={styles.uploadButtonText}>+Upload Files</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {selectedFiles.length > 0 && (
          <View style={styles.gridContainer}>
            {selectedFiles.map((item, index) => renderItem(item, index))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  uploadButton: {
    borderStyle: 'dashed',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    borderColor: Color.primary,
    borderWidth: 1,
    alignItems: 'center',
    marginTop: 7,
  },
  uploadButtonText: {
    color: Color.primary,
    fontFamily: FontFamily.poppinsMedium,
  },
  uploadedImage: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default FileUploadComponent;

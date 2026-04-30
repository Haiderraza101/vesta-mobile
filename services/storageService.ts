import * as ImagePicker from 'expo-image-picker';

export const storageService = {
  uploadImage: async (uri: string, path: string): Promise<string> => {
    try {
      const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      if (!cloudName || !uploadPreset) {
        throw new Error("Cloudinary configuration missing");
      }

      const formData = new FormData();
      // @ts-ignore
      formData.append('file', {
        uri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', uploadPreset);
      formData.append('folder', path);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error(data.error?.message || "Upload failed");
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw error;
    }
  },

  pickImage: async (useCamera: boolean = false): Promise<string | null> => {
    const permissionResult = useCamera 
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      throw new Error(`Permission to access ${useCamera ? 'camera' : 'gallery'} is required`);
    }

    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.7,
        });

    if (!result.canceled) {
      return result.assets[0].uri;
    }
    return null;
  }
};

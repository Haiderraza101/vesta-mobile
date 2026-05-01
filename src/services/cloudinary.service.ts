// Simplified Cloudinary service using unsigned uploads for MVP
export const uploadToCloudinary = async (uri: string) => {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary credentials. Set EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME and EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET.");
  }

  const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const data = new FormData();
  data.append('file', {
    uri,
    type: 'image/jpeg',
    name: 'upload.jpg',
  } as any);
  data.append('upload_preset', uploadPreset);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      body: data,
    });
    const result = await response.json();
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    throw error;
  }
};

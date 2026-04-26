export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  const url = 'https://api.cloudinary.com/v1_1/dnmaci6zo/image/upload';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error('Upload failed: ' + (data.error?.message || 'Unknown error'));
    }
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

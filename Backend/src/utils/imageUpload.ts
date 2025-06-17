import { storage } from '../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const uploadImage = async (file: Express.Multer.File, path: string): Promise<string> => {
  try {
    // Generate a unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const fullPath = `${path}/${fileName}`;

    // Create a reference to the file location
    const storageRef = ref(storage, fullPath);

    // Upload the file
    await uploadBytes(storageRef, file.buffer, {
      contentType: file.mimetype,
    });

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('Failed to upload image');
  }
}; 
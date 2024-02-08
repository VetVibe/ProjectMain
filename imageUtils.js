import * as FileSystem from "expo-file-system";

export const encodeImageAsBase64 = async (uri) => {
  try {
    const base64Image = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64Image;
  } catch (error) {
    console.error("Error encoding image as Base64:", error);
    throw error;
  }
};

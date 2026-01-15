const CLOUD_NAME = "davo4f0o3";
const UPLOAD_PRESET = "tmp8b5ug";
const API_KEY = "717434999377659";
// API_SECRET is now passed dynamically from the DB for security

/**
 * Uploads an image file to Cloudinary.
 * @param {File} file - The file object from an input element.
 * @returns {Promise<Object>} - The JSON response from Cloudinary containing url, secure_url, etc.
 */
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("cloud_name", CLOUD_NAME);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Upload failed");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw error;
    }
};

/**
 * Deletes an image from Cloudinary using the Admin API authentication
 * @param {string} publicId - The public ID of the image to delete
 * @param {string} apiSecret - The API Secret fetched from backend/db
 * @returns {Promise<Object>} - The response from Cloudinary
 */
export const deleteImage = async (publicId, apiSecret) => {
    const timestamp = new Date().getTime();

    // Generate Signature: SHA-1(public_id={public_id}&timestamp={timestamp}{api_secret})
    const strToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = await sha1(strToSign);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
            {
                method: "POST",
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || "Deletion failed");
        }

        return await response.json();
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw error;
    }
};

/**
 * Helper function to generate SHA-1 hash for Cloudinary signature
 * @param {string} str - String to hash
 * @returns {Promise<string>} - Hex string of SHA-1 hash
 */
async function sha1(str) {
    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-1', enc.encode(str));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

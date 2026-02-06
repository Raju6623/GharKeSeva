
// Central Configuration for API Config
// Central Configuration for API Config
export const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";
export const API_URL = `${BASE_URL}/api/auth`;

// Helper for Image URLs (if they are relative paths from DB)
export const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";

    // 1. If it's already a full URL or base64, return it
    if (typeof path === 'string' && (path.startsWith('http') || path.startsWith('data:'))) {
        return path;
    }

    // 2. Special case for 3D icons in the public folder
    if (typeof path === 'string' && (path.includes('3d-icons') || path.startsWith('/3d-icons'))) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    // 3. Normalize path: replace all backslashes with forward slashes
    let cleanPath = path.toString().replace(/\\/g, '/');

    // 4. Handle cases where the path might be an absolute local path from another machine
    if (cleanPath.includes('uploads/')) {
        cleanPath = 'uploads/' + cleanPath.split('uploads/').pop();
    }

    // 5. Remove any leading slash from the path to prevent double slashes with BASE_URL
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }

    // 6. Ensure we use the current BASE_URL (which might be local or prod)
    const finalUrl = `${BASE_URL}/${cleanPath}`;
    return finalUrl;
};

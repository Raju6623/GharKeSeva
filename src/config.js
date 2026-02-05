
// Central Configuration for API Config
export const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:3001";
export const API_URL = `${BASE_URL}/api/auth`;

// Helper for Image URLs (if they are relative paths from DB)
export const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith('http') || path.startsWith('data:')) return path;

    // Check if it's a 3D icon from public folder
    if (path.includes('3d-icons') || path.startsWith('/3d-icons')) {
        return path.startsWith('/') ? path : `/${path}`;
    }

    return `${BASE_URL}/${path}`;
};

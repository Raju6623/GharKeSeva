
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

    // 2. Normalize path: replace all backslashes with forward slashes
    let cleanPath = path.toString().replace(/\\/g, '/');

    // 3. Special case for frontend public folder assets
    // These folders exist in the frontend's public directory and should not use BASE_URL (backend)
    const publicFolders = ['3d-icons', 'Saloon', 'Plumbing', 'AC Service', 'Electronic', 'HomePageHero', 'Offer', 'Review'];
    const isPublicAsset = publicFolders.some(folder =>
        cleanPath.includes(folder + '/') || cleanPath.startsWith(folder + '/') || cleanPath.startsWith('/' + folder + '/')
    );

    if (isPublicAsset) {
        // Return relative to frontend root
        return cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
    }

    // 4. Handle backend uploads
    if (cleanPath.includes('uploads/')) {
        // Ensure it starts with uploads/ and nothing else before it (like absolute paths)
        cleanPath = 'uploads/' + cleanPath.split('uploads/').pop();
    } else {
        // If it's a simple filename, assume it's in the uploads folder on the backend
        // But only if it's not already handled as a public asset
        if (!cleanPath.startsWith('uploads/')) {
            cleanPath = 'uploads/' + cleanPath;
        }
    }

    // 5. Remove any leading slash from the backend path to prevent double slashes with BASE_URL
    if (cleanPath.startsWith('/')) {
        cleanPath = cleanPath.substring(1);
    }

    // 6. Ensure we use the current BASE_URL for all backend-hosted assets
    // We trim any trailing slash from BASE_URL to be safe
    const finalUrl = `${BASE_URL.replace(/\/$/, '')}/${cleanPath}`;
    return finalUrl;
};

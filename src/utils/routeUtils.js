/**
 * Utility to map backend service categories to frontend routes.
 * This ensures that clicking a service on the Home Page leads to the correct page.
 */
export const getServiceRoute = (category) => {
    if (!category) return '/services';

    const cat = category.toLowerCase();

    // Specific Service Pages
    if (cat.includes('ac')) return '/services/acservice';
    if (cat.includes('carpenter')) return '/services/carpenter-service';
    if (cat.includes('appliance')) return '/services/appliances-service';
    if (cat.includes('electrician')) return '/services/electrician-service';
    if (cat.includes('house maid') || cat.includes('cleaning')) return '/services/house-maid-service';
    if (cat.includes('maid')) return '/services/maid-service';
    if (cat.includes('painting')) return '/services/painting-service';
    if (cat.includes('salon')) return '/services/salon-for-women';
    if (cat.includes('plumbing')) return '/services/plumbing-service';
    if (cat.includes('ro service')) return '/services/ro-service';
    if (cat.includes('smart lock')) return '/services/smartlock-service';

    // Fallback to search results with normalized slug
    const slug = category.toLowerCase().replace(/\s+/g, '-');
    return `/services/${slug}`;
};

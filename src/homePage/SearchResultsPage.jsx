import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchServices } from '../redux/thunks/serviceThunks';
import ServicePageLayout from '../ServiceSection/ServicePageLayout';
import { SERVICE_CONFIG, DEFAULT_CATEGORIES } from '../utils/serviceConfig';
import useTranslation from '../hooks/useTranslation';
import { SearchX } from 'lucide-react';

function SearchResultsPage() {
    const location = useLocation();
    const { category } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { t } = useTranslation();

    const { availableServices } = useSelector((state) => state.services);
    const [pageTitle, setPageTitle] = useState(t('our_services') || "Our Services");
    const [searchQuery, setSearchQuery] = useState("");
    const [hasResults, setHasResults] = useState(true);

    // Get configuration for current category if exists
    const config = SERVICE_CONFIG[category];

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const q = searchParams.get('q');
        setSearchQuery(q || "");

        if (config) {
            setPageTitle(t(config.title));
        } else if (category) {
            const normalized = category.replace(/-/g, ' ');
            setPageTitle(normalized.charAt(0).toUpperCase() + normalized.slice(1));
        } else if (q) {
            setPageTitle(`${t('search_results')}: "${q}"`);
        } else {
            setPageTitle(t('all_services'));
        }
    }, [location.search, category, config, t]);

    // Check if search query has any matching services
    useEffect(() => {
        if (searchQuery && availableServices.length > 0) {
            const query = searchQuery.toLowerCase();
            const hasMatch = availableServices.some(service => {
                const name = (service.packageName || "").toLowerCase();
                const cat = (service.category || "").toLowerCase();
                const serviceCat = (service.serviceCategory || "").toLowerCase();
                const tags = (service.tag || "").toLowerCase();

                return name.includes(query) ||
                    cat.includes(query) ||
                    serviceCat.includes(query) ||
                    tags.includes(query);
            });
            setHasResults(hasMatch);
        } else {
            setHasResults(true); // Default to true if no search query
        }
    }, [searchQuery, availableServices]);

    const initialService = category ? category.replace(/-/g, ' ') : (new URLSearchParams(location.search).get('q') || t('all_services'));

    // Translate categories before passing
    const translatedCategories = (config?.categories || DEFAULT_CATEGORIES).map(cat => ({
        ...cat,
        label: t(cat.label)
    }));

    // If search query exists but no results found, show custom "No Results" page
    if (searchQuery && !hasResults) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <SearchX size={48} className="text-slate-300" />
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-3">
                            No services found for "{searchQuery}"
                        </h1>
                        <p className="text-slate-500 text-lg mb-8 max-w-md mx-auto">
                            We couldn't find any services matching your search. Try different keywords or browse our popular services.
                        </p>
                        <div className="flex gap-4 justify-center flex-wrap">
                            <button
                                onClick={() => navigate('/')}
                                className="bg-[#0c8182] text-white font-bold px-8 py-3 rounded-xl hover:bg-[#0a6d6d] transition-all shadow-lg"
                            >
                                Go to Home
                            </button>
                            <button
                                onClick={() => navigate('/services/ac')}
                                className="bg-white text-slate-900 border-2 border-slate-200 font-bold px-8 py-3 rounded-xl hover:bg-slate-50 transition-all"
                            >
                                Browse AC Services
                            </button>
                        </div>

                        {/* Popular searches */}
                        <div className="mt-12 pt-8 border-t border-slate-200">
                            <h3 className="text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
                                Popular Searches
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['AC Service', 'Salon', 'Cleaning', 'Plumbing', 'Electrician'].map((term) => (
                                    <button
                                        key={term}
                                        onClick={() => navigate(`/services?q=${term}`)}
                                        className="px-4 py-2 bg-slate-50 text-slate-700 rounded-lg text-sm font-semibold hover:bg-[#effafa] hover:text-[#0c8182] transition-all"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <ServicePageLayout
            title={config?.title ? t(config.title) : pageTitle}
            breadcrumb={config?.breadcrumb ? t(config.breadcrumb) : pageTitle}
            initialServiceType={initialService}
            categories={translatedCategories}
            reviewServiceId={config?.reviewServiceId || "general"}
            category={config?.category || category}
            genderType={config?.genderType}
            searchQuery={searchQuery}
        />
    );
}

export default SearchResultsPage;

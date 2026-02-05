import { useSelector } from 'react-redux';
import { translations } from '../utils/translations';

const useTranslation = () => {
    const { language } = useSelector((state) => state.auth);
    // Default to English if language is not set or not found in translations
    const currentLang = translations[language] ? language : 'English';

    return {
        t: (key) => translations[currentLang][key] || key, // Fallback to key if not found
        language: currentLang
    };
};

export default useTranslation;

// Language Persistence System
const LanguagePersistence = {
    // Available languages
    SUPPORTED_LANGUAGES: ['en', 'de', 'fr'],
    DEFAULT_LANGUAGE: 'en',

    // LocalStorage key
    STORAGE_KEY: 'preferred_language',

    // Get the user's preferred language
    getPreferredLanguage() {
        // Check localStorage first
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (stored && this.SUPPORTED_LANGUAGES.includes(stored)) {
            return stored;
        }

        // Check browser language
        const browserLang = navigator.language.split('-')[0];
        if (this.SUPPORTED_LANGUAGES.includes(browserLang)) {
            this.setPreferredLanguage(browserLang);
            return browserLang;
        }

        // Fall back to default
        this.setPreferredLanguage(this.DEFAULT_LANGUAGE);
        return this.DEFAULT_LANGUAGE;
    },

    // Set the preferred language
    setPreferredLanguage(lang) {
        if (this.SUPPORTED_LANGUAGES.includes(lang)) {
            localStorage.setItem(this.STORAGE_KEY, lang);
            return true;
        }
        return false;
    },

    // Initialize language detection and setting
    init() {
        const currentLang = this.getPreferredLanguage();
        document.documentElement.lang = currentLang;
        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: currentLang }
        }));
    }
};

// Initialize language system when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    LanguagePersistence.init();
});

// Export for use in other modules
export default LanguagePersistence;
// Language Switcher Component
class LanguageSwitcher {
    constructor() {
        this.currentLang = localStorage.getItem('preferredLanguage') || this.getBrowserLanguage() || 'en';
        this.availableLanguages = ['en', 'de', 'fr'];
        this.translations = null;
        this.init();
    }

    // Get browser's preferred language
    getBrowserLanguage() {
        const lang = navigator.language.split('-')[0];
        return this.availableLanguages.includes(lang) ? lang : 'en';
    }

    // Initialize the language switcher
    async init() {
        try {
            // Load translations
            const response = await fetch('/_data/translations.yml');
            const yamlText = await response.text();
            this.translations = jsyaml.load(yamlText);
            
            // Create language switcher UI
            this.createSwitcherUI();
            
            // Initial translation
            this.translatePage();
            
            // Set up event listeners
            this.setupEventListeners();
        } catch (error) {
            console.error('Error initializing language switcher:', error);
        }
    }

    // Create language switcher UI
    createSwitcherUI() {
        const switcher = document.createElement('div');
        switcher.className = 'language-switcher';
        switcher.innerHTML = `
            <div class="language-selector">
                ${this.availableLanguages.map(lang => `
                    <button class="lang-btn ${lang === this.currentLang ? 'active' : ''}" 
                            data-lang="${lang}">
                        ${lang.toUpperCase()}
                    </button>
                `).join('')}
            </div>
        `;
        document.body.appendChild(switcher);
    }

    // Set up event listeners
    setupEventListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const newLang = btn.dataset.lang;
                this.switchLanguage(newLang);
            });
        });
    }

    // Switch language
    async switchLanguage(lang) {
        if (this.currentLang === lang) return;
        
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        
        // Update UI
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Translate page
        await this.translatePage();
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    }

    // Translate page content
    async translatePage() {
        if (!this.translations) return;
        
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.dataset.i18n;
            if (this.translations[key] && this.translations[key][this.currentLang]) {
                element.textContent = this.translations[key][this.currentLang];
            }
        });
        
        // Update document title
        if (this.translations.pageTitle && this.translations.pageTitle[this.currentLang]) {
            document.title = this.translations.pageTitle[this.currentLang];
        }
        
        // Update meta description
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc && this.translations.metaDescription && this.translations.metaDescription[this.currentLang]) {
            metaDesc.setAttribute('content', this.translations.metaDescription[this.currentLang]);
        }
        
        // Reload dynamic content
        await this.reloadDynamicContent();
    }

    // Reload dynamic content (carousels, timeline, etc.)
    async reloadDynamicContent() {
        // Dispatch events to reload various components
        window.dispatchEvent(new CustomEvent('reloadCareer'));
        window.dispatchEvent(new CustomEvent('reloadEducation'));
        window.dispatchEvent(new CustomEvent('reloadSkills'));
        window.dispatchEvent(new CustomEvent('reloadTimeline'));
    }
}

// Initialize language switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});
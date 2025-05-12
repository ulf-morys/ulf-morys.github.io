// YAML Parser and Data Loading Functionality

// Import js-yaml from CDN in index.html
const yamlLoader = {
    cache: new Map(),
    
    // Load YAML file and parse it
    async loadYamlFile(filename) {
        try {
            if (this.cache.has(filename)) {
                return this.cache.get(filename);
            }
            
            const response = await fetch(`/_data/${filename}`);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            
            const yamlText = await response.text();
            const data = jsyaml.load(yamlText);
            this.cache.set(filename, data);
            return data;
        } catch (error) {
            console.error(`Error loading YAML file ${filename}:`, error);
            return null;
        }
    },
    
    // Clear cache for specific file or all files
    clearCache(filename = null) {
        if (filename) {
            this.cache.delete(filename);
        } else {
            this.cache.clear();
        }
    }
};

// Content Manager for dynamic loading
const contentManager = {
    currentLanguage: 'en',
    
    // Initialize content manager
    async init() {
        this.currentLanguage = this.getBrowserLanguage();
        await this.loadTranslations();
        this.setupLanguageToggle();
    },
    
    // Get browser preferred language
    getBrowserLanguage() {
        const browserLang = navigator.language.substring(0, 2);
        return ['en', 'de', 'fr'].includes(browserLang) ? browserLang : 'en';
    },
    
    // Load translations
    async loadTranslations() {
        this.translations = await yamlLoader.loadYamlFile('translations.yml');
    },
    
    // Setup language toggle functionality
    setupLanguageToggle() {
        document.addEventListener('DOMContentLoaded', () => {
            const langToggle = document.getElementById('language-toggle');
            if (langToggle) {
                langToggle.addEventListener('change', (e) => {
                    this.setLanguage(e.target.value);
                });
            }
        });
    },
    
    // Change language and update content
    async setLanguage(lang) {
        if (this.currentLanguage === lang) return;
        this.currentLanguage = lang;
        localStorage.setItem('preferred-language', lang);
        await this.updatePageContent();
    },
    
    // Update all content on page
    async updatePageContent() {
        await Promise.all([
            this.updateCareerCarousel(),
            this.updateAcademicCarousel(),
            this.updateTimeline(),
            this.updateSkills(),
            this.updateContactInfo()
        ]);
    },
    
    // Load and render career data
    async updateCareerCarousel() {
        const careerData = await yamlLoader.loadYamlFile('career.yml');
        if (!careerData) return;
        
        // Implementation will be added in carousel component
    },
    
    // Load and render academic data
    async updateAcademicCarousel() {
        const educationData = await yamlLoader.loadYamlFile('education.yml');
        if (!educationData) return;
        
        // Implementation will be added in carousel component
    },
    
    // Load and render timeline
    async updateTimeline() {
        const careerData = await yamlLoader.loadYamlFile('career.yml');
        const educationData = await yamlLoader.loadYamlFile('education.yml');
        if (!careerData || !educationData) return;
        
        // Implementation will be added in timeline component
    },
    
    // Load and render skills
    async updateSkills() {
        const skillsData = await yamlLoader.loadYamlFile('skills.yml');
        if (!skillsData) return;
        
        // Implementation will be added in skills component
    },
    
    // Load and render contact information
    async updateContactInfo() {
        const personalData = await yamlLoader.loadYamlFile('personal.yml');
        if (!personalData) return;
        
        // Implementation will be added in contact component
    }
};

// Error handling and validation
const dataValidator = {
    validateCareerEntry(entry) {
        const required = ['company', 'position', 'startDate'];
        return required.every(field => entry && entry[field]);
    },
    
    validateEducationEntry(entry) {
        const required = ['institution', 'degree', 'graduationDate'];
        return required.every(field => entry && entry[field]);
    },
    
    validateSkillEntry(entry) {
        const required = ['name', 'category', 'level'];
        return required.every(field => entry && entry[field]);
    }
};

// Export functionality
window.cvApp = {
    yamlLoader,
    contentManager,
    dataValidator
};
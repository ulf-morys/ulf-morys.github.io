// Contact Form Handling and Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = {
        init() {
            this.form = document.getElementById('contact-form');
            this.setupEventListeners();
            this.loadTranslations();
        },

        setupEventListeners() {
            if (this.form) {
                this.form.addEventListener('submit', this.handleSubmit.bind(this));
                this.form.querySelectorAll('input, textarea').forEach(field => {
                    field.addEventListener('input', this.validateField.bind(this));
                });
            }
        },

        async loadTranslations() {
            try {
                const response = await fetch('/_data/translations.yml');
                const translations = jsyaml.load(await response.text());
                this.translations = translations.contact;
                this.updateFormLabels();
            } catch (error) {
                console.error('Error loading translations:', error);
            }
        },

        updateFormLabels() {
            const currentLang = localStorage.getItem('preferredLanguage') || 'en';
            const labels = this.translations[currentLang];
            
            if (labels) {
                Object.keys(labels).forEach(key => {
                    const element = document.querySelector(`[data-translate="${key}"]`);
                    if (element) {
                        element.textContent = labels[key];
                    }
                });
            }
        },

        validateField(event) {
            const field = event.target;
            const value = field.value.trim();
            let isValid = true;

            switch (field.type) {
                case 'email':
                    isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
                    break;
                case 'text':
                case 'textarea':
                    isValid = value.length >= 2;
                    break;
            }

            field.classList.toggle('is-invalid', !isValid);
            return isValid;
        },

        async handleSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(this.form);
            const data = Object.fromEntries(formData.entries());
            
            // Example: Send to a form service or email
            try {
                // Replace with actual form submission logic
                console.log('Form data:', data);
                this.showSuccessMessage();
                this.form.reset();
            } catch (error) {
                console.error('Error submitting form:', error);
                this.showErrorMessage();
            }
        },

        showSuccessMessage() {
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                messageDiv.textContent = this.translations[localStorage.getItem('preferredLanguage') || 'en'].success;
                messageDiv.className = 'success-message';
            }
        },

        showErrorMessage() {
            const messageDiv = document.getElementById('form-message');
            if (messageDiv) {
                messageDiv.textContent = this.translations[localStorage.getItem('preferredLanguage') || 'en'].error;
                messageDiv.className = 'error-message';
            }
        }
    };

    contactForm.init();
});
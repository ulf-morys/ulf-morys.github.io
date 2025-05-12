// Main JavaScript functionality for dynamic CV content loading
document.addEventListener('DOMContentLoaded', function() {
    // Initialize YAML parser and content loader
    const ContentLoader = {
        async loadYAMLData(file) {
            try {
                const response = await fetch(`/_data/${file}.yml`);
                if (!response.ok) throw new Error(`Failed to load ${file}.yml`);
                const yamlText = await response.text();
                return jsyaml.load(yamlText);
            } catch (error) {
                console.error(`Error loading ${file}.yml:`, error);
                return null;
            }
        },

        async initializeContent() {
            // Load all required YAML files
            const [personal, career, education, skills, projects, translations] = await Promise.all([
                this.loadYAMLData('personal'),
                this.loadYAMLData('career'),
                this.loadYAMLData('education'),
                this.loadYAMLData('skills'),
                this.loadYAMLData('projects'),
                this.loadYAMLData('translations')
            ]);

            // Store data in memory for quick access
            this.data = {
                personal,
                career,
                education,
                skills,
                projects,
                translations
            };

            // Initialize UI components
            this.initializeLanguageSelector();
            this.renderMainContent();
        },

        initializeLanguageSelector() {
            const userLang = navigator.language.split('-')[0];
            this.currentLanguage = ['en', 'de', 'fr'].includes(userLang) ? userLang : 'en';
            this.updateLanguageUI();
        },

        updateLanguageUI() {
            document.documentElement.setAttribute('lang', this.currentLanguage);
            this.renderMainContent();
        },

        renderMainContent() {
            if (!this.data) return;
            
            // Render each section based on current language
            this.renderPersonalInfo();
            this.renderCareerCarousel();
            this.renderEducationCarousel();
            this.renderSkills();
            this.renderTimeline();
            this.renderContactInfo();
        },

        renderPersonalInfo() {
            const personalInfo = this.data.personal[this.currentLanguage];
            if (!personalInfo) return;

            // Update personal information in the DOM
            const elements = {
                name: document.getElementById('name'),
                title: document.getElementById('title'),
                summary: document.getElementById('summary')
            };

            for (const [key, element] of Object.entries(elements)) {
                if (element && personalInfo[key]) {
                    element.textContent = personalInfo[key];
                }
            }
        },

        renderCareerCarousel() {
            const careerData = this.data.career[this.currentLanguage];
            if (!careerData || !careerData.positions) return;

            const carouselContainer = document.getElementById('career-carousel');
            if (!carouselContainer) return;

            carouselContainer.innerHTML = careerData.positions
                .map((position, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}" data-position-id="${position.id}">
                        <div class="position-card">
                            <img src="${position.companyLogo}" alt="${position.companyName}" class="company-logo">
                            <h3>${position.title}</h3>
                            <h4>${position.companyName}</h4>
                            <p class="tenure">${position.startDate} - ${position.endDate || 'Present'}</p>
                        </div>
                    </div>
                `).join('');

            // Initialize carousel functionality
            this.initializeCarousel('career-carousel');
        },

        renderEducationCarousel() {
            const educationData = this.data.education[this.currentLanguage];
            if (!educationData || !educationData.institutions) return;

            const carouselContainer = document.getElementById('education-carousel');
            if (!carouselContainer) return;

            carouselContainer.innerHTML = educationData.institutions
                .map((institution, index) => `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}" data-institution-id="${institution.id}">
                        <div class="education-card">
                            <h3>${institution.name}</h3>
                            <h4>${institution.degree}</h4>
                            <p class="period">${institution.startDate} - ${institution.endDate}</p>
                        </div>
                    </div>
                `).join('');

            // Initialize carousel functionality
            this.initializeCarousel('education-carousel');
        },

        renderSkills() {
            const skillsData = this.data.skills[this.currentLanguage];
            if (!skillsData) return;

            const categories = ['soft', 'hard', 'it'];
            categories.forEach(category => {
                const container = document.getElementById(`${category}-skills`);
                if (!container || !skillsData[category]) return;

                container.innerHTML = skillsData[category]
                    .map(skill => `
                        <div class="skill-item">
                            <span class="skill-name">${skill.name}</span>
                            <div class="skill-bar">
                                <div class="skill-level" style="width: ${skill.level}%"></div>
                            </div>
                        </div>
                    `).join('');
            });
        },

        renderTimeline() {
            const careerData = this.data.career[this.currentLanguage];
            if (!careerData || !careerData.positions) return;

            const timelineContainer = document.getElementById('career-timeline');
            if (!timelineContainer) return;

            timelineContainer.innerHTML = careerData.positions
                .map(position => `
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <h3>${position.title}</h3>
                            <h4>${position.companyName}</h4>
                            <p class="timeline-period">${position.startDate} - ${position.endDate || 'Present'}</p>
                        </div>
                    </div>
                `).join('');
        },

        renderContactInfo() {
            const personalInfo = this.data.personal[this.currentLanguage];
            if (!personalInfo || !personalInfo.contact) return;

            const contactContainer = document.getElementById('contact-info');
            if (!contactContainer) return;

            contactContainer.innerHTML = `
                <div class="contact-details">
                    ${personalInfo.contact.email ? `<p><i class="fas fa-envelope"></i> ${personalInfo.contact.email}</p>` : ''}
                    ${personalInfo.contact.phone ? `<p><i class="fas fa-phone"></i> ${personalInfo.contact.phone}</p>` : ''}
                    ${personalInfo.contact.location ? `<p><i class="fas fa-map-marker-alt"></i> ${personalInfo.contact.location}</p>` : ''}
                </div>
                ${this.renderSocialLinks(personalInfo.contact.social)}
            `;
        },

        renderSocialLinks(social) {
            if (!social) return '';
            
            return `
                <div class="social-links">
                    ${social.linkedin ? `<a href="${social.linkedin}" target="_blank"><i class="fab fa-linkedin"></i></a>` : ''}
                    ${social.github ? `<a href="${social.github}" target="_blank"><i class="fab fa-github"></i></a>` : ''}
                    ${social.twitter ? `<a href="${social.twitter}" target="_blank"><i class="fab fa-twitter"></i></a>` : ''}
                </div>
            `;
        },

        initializeCarousel(containerId) {
            const container = document.getElementById(containerId);
            if (!container) return;

            // Add carousel navigation
            const prevBtn = container.querySelector('.carousel-prev');
            const nextBtn = container.querySelector('.carousel-next');

            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.moveCarousel(containerId, 'prev'));
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.moveCarousel(containerId, 'next'));
            }
        },

        moveCarousel(containerId, direction) {
            const container = document.getElementById(containerId);
            if (!container) return;

            const items = container.querySelectorAll('.carousel-item');
            const activeItem = container.querySelector('.carousel-item.active');
            let nextIndex = Array.from(items).indexOf(activeItem);

            if (direction === 'next') {
                nextIndex = (nextIndex + 1) % items.length;
            } else {
                nextIndex = (nextIndex - 1 + items.length) % items.length;
            }

            activeItem.classList.remove('active');
            items[nextIndex].classList.add('active');
        }
    };

    // Initialize the content loader
    ContentLoader.initializeContent();

    // Handle language switching
    document.querySelectorAll('.language-selector button').forEach(button => {
        button.addEventListener('click', () => {
            ContentLoader.currentLanguage = button.dataset.lang;
            ContentLoader.updateLanguageUI();
        });
    });
});
// Main JavaScript functionality for dynamic CV content loading
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed."); // Log DOM ready

    const ContentLoader = {
        data: {}, // Store loaded YAML data
        currentLanguage: 'en', // Default language
        availableLanguages: ['en', 'de', 'fr'],

        // --- Data Loading ---
        async loadYAMLData(file) {
            console.log(`Attempting to load: /_data/${file}.yml`);
            try {
                const response = await fetch(`/_data/${file}.yml`);
                console.log(`Response status for ${file}.yml: ${response.status}`);
                if (!response.ok) {
                    console.error(`Failed to load ${file}.yml. Status: ${response.status}`);
                    return null;
                }
                const yamlText = await response.text();
                const loadedData = jsyaml.load(yamlText);
                console.log(`Successfully loaded and parsed ${file}.yml:`, loadedData);
                return loadedData;
            } catch (error) {
                console.error(`Error loading or parsing ${file}.yml:`, error);
                return null;
            }
        },

        // --- Initialization ---
        async initializeApp() {
            console.log("Initializing app...");
            this.currentLanguage = localStorage.getItem('preferredLanguage') || this.getBrowserLanguage() || 'en';
            document.documentElement.setAttribute('lang', this.currentLanguage);
            console.log(`Initializing with language: ${this.currentLanguage}`);

            console.log("Starting YAML data loading...");
            const [personal, career, education, skills, projects, translations] = await Promise.all([
                this.loadYAMLData('personal'),
                this.loadYAMLData('career'),
                this.loadYAMLData('education'),
                this.loadYAMLData('skills'),
                this.loadYAMLData('projects'),
                this.loadYAMLData('translations')
            ]);
            console.log("Finished YAML data loading.");

            this.data = {
                personal: personal || {},
                career: career || {},
                education: education || {},
                skills: skills || {},
                projects: projects || {},
                translations: translations || {}
            };
            console.log("Stored data object:", JSON.parse(JSON.stringify(this.data))); // Log a deep copy

            if (Object.keys(this.data.personal).length === 0 || Object.keys(this.data.career).length === 0 || Object.keys(this.data.education).length === 0 || Object.keys(this.data.skills).length === 0 || Object.keys(this.data.projects).length === 0 || Object.keys(this.data.translations).length === 0) {
                 console.error("One or more critical YAML files failed to load or are empty. Rendering might be incomplete.");
                 // Display a more prominent error?
                 const body = document.querySelector('body');
                 if (body) {
                    const errorDiv = document.createElement('div');
                    errorDiv.style.backgroundColor = 'red';
                    errorDiv.style.color = 'white';
                    errorDiv.style.padding = '10px';
                    errorDiv.style.position = 'fixed';
                    errorDiv.style.top = '0';
                    errorDiv.style.left = '0';
                    errorDiv.style.width = '100%';
                    errorDiv.style.zIndex = '1000';
                    errorDiv.textContent = 'Error: Failed to load critical site data. Please check console.';
                    body.prepend(errorDiv);
                 }
            }

            console.log("Creating language switcher UI...");
            this.createLanguageSwitcherUI();
            console.log("Rendering all content...");
            this.renderAllContent();
            console.log("Setting up event listeners...");
            this.setupEventListeners();
            console.log("App initialization complete.");
        },

        getBrowserLanguage() {
            const lang = navigator.language.split('-')[0];
            return this.availableLanguages.includes(lang) ? lang : null;
        },

        // --- UI Creation & Event Handling ---
        createLanguageSwitcherUI() {
            const navContainer = document.querySelector('.nav-container');
            if (!navContainer) {
                console.error("Navigation container (.nav-container) not found.");
                return;
            }
            const existingSwitcher = navContainer.querySelector('.language-selector');
            if (existingSwitcher) existingSwitcher.remove();

            const switcher = document.createElement('div');
            switcher.className = 'language-selector';
            switcher.innerHTML = this.availableLanguages.map(lang => `
                <button class="lang-btn ${lang === this.currentLanguage ? 'active' : ''}" data-lang="${lang}">
                    ${lang.toUpperCase()}
                </button>
            `).join('');
            navContainer.appendChild(switcher);
            console.log("Language switcher UI created.");
        },

        setupEventListeners() {
            const navContainer = document.querySelector('.nav-container');
            if (navContainer) {
                navContainer.addEventListener('click', (event) => {
                    if (event.target.matches('.language-selector .lang-btn')) {
                        console.log(`Language button clicked: ${event.target.dataset.lang}`);
                        this.switchLanguage(event.target.dataset.lang);
                    }
                });
            } else { console.error("Cannot add listener: .nav-container not found."); }

            document.body.addEventListener('click', (event) => {
                if (event.target.matches('.carousel-prev')) {
                    const carouselId = event.target.closest('.carousel-container')?.querySelector('.carousel')?.id;
                    console.log(`Prev button clicked for carousel: ${carouselId}`);
                    if (carouselId) this.moveCarousel(carouselId, 'prev');
                }
                if (event.target.matches('.carousel-next')) {
                    const carouselId = event.target.closest('.carousel-container')?.querySelector('.carousel')?.id;
                    console.log(`Next button clicked for carousel: ${carouselId}`);
                    if (carouselId) this.moveCarousel(carouselId, 'next');
                }
            });

            const feedbackForm = document.getElementById('feedback-form');
            if (feedbackForm) {
                feedbackForm.addEventListener('submit', this.handleFeedbackSubmit.bind(this));
            } else { console.warn("Feedback form #feedback-form not found."); }
            console.log("Event listeners set up.");
        },

        switchLanguage(newLang) {
            if (!this.availableLanguages.includes(newLang) || newLang === this.currentLanguage) {
                console.log(`Switch language ignored: ${newLang} (invalid or already active)`);
                return;
            }
            console.log(`Switching language from ${this.currentLanguage} to: ${newLang}`);
            this.currentLanguage = newLang;
            localStorage.setItem('preferredLanguage', newLang);
            document.documentElement.setAttribute('lang', this.currentLanguage);

            document.querySelectorAll('.language-selector .lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.lang === this.currentLanguage);
            });

            console.log("Re-rendering content for new language...");
            this.renderAllContent();
        },

        // --- Rendering Functions ---
        renderAllContent() {
            if (!this.data) {
                console.error("Cannot render content: Data object is missing.");
                return;
            }
            console.log(`Rendering all content for language: ${this.currentLanguage}`);
            this.translateUIElements();
            this.renderPersonalInfo();
            this.renderCareer();
            this.renderEducation();
            this.renderSkills();
            this.renderProjects();
            this.renderContactInfo();
            console.log("Finished rendering all content.");
        },

        getTranslation(key) {
            const langTranslations = this.data.translations?.[this.currentLanguage];
            if (!langTranslations) { /* console.warn(`No translations found for lang: ${this.currentLanguage}`); */ return null; }

            const keyParts = key.split('.');
            let currentLevel = langTranslations;
            for (const part of keyParts) {
                if (currentLevel && typeof currentLevel === 'object' && part in currentLevel) {
                    currentLevel = currentLevel[part];
                } else {
                    return null;
                }
            }
            return typeof currentLevel === 'string' ? currentLevel : null;
        },

        translateUIElements() {
            console.log("Translating UI elements...");
            let translationCount = 0;
            document.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.dataset.i18n;
                const translation = this.getTranslation(key);
                if (translation) {
                    element.textContent = translation;
                    translationCount++;
                } else {
                     // console.warn(`Translation missing for key: ${key}, lang: ${this.currentLanguage}`);
                }
            });
            console.log(`Translated ${translationCount} elements.`);
        },

        renderPersonalInfo() {
            console.log("Rendering Personal Info...");
            const personalData = this.data.personal?.personal?.[this.currentLanguage];
            const container = document.getElementById('personal-info');
            if (!container) { console.error("Element #personal-info not found."); return; }

            console.log("Personal data for rendering:", personalData);
            if (!personalData) {
                container.innerHTML = '<p>Personal information not available.</p>'; return;
            }

            container.innerHTML = `
                ${personalData.name ? `<h1>${personalData.name}</h1>` : ''}
                ${personalData.title ? `<p class="job-title">${personalData.title}</p>` : ''}
                ${personalData.summary ? `<p class="summary">${personalData.summary}</p>` : ''}
            `;
        },

        renderCareer() {
            console.log("Rendering Career...");
            const careerData = this.data.career?.career_positions;
            const carouselContainer = document.getElementById('career-carousel');
            const timelineContainer = document.getElementById('career-timeline');

            console.log("Career data for rendering:", careerData);
            if (!careerData || !Array.isArray(careerData)) {
                if (carouselContainer) carouselContainer.innerHTML = '<p>Career data not available.</p>'; else console.warn("#career-carousel not found");
                if (timelineContainer) timelineContainer.innerHTML = ''; else console.warn("#career-timeline not found");
                return;
            }

            const sortedEntries = [...careerData].sort((a, b) => {
                const dateA = a.tenure?.start ? new Date(a.tenure.start + '-01') : null;
                const dateB = b.tenure?.start ? new Date(b.tenure.start + '-01') : null;
                if (!dateA && !dateB) return 0;
                if (!dateA) return 1;
                if (!dateB) return -1;
                return dateB - dateA;
            });
            console.log("Sorted career entries:", sortedEntries);

            // Render Carousel
            if (carouselContainer) {
                carouselContainer.innerHTML = sortedEntries.map((position, index) => {
                    const title = position.position?.[this.currentLanguage] || 'N/A';
                    const company = position.company || 'N/A';
                    const startDate = position.tenure?.start || 'N/A';
                    const endDate = position.tenure?.end || 'Present';
                    const logo = position.logo || '';
                    const scope = position.scope?.[this.currentLanguage] || '';

                    return `
                        <div class="carousel-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                            <div class="position-card">
                                ${logo ? `<img src="${logo}" alt="${company} logo" class="company-logo">` : ''}
                                <h3>${title}</h3>
                                <h4>${company}</h4>
                                <p class="tenure">${startDate} - ${endDate}</p>
                                ${scope ? `<p class="scope">${scope}</p>` : ''}
                            </div>
                        </div>`;
                }).join('');
                console.log("Career carousel rendered.");
            } else { console.warn("Element #career-carousel not found."); }

            // Timeline rendering removed - handled by carousel now.
            if (timelineContainer) {
                 timelineContainer.innerHTML = ''; // Clear timeline container if it exists
                 console.log("Cleared #career-timeline container.");
            }
        },

        renderEducation() {
            console.log("Rendering Education...");
            const educationData = this.data.education?.education?.[this.currentLanguage];
            const carouselContainer = document.getElementById('education-carousel');

            if (!carouselContainer) { console.error("Element #education-carousel not found."); return; }
            console.log("Education data for rendering:", educationData);
            if (!educationData || !Array.isArray(educationData)) {
                carouselContainer.innerHTML = '<p>Education data not available.</p>'; return;
            }

            const sortedEntries = [...educationData].sort((a, b) => {
                const yearA = parseInt(a.period?.start);
                const yearB = parseInt(b.period?.start);
                if (isNaN(yearA) && isNaN(yearB)) return 0;
                if (isNaN(yearA)) return 1;
                if (isNaN(yearB)) return -1;
                return yearB - yearA;
            });
             console.log("Sorted education entries:", sortedEntries);

            carouselContainer.innerHTML = sortedEntries.map((item, index) => {
                const institution = item.institution || 'N/A';
                const degree = item.degree || 'N/A';
                const startDate = item.period?.start || 'N/A';
                const endDate = item.period?.end || 'N/A';
                const description = item.description || '';
                const grade = item.grade || '';

                return `
                    <div class="carousel-item ${index === 0 ? 'active' : ''}" data-index="${index}">
                        <div class="education-card">
                            <h3>${institution}</h3>
                            <h4>${degree}</h4>
                            <p class="period">${startDate} - ${endDate}</p>
                            ${description ? `<p class="description">${description}</p>` : ''}
                            ${grade ? `<p class="grade">Grade: ${grade}</p>` : ''}
                        </div>
                    </div>`;
            }).join('');
            console.log("Education carousel rendered.");
        },

        renderSkills() {
            console.log("Rendering Skills...");
            const skillsData = this.data.skills;
            if (!skillsData) { console.warn("Skills data object is missing."); return; }
             console.log("Skills data for rendering:", skillsData);

            const categories = [
                { yamlKey: 'soft_skills', containerId: 'soft-skills' },
                { yamlKey: 'hard_skills', containerId: 'hard-skills' },
                { yamlKey: 'it_skills', containerId: 'it-skills' }
            ];

            categories.forEach(cat => {
                console.log(`Rendering skills category: ${cat.yamlKey}`);
                const categoryData = skillsData[cat.yamlKey]?.[this.currentLanguage];
                const container = document.getElementById(cat.containerId);
                const listContainer = container?.querySelector('.skills-list');

                if (!listContainer) {
                     console.warn(`Skills list container (.skills-list) not found within #${cat.containerId}`);
                     if(container) container.innerHTML = `<h3 data-i18n="skills.${cat.yamlKey.split('_')[0]}">${cat.yamlKey.replace('_',' ')}</h3><p>Skills list container missing.</p>`;
                     return;
                }
                 console.log(`Data for ${cat.yamlKey}:`, categoryData);
                if (!categoryData || !Array.isArray(categoryData)) {
                    listContainer.innerHTML = '<p>Skills not available.</p>';
                    return;
                }

                listContainer.innerHTML = categoryData.map(skill => {
                    const name = skill.name || 'N/A';
                    const proficiency = skill.proficiency || 0;
                    const maxRating = 6; // Define max rating
                    const description = skill.description || '';
                    let starsHTML = '';
                    for (let i = 1; i <= maxRating; i++) {
                        starsHTML += i <= proficiency ? '★' : '☆'; // Use ★ for filled, ☆ for empty
                    }

                    return `
                        <div class="skill-item">
                            <span class="skill-name">${name}</span>
                            <div class="skill-rating-container">
                                <span class="skill-stars">${starsHTML}</span>
                            </div>
                            ${description ? `<p class="skill-description">${description}</p>` : ''}
                        </div>`;
                }).join('');
            });
             console.log("Skills section rendered.");
        },

        renderProjects() {
            console.log("Rendering Projects...");
            const projectsData = this.data.projects?.projects?.[this.currentLanguage];
            const container = document.getElementById('projects-grid');
            if (!container) { console.error("Element #projects-grid not found."); return; }

            console.log("Projects data for rendering:", projectsData);
            if (!projectsData || !Array.isArray(projectsData)) {
                container.innerHTML = '<p>Project data not available.</p>'; return;
            }

            container.innerHTML = projectsData.map(project => {
                const title = project.title || 'N/A';
                const description = project.description || '';
                const link = project.link || '#';
                const image = project.image || '';
                const technologies = project.technologies || [];

                return `
                    <div class="project-card">
                        ${image ? `<img src="${image}" alt="${title}" class="project-image">` : ''}
                        <div class="project-content">
                            <h3>${title}</h3>
                            ${description ? `<p>${description}</p>` : ''}
                            ${technologies.length > 0 ? `<p class="technologies"><strong>Technologies:</strong> ${technologies.join(', ')}</p>` : ''}
                            ${link !== '#' ? `<a href="${link}" target="_blank" class="project-link">View Project</a>` : ''}
                        </div>
                    </div>`;
            }).join('');
            console.log("Projects section rendered.");
        },

        renderContactInfo() {
            console.log("Rendering Contact Info...");
            const personalData = this.data.personal?.personal?.[this.currentLanguage];
            const container = document.getElementById('contact-info');
            if (!container) { console.error("Element #contact-info not found."); return; }

            console.log("Contact data (from personal):", personalData);
            if (!personalData) {
                container.innerHTML = '<p>Contact information not available.</p>'; return;
            }

            const email = personalData.email;
            const phone = personalData.phone;
            const location = personalData.location;
            // Assuming social links are language-independent under personal.personal (as per personal.yml structure)
            const social = this.data.personal?.personal; // Get the parent 'personal' object

            let contactHTML = '<div class="contact-details">';
            if (email) contactHTML += `<p><i class="fas fa-envelope"></i> <a href="mailto:${email}">${email}</a></p>`;
            if (phone) contactHTML += `<p><i class="fas fa-phone"></i> ${phone}</p>`;
            if (location) contactHTML += `<p><i class="fas fa-map-marker-alt"></i> ${location}</p>`;
            contactHTML += '</div>';

            // Pass the potentially language-independent social object from the root 'personal'
            contactHTML += this.renderSocialLinks(social); // Pass the parent object
            container.innerHTML = contactHTML;
            console.log("Contact info rendered.");
        },

        renderSocialLinks(personalRootData) {
             // Expecting the root 'personal' object which might contain language-independent social links
             console.log("Rendering social links with data:", personalRootData);
             // Check personal.yml structure - social links seem to be missing?
             // Let's assume they might be under personalRootData.social if added later
             const social = personalRootData?.social; // Example path
             if (!social || typeof social !== 'object') {
                 console.log("No social links data found.");
                 return '';
             }

            let linksHTML = '<div class="social-links">';
            if (social.linkedin) linksHTML += `<a href="//${social.linkedin.replace(/^https?:\/\//,'')}" target="_blank" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>`;
            if (social.github) linksHTML += `<a href="//${social.github.replace(/^https?:\/\//,'')}" target="_blank" aria-label="GitHub"><i class="fab fa-github"></i></a>`;
            if (social.twitter) linksHTML += `<a href="//${social.twitter.replace(/^https?:\/\//,'')}" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>`;
            if (social.website) linksHTML += `<a href="//${social.website.replace(/^https?:\/\//,'')}" target="_blank" aria-label="Website"><i class="fas fa-globe"></i></a>`;
            linksHTML += '</div>';
            console.log("Social links HTML:", linksHTML);
            return linksHTML;
        },


        // --- Carousel Logic ---
        moveCarousel(containerId, direction) {
            const carousel = document.getElementById(containerId);
            if (!carousel) { console.warn(`Carousel container #${containerId} not found for move.`); return; }
            const items = carousel.querySelectorAll('.carousel-item');
            if (items.length === 0) return;

            const activeItem = carousel.querySelector('.carousel-item.active');
            let currentIndex = activeItem ? Array.from(items).indexOf(activeItem) : 0;
            let nextIndex;

            if (direction === 'next') {
                nextIndex = (currentIndex + 1) % items.length;
            } else {
                nextIndex = (currentIndex - 1 + items.length) % items.length;
            }

            if (activeItem) activeItem.classList.remove('active');
            items[nextIndex].classList.add('active');
            console.log(`Moved carousel ${containerId} to index ${nextIndex}`);
        },

        // --- Form Handling ---
        handleFeedbackSubmit(event) {
            event.preventDefault();
            const form = event.target;
            const formData = new FormData(form);
            console.log('Feedback submitted (client-side):', Object.fromEntries(formData));
            alert('Thank you for your feedback! (Submission not implemented)');
            form.reset();
        }
    };

    // Initialize the application
    ContentLoader.initializeApp();
});

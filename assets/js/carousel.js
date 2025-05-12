// Career and Academic Carousels Component
class Carousel {
    constructor(containerId, data, type) {
        this.container = document.getElementById(containerId);
        this.data = data;
        this.type = type;
        this.currentIndex = 0;
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
    }

    render() {
        const carouselHTML = `
            <div class="carousel-container">
                <button class="carousel-btn prev" aria-label="Previous">&#10094;</button>
                <div class="carousel-content"></div>
                <button class="carousel-btn next" aria-label="Next">&#10095;</button>
                <div class="carousel-indicators"></div>
            </div>
        `;
        this.container.innerHTML = carouselHTML;
        this.updateContent();
    }

    updateContent() {
        const content = this.container.querySelector('.carousel-content');
        const item = this.data[this.currentIndex];
        
        let itemHTML = '';
        if (this.type === 'career') {
            itemHTML = `
                <div class="carousel-item" data-index="${this.currentIndex}">
                    <div class="company-logo">
                        <img src="${item.logo || 'assets/images/default-company.png'}" alt="${item.company}">
                    </div>
                    <h3 class="company-name">${item.company}</h3>
                    <p class="position-title">${item.position}</p>
                    <p class="tenure">${item.startDate} - ${item.endDate || 'Present'}</p>
                    <a href="/career/${this.slugify(item.company)}-${this.slugify(item.position)}" 
                       class="details-link">View Details</a>
                </div>
            `;
        } else {
            itemHTML = `
                <div class="carousel-item" data-index="${this.currentIndex}">
                    <h3 class="institution-name">${item.institution}</h3>
                    <p class="qualification">${item.qualification}</p>
                    <p class="study-period">${item.startDate} - ${item.endDate}</p>
                    <a href="/education/${this.slugify(item.institution)}-${this.slugify(item.qualification)}" 
                       class="details-link">View Details</a>
                </div>
            `;
        }
        
        content.innerHTML = itemHTML;
        this.updateIndicators();
    }

    updateIndicators() {
        const indicators = this.container.querySelector('.carousel-indicators');
        indicators.innerHTML = this.data.map((_, index) => `
            <button class="indicator ${index === this.currentIndex ? 'active' : ''}" 
                    data-index="${index}" aria-label="Slide ${index + 1}"></button>
        `).join('');
    }

    attachEventListeners() {
        const prevBtn = this.container.querySelector('.prev');
        const nextBtn = this.container.querySelector('.next');
        const indicators = this.container.querySelector('.carousel-indicators');

        prevBtn.addEventListener('click', () => this.navigate('prev'));
        nextBtn.addEventListener('click', () => this.navigate('next'));
        
        indicators.addEventListener('click', (e) => {
            if (e.target.classList.contains('indicator')) {
                this.currentIndex = parseInt(e.target.dataset.index);
                this.updateContent();
            }
        });

        // Touch events for mobile swipe
        let touchStartX = 0;
        let touchEndX = 0;

        this.container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        this.container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            if (touchStartX - touchEndX > 50) {
                this.navigate('next');
            } else if (touchEndX - touchStartX > 50) {
                this.navigate('prev');
            }
        });
    }

    navigate(direction) {
        if (direction === 'prev') {
            this.currentIndex = (this.currentIndex - 1 + this.data.length) % this.data.length;
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.data.length;
        }
        this.updateContent();
    }

    slugify(text) {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }
}

// Initialize carousels when YAML data is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const careerData = await window.loadYamlData('career');
        const educationData = await window.loadYamlData('education');
        
        new Carousel('career-carousel', careerData, 'career');
        new Carousel('education-carousel', educationData, 'education');
    } catch (error) {
        console.error('Error initializing carousels:', error);
    }
});
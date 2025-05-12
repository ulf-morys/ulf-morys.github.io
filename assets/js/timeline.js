/**
 * Timeline Component
 * Implements a chronological visualization of career progression
 */

class Timeline {
    constructor() {
        this.container = document.getElementById('career-timeline');
        this.careerData = null;
    }

    async initialize() {
        try {
            // Load career data
            const response = await fetch('/_data/career.yml');
            this.careerData = jsyaml.load(await response.text());
            this.render();
        } catch (error) {
            console.error('Failed to initialize timeline:', error);
            this.handleError();
        }
    }

    render() {
        if (!this.careerData || !this.container) return;

        // Sort career entries by date
        const sortedEntries = this.careerData.positions.sort((a, b) => {
            return new Date(b.startDate) - new Date(a.startDate);
        });

        // Create timeline structure
        const timeline = document.createElement('div');
        timeline.className = 'timeline-container';

        sortedEntries.forEach((position, index) => {
            const timelineItem = this.createTimelineItem(position, index);
            timeline.appendChild(timelineItem);
        });

        this.container.appendChild(timeline);
        this.addAnimations();
    }

    createTimelineItem(position, index) {
        const item = document.createElement('div');
        item.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
        
        const content = document.createElement('div');
        content.className = 'timeline-content';
        
        // Add company logo if available
        if (position.companyLogo) {
            const logo = document.createElement('img');
            logo.src = position.companyLogo;
            logo.alt = position.companyName;
            logo.className = 'company-logo';
            content.appendChild(logo);
        }

        // Add position details
        const title = document.createElement('h3');
        title.textContent = position.title;
        content.appendChild(title);

        const company = document.createElement('h4');
        company.textContent = position.companyName;
        content.appendChild(company);

        const date = document.createElement('p');
        date.className = 'timeline-date';
        date.textContent = `${position.startDate} - ${position.endDate || 'Present'}`;
        content.appendChild(date);

        // Add brief description
        const description = document.createElement('p');
        description.textContent = position.briefDescription;
        content.appendChild(description);

        item.appendChild(content);
        return item;
    }

    addAnimations() {
        // Add scroll-based animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.2
        });

        document.querySelectorAll('.timeline-item').forEach(item => {
            observer.observe(item);
        });
    }

    handleError() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="error-message">
                    <p>Failed to load timeline data. Please try again later.</p>
                </div>
            `;
        }
    }
}

// Initialize timeline when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const timeline = new Timeline();
    timeline.initialize();
});
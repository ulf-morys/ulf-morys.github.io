// Skills Visualization Component
class SkillsVisualization {
    constructor() {
        this.skillsData = null;
    }

    async init() {
        try {
            const response = await fetch('/_data/skills.yml');
            this.skillsData = jsyaml.load(await response.text());
            this.render();
        } catch (error) {
            console.error('Error loading skills data:', error);
        }
    }

    createRatingBar(proficiency) {
        const maxRating = 6;
        const percentage = (proficiency / maxRating) * 100;
        return `
            <div class="skill-rating-container">
                <div class="skill-rating-bar" style="width: ${percentage}%"></div>
                <span class="skill-rating-text">${proficiency}/${maxRating}</span>
            </div>
        `;
    }

    render() {
        const container = document.getElementById('skills-section');
        if (!container || !this.skillsData) return;

        const categories = ['softSkills', 'hardSkills', 'itSkills'];
        const html = categories.map(category => {
            const skills = this.skillsData[category] || [];
            return `
                <div class="skills-category" id="${category}">
                    <h3>${this.formatCategoryTitle(category)}</h3>
                    <div class="skills-grid">
                        ${skills.map(skill => `
                            <div class="skill-item">
                                <div class="skill-header">
                                    <span class="skill-name">${skill.name}</span>
                                </div>
                                ${this.createRatingBar(skill.proficiency)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    formatCategoryTitle(category) {
        return category
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .replace('Skills', ' Skills');
    }
}

// Initialize skills visualization
document.addEventListener('DOMContentLoaded', () => {
    const skillsViz = new SkillsVisualization();
    skillsViz.init();
});
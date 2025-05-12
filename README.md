# Dynamic CV Website for GitHub Pages

A professional, multi-language CV/resume website that dynamically loads content from YAML files. Built for GitHub Pages with responsive design and modern features.

## Project Structure

```
dynamic-cv/
├── _data/                  # YAML data files
│   ├── personal.yml       # Personal information
│   ├── career.yml        # Career history
│   ├── education.yml     # Education history
│   ├── skills.yml        # Skills categories
│   ├── projects.yml      # Project highlights
│   ├── translations.yml  # Multi-language translations
│   └── seo.yml          # SEO metadata
├── assets/
│   ├── css/
│   │   ├── main.css     # Core styles
│   │   ├── grid.css     # Responsive grid system
│   │   └── components.css # Component-specific styles
│   └── js/
│       ├── yaml-parser.js     # YAML parsing functionality
│       ├── main.js           # Core JavaScript
│       ├── carousel.js       # Carousel components
│       ├── timeline.js       # Timeline visualization
│       ├── skills.js         # Skills visualization
│       ├── contact.js        # Contact form handling
│       ├── language-switcher.js # Language switching
│       └── language-persistence.js # Language preferences
├── career/               # Career detail pages
│   └── index.html
├── education/           # Education detail pages
│   └── index.html
├── index.html           # Main page
├── robots.txt           # Search engine directives
└── README.md           # Project documentation
```

## Modifying YAML Content

### Personal Information
Edit `_data/personal.yml`:
```yaml
name:
  en: "John Doe"
  de: "John Doe"
  fr: "John Doe"
title:
  en: "Senior Finance Director"
  de: "Senior Finanzdirektor"
  fr: "Directeur Financier Senior"
contact:
  email: "john.doe@example.com"
  phone: "+1 234 567 890"
  linkedin: "linkedin.com/in/johndoe"
```

### Career History
Edit `_data/career.yml`:
```yaml
positions:
  - company: "Example Corp"
    period:
      start: "2020-01"
      end: "present"
    title:
      en: "Senior Finance Director"
      de: "Senior Finanzdirektor"
      fr: "Directeur Financier Senior"
    description:
      en: "Led financial strategy..."
      de: "Leitete die Finanzstrategie..."
      fr: "A dirigé la stratégie financière..."
```

### Skills
Edit `_data/skills.yml`:
```yaml
categories:
  soft:
    - name:
        en: "Leadership"
        de: "Führung"
        fr: "Leadership"
      level: 5
  hard:
    - name:
        en: "Financial Analysis"
        de: "Finanzanalyse"
        fr: "Analyse Financière"
      level: 6
```

## Deployment to GitHub Pages

1. Create a new GitHub repository named `username.github.io`
2. Clone this repository to your local machine
3. Copy all files from the `dynamic-cv` directory to your repository
4. Push the changes to GitHub:
```bash
git add .
git commit -m "Initial CV website deployment"
git push origin main
```
5. Go to repository Settings > Pages
6. Select `main` branch as source
7. Your site will be available at `https://username.github.io`

## Features

- Responsive design with Midnight Ocean color scheme
- Multi-language support (English, German, French)
- Dynamic content loading from YAML files
- Interactive career and education carousels
- Chronological timeline visualization
- Skills rating system
- Contact form integration
- SEO optimization

## Technical Details

### Color Scheme
- Primary: #001f3f
- Secondary: #003366
- Tertiary: #004080
- Accent: #0059b3
- Highlight: #0077e6

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Dependencies
- No external frameworks required
- Uses native JavaScript (ES6+)
- CSS Grid and Flexbox for layouts

## Future Enhancements

- PDF export functionality
- Additional language support
- Custom theme options
- Integration with professional certification APIs
- Advanced analytics integration

## Troubleshooting

### Common Issues

1. **YAML Loading Errors**
   - Verify YAML syntax at [YAML Validator](http://www.yamllint.com)
   - Check file permissions
   - Ensure proper UTF-8 encoding

2. **Display Issues**
   - Clear browser cache
   - Check browser console for errors
   - Verify CSS media queries for responsive design

3. **Language Switching**
   - Clear localStorage
   - Check browser language settings
   - Verify translations.yml structure

## Support

For issues and feature requests, please create an issue in the GitHub repository.
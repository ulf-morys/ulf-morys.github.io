"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import yaml from 'js-yaml';

interface SkillItem {
  name: string;
  level: number;
  type: 'stars' | 'percentage';
}

interface SkillCategory {
  title: string;
  items: SkillItem[];
}

interface SkillsData {
  skills: {
    hard: SkillCategory;
    soft: SkillCategory;
    it: SkillCategory;
  };
}

const SkillsSection: React.FC = () => {
  const { language } = useLanguage();
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load skills data for the current language
        const skillsResponse = await fetch(`/cv_data/skills_${language}.yaml`);
        const skillsYaml = await skillsResponse.text();
        const parsedSkillsData = yaml.load(skillsYaml) as SkillsData;
        
        // Load UI text for the current language
        const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
        const uiTextYaml = await uiTextResponse.text();
        const parsedUiText = yaml.load(uiTextYaml);
        
        setSkillsData(parsedSkillsData);
        setUiText(parsedUiText);
      } catch (error) {
        console.error('Error loading skills data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  if (loading || !skillsData || !uiText) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Render stars (x out of 6)
  const renderStars = (level: number) => {
    const stars = [];
    const maxStars = 6;
    
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span key={i} className={i <= level ? "skill-star" : "skill-star-empty"}>
          ★
        </span>
      );
    }
    
    return <div className="skill-stars">{stars}</div>;
  };

  // Render percentage bar
  const renderPercentageBar = (percentage: number) => {
    return (
      <div className="skill-percentage-container">
        <div 
          className="skill-percentage-bar" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    );
  };

  // Render a skill category
  const renderSkillCategory = (category: SkillCategory) => {
    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold mb-4 text-midnight-ocean-5">{category.title}</h3>
        <div className="space-y-4">
          {category.items.map((skill, index) => (
            <div key={index} className="flex flex-col">
              <div className="flex justify-between mb-1">
                <span>{skill.name}</span>
                {skill.type === 'stars' && <span>{skill.level}/6</span>}
                {skill.type === 'percentage' && <span>{skill.level}%</span>}
              </div>
              {skill.type === 'stars' && renderStars(skill.level)}
              {skill.type === 'percentage' && renderPercentageBar(skill.level)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-midnight-ocean-5">
        {uiText.ui_text?.skills_title || 'Skills & Expertise'}
      </h2>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          {renderSkillCategory(skillsData.skills.hard)}
        </div>
        <div>
          {renderSkillCategory(skillsData.skills.soft)}
        </div>
        <div>
          {renderSkillCategory(skillsData.skills.it)}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;

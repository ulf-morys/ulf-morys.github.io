"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import Link from 'next/link';
import yaml from 'js-yaml';

interface CareerItem {
  id: string;
  company: string;
  logo: string;
  position: string;
  duration: string;
}

interface CareerData {
  career: CareerItem[];
}

const Timeline: React.FC = () => {
  const { language } = useLanguage();
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load career data for the current language
        const careerResponse = await fetch(`/cv_data/career_${language}.yaml`);
        const careerYaml = await careerResponse.text();
        const parsedCareerData = yaml.load(careerYaml) as CareerData;
        
        // Load UI text for the current language
        const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
        const uiTextYaml = await uiTextResponse.text();
        const parsedUiText = yaml.load(uiTextYaml);
        
        setCareerData(parsedCareerData);
        setUiText(parsedUiText);
      } catch (error) {
        console.error('Error loading career data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  if (loading || !careerData || !uiText) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Sort career items in reverse chronological order (most recent first)
  const sortedCareerItems = [...careerData.career].sort((a, b) => {
    // Extract years from duration strings (assuming format like "2019 - Present" or "2015 - 2019")
    const aStartYear = parseInt(a.duration.split(' - ')[0]);
    const bStartYear = parseInt(b.duration.split(' - ')[0]);
    return bStartYear - aStartYear;
  });

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-midnight-ocean-5">
        {uiText.ui_text?.timeline_page_title || 'Career Timeline'}
      </h2>
      
      <div className="timeline-container max-w-4xl mx-auto relative py-8">
        <div className="timeline-line"></div>
        
        {sortedCareerItems.map((item, index) => (
          <div key={item.id} className={`timeline-item ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
            <div className="timeline-item-dot"></div>
            
            <div className={`timeline-item-content ${index % 2 === 0 ? 'ml-auto mr-8' : 'mr-auto ml-8'}`}>
              <div className="mb-3">
                <h3 className="text-xl font-bold">{item.company}</h3>
                <p className="text-lg">{item.position}</p>
                <p className="text-sm text-gray-300">{item.duration}</p>
              </div>
              
              <Link href={`/career/${item.id}`} className="px-3 py-1 bg-midnight-ocean-4 text-white rounded-md hover:bg-midnight-ocean-5 transition-colors inline-block">
                {uiText.ui_text?.view_details || 'View Details'}
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <Link href="/" className="px-4 py-2 bg-midnight-ocean-4 text-white rounded-md hover:bg-midnight-ocean-5 transition-colors inline-block">
          {uiText.ui_text?.home || 'Home'}
        </Link>
      </div>
    </section>
  );
};

export default Timeline;

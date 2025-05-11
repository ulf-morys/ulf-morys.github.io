"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import yaml from 'js-yaml';
import Link from 'next/link';

// Interfaces (can be moved to a types file)
interface StarExample {
  situation: string;
  target: string;
  actions: string;
  result: string;
}

interface CareerDetails {
  scope: string;
  achievements: string[];
  star_examples: StarExample[];
}

interface CareerItem {
  id: string;
  company: string;
  logo: string;
  position: string;
  duration: string;
  details: CareerDetails;
}

interface CareerData {
  career: CareerItem[];
}

interface CareerDetailClientProps {
  initialCareerItem: CareerItem | null; // Pre-fetched data from server component
}

const CareerDetailClient: React.FC<CareerDetailClientProps> = ({ initialCareerItem }) => {
  const params = useParams();
  const { language } = useLanguage();
  const [careerItem, setCareerItem] = useState<CareerItem | null>(initialCareerItem);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(!initialCareerItem); // Only loading if no initial data
  const careerId = params.id as string;

  useEffect(() => {
    // Fetch data client-side if initial data is missing or language changes
    const loadData = async () => {
      if (!careerId) return;
      
      setLoading(true);
      try {
        // Fetch career data for the current language
        const careerResponse = await fetch(`/cv_data/career_${language}.yaml`);
        const careerYaml = await careerResponse.text();
        const parsedCareerData = yaml.load(careerYaml) as CareerData;
        const item = parsedCareerData.career.find(item => item.id === careerId);
        setCareerItem(item || null);

        // Fetch UI text for the current language
        const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
        const uiTextYaml = await uiTextResponse.text();
        const parsedUiText = yaml.load(uiTextYaml);
        setUiText(parsedUiText);

      } catch (error) {
        console.error('Error loading career data client-side:', error);
        setCareerItem(null); // Reset on error
        setUiText(null);
      } finally {
        setLoading(false);
      }
    };

    // Load data if:
    // 1. Initial data was not provided (shouldn't happen in static export but good fallback)
    // 2. Language changes and we have an initial item (to get the correct language version)
    if (!initialCareerItem || (initialCareerItem && initialCareerItem.id === careerId)) {
        loadData();
    } else if (initialCareerItem && initialCareerItem.id !== careerId) {
        // If the initial item ID doesn't match the current param ID (e.g., navigation), load fresh data
        loadData();
    }

  }, [careerId, language, initialCareerItem]); // Rerun on language change or if initial data mismatch

  // Update state if initialCareerItem changes (e.g., navigating between static pages)
  useEffect(() => {
    setCareerItem(initialCareerItem);
    setLoading(!initialCareerItem);
  }, [initialCareerItem]);

  if (loading) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  if (!careerItem || !uiText) {
    return (
      <div className="text-center py-10 text-white">
        <p>Career item not found.</p>
        <Link href="/" className="text-midnight-ocean-5 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  // --- Rendering Logic (copied from previous page.tsx) ---
  return (
    <div className="min-h-screen bg-midnight-ocean-1 text-white p-8">
      <div className="max-w-4xl mx-auto pt-12"> {/* Added padding-top */}
        <Link href="/" className="text-midnight-ocean-5 hover:underline mb-6 inline-block">
          &larr; {uiText.ui_text?.home || 'Home'}
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-midnight-ocean-5">
          {uiText.ui_text?.career_details_title || 'Career Details'}
        </h1>
        
        <div className="bg-midnight-ocean-2 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            {/* Logo placeholder */}
            <div className="w-20 h-20 bg-midnight-ocean-4 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 md:mb-0 md:mr-6">
              {careerItem.company.substring(0, 2)}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{careerItem.company}</h2>
              <p className="text-xl mb-2">{careerItem.position}</p>
              <p className="text-gray-300">{careerItem.duration}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-midnight-ocean-5">
              {uiText.ui_text?.scope_responsibilities || 'Scope & Responsibilities'}
            </h3>
            <div className="whitespace-pre-line">{careerItem.details.scope}</div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-midnight-ocean-5">
              {uiText.ui_text?.achievements || 'Key Achievements'}
            </h3>
            <ul className="list-disc pl-5 space-y-2">
              {careerItem.details.achievements.map((achievement, index) => (
                <li key={index}>{achievement}</li>
              ))}
            </ul>
          </div>
          
          {careerItem.details.star_examples && careerItem.details.star_examples.length > 0 && (
            <div>
              <h3 className="text-xl font-bold mb-3 text-midnight-ocean-5">
                {uiText.ui_text?.star_examples || 'Achievement Highlights (STAR)'}
              </h3>
              
              <div className="space-y-8">
                {careerItem.details.star_examples.map((example, index) => (
                  <div key={index} className="bg-midnight-ocean-3 rounded-lg p-6">
                    <div className="mb-3">
                      <h4 className="font-bold text-midnight-ocean-5">
                        {uiText.ui_text?.situation || 'Situation'}
                      </h4>
                      <p>{example.situation}</p>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-bold text-midnight-ocean-5">
                        {uiText.ui_text?.target || 'Target'}
                      </h4>
                      <p>{example.target}</p>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-bold text-midnight-ocean-5">
                        {uiText.ui_text?.actions || 'Actions'}
                      </h4>
                      <div className="whitespace-pre-line">{example.actions}</div>
                    </div>
                    
                    <div>
                      <h4 className="font-bold text-midnight-ocean-5">
                        {uiText.ui_text?.result || 'Result'}
                      </h4>
                      <p>{example.result}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CareerDetailClient;

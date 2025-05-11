"use client";

import React from 'react';
import { useLanguage } from '@/components/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import CareerCarousel from '@/components/CareerCarousel';
import AcademicCarousel from '@/components/AcademicCarousel';
import SkillsSection from '@/components/SkillsSection';
import Footer from '@/components/Footer';
import YamlLoader from '@/components/YamlLoader'; // Import YamlLoader
import Link from 'next/link';
import { useEffect, useState } from 'react';
import yaml from 'js-yaml';

interface PersonalInfo {
  name: string;
  title: string;
  contact: {
    email: string;
    phone: string;
    linkedin: string;
    xing?: string;
  };
  feedback_email: string;
}

export default function Home() {
  const { language } = useLanguage();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load personal info
        const personalInfoResponse = await fetch('/cv_data/personal_info.yaml');
        const personalInfoYaml = await personalInfoResponse.text();
        const parsedPersonalInfo = yaml.load(personalInfoYaml) as PersonalInfo;
        
        // Load UI text for the current language
        const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
        const uiTextYaml = await uiTextResponse.text();
        const parsedUiText = yaml.load(uiTextYaml);
        
        setPersonalInfo(parsedPersonalInfo);
        setUiText(parsedUiText);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-midnight-ocean-1 text-white">Loading...</div>;
  }

  if (!personalInfo || !uiText) {
    return <div className="flex min-h-screen items-center justify-center bg-midnight-ocean-1 text-white">Error loading data</div>;
  }

  return (
    <main className="min-h-screen bg-midnight-ocean-1 text-white">
      {/* LanguageToggle is now in RootLayout */}
      
      <div className="max-w-5xl mx-auto px-4 py-12">
        <header className="text-center mb-12 pt-12"> {/* Added padding-top to avoid overlap with fixed LanguageToggle */}
          <h1 className="text-4xl font-bold mb-2 text-midnight-ocean-5">{personalInfo.name}</h1>
          <h2 className="text-2xl mb-4">{personalInfo.title}</h2>
        </header>
        
        <CareerCarousel />
        <AcademicCarousel />
        
        <div className="text-center my-10">
          <Link href="/timeline" className="px-4 py-2 bg-midnight-ocean-4 text-white rounded-md hover:bg-midnight-ocean-5 transition-colors inline-block">
            {uiText.ui_text?.timeline_link_text || 'View Full Timeline'}
          </Link>
        </div>
        
        <SkillsSection />
        
        {/* Add YamlLoader for verification */}
        <YamlLoader />
        
      </div>
      
      <Footer />
    </main>
  );
}

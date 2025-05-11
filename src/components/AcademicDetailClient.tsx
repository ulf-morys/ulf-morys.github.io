"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '@/components/LanguageContext';
import yaml from 'js-yaml';
import Link from 'next/link';

// Interfaces (can be moved to a types file)
interface AcademicDetails {
  course: string;
  description: string;
  diploma: string;
  grade: string;
}

interface AcademicItem {
  id: string;
  institution: string;
  time: string;
  details: AcademicDetails;
}

interface AcademicData {
  academic: AcademicItem[];
}

interface AcademicDetailClientProps {
  initialAcademicItem: AcademicItem | null; // Pre-fetched data from server component
}

const AcademicDetailClient: React.FC<AcademicDetailClientProps> = ({ initialAcademicItem }) => {
  const params = useParams();
  const { language } = useLanguage();
  const [academicItem, setAcademicItem] = useState<AcademicItem | null>(initialAcademicItem);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(!initialAcademicItem); // Only loading if no initial data
  const academicId = params.id as string;

  useEffect(() => {
    // Fetch data client-side if initial data is missing or language changes
    const loadData = async () => {
      if (!academicId) return;
      
      setLoading(true);
      try {
        // Fetch academic data for the current language
        const academicResponse = await fetch(`/cv_data/academic_${language}.yaml`);
        const academicYaml = await academicResponse.text();
        const parsedAcademicData = yaml.load(academicYaml) as AcademicData;
        const item = parsedAcademicData.academic.find(item => item.id === academicId);
        setAcademicItem(item || null);

        // Fetch UI text for the current language
        const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
        const uiTextYaml = await uiTextResponse.text();
        const parsedUiText = yaml.load(uiTextYaml);
        setUiText(parsedUiText);

      } catch (error) {
        console.error('Error loading academic data client-side:', error);
        setAcademicItem(null); // Reset on error
        setUiText(null);
      } finally {
        setLoading(false);
      }
    };

    // Load data if:
    // 1. Initial data was not provided
    // 2. Language changes and we have an initial item
    if (!initialAcademicItem || (initialAcademicItem && initialAcademicItem.id === academicId)) {
        loadData();
    } else if (initialAcademicItem && initialAcademicItem.id !== academicId) {
        // If the initial item ID doesn't match the current param ID, load fresh data
        loadData();
    }

  }, [academicId, language, initialAcademicItem]); // Rerun on language change or if initial data mismatch

  // Update state if initialAcademicItem changes
  useEffect(() => {
    setAcademicItem(initialAcademicItem);
    setLoading(!initialAcademicItem);
  }, [initialAcademicItem]);

  if (loading) {
    return <div className="text-center py-10 text-white">Loading...</div>;
  }

  if (!academicItem || !uiText) {
    return (
      <div className="text-center py-10 text-white">
        <p>Academic item not found.</p>
        <Link href="/" className="text-midnight-ocean-5 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  // --- Rendering Logic (copied from previous page.tsx) ---
  return (
    <div className="min-h-screen bg-midnight-ocean-1 text-white p-8">
      <div className="max-w-4xl mx-auto pt-12">
        <Link href="/" className="text-midnight-ocean-5 hover:underline mb-6 inline-block">
          &larr; {uiText.ui_text?.home || 'Home'}
        </Link>
        
        <h1 className="text-3xl font-bold mb-8 text-midnight-ocean-5">
          {uiText.ui_text?.academic_details_title || 'Academic Details'}
        </h1>
        
        <div className="bg-midnight-ocean-2 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center mb-6">
            {/* Institution icon placeholder */}
            <div className="w-20 h-20 bg-midnight-ocean-4 rounded-full flex items-center justify-center text-white text-xl font-bold mb-4 md:mb-0 md:mr-6">
              {academicItem.institution.substring(0, 2)}
            </div>
            
            <div>
              <h2 className="text-2xl font-bold">{academicItem.institution}</h2>
              <p className="text-gray-300">{academicItem.time}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-midnight-ocean-5">
              {uiText.ui_text?.course_study || 'Course of Study'}
            </h3>
            <p className="text-lg">{academicItem.details.course}</p>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold mb-2 text-midnight-ocean-5">
              {uiText.ui_text?.description || 'Description'}
            </h3>
            <div className="whitespace-pre-line">{academicItem.details.description}</div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2 text-midnight-ocean-5">
              {uiText.ui_text?.diploma_grade || 'Diploma & Grade'}
            </h3>
            <p>{academicItem.details.diploma} ({academicItem.details.grade})</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicDetailClient;

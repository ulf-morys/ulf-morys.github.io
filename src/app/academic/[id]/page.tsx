import React from 'react';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import AcademicDetailClient from '@/components/AcademicDetailClient'; // Import the client component

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

// Type for Page props
type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Function to load YAML data at build time
const loadAcademicData = (lang: string): AcademicData => {
  const filePath = path.join(process.cwd(), 'public', 'cv_data', `academic_${lang}.yaml`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents) as AcademicData;
};

// Generate static paths for all academic items in all languages
export async function generateStaticParams() {
  const languages = ['en', 'de', 'fr'];
  const params: { id: string }[] = [];

  languages.forEach(lang => {
    try {
      const data = loadAcademicData(lang);
      data.academic.forEach(item => {
        // Ensure unique IDs are added
        if (!params.some(p => p.id === item.id)) {
          params.push({ id: item.id });
        }
      });
    } catch (error) {
      console.error(`Error loading academic data for lang ${lang} in generateStaticParams:`, error);
    }
  });

  return params;
}

// Server component to fetch data for a specific academic item
async function getAcademicItem(id: string): Promise<AcademicItem | null> {
  // Default to 'en' for pre-rendering. Client component handles language switching.
  const defaultLang = 'en'; 
  try {
    const data = loadAcademicData(defaultLang);
    const item = data.academic.find(item => item.id === id);
    return item || null;
  } catch (error) {
    console.error(`Error loading academic item ${id} for lang ${defaultLang}:`, error);
    return null;
  }
}

// The Page component is now a Server Component
export default async function AcademicDetailPage({ params }: PageProps) { // Use PageProps type
  const academicId = params.id;
  const initialAcademicItem = await getAcademicItem(academicId);

  // Pass the fetched data to the client component
  return <AcademicDetailClient initialAcademicItem={initialAcademicItem} />;
}

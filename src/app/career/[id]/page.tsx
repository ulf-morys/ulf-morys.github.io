import React from 'react';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import CareerDetailClient from '@/components/CareerDetailClient'; // Import the client component

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

// Type for Page props
type PageProps = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

// Function to load YAML data at build time
const loadCareerData = (lang: string): CareerData => {
  const filePath = path.join(process.cwd(), 'public', 'cv_data', `career_${lang}.yaml`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents) as CareerData;
};

// Generate static paths for all career items in all languages
export async function generateStaticParams() {
  const languages = ['en', 'de', 'fr'];
  const params: { id: string }[] = [];

  languages.forEach(lang => {
    try {
      const data = loadCareerData(lang);
      data.career.forEach(item => {
        // Ensure unique IDs are added
        if (!params.some(p => p.id === item.id)) {
          params.push({ id: item.id });
        }
      });
    } catch (error) {
      console.error(`Error loading career data for lang ${lang} in generateStaticParams:`, error);
    }
  });

  return params;
}

// Server component to fetch data for a specific career item
async function getCareerItem(id: string): Promise<CareerItem | null> {
  // For static export, we need to determine the 'default' language data to pre-render.
  // Let's default to 'en'. The client component will handle fetching the correct language.
  const defaultLang = 'en'; 
  try {
    const data = loadCareerData(defaultLang);
    const item = data.career.find(item => item.id === id);
    return item || null;
  } catch (error) {
    console.error(`Error loading career item ${id} for lang ${defaultLang}:`, error);
    return null;
  }
}

// The Page component is now a Server Component
export default async function CareerDetailPage({ params }: PageProps) { // Use PageProps type
  const careerId = params.id;
  const initialCareerItem = await getCareerItem(careerId);

  // Pass the fetched data to the client component
  return <CareerDetailClient initialCareerItem={initialCareerItem} />;
}

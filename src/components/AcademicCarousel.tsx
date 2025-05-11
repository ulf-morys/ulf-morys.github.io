"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import Slider from 'react-slick';
import Link from 'next/link';
import yaml from 'js-yaml';

// Import slick carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface AcademicItem {
  id: string;
  institution: string;
  time: string;
  details: {
    course: string;
    description: string;
    diploma: string;
    grade: string;
  };
}

interface AcademicData {
  academic: AcademicItem[];
}

const AcademicCarousel: React.FC = () => {
  const { language } = useLanguage();
  const [academicData, setAcademicData] = useState<AcademicData | null>(null);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load academic data for the current language
        const academicResponse = await fetch(`/cv_data/academic_${language}.yaml`);
        const academicYaml = await academicResponse.text();
        const parsedAcademicData = yaml.load(academicYaml) as AcademicData;
        
        // Load UI text for the current language
        const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
        const uiTextYaml = await uiTextResponse.text();
        const parsedUiText = yaml.load(uiTextYaml);
        
        setAcademicData(parsedAcademicData);
        setUiText(parsedUiText);
      } catch (error) {
        console.error('Error loading academic data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  if (loading || !academicData || !uiText) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-midnight-ocean-5">
        {uiText.ui_text?.academic_title || 'Academic Background'}
      </h2>
      
      <div className="carousel-container max-w-4xl mx-auto">
        <Slider {...sliderSettings}>
          {academicData.academic.map((item) => (
            <div key={item.id} className="px-4">
              <div className="carousel-item">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    {/* Institution icon placeholder */}
                    <div className="w-16 h-16 bg-midnight-ocean-4 rounded-full flex items-center justify-center text-white">
                      {item.institution.substring(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{item.institution}</h3>
                    <p className="text-lg">{item.details.diploma}</p>
                    <p className="text-sm text-gray-300">{item.time}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link href={`/academic/${item.id}`} className="px-4 py-2 bg-midnight-ocean-4 text-white rounded-md hover:bg-midnight-ocean-5 transition-colors">
                      {uiText.ui_text?.view_details || 'View Details'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default AcademicCarousel;

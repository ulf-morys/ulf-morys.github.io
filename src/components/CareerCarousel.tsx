"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import Slider from 'react-slick';
import Link from 'next/link';
import yaml from 'js-yaml';

// Import slick carousel CSS
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface CareerItem {
  id: string;
  company: string;
  logo: string;
  position: string;
  duration: string;
  details: {
    scope: string;
    achievements: string[];
    star_examples: {
      situation: string;
      target: string;
      actions: string;
      result: string;
    }[];
  };
}

interface CareerData {
  career: CareerItem[];
}

const CareerCarousel: React.FC = () => {
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

  if (loading || !careerData || !uiText) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-midnight-ocean-5">
        {uiText.ui_text?.career_title || 'Career History'}
      </h2>
      
      <div className="carousel-container max-w-4xl mx-auto">
        <Slider {...sliderSettings}>
          {careerData.career.map((item) => (
            <div key={item.id} className="px-4">
              <div className="carousel-item">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div className="mb-4 md:mb-0 md:mr-6">
                    {/* Logo placeholder - in a real implementation, this would display the actual logo */}
                    <div className="w-16 h-16 bg-midnight-ocean-4 rounded-full flex items-center justify-center text-white">
                      {item.company.substring(0, 2)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{item.company}</h3>
                    <p className="text-lg">{item.position}</p>
                    <p className="text-sm text-gray-300">{item.duration}</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Link href={`/career/${item.id}`} className="px-4 py-2 bg-midnight-ocean-4 text-white rounded-md hover:bg-midnight-ocean-5 transition-colors">
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

export default CareerCarousel;

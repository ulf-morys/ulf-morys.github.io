"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
import yaml from 'js-yaml';

// This component demonstrates and verifies dynamic YAML loading functionality
const YamlLoader: React.FC = () => {
  const { language } = useLanguage();
  const [yamlStatus, setYamlStatus] = useState<{
    personal: boolean;
    career: boolean;
    academic: boolean;
    skills: boolean;
    ui: boolean;
  }>({
    personal: false,
    career: false,
    academic: false,
    skills: false,
    ui: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyYamlLoading = async () => {
      try {
        setLoading(true);
        setError(null);
        const status = { ...yamlStatus };
        
        // Test loading personal info
        try {
          const personalInfoResponse = await fetch('/cv_data/personal_info.yaml');
          const personalInfoYaml = await personalInfoResponse.text();
          const parsedPersonalInfo = yaml.load(personalInfoYaml);
          status.personal = !!parsedPersonalInfo;
        } catch (e) {
          console.error('Error loading personal info:', e);
          status.personal = false;
        }
        
        // Test loading career data
        try {
          const careerResponse = await fetch(`/cv_data/career_${language}.yaml`);
          const careerYaml = await careerResponse.text();
          const parsedCareerData = yaml.load(careerYaml);
          status.career = !!parsedCareerData;
        } catch (e) {
          console.error('Error loading career data:', e);
          status.career = false;
        }
        
        // Test loading academic data
        try {
          const academicResponse = await fetch(`/cv_data/academic_${language}.yaml`);
          const academicYaml = await academicResponse.text();
          const parsedAcademicData = yaml.load(academicYaml);
          status.academic = !!parsedAcademicData;
        } catch (e) {
          console.error('Error loading academic data:', e);
          status.academic = false;
        }
        
        // Test loading skills data
        try {
          const skillsResponse = await fetch(`/cv_data/skills_${language}.yaml`);
          const skillsYaml = await skillsResponse.text();
          const parsedSkillsData = yaml.load(skillsYaml);
          status.skills = !!parsedSkillsData;
        } catch (e) {
          console.error('Error loading skills data:', e);
          status.skills = false;
        }
        
        // Test loading UI text
        try {
          const uiTextResponse = await fetch(`/cv_data/ui_text_${language}.yaml`);
          const uiTextYaml = await uiTextResponse.text();
          const parsedUiText = yaml.load(uiTextYaml);
          status.ui = !!parsedUiText;
        } catch (e) {
          console.error('Error loading UI text:', e);
          status.ui = false;
        }
        
        setYamlStatus(status);
      } catch (error) {
        console.error('Error verifying YAML loading:', error);
        setError('Failed to verify YAML loading functionality');
      } finally {
        setLoading(false);
      }
    };

    verifyYamlLoading();
  }, [language]);

  if (loading) {
    return <div className="text-center py-10">Verifying YAML loading functionality...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  const allSuccessful = Object.values(yamlStatus).every(status => status);

  return (
    <div className="bg-midnight-ocean-2 rounded-lg shadow-lg p-6 my-8">
      <h3 className="text-xl font-bold mb-4 text-midnight-ocean-5">YAML Loading Status</h3>
      
      <div className="space-y-2">
        <div className="flex items-center">
          <span className={`w-5 h-5 rounded-full mr-2 ${yamlStatus.personal ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Personal Info: {yamlStatus.personal ? 'Loaded successfully' : 'Failed to load'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-5 h-5 rounded-full mr-2 ${yamlStatus.career ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Career Data ({language}): {yamlStatus.career ? 'Loaded successfully' : 'Failed to load'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-5 h-5 rounded-full mr-2 ${yamlStatus.academic ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Academic Data ({language}): {yamlStatus.academic ? 'Loaded successfully' : 'Failed to load'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-5 h-5 rounded-full mr-2 ${yamlStatus.skills ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>Skills Data ({language}): {yamlStatus.skills ? 'Loaded successfully' : 'Failed to load'}</span>
        </div>
        <div className="flex items-center">
          <span className={`w-5 h-5 rounded-full mr-2 ${yamlStatus.ui ? 'bg-green-500' : 'bg-red-500'}`}></span>
          <span>UI Text ({language}): {yamlStatus.ui ? 'Loaded successfully' : 'Failed to load'}</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 rounded-md bg-midnight-ocean-3">
        <p className={allSuccessful ? 'text-green-400' : 'text-red-400'}>
          {allSuccessful 
            ? 'All YAML files loaded successfully! The website is correctly loading data dynamically from YAML files.' 
            : 'Some YAML files failed to load. Please check the file paths and content.'}
        </p>
      </div>
    </div>
  );
};

export default YamlLoader;

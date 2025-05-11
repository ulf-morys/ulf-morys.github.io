"use client";

import React, { useEffect, useState } from 'react';
import { useLanguage } from './LanguageContext';
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

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [uiText, setUiText] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

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
        console.error('Error loading footer data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [language]);

  const handleFeedbackSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // NOTE: In a real application, this would send data to a backend endpoint or service (e.g., Formspree, Netlify Forms).
    // For this static example, we'll just simulate success/error.
    console.log('Feedback form submitted (simulation). Target email:', personalInfo?.feedback_email);
    
    // Simulate API call
    setFormStatus({ type: 'idle', message: 'Sending...' }); // Optional: show sending state
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
    
    // Simulate success
    setFormStatus({ type: 'success', message: uiText.ui_text?.feedback_success_message || 'Thank you! Your message has been sent.' });
    (event.target as HTMLFormElement).reset(); // Clear form
    
    // // Simulate error (uncomment to test error state)
    // setFormStatus({ type: 'error', message: uiText.ui_text?.feedback_error_message || 'Sorry, there was an error.' });
  };

  if (loading || !personalInfo || !uiText) {
    return <footer className="bg-midnight-ocean-2 py-8 text-center">Loading footer...</footer>;
  }

  return (
    <footer className="bg-midnight-ocean-2 py-12 mt-16">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Information */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-midnight-ocean-5">
            {uiText.ui_text?.contact_info || 'Contact Information'}
          </h3>
          <div className="space-y-2">
            <p><strong>{personalInfo.name}</strong></p>
            <p>{personalInfo.title}</p>
            <p>
              <a href={`mailto:${personalInfo.contact.email}`} className="hover:text-midnight-ocean-5 transition-colors">
                {personalInfo.contact.email}
              </a>
            </p>
            <p>
              <a href={`tel:${personalInfo.contact.phone}`} className="hover:text-midnight-ocean-5 transition-colors">
                {personalInfo.contact.phone}
              </a>
            </p>
            <div className="flex space-x-4 mt-2">
              <a href={personalInfo.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-midnight-ocean-5 transition-colors">
                LinkedIn
              </a>
              {personalInfo.contact.xing && (
                <a href={personalInfo.contact.xing} target="_blank" rel="noopener noreferrer" className="hover:text-midnight-ocean-5 transition-colors">
                  Xing
                </a>
              )}
              {/* Add other social/contact links here if needed */}
            </div>
          </div>
        </div>

        {/* Feedback Form */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-midnight-ocean-5">
            {uiText.ui_text?.feedback_form_title || 'Send Feedback'}
          </h3>
          <form onSubmit={handleFeedbackSubmit} className="feedback-form space-y-4 bg-midnight-ocean-1 p-6 rounded-lg">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium">
                {uiText.ui_text?.feedback_name_label || 'Name'}
              </label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="feedback-input"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                {uiText.ui_text?.feedback_email_label || 'Email'}
              </label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className="feedback-input"
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-1 text-sm font-medium">
                {uiText.ui_text?.feedback_message_label || 'Message'}
              </label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                required 
                className="feedback-input"
              ></textarea>
            </div>
            <div>
              <button type="submit" className="feedback-button">
                {uiText.ui_text?.feedback_send_button || 'Send Message'}
              </button>
            </div>
            {formStatus.message && (
              <p className={`mt-4 text-sm ${formStatus.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {formStatus.message}
              </p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              Note: This form is for demonstration purposes. A backend service is required to send emails.
            </p>
          </form>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

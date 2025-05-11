"use client";

import React from 'react';
import Timeline from '@/components/Timeline';
import LanguageToggle from '@/components/LanguageToggle';

export default function TimelinePage() {
  return (
    <main className="min-h-screen bg-midnight-ocean-1 text-white">
      <LanguageToggle />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Timeline />
      </div>
    </main>
  );
}

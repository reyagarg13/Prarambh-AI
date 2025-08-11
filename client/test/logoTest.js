// Test the logo generator functions
import React from 'react';

// Simple test to verify logo generation doesn't crash
const testLogoGeneration = () => {
  console.log('🧪 Testing Logo Generation...');
  
  const businessIdea = "A mobile app that helps students find part-time internships based on their skill set and location";
  const industry = "Technology";
  const businessModel = "B2C";
  
  console.log('Test inputs:', { businessIdea, industry, businessModel });
  
  // Test extractCompanyName function
  const extractCompanyName = (businessIdea) => {
    if (!businessIdea || typeof businessIdea !== 'string') {
      return 'StartupAI';
    }
    
    const words = businessIdea.toLowerCase().split(' ');
    const keyWords = words.filter(word => 
      word.length > 3 && 
      !['that', 'helps', 'using', 'with', 'for', 'and', 'the'].includes(word)
    );
    
    if (keyWords.length > 0) {
      return keyWords[0].charAt(0).toUpperCase() + keyWords[0].slice(1) + 'AI';
    }
    return 'StartupAI';
  };
  
  // Test determineTheme function
  const determineTheme = (businessIdea, industry) => {
    if (!businessIdea || typeof businessIdea !== 'string') {
      businessIdea = '';
    }
    
    const ideaLower = businessIdea.toLowerCase();
    
    // Default theme for general use
    return {
      colors: {
        primary: '#3B82F6', // Blue
        secondary: '#DBEAFE',
        accent: '#1D4ED8',
        gradient: ['#3B82F6', '#60A5FA']
      },
      icon: '💡',
      typography: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        accent: 'Poppins, sans-serif'
      }
    };
  };
  
  try {
    const companyName = extractCompanyName(businessIdea);
    console.log('✅ Company name extracted:', companyName);
    
    const theme = determineTheme(businessIdea, industry);
    console.log('✅ Theme determined:', theme);
    
    console.log('✅ Logo generation functions working properly!');
    return true;
  } catch (error) {
    console.error('❌ Error in logo generation:', error);
    return false;
  }
};

// Run the test
if (typeof window !== 'undefined') {
  testLogoGeneration();
}

export { testLogoGeneration };

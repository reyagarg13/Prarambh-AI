import React, { useState, useEffect } from 'react';

const LogoGenerator = ({ businessIdea, industry, businessModel, onLogosGenerated }) => {
  const [logos, setLogos] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [brandPalette, setBrandPalette] = useState(null);
  const [error, setError] = useState(null);

  // Generate logos based on startup theme
  const generateLogos = async () => {
    if (!businessIdea || businessIdea.trim() === '') {
      alert('Please enter your business idea in the pitch deck tab first!');
      return;
    }
    
    setGenerating(true);
    setError(null); // Clear any previous errors
    
    try {
      console.log('Starting logo generation for:', businessIdea);
      
      // Simulate AI logo generation with different styles
      const logoStyles = await generateLogoStyles(businessIdea, industry, businessModel);
      console.log('Generated logo styles:', logoStyles);
      setLogos(logoStyles);
      
      // Generate brand palette
      const palette = await generateBrandPalette(businessIdea, industry);
      console.log('Generated brand palette:', palette);
      setBrandPalette(palette);
      
      if (onLogosGenerated) {
        onLogosGenerated({ logos: logoStyles, palette });
      }
      
    } catch (error) {
      console.error('Error generating logos:', error);
      setError(`Failed to generate logos: ${error.message || 'Unknown error'}`);
      // Reset state on error
      setLogos([]);
      setBrandPalette(null);
    } finally {
      setGenerating(false);
    }
  };

  // Generate logo styles based on startup theme
  const generateLogoStyles = async (businessIdea, industry, businessModel) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const companyName = extractCompanyName(businessIdea);
      const theme = determineTheme(businessIdea, industry);
      
      console.log('Company name:', companyName);
      console.log('Theme:', theme);
      
      return [
        {
          id: 1,
          style: 'Modern Minimalist',
          type: 'text',
          design: generateTextLogo(companyName, 'minimalist', theme.colors.primary),
          colors: [theme.colors.primary, theme.colors.secondary],
          description: 'Clean, professional typography-based design'
        },
        {
          id: 2,
          style: 'Icon + Text',
          type: 'combination',
          design: generateCombinationLogo(companyName, theme.icon, theme.colors.primary),
          colors: [theme.colors.primary, theme.colors.accent],
          description: 'Symbol with company name for versatile branding'
        },
        {
          id: 3,
          style: 'Abstract Symbol',
          type: 'symbol',
          design: generateSymbolLogo(theme.icon, theme.colors.gradient),
          colors: theme.colors.gradient,
          description: 'Unique abstract mark representing your brand essence'
        },
        {
          id: 4,
          style: 'Badge Style',
          type: 'badge',
          design: generateBadgeLogo(companyName, theme.colors.primary, theme.colors.secondary),
          colors: [theme.colors.primary, theme.colors.secondary, '#ffffff'],
          description: 'Classic badge design for established brand feel'
        },
        {
          id: 5,
          style: 'Geometric Shape',
          type: 'geometric',
          design: generateGeometricLogo(companyName, theme.colors.gradient),
          colors: theme.colors.gradient,
          description: 'Modern geometric pattern with contemporary appeal'
        }
      ];
    } catch (error) {
      console.error('Error in generateLogoStyles:', error);
      throw error;
    }
  };

  // Generate brand color palette
  const generateBrandPalette = async (businessIdea, industry) => {
    try {
      const theme = determineTheme(businessIdea, industry);
    
      return {
        primary: {
          name: 'Primary',
          hex: theme.colors.primary,
          rgb: hexToRgb(theme.colors.primary),
          usage: 'Main brand color, CTAs, headers'
        },
        secondary: {
          name: 'Secondary', 
          hex: theme.colors.secondary,
          rgb: hexToRgb(theme.colors.secondary),
          usage: 'Supporting elements, backgrounds'
        },
        accent: {
          name: 'Accent',
          hex: theme.colors.accent,
          rgb: hexToRgb(theme.colors.accent),
          usage: 'Highlights, notifications, active states'
        },
        neutral: {
          name: 'Neutral',
          hex: '#6B7280',
          rgb: hexToRgb('#6B7280'),
          usage: 'Text, borders, subtle elements'
        },
        typography: {
          heading: theme.typography.heading,
          body: theme.typography.body,
          accent: theme.typography.accent
        }
      };
    } catch (error) {
      console.error('Error in generateBrandPalette:', error);
      throw error;
    }
  };

  // Extract potential company name from businessIdea
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

  // Determine theme based on industry and businessIdea
  const determineTheme = (businessIdea, industry) => {
    if (!businessIdea || typeof businessIdea !== 'string') {
      businessIdea = '';
    }
    
    const ideaLower = businessIdea.toLowerCase();
    
    if (ideaLower.includes('health') || ideaLower.includes('medical') || ideaLower.includes('fitness')) {
      return {
        colors: {
          primary: '#10B981', // Emerald
          secondary: '#D1FAE5',
          accent: '#059669',
          gradient: ['#10B981', '#34D399']
        },
        icon: '🏥',
        typography: {
          heading: 'Inter, system-ui, sans-serif',
          body: 'Inter, system-ui, sans-serif',
          accent: 'Poppins, sans-serif'
        }
      };
    }
    
    if (ideaLower.includes('food') || ideaLower.includes('restaurant') || ideaLower.includes('delivery')) {
      return {
        colors: {
          primary: '#F97316', // Orange
          secondary: '#FED7AA',
          accent: '#EA580C',
          gradient: ['#F97316', '#FB923C']
        },
        icon: '🍽️',
        typography: {
          heading: 'Poppins, sans-serif',
          body: 'Open Sans, sans-serif',
          accent: 'Playfair Display, serif'
        }
      };
    }
    
    if (ideaLower.includes('education') || ideaLower.includes('learning') || ideaLower.includes('student')) {
      return {
        colors: {
          primary: '#3B82F6', // Blue
          secondary: '#DBEAFE',
          accent: '#1D4ED8',
          gradient: ['#3B82F6', '#60A5FA']
        },
        icon: '📚',
        typography: {
          heading: 'Poppins, sans-serif',
          body: 'Source Sans Pro, sans-serif',
          accent: 'Merriweather, serif'
        }
      };
    }
    
    if (ideaLower.includes('finance') || ideaLower.includes('fintech') || ideaLower.includes('payment')) {
      return {
        colors: {
          primary: '#1F2937', // Dark Gray
          secondary: '#F3F4F6',
          accent: '#10B981',
          gradient: ['#1F2937', '#374151']
        },
        icon: '💰',
        typography: {
          heading: 'Inter, system-ui, sans-serif',
          body: 'Inter, system-ui, sans-serif',
          accent: 'IBM Plex Sans, sans-serif'
        }
      };
    }
    
    // Default tech theme
    return {
      colors: {
        primary: '#6366F1', // Indigo
        secondary: '#E0E7FF',
        accent: '#4F46E5',
        gradient: ['#6366F1', '#8B5CF6']
      },
      icon: '⚡',
      typography: {
        heading: 'Inter, system-ui, sans-serif',
        body: 'Inter, system-ui, sans-serif',
        accent: 'JetBrains Mono, monospace'
      }
    };
  };

  // Generate different logo types (simplified SVG representations)
  const generateTextLogo = (name, style, color) => {
    return {
      type: 'svg',
      content: `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="40" font-family="Inter, sans-serif" font-size="24" font-weight="600" fill="${color}">
          ${name}
        </text>
      </svg>`
    };
  };

  const generateCombinationLogo = (name, icon, color) => {
    return {
      type: 'svg',
      content: `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <circle cx="30" cy="30" r="20" fill="${color}"/>
        <text x="30" y="38" font-size="20" text-anchor="middle" fill="white">${icon}</text>
        <text x="60" y="38" font-family="Inter, sans-serif" font-size="20" font-weight="600" fill="${color}">
          ${name}
        </text>
      </svg>`
    };
  };

  const generateSymbolLogo = (icon, gradient) => {
    return {
      type: 'svg',
      content: `<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${gradient[0]};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${gradient[1]};stop-opacity:1" />
          </linearGradient>
        </defs>
        <circle cx="30" cy="30" r="25" fill="url(#grad1)"/>
        <text x="30" y="40" font-size="24" text-anchor="middle" fill="white">${icon}</text>
      </svg>`
    };
  };

  const generateBadgeLogo = (name, primary, secondary) => {
    const initials = name.substring(0, 2).toUpperCase();
    return {
      type: 'svg',
      content: `<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" fill="${primary}" stroke="${secondary}" stroke-width="4"/>
        <text x="50" y="35" font-family="Inter, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">
          ${initials}
        </text>
        <text x="50" y="65" font-family="Inter, sans-serif" font-size="10" text-anchor="middle" fill="white">
          ${name.split('AI')[0]}
        </text>
      </svg>`
    };
  };

  const generateGeometricLogo = (name, color) => {
    return {
      type: 'svg',
      content: `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,10 40,10 50,30 40,50 10,50 20,30" fill="${color}"/>
        <text x="70" y="38" font-family="Inter, sans-serif" font-size="20" font-weight="600" fill="${color}">
          ${name}
        </text>
      </svg>`
    };
  };

  // Utility function
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const downloadLogo = (logo, format = 'svg') => {
    const element = document.createElement('a');
    const file = new Blob([logo.design.content], { type: `image/${format}` });
    element.href = URL.createObjectURL(file);
    element.download = `logo-${logo.style.replace(/\s+/g, '-').toLowerCase()}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyColorToClipboard = async (color) => {
    try {
      await navigator.clipboard.writeText(color.hex);
      // Show success feedback
      console.log(`Copied ${color.hex} to clipboard`);
    } catch (err) {
      console.error('Failed to copy color:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="logo-generator">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🎨 AI Logo & Branding
        </h2>
        <button
          onClick={generateLogos}
          disabled={generating}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            generating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {generating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating...</span>
            </div>
          ) : (
            '✨ Generate Logos'
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">❌</span>
            <span className="text-sm font-medium text-red-800">Error</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-500 hover:text-red-700 mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {generating && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Creating unique logos and brand identity...</p>
        </div>
      )}

      {logos.length > 0 && (
        <div className="space-y-8">
          {/* Logo Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Logo Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {logos.map((logo) => (
                <div
                  key={logo.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedLogo?.id === logo.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedLogo(logo)}
                >
                  <div className="text-center mb-3">
                    <div
                      className="inline-block p-4 bg-gray-50 rounded-lg"
                      dangerouslySetInnerHTML={{ __html: logo.design.content }}
                    />
                  </div>
                  <h4 className="font-medium text-gray-900">{logo.style}</h4>
                  <p className="text-sm text-gray-600 mt-1">{logo.description}</p>
                  <div className="flex space-x-1 mt-2">
                    {logo.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadLogo(logo);
                    }}
                    className="mt-3 w-full px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
                  >
                    Download SVG
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Palette */}
          {brandPalette && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Brand Color Palette</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(brandPalette).filter(([key]) => key !== 'typography').map(([key, color]) => (
                  <div key={key} className="bg-gray-50 rounded-lg p-4">
                    <div
                      className="w-full h-20 rounded-lg mb-3 cursor-pointer"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyColorToClipboard(color)}
                      title="Click to copy hex code"
                    />
                    <h4 className="font-medium text-gray-900">{color.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{color.hex}</p>
                    <p className="text-sm text-gray-600">
                      RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{color.usage}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Typography */}
          {brandPalette?.typography && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Typography</h3>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Heading Font</h4>
                  <p style={{ fontFamily: brandPalette.typography.heading }} className="text-2xl">
                    {extractCompanyName(idea)} - Innovation Starts Here
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{brandPalette.typography.heading}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Body Font</h4>
                  <p style={{ fontFamily: brandPalette.typography.body }} className="text-base">
                    This is how your body text will look in marketing materials, website content, and documentation.
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{brandPalette.typography.body}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Accent Font</h4>
                  <p style={{ fontFamily: brandPalette.typography.accent }} className="text-lg">
                    Perfect for quotes, callouts, and special emphasis
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{brandPalette.typography.accent}</p>
                </div>
              </div>
            </div>
          )}

          {/* Brand Guidelines */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📋 Brand Usage Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Use primary color for main CTAs, headers, and key brand elements</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Maintain minimum 20px clear space around logos</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Use heading font for titles, body font for paragraphs</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Ensure 4.5:1 contrast ratio for accessibility compliance</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span>Download high-resolution versions for print materials</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {!generating && logos.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🎨</div>
          <h3 className="text-lg font-medium mb-2">Ready to Create Your Brand?</h3>
          {businessIdea && businessIdea.trim() !== '' ? (
            <p className="text-gray-400">
              Click "Generate Logos" to create unique branding based on your startup idea!
            </p>
          ) : (
            <p className="text-gray-400">
              First, enter your business idea in the "📊 Pitch Deck Generator" tab, then return here to generate logos and branding assets.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoGenerator;

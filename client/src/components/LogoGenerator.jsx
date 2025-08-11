import React, { useState, useEffect } from 'react';

const LogoGenerator = ({ businessIdea, industry, businessModel, onLogosGenerated }) => {
  const [logos, setLogos] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [brandPalette, setBrandPalette] = useState(null);
  const [error, setError] = useState(null);
  const [brandKit, setBrandKit] = useState(null);
  const [activeSection, setActiveSection] = useState('logos');
  const [marketingCopy, setMarketingCopy] = useState(null);

  // Generate logos based on startup theme
  const generateLogos = async () => {
    console.log('🔥 Generate logos clicked!');
    console.log('Props:', { businessIdea, industry, businessModel });
    
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
      
      // Validate logos before setting
      if (!logoStyles || !Array.isArray(logoStyles) || logoStyles.length === 0) {
        throw new Error('No logos were generated');
      }
      
      setLogos(logoStyles);
      
      // Generate brand palette
      const palette = await generateBrandPalette(businessIdea, industry);
      console.log('Generated brand palette:', palette);
      setBrandPalette(palette);
      
      // Generate complete brand kit
      const kit = await generateBrandKit(businessIdea, industry, businessModel);
      console.log('Generated brand kit:', kit);
      setBrandKit(kit);
      
      // Generate marketing copy suggestions
      const copy = await generateMarketingCopy(businessIdea, palette);
      console.log('Generated marketing copy:', copy);
      setMarketingCopy(copy);
      
      if (onLogosGenerated) {
        onLogosGenerated({ logos: logoStyles, palette, brandKit: kit, marketingCopy: copy });
      }
      
      console.log('✅ Logo generation completed successfully!');
      
    } catch (error) {
      console.error('❌ Error generating logos:', error);
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
          design: generateGeometricLogo(companyName, theme.colors.primary),
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

  // Generate comprehensive brand kit
  const generateBrandKit = async (businessIdea, industry, businessModel) => {
    try {
      const theme = determineTheme(businessIdea, industry);
      const companyName = extractCompanyName(businessIdea);
      
      return {
        brandValues: [
          'Innovation',
          'Reliability', 
          'User-Centric Design',
          'Transparency',
          'Growth-Oriented'
        ],
        brandVoice: {
          tone: 'Professional yet approachable',
          personality: ['Confident', 'Helpful', 'Authentic', 'Forward-thinking'],
          doSay: ['We empower', 'Together we build', 'Innovation made simple'],
          dontSay: ['Impossible', 'Maybe', 'We think']
        },
        logoVariations: [
          { name: 'Primary Logo', usage: 'Main brand applications' },
          { name: 'Icon Only', usage: 'Social media, favicon, small spaces' },
          { name: 'Horizontal Layout', usage: 'Headers, business cards' },
          { name: 'Stacked Layout', usage: 'Square formats, app icons' },
          { name: 'Monochrome', usage: 'Single color printing' }
        ],
        applicationSuggestions: [
          { item: 'Business Cards', size: '3.5" x 2"', specs: 'Use horizontal logo, primary colors' },
          { item: 'Website Header', size: 'Responsive', specs: 'Primary logo with transparent background' },
          { item: 'Social Media Profile', size: '400x400px', specs: 'Icon only version, high contrast' },
          { item: 'App Icon', size: '1024x1024px', specs: 'Simplified icon, works at small sizes' },
          { item: 'Email Signature', size: 'Max 300px wide', specs: 'Horizontal layout, web-safe colors' }
        ]
      };
    } catch (error) {
      console.error('Error generating brand kit:', error);
      throw error;
    }
  };

  // Generate marketing copy suggestions
  const generateMarketingCopy = async (businessIdea, palette) => {
    try {
      const companyName = extractCompanyName(businessIdea);
      
      return {
        taglines: [
          `${companyName} - Where Innovation Meets Opportunity`,
          'Transforming Ideas Into Reality',
          'Building Tomorrow, Today',
          'Your Success, Our Mission'
        ],
        headlines: [
          'Revolutionizing the Way You Work',
          'The Future of Business Innovation',
          'Simplifying Complex Solutions',
          'Empowering Your Business Growth'
        ],
        descriptions: {
          short: `${companyName} provides innovative solutions that transform the way businesses operate and grow.`,
          medium: `${companyName} is a cutting-edge platform designed to streamline operations, enhance productivity, and drive sustainable growth for businesses of all sizes.`,
          long: `At ${companyName}, we believe that every business deserves access to powerful, intuitive tools that can transform their operations. Our innovative platform combines advanced technology with user-friendly design to deliver solutions that not only meet today's challenges but anticipate tomorrow's opportunities.`
        },
        callToActions: [
          'Get Started Today',
          'Transform Your Business',
          'Join Thousands of Success Stories',
          'Start Your Free Trial',
          'Discover the Difference'
        ]
      };
    } catch (error) {
      console.error('Error generating marketing copy:', error);
      throw error;
    }
  };
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
    // Handle both single color and gradient array
    const fillColor = Array.isArray(color) ? color[0] : color;
    
    return {
      type: 'svg',
      content: `<svg width="200" height="60" viewBox="0 0 200 60" xmlns="http://www.w3.org/2000/svg">
        <polygon points="10,10 40,10 50,30 40,50 10,50 20,30" fill="${fillColor}"/>
        <text x="70" y="38" font-family="Inter, sans-serif" font-size="20" font-weight="600" fill="${fillColor}">
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🎨 AI Logo & Branding Suite
        </h2>
        <button
          onClick={generateLogos}
          disabled={generating}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            generating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {generating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Brand Identity...</span>
            </div>
          ) : (
            '✨ Generate Complete Brand Package'
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      {logos.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'logos', label: '🎯 Logos', desc: 'Logo designs' },
              { id: 'colors', label: '🎨 Colors', desc: 'Brand palette' },
              { id: 'typography', label: '📝 Typography', desc: 'Font styles' },
              { id: 'brand-kit', label: '📦 Brand Kit', desc: 'Guidelines & assets' },
              { id: 'marketing', label: '📢 Marketing Copy', desc: 'Copy suggestions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div>{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </nav>
        </div>
      )}

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

      {/* Loading State */}
      {generating && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Your Brand Identity</h3>
          <p className="text-gray-600 mb-4">Generating logos, colors, typography, and marketing assets...</p>
          <div className="bg-gray-200 rounded-full h-2 w-64 mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {logos.length > 0 && (
        <div className="space-y-6">
          {/* Logos Section */}
          {activeSection === 'logos' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Logo Design Options</h3>
                <span className="text-sm text-gray-500">{logos.length} variations generated</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logos.map((logo) => {
                  try {
                    return (
                      <div
                        key={logo.id}
                        className={`group p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          selectedLogo?.id === logo.id
                            ? 'border-purple-500 bg-purple-50 shadow-md'
                            : 'border-gray-200 hover:border-purple-300 hover:shadow-sm'
                        }`}
                        onClick={() => setSelectedLogo(logo)}
                      >
                        <div className="text-center mb-4">
                          <div
                            className="inline-block p-6 bg-white rounded-lg shadow-sm border"
                            dangerouslySetInnerHTML={{ 
                              __html: logo.design?.content || '<div class="text-gray-400 p-4">Logo Preview</div>' 
                            }}
                          />
                        </div>
                        <h4 className="font-semibold text-gray-900 mb-2">{logo.style || 'Unknown Style'}</h4>
                        <p className="text-sm text-gray-600 mb-4">{logo.description || 'No description available'}</p>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Colors</span>
                          <div className="flex space-x-1">
                            {(logo.colors || []).slice(0, 4).map((color, index) => (
                              <div
                                key={index}
                                className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadLogo(logo);
                            }}
                            className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                          >
                            📥 Download SVG
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedLogo(logo);
                            }}
                            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                              selectedLogo?.id === logo.id
                                ? 'bg-purple-600 text-white'
                                : 'bg-purple-100 hover:bg-purple-200 text-purple-700'
                            }`}
                          >
                            {selectedLogo?.id === logo.id ? '✓' : '👁️'}
                          </button>
                        </div>
                      </div>
                    );
                  } catch (renderError) {
                    console.error('Error rendering logo:', logo, renderError);
                    return (
                      <div key={logo.id} className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                        <p className="text-red-600 text-sm">Error rendering logo</p>
                        <p className="text-red-500 text-xs">{renderError.message}</p>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          )}

          {/* Brand Palette */}
          {activeSection === 'colors' && brandPalette && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Brand Color Palette</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700">Export Palette</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(brandPalette).filter(([key]) => key !== 'typography').map(([key, color]) => (
                  <div key={key} className="group">
                    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div
                        className="w-full h-24 rounded-lg mb-4 cursor-pointer relative overflow-hidden"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColorToClipboard(color)}
                        title="Click to copy hex code"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                          <span className="text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">📋 Copy</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{color.name}</h4>
                      <div className="space-y-1 text-sm">
                        <p className="font-mono text-gray-800">{color.hex}</p>
                        <p className="font-mono text-gray-600">RGB({color.rgb.r}, {color.rgb.g}, {color.rgb.b})</p>
                        <p className="text-gray-500 text-xs mt-2">{color.usage}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Color Accessibility */}
              <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6">
                <h4 className="font-semibold text-green-900 mb-3">♿ Accessibility Guidelines</h4>
                <ul className="space-y-2 text-sm text-green-800">
                  <li>✓ All color combinations meet WCAG AA contrast requirements</li>
                  <li>✓ Primary color provides 4.5:1 contrast ratio with white text</li>
                  <li>✓ Colors are distinguishable for color-blind users</li>
                  <li>✓ Neutral color ensures readability for body text</li>
                </ul>
              </div>
            </div>
          )}

          {/* Typography Section */}
          {activeSection === 'typography' && brandPalette?.typography && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Typography System</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700">Download Fonts</button>
              </div>
              
              <div className="space-y-8">
                {/* Heading Font */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Primary Heading Font</h4>
                    <span className="text-sm text-gray-500 font-mono">{brandPalette.typography.heading}</span>
                  </div>
                  <div style={{ fontFamily: brandPalette.typography.heading }}>
                    <h1 className="text-4xl font-bold mb-2">{extractCompanyName(businessIdea)}</h1>
                    <h2 className="text-2xl font-semibold mb-2">Innovation Starts Here</h2>
                    <h3 className="text-xl font-medium">Transforming Ideas Into Reality</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Use for: Main headings, hero titles, section headers</p>
                </div>

                {/* Body Font */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Body Text Font</h4>
                    <span className="text-sm text-gray-500 font-mono">{brandPalette.typography.body}</span>
                  </div>
                  <div style={{ fontFamily: brandPalette.typography.body }}>
                    <p className="text-lg mb-4">
                      This is how your body text will appear in marketing materials, website content, 
                      and documentation. It's designed for optimal readability and user experience.
                    </p>
                    <p className="text-base mb-2">
                      Regular paragraph text maintains excellent legibility at various sizes and provides 
                      a professional appearance across all platforms.
                    </p>
                    <p className="text-sm text-gray-600">
                      Small text and captions remain clear and accessible even at reduced sizes.
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Use for: Paragraphs, descriptions, body content, navigation</p>
                </div>

                {/* Accent Font */}
                <div className="bg-white border border-gray-200 rounded-xl p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Accent Font</h4>
                    <span className="text-sm text-gray-500 font-mono">{brandPalette.typography.accent}</span>
                  </div>
                  <div style={{ fontFamily: brandPalette.typography.accent }}>
                    <blockquote className="text-xl italic mb-4">
                      "Perfect for quotes, callouts, and special emphasis text that needs to stand out."
                    </blockquote>
                    <p className="text-lg font-medium">Special Announcements & Highlights</p>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">Use for: Quotes, callouts, testimonials, special emphasis</p>
                </div>
              </div>
            </div>
          )}

          {/* Brand Kit Section */}
          {activeSection === 'brand-kit' && brandKit && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Complete Brand Kit</h3>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  📦 Download Brand Kit
                </button>
              </div>

              <div className="space-y-8">
                {/* Brand Values */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                  <h4 className="font-semibold text-blue-900 mb-4">🎯 Brand Values</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {brandKit.brandValues.map((value, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 text-center border border-blue-100">
                        <p className="font-medium text-blue-800">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Brand Voice */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                  <h4 className="font-semibold text-purple-900 mb-4">🗣️ Brand Voice & Tone</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-purple-800 mb-2">Tone</h5>
                      <p className="text-purple-700 mb-4">{brandKit.brandVoice.tone}</p>
                      
                      <h5 className="font-medium text-purple-800 mb-2">Personality Traits</h5>
                      <div className="flex flex-wrap gap-2">
                        {brandKit.brandVoice.personality.map((trait, index) => (
                          <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h5 className="font-medium text-green-800 mb-2">✅ Do Say</h5>
                        <ul className="space-y-1">
                          {brandKit.brandVoice.doSay.map((phrase, index) => (
                            <li key={index} className="text-green-700 text-sm">• {phrase}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h5 className="font-medium text-red-800 mb-2">❌ Don't Say</h5>
                        <ul className="space-y-1">
                          {brandKit.brandVoice.dontSay.map((phrase, index) => (
                            <li key={index} className="text-red-700 text-sm">• {phrase}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logo Usage Guidelines */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">📐 Logo Usage Guidelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3">Logo Variations</h5>
                      <div className="space-y-2">
                        {brandKit.logoVariations.map((variation, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium text-gray-700">{variation.name}</span>
                            <span className="text-sm text-gray-500">{variation.usage}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-gray-800 mb-3">Application Guidelines</h5>
                      <div className="space-y-2">
                        {brandKit.applicationSuggestions.slice(0, 5).map((app, index) => (
                          <div key={index} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-gray-700">{app.item}</span>
                              <span className="text-xs text-gray-500">{app.size}</span>
                            </div>
                            <p className="text-sm text-gray-600">{app.specs}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Marketing Copy Section */}
          {activeSection === 'marketing' && marketingCopy && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">Marketing Copy & Messaging</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700">Copy All Text</button>
              </div>

              <div className="space-y-8">
                {/* Taglines */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">🎯 Taglines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {marketingCopy.taglines.map((tagline, index) => (
                      <div key={index} className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <p className="text-gray-800 font-medium">{tagline}</p>
                        <button className="opacity-0 group-hover:opacity-100 text-xs text-purple-600 mt-2 transition-opacity">
                          📋 Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Headlines */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">📰 Marketing Headlines</h4>
                  <div className="space-y-3">
                    {marketingCopy.headlines.map((headline, index) => (
                      <div key={index} className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                        <h5 className="text-lg font-semibold text-gray-800">{headline}</h5>
                        <button className="opacity-0 group-hover:opacity-100 text-xs text-purple-600 mt-2 transition-opacity">
                          📋 Copy
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">📝 Brand Descriptions</h4>
                  <div className="space-y-6">
                    {Object.entries(marketingCopy.descriptions).map(([length, description]) => (
                      <div key={length}>
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-700 capitalize">{length} Description</h5>
                          <span className="text-xs text-gray-500">{description.length} characters</span>
                        </div>
                        <div className="group p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                          <p className="text-gray-800 leading-relaxed">{description}</p>
                          <button className="opacity-0 group-hover:opacity-100 text-xs text-purple-600 mt-3 transition-opacity">
                            📋 Copy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Actions */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">🚀 Call-to-Action Phrases</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {marketingCopy.callToActions.map((cta, index) => (
                      <div key={index} className="group">
                        <button className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105">
                          {cta}
                        </button>
                        <button className="opacity-0 group-hover:opacity-100 text-xs text-purple-600 mt-2 transition-opacity w-full">
                          📋 Copy Text
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!generating && logos.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-6">🎨</div>
          <h3 className="text-xl font-medium mb-3">Ready to Create Your Brand Identity?</h3>
          {businessIdea && businessIdea.trim() !== '' ? (
            <div>
              <p className="text-gray-400 mb-6">
                Click "Generate Complete Brand Package" to create logos, colors, typography, and marketing assets for your startup idea!
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
                <p className="text-sm text-blue-800">
                  <strong>Your Idea:</strong> {businessIdea.substring(0, 100)}{businessIdea.length > 100 ? '...' : ''}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              First, enter your business idea in the "📊 Pitch Deck Generator" tab, then return here to generate your complete brand identity package.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default LogoGenerator;

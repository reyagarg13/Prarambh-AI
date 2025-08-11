import React, { useState } from 'react';

// Enhanced LogoGenerator test component with more realistic features
const LogoGeneratorTest = ({ businessIdea = "Test AI app that connects students with internships", industry = "Technology" }) => {
  const [logos, setLogos] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [activeSection, setActiveSection] = useState('logos');

  console.log('LogoGeneratorTest rendered with:', { businessIdea, industry });

  const generateLogos = async () => {
    console.log('🔥 Generate logos clicked!');
    console.log('Business idea:', businessIdea);
    
    if (!businessIdea || businessIdea.trim() === '') {
      alert('Please enter your business idea in the pitch deck tab first!');
      return;
    }
    
    setGenerating(true);
    setError(null);
    
    try {
      console.log('🎯 Starting enhanced logo generation...');
      
      // Simulate longer delay for more comprehensive generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const testLogos = [
        {
          id: 1,
          style: 'Modern Minimalist',
          type: 'text',
          design: {
            content: `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="40" text-anchor="start" style="font-family: Inter, sans-serif; font-size: 24px; font-weight: 600; fill: #3B82F6;">
                TestAI
              </text>
            </svg>`
          },
          colors: ['#3B82F6', '#60A5FA'],
          description: 'Clean, professional typography-based design perfect for digital applications'
        },
        {
          id: 2,
          style: 'Icon + Text',
          type: 'combination',
          design: {
            content: `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
              <circle cx="30" cy="30" r="20" fill="#10B981"/>
              <text x="30" y="38" font-size="20" text-anchor="middle" fill="white">🚀</text>
              <text x="60" y="38" style="font-family: Inter, sans-serif; font-size: 20px; font-weight: 600; fill: #10B981;">
                TestAI
              </text>
            </svg>`
          },
          colors: ['#10B981', '#34D399'],
          description: 'Symbol with company name for versatile branding across platforms'
        },
        {
          id: 3,
          style: 'Abstract Symbol',
          type: 'symbol',
          design: {
            content: `<svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#8B5CF6;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#EC4899;stop-opacity:1" />
                </linearGradient>
              </defs>
              <circle cx="30" cy="30" r="25" fill="url(#grad1)"/>
              <text x="30" y="40" font-size="24" text-anchor="middle" fill="white">⚡</text>
            </svg>`
          },
          colors: ['#8B5CF6', '#EC4899'],
          description: 'Unique abstract mark representing innovation and energy'
        },
        {
          id: 4,
          style: 'Badge Style',
          type: 'badge',
          design: {
            content: `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="#1F2937" stroke="#F3F4F6" stroke-width="4"/>
              <text x="50" y="35" font-family="Inter, sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">
                TA
              </text>
              <text x="50" y="65" font-family="Inter, sans-serif" font-size="10" text-anchor="middle" fill="white">
                Test
              </text>
            </svg>`
          },
          colors: ['#1F2937', '#F3F4F6', '#ffffff'],
          description: 'Classic badge design for established, trustworthy brand feel'
        },
        {
          id: 5,
          style: 'Geometric Shape',
          type: 'geometric',
          design: {
            content: `<svg width="200" height="60" xmlns="http://www.w3.org/2000/svg">
              <polygon points="10,10 40,10 50,30 40,50 10,50 20,30" fill="#6366F1"/>
              <text x="70" y="38" font-family="Inter, sans-serif" font-size="20" font-weight="600" fill="#6366F1">
                TestAI
              </text>
            </svg>`
          },
          colors: ['#6366F1', '#8B5CF6'],
          description: 'Modern geometric pattern with contemporary tech appeal'
        }
      ];
      
      console.log('✅ Generated enhanced logos:', testLogos);
      setLogos(testLogos);
      
    } catch (error) {
      console.error('❌ Error generating logos:', error);
      setError(`Failed to generate logos: ${error.message}`);
      setLogos([]);
    } finally {
      setGenerating(false);
    }
  };

  const downloadLogo = (logo, format = 'svg') => {
    const element = document.createElement('a');
    const file = new Blob([logo.design.content], { type: `image/${format}` });
    element.href = URL.createObjectURL(file);
    element.download = `test-logo-${logo.style.replace(/\s+/g, '-').toLowerCase()}.${format}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  console.log('Current state:', { logos: logos.length, generating, error, selectedLogo: selectedLogo?.id });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="logo-generator-test">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🧪 Enhanced Logo Generator Test
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
              <span>Creating Brand Package...</span>
            </div>
          ) : (
            '✨ Generate Test Brand Package'
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      {logos.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'logos', label: '🎯 Logos', desc: 'Logo designs' },
              { id: 'preview', label: '👁️ Preview', desc: 'Selected logo' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
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
            <span className="text-sm font-medium text-red-800">Test Error</span>
          </div>
          <p className="text-sm text-red-600 mt-1">{error}</p>
        </div>
      )}

      {/* Loading */}
      {generating && (
        <div className="text-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-6"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Test Brand Identity</h3>
          <p className="text-gray-600 mb-4">Generating logos and brand assets for testing...</p>
          <div className="bg-gray-200 rounded-full h-2 w-64 mx-auto">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
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
                <h3 className="text-lg font-medium text-gray-900">Test Logo Variations</h3>
                <span className="text-sm text-gray-500">{logos.length} test designs</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logos.map((logo) => (
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
                    <h4 className="font-semibold text-gray-900 mb-2">{logo.style}</h4>
                    <p className="text-sm text-gray-600 mb-4">{logo.description}</p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Test Colors</span>
                      <div className="flex space-x-1">
                        {logo.colors.map((color, index) => (
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
                        📥 Test Download
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
                ))}
              </div>
            </div>
          )}

          {/* Preview Section */}
          {activeSection === 'preview' && selectedLogo && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-6">Selected Logo Preview</h3>
              <div className="bg-white border border-gray-200 rounded-xl p-8">
                <div className="text-center mb-6">
                  <div
                    className="inline-block p-8 bg-gray-50 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: selectedLogo.design.content }}
                  />
                </div>
                <div className="text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{selectedLogo.style}</h4>
                  <p className="text-gray-600 mb-4">{selectedLogo.description}</p>
                  <button
                    onClick={() => downloadLogo(selectedLogo)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    📥 Download Selected Logo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!generating && logos.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-6">🧪</div>
          <h3 className="text-xl font-medium mb-3">Enhanced Logo Generator Test</h3>
          <p className="text-gray-400 mb-4">
            Click "Generate Test Brand Package" to test the enhanced logo generation functionality with improved UI!
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-blue-800">
              <strong>Test Idea:</strong> {businessIdea}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoGeneratorTest;

import React, { useState, useEffect } from 'react';

const WebsiteGenerator = ({ businessIdea, industry, businessModel, brandAssets, onWebsiteGenerated }) => {
  const [websites, setWebsites] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('templates');
  const [previewMode, setPreviewMode] = useState('desktop');

  // Generate websites based on startup theme
  const generateWebsites = async () => {
    if (!businessIdea || businessIdea.trim() === '') {
      alert('Please enter your business idea in the pitch deck tab first!');
      return;
    }
    
    setGenerating(true);
    setError(null);
    
    try {
      console.log('Starting website generation for:', businessIdea);
      
      // Simulate AI website generation with different templates
      const websiteTemplates = await generateWebsiteTemplates(businessIdea, industry, businessModel, brandAssets);
      console.log('Generated website templates:', websiteTemplates);
      setWebsites(websiteTemplates);
      
      if (onWebsiteGenerated) {
        onWebsiteGenerated({ websites: websiteTemplates });
      }
      
      console.log('✅ Website generation completed successfully!');
      
    } catch (error) {
      console.error('❌ Error generating websites:', error);
      setError(`Failed to generate websites: ${error.message || 'Unknown error'}`);
      setWebsites([]);
    } finally {
      setGenerating(false);
    }
  };

  // Generate website templates based on business theme
  const generateWebsiteTemplates = async (businessIdea, industry, businessModel, brandAssets) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const companyName = extractCompanyName(businessIdea);
      const theme = determineTheme(businessIdea, industry);
      const content = generateWebsiteContent(businessIdea, companyName, theme);
      
      return [
        {
          id: 1,
          name: 'Modern Startup',
          type: 'modern',
          description: 'Clean, minimalist design perfect for tech startups',
          html: generateModernTemplate(content, theme),
          features: ['Hero Section', 'Features Grid', 'About Section', 'CTA Buttons', 'Contact Form'],
          preview: 'modern-preview.jpg'
        },
        {
          id: 2,
          name: 'Business Professional',
          type: 'business',
          description: 'Professional layout ideal for B2B services',
          html: generateBusinessTemplate(content, theme),
          features: ['Header Navigation', 'Services Section', 'Testimonials', 'Team Section', 'Footer'],
          preview: 'business-preview.jpg'
        },
        {
          id: 3,
          name: 'Creative Portfolio',
          type: 'creative',
          description: 'Vibrant design for creative and innovative companies',
          html: generateCreativeTemplate(content, theme),
          features: ['Animated Hero', 'Portfolio Gallery', 'Process Section', 'Creative CTA', 'Social Links'],
          preview: 'creative-preview.jpg'
        },
        {
          id: 4,
          name: 'Landing Page Focus',
          type: 'landing',
          description: 'Conversion-optimized single page design',
          html: generateLandingTemplate(content, theme),
          features: ['Compelling Headlines', 'Benefits List', 'Social Proof', 'Lead Capture', 'Urgency Elements'],
          preview: 'landing-preview.jpg'
        }
      ];
    } catch (error) {
      console.error('Error in generateWebsiteTemplates:', error);
      throw error;
    }
  };

  // Generate website content based on business idea
  const generateWebsiteContent = (businessIdea, companyName, theme) => {
    const ideaLower = businessIdea.toLowerCase();
    
    // Generate content based on business type
    const baseContent = {
      companyName,
      tagline: generateTagline(businessIdea, theme),
      heroHeadline: generateHeroHeadline(businessIdea),
      heroSubtext: generateHeroSubtext(businessIdea),
      features: generateFeatures(businessIdea, theme),
      aboutText: generateAboutText(businessIdea, companyName),
      ctaText: generateCTAText(businessIdea),
      contactInfo: {
        email: `hello@${companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
        phone: '+1 (555) 123-4567',
        address: 'San Francisco, CA'
      }
    };

    return baseContent;
  };

  // Helper functions for content generation
  const generateTagline = (businessIdea, theme) => {
    const taglines = [
      'Innovation Meets Opportunity',
      'Transforming Ideas Into Reality',
      'Building Tomorrow, Today',
      'Your Success, Our Mission',
      'Where Vision Becomes Value'
    ];
    return taglines[Math.floor(Math.random() * taglines.length)];
  };

  const generateHeroHeadline = (businessIdea) => {
    if (businessIdea.toLowerCase().includes('app')) {
      return 'The App That Changes Everything';
    } else if (businessIdea.toLowerCase().includes('platform')) {
      return 'The Platform for Modern Innovation';
    } else if (businessIdea.toLowerCase().includes('service')) {
      return 'Service Excellence Redefined';
    }
    return 'Revolutionary Solutions for Modern Challenges';
  };

  const generateHeroSubtext = (businessIdea) => {
    return `Experience the future of ${extractMainConcept(businessIdea)} with our innovative solution that puts your needs first.`;
  };

  const generateFeatures = (businessIdea, theme) => {
    const baseFeatures = [
      {
        icon: '🚀',
        title: 'Fast & Reliable',
        description: 'Lightning-fast performance that scales with your needs'
      },
      {
        icon: '🔒',
        title: 'Secure & Private',
        description: 'Enterprise-grade security protecting your data'
      },
      {
        icon: '💡',
        title: 'Innovative Design',
        description: 'Cutting-edge features with intuitive user experience'
      },
      {
        icon: '📱',
        title: 'Mobile Optimized',
        description: 'Perfect experience across all devices and platforms'
      }
    ];

    // Customize features based on industry
    if (businessIdea.toLowerCase().includes('health')) {
      baseFeatures[0] = {
        icon: '🏥',
        title: 'Healthcare Focused',
        description: 'Built specifically for healthcare professionals and patients'
      };
    } else if (businessIdea.toLowerCase().includes('education')) {
      baseFeatures[0] = {
        icon: '📚',
        title: 'Educational Excellence',
        description: 'Designed to enhance learning and educational outcomes'
      };
    }

    return baseFeatures;
  };

  const generateAboutText = (businessIdea, companyName) => {
    return `${companyName} was founded with a simple mission: to ${extractMainGoal(businessIdea)}. We believe that technology should empower people and businesses to achieve their full potential. Our team of dedicated professionals works tirelessly to deliver innovative solutions that make a real difference in people's lives.`;
  };

  const generateCTAText = (businessIdea) => {
    if (businessIdea.toLowerCase().includes('app')) {
      return 'Download Now';
    } else if (businessIdea.toLowerCase().includes('service')) {
      return 'Get Started Today';
    }
    return 'Try It Free';
  };

  // Template generators
  const generateModernTemplate = (content, theme) => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.companyName} - ${content.tagline}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }
        
        /* Header */
        header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: ${theme.colors?.primary || '#3B82F6'};
        }
        
        .nav-links {
            display: flex;
            list-style: none;
            gap: 2rem;
        }
        
        .nav-links a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            transition: color 0.3s;
        }
        
        .nav-links a:hover {
            color: ${theme.colors?.primary || '#3B82F6'};
        }
        
        .cta-button {
            background: linear-gradient(135deg, ${theme.colors?.primary || '#3B82F6'}, ${theme.colors?.accent || '#8B5CF6'});
            color: white;
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        /* Hero Section */
        .hero {
            background: linear-gradient(135deg, ${theme.colors?.primary || '#3B82F6'}15, ${theme.colors?.secondary || '#E0E7FF'}30);
            padding: 8rem 0 4rem;
            text-align: center;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            font-weight: 800;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, ${theme.colors?.primary || '#3B82F6'}, ${theme.colors?.accent || '#8B5CF6'});
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .hero p {
            font-size: 1.25rem;
            color: #666;
            margin-bottom: 2rem;
            max-width: 600px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .hero-cta {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, ${theme.colors?.primary || '#3B82F6'}, ${theme.colors?.accent || '#8B5CF6'});
            color: white;
            padding: 1rem 2rem;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-secondary {
            background: transparent;
            color: ${theme.colors?.primary || '#3B82F6'};
            padding: 1rem 2rem;
            border: 2px solid ${theme.colors?.primary || '#3B82F6'};
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
        }
        
        .btn-secondary:hover {
            background: ${theme.colors?.primary || '#3B82F6'};
            color: white;
        }
        
        /* Features Section */
        .features {
            padding: 4rem 0;
        }
        
        .section-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 3rem;
            color: #1F2937;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature-card {
            background: white;
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            text-align: center;
            transition: transform 0.3s;
        }
        
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        
        .feature-card h3 {
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1rem;
            color: #1F2937;
        }
        
        .feature-card p {
            color: #666;
            line-height: 1.6;
        }
        
        /* About Section */
        .about {
            background: #F9FAFB;
            padding: 4rem 0;
        }
        
        .about-content {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
            align-items: center;
        }
        
        .about-text h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 2rem;
            color: #1F2937;
        }
        
        .about-text p {
            font-size: 1.1rem;
            color: #666;
            margin-bottom: 2rem;
            line-height: 1.8;
        }
        
        .about-image {
            background: linear-gradient(135deg, ${theme.colors?.primary || '#3B82F6'}20, ${theme.colors?.accent || '#8B5CF6'}20);
            height: 400px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 4rem;
        }
        
        /* CTA Section */
        .final-cta {
            background: linear-gradient(135deg, ${theme.colors?.primary || '#3B82F6'}, ${theme.colors?.accent || '#8B5CF6'});
            color: white;
            padding: 4rem 0;
            text-align: center;
        }
        
        .final-cta h2 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
        }
        
        .final-cta p {
            font-size: 1.25rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }
        
        .final-cta .btn-primary {
            background: white;
            color: ${theme.colors?.primary || '#3B82F6'};
        }
        
        /* Footer */
        footer {
            background: #1F2937;
            color: white;
            padding: 3rem 0 1rem;
        }
        
        .footer-content {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-bottom: 2rem;
        }
        
        .footer-section h3 {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .footer-section p,
        .footer-section a {
            color: #D1D5DB;
            text-decoration: none;
            line-height: 1.8;
        }
        
        .footer-section a:hover {
            color: white;
        }
        
        .footer-bottom {
            border-top: 1px solid #374151;
            padding-top: 1rem;
            text-align: center;
            color: #9CA3AF;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .about-content {
                grid-template-columns: 1fr;
            }
            
            .nav-links {
                display: none;
            }
        }
    </style>
</head>
<body>
    <!-- Header -->
    <header>
        <nav class="container">
            <div class="logo">${content.companyName}</div>
            <ul class="nav-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
            <button class="cta-button">${content.ctaText}</button>
        </nav>
    </header>

    <!-- Hero Section -->
    <section class="hero" id="home">
        <div class="container">
            <h1>${content.heroHeadline}</h1>
            <p>${content.heroSubtext}</p>
            <div class="hero-cta">
                <button class="btn-primary">${content.ctaText}</button>
                <button class="btn-secondary">Learn More</button>
            </div>
        </div>
    </section>

    <!-- Features Section -->
    <section class="features" id="features">
        <div class="container">
            <h2 class="section-title">Why Choose ${content.companyName}?</h2>
            <div class="features-grid">
                ${content.features.map(feature => `
                    <div class="feature-card">
                        <div class="feature-icon">${feature.icon}</div>
                        <h3>${feature.title}</h3>
                        <p>${feature.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section class="about" id="about">
        <div class="container">
            <div class="about-content">
                <div class="about-text">
                    <h2>About ${content.companyName}</h2>
                    <p>${content.aboutText}</p>
                    <button class="btn-primary">Learn Our Story</button>
                </div>
                <div class="about-image">
                    🏢
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA -->
    <section class="final-cta">
        <div class="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied customers who have transformed their business with ${content.companyName}</p>
            <button class="btn-primary">${content.ctaText}</button>
        </div>
    </section>

    <!-- Footer -->
    <footer id="contact">
        <div class="container">
            <div class="footer-content">
                <div class="footer-section">
                    <h3>${content.companyName}</h3>
                    <p>${content.tagline}</p>
                    <p>Building the future, one innovation at a time.</p>
                </div>
                <div class="footer-section">
                    <h3>Contact Info</h3>
                    <p>Email: ${content.contactInfo.email}</p>
                    <p>Phone: ${content.contactInfo.phone}</p>
                    <p>Address: ${content.contactInfo.address}</p>
                </div>
                <div class="footer-section">
                    <h3>Quick Links</h3>
                    <p><a href="#features">Features</a></p>
                    <p><a href="#about">About Us</a></p>
                    <p><a href="#contact">Contact</a></p>
                    <p><a href="#">Privacy Policy</a></p>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2025 ${content.companyName}. All rights reserved. | Generated by Cofoundr AI</p>
            </div>
        </div>
    </footer>
</body>
</html>`;
  };

  const generateBusinessTemplate = (content, theme) => {
    // Similar structure but with business-focused styling
    return generateModernTemplate(content, theme).replace(
      /linear-gradient\(135deg, [^)]+\)/g,
      `linear-gradient(135deg, #1F2937, #374151)`
    ).replace(
      /#3B82F6/g,
      '#1F2937'
    );
  };

  const generateCreativeTemplate = (content, theme) => {
    // Creative template with more vibrant colors and animations
    return generateModernTemplate(content, theme).replace(
      /font-family: 'Inter'/g,
      `font-family: 'Poppins'`
    );
  };

  const generateLandingTemplate = (content, theme) => {
    // Landing page focused on conversion
    return generateModernTemplate(content, theme).replace(
      /<section class="about"[^>]*>[\s\S]*?<\/section>/,
      `<section class="testimonials">
        <div class="container">
          <h2 class="section-title">What Our Customers Say</h2>
          <div class="testimonials-grid">
            <div class="testimonial">
              <p>"${content.companyName} transformed our business completely!"</p>
              <cite>- Sarah Johnson, CEO</cite>
            </div>
          </div>
        </div>
      </section>`
    );
  };

  // Utility functions
  const extractCompanyName = (businessIdea) => {
    if (!businessIdea || typeof businessIdea !== 'string') {
      return 'StartupCo';
    }
    
    const words = businessIdea.toLowerCase().split(' ');
    const keyWords = words.filter(word => 
      word.length > 3 && 
      !['that', 'helps', 'using', 'with', 'for', 'and', 'the', 'which'].includes(word)
    );
    
    if (keyWords.length > 0) {
      return keyWords[0].charAt(0).toUpperCase() + keyWords[0].slice(1) + 'Co';
    }
    return 'StartupCo';
  };

  const extractMainConcept = (businessIdea) => {
    const concepts = businessIdea.toLowerCase().split(' ');
    return concepts.find(word => 
      ['business', 'service', 'platform', 'app', 'solution', 'system'].includes(word)
    ) || 'innovation';
  };

  const extractMainGoal = (businessIdea) => {
    if (businessIdea.toLowerCase().includes('help')) {
      return 'help people achieve their goals';
    } else if (businessIdea.toLowerCase().includes('connect')) {
      return 'connect people and opportunities';
    } else if (businessIdea.toLowerCase().includes('simplify')) {
      return 'simplify complex processes';
    }
    return 'solve real-world problems';
  };

  const determineTheme = (businessIdea, industry) => {
    if (!businessIdea || typeof businessIdea !== 'string') {
      businessIdea = '';
    }
    
    const ideaLower = businessIdea.toLowerCase();
    
    if (ideaLower.includes('health') || ideaLower.includes('medical') || ideaLower.includes('fitness')) {
      return {
        colors: {
          primary: '#10B981',
          secondary: '#D1FAE5',
          accent: '#059669'
        }
      };
    }
    
    if (ideaLower.includes('finance') || ideaLower.includes('fintech') || ideaLower.includes('payment')) {
      return {
        colors: {
          primary: '#1F2937',
          secondary: '#F3F4F6',
          accent: '#10B981'
        }
      };
    }
    
    // Default tech theme
    return {
      colors: {
        primary: '#3B82F6',
        secondary: '#E0E7FF',
        accent: '#8B5CF6'
      }
    };
  };

  const downloadWebsite = (website) => {
    const element = document.createElement('a');
    const file = new Blob([website.html], { type: 'text/html' });
    element.href = URL.createObjectURL(file);
    element.download = `${website.name.replace(/\s+/g, '-').toLowerCase()}-website.html`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const previewWebsite = (website) => {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(website.html);
    newWindow.document.close();
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" data-testid="website-generator">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          🌐 AI Website Generator
        </h2>
        <button
          onClick={generateWebsites}
          disabled={generating}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            generating
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl'
          }`}
        >
          {generating ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Generating Websites...</span>
            </div>
          ) : (
            '✨ Generate Website Templates'
          )}
        </button>
      </div>

      {/* Navigation Tabs */}
      {websites.length > 0 && (
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'templates', label: '🏗️ Templates', desc: 'Website designs' },
              { id: 'preview', label: '👁️ Preview', desc: 'Live preview' },
              { id: 'code', label: '💻 Code', desc: 'HTML/CSS code' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'border-green-500 text-green-600'
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
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto mb-6"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Creating Your Website</h3>
          <p className="text-gray-600 mb-4">Generating responsive templates with hero sections, features, and CTA buttons...</p>
          <div className="bg-gray-200 rounded-full h-2 w-64 mx-auto">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 h-2 rounded-full animate-pulse" style={{width: '80%'}}></div>
          </div>
        </div>
      )}

      {/* Content Sections */}
      {websites.length > 0 && (
        <div className="space-y-6">
          {/* Templates Section */}
          {activeSection === 'templates' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Website Templates</h3>
                <span className="text-sm text-gray-500">{websites.length} templates generated</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {websites.map((website) => (
                  <div
                    key={website.id}
                    className={`group p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedWebsite?.id === website.id
                        ? 'border-green-500 bg-green-50 shadow-md'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                    }`}
                    onClick={() => setSelectedWebsite(website)}
                  >
                    <div className="mb-4">
                      <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center border">
                        <span className="text-gray-500 text-sm">Template Preview</span>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">{website.name}</h4>
                    <p className="text-sm text-gray-600 mb-4">{website.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Features</h5>
                      <div className="flex flex-wrap gap-1">
                        {website.features.slice(0, 3).map((feature, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                          >
                            {feature}
                          </span>
                        ))}
                        {website.features.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{website.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          previewWebsite(website);
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                      >
                        👁️ Live Preview
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadWebsite(website);
                        }}
                        className="flex-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preview Section */}
          {activeSection === 'preview' && selectedWebsite && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Live Preview - {selectedWebsite.name}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`px-3 py-1 text-sm rounded ${
                      previewMode === 'desktop' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    🖥️ Desktop
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`px-3 py-1 text-sm rounded ${
                      previewMode === 'mobile' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    📱 Mobile
                  </button>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={selectedWebsite.html}
                  className={`w-full bg-white ${
                    previewMode === 'mobile' ? 'max-w-sm mx-auto h-96' : 'h-96'
                  }`}
                  title="Website Preview"
                />
              </div>
              
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={() => previewWebsite(selectedWebsite)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  🔗 Open in New Tab
                </button>
                <button
                  onClick={() => downloadWebsite(selectedWebsite)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  📥 Download HTML
                </button>
              </div>
            </div>
          )}

          {/* Code Section */}
          {activeSection === 'code' && selectedWebsite && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">HTML Code - {selectedWebsite.name}</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(selectedWebsite.html)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                >
                  📋 Copy Code
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100 font-mono">
                  <code>{selectedWebsite.html}</code>
                </pre>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">📋 Implementation Instructions</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Save the code as an HTML file (e.g., index.html)</li>
                  <li>• Open the file in any web browser to view your website</li>
                  <li>• Customize colors, text, and images to match your brand</li>
                  <li>• Deploy to any web hosting service for live access</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!generating && websites.length === 0 && (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-6">🌐</div>
          <h3 className="text-xl font-medium mb-3">Ready to Build Your Website?</h3>
          {businessIdea && businessIdea.trim() !== '' ? (
            <div>
              <p className="text-gray-400 mb-6">
                Click "Generate Website Templates" to create professional websites with hero sections, features, about pages, and CTA buttons!
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 inline-block">
                <p className="text-sm text-green-800">
                  <strong>Your Idea:</strong> {businessIdea.substring(0, 100)}{businessIdea.length > 100 ? '...' : ''}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">
              First, enter your business idea in the "📊 Pitch Deck Generator" tab, then return here to generate your professional website templates.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WebsiteGenerator;

import React, { useState, useEffect, useRef } from 'react';
import { generatePitchDeck, generateDetailedPitchDeck, checkServerHealth, validateStartupIdea } from './services/api';
import LandingSection from './components/LandingSection';
import LoadingSpinner from './components/LoadingSpinner';
import LogoGenerator from './components/LogoGenerator';
import { downloadPDF, validateContentForPDF, previewPDFStructure } from './utils/pdfGenerator';

function App() {
  // Tab management
  const [activeTab, setActiveTab] = useState('pitch-deck');
  
  // Pitch deck states
  const [pitchDeck, setPitchDeck] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [serverStatus, setServerStatus] = useState('checking');
  const [businessIdea, setBusinessIdea] = useState('');
  const [businessModel, setBusinessModel] = useState('B2C');
  const [industry, setIndustry] = useState('Technology');
  const [targetMarket, setTargetMarket] = useState('Young Adults (18-30)');
  const [fundingStage, setFundingStage] = useState('Pre-Seed');
  const [useDetailed, setUseDetailed] = useState(false);
  const [ideaValidation, setIdeaValidation] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [generateDetailed, setGenerateDetailed] = useState(false);
  const [targetAudience, setTargetAudience] = useState('general investors');
  const [showLanding, setShowLanding] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);
  const [presentationStyle, setPresentationStyle] = useState('balanced');
  const [competitorContext, setCompetitorContext] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');
  const [pdfDownloading, setPdfDownloading] = useState(false);
  
  // Refs
  const containerRef = useRef(null);
  const formRef = useRef(null);

  // Sample ideas for inspiration
  const sampleIdeas = [
    "A mobile app that helps students find part-time internships based on their skill set and location",
    "An AI-powered fitness platform that creates personalized workout plans for seniors",
    "A sustainable food delivery service using electric bikes and eco-friendly packaging",
    "A blockchain-based platform for freelancers to showcase verified skills and get hired",
    "A virtual reality meditation app that creates immersive relaxation experiences",
    "A smart home security system that uses AI to detect unusual activities",
    "An online marketplace for local farmers to sell directly to consumers"
  ];

  // Check server health on component mount
  useEffect(() => {
    const checkHealth = async () => {
      const health = await checkServerHealth();
      setServerStatus(health.status === 'healthy' ? 'online' : 'offline');
    };
    checkHealth();
    
    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleGenerate = async () => {
    // Validate idea
    const validation = validateStartupIdea(businessIdea);
    if (!validation.isValid) {
      setOutput(`❌ ${validation.error}`);
      return;
    }

    setLoading(true);
    setLoadingMessage(generateDetailed ? 
      '� Analyzing your startup idea for detailed pitch deck...' : 
      '🚀 Crafting your professional pitch deck...'
    );
    setOutput('');
    
    try {
      const options = {
        target_audience: targetAudience,
        industry: industry || null,
        funding_stage: fundingStage,
        presentation_style: presentationStyle,
        business_model: businessModel || null,
        competitor_context: competitorContext || null,
        // Add timestamp and random element to ensure unique requests
        request_id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log("🔍 DEBUG: Generation options:", options);
      console.log("🎯 DEBUG: Idea:", businessIdea);
      console.log("📊 DEBUG: Generate detailed:", generateDetailed);

      // Update loading message during process
      setTimeout(() => {
        if (loading) {
          setLoadingMessage(generateDetailed ? 
            '📊 Creating comprehensive market analysis and financial projections...' : 
            '✨ Generating compelling slides and content...'
          );
        }
      }, 3000);

      setTimeout(() => {
        if (loading) {
          setLoadingMessage('🎯 Finalizing your investor-ready pitch deck...');
        }
      }, 6000);

      const result = generateDetailed 
        ? await generateDetailedPitchDeck(businessIdea, options)
        : await generatePitchDeck(businessIdea, options);
      
      console.log("Pitch deck result:", result);
      setOutput(result);
      
      // Analytics - track successful generation
      if (window.gtag) {
        window.gtag('event', 'pitch_deck_generated', {
          event_category: 'engagement',
          event_label: generateDetailed ? 'detailed' : 'basic',
          value: 1
        });
      }
    } catch (err) {
      console.error("Error generating pitch deck:", err);
      setOutput('❌ Failed to generate pitch deck. Please try again or check your connection.');
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSampleClick = (sampleIdea) => {
    setBusinessIdea(sampleIdea);
    setShowLanding(false);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearAll = () => {
    setBusinessIdea('');
    setOutput('');
    setIndustry('');
    setTargetAudience('general investors');
    setFundingStage('seed');
    setGenerateDetailed(false);
    setPresentationStyle('balanced');
    setBusinessModel('');
    setCompetitorContext('');
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = output;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  const downloadAsTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([output], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `pitch-deck-${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleRegenerateWithStyle = async (newStyle) => {
    const originalStyle = presentationStyle;
    setPresentationStyle(newStyle);
    
    setLoading(true);
    setLoadingMessage(`🔄 Regenerating with ${newStyle.replace('-', ' ')} approach...`);
    setOutput('');
    
    try {
      const options = {
        target_audience: targetAudience,
        industry: industry || null,
        funding_stage: fundingStage,
        presentation_style: newStyle,
        business_model: businessModel || null,
        competitor_context: competitorContext || null,
        request_id: `${Date.now()}_${newStyle}_${Math.random().toString(36).substr(2, 9)}`
      };

      console.log("🔄 DEBUG: Regeneration options:", options);

      // Update loading message
      setTimeout(() => {
        if (loading) {
          setLoadingMessage(`✨ Crafting ${newStyle.replace('-', ' ')} pitch deck...`);
        }
      }, 2000);

      const result = generateDetailed 
        ? await generateDetailedPitchDeck(businessIdea, options)
        : await generatePitchDeck(businessIdea, options);
      
      setOutput(result);
    } catch (err) {
      console.error("Error regenerating pitch deck:", err);
      setOutput('❌ Failed to regenerate pitch deck. Please try again.');
      setPresentationStyle(originalStyle); // Restore original style on error
    } finally {
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const downloadAsPDF = async () => {
    if (!isValidOutput) return;
    
    setPdfDownloading(true);
    try {
      // Validate content before generating PDF
      const validation = validateContentForPDF(output);
      
      if (!validation.isValid) {
        const errorMessage = `Cannot generate PDF: ${validation.issues.join(', ')}`;
        console.error('PDF validation failed:', validation);
        alert(errorMessage);
        return;
      }
      
      // Show validation warnings if any
      if (validation.issues.length > 0) {
        const warningMessage = `PDF Warning: ${validation.issues.join(', ')}`;
        console.warn('PDF validation warnings:', validation);
        
        const proceed = window.confirm(
          `${warningMessage}\n\nDo you want to continue with PDF generation?`
        );
        if (!proceed) return;
      }
      
      // Preview structure for debugging
      const structure = previewPDFStructure(output);
      console.log('PDF Structure Preview:', structure);
      
      // Generate filename with more context
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
      const ideaSlug = businessIdea.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 30);
      const filename = `cofoundr-${ideaSlug}-${timestamp}.pdf`;
      
      const success = downloadPDF(output, filename);
      
      if (success) {
        // Show success message with structure info
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
        
        // Optional: Show PDF info to user
        if (structure.totalSlides > 0) {
          console.log(`PDF generated successfully: ${structure.totalSlides} slides, ~${structure.estimatedPages} pages`);
        }
      } else {
        throw new Error('PDF generation returned false');
      }
    } catch (error) {
      console.error('PDF download error:', error);
      console.error('Content length:', output?.length);
      console.error('Content preview:', output?.substring(0, 300));
      
      // More specific error messages
      let errorMessage = 'Failed to download PDF. ';
      
      if (error.message.includes('Invalid pitch content')) {
        errorMessage += 'The pitch content appears to be invalid. Please try regenerating the pitch deck.';
      } else if (error.message.includes('too short')) {
        errorMessage += 'The pitch content is too short. Please generate a more detailed pitch deck.';
      } else if (error.message.includes('jsPDF')) {
        errorMessage += 'PDF library error. Please try again or contact support.';
      } else {
        errorMessage += 'Please try again. If the problem persists, try regenerating the pitch deck.';
      }
      
      alert(errorMessage);
    } finally {
      setPdfDownloading(false);
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('My Startup Pitch Deck');
    const body = encodeURIComponent(`Check out my startup pitch deck:\n\n${output}`);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleGetStarted = () => {
    setShowLanding(false);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const getServerStatusColor = () => {
    switch (serverStatus) {
      case 'online': return 'text-green-600';
      case 'offline': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  const getServerStatusIcon = () => {
    switch (serverStatus) {
      case 'online': return '🟢';
      case 'offline': return '🔴';
      default: return '🟡';
    }
  };

  const isValidOutput = output && !loading && 
    !output.includes('Please enter') && 
    !output.includes('Failed') && 
    !output.includes('❌') &&
    !output.includes('Analyzing your startup');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Cofoundr AI</h1>
                <p className="text-sm text-gray-600">Complete AI Co-founder: Pitch Decks • Logos • Branding • Marketing Copy</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm">
                <span>{getServerStatusIcon()}</span>
                <span className={getServerStatusColor()}>
                  {serverStatus === 'checking' ? 'Checking...' : `Server ${serverStatus}`}
                </span>
              </div>
              {!showLanding && (
                <button
                  onClick={() => setShowLanding(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  ← Back to Home
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Tab Navigation */}
        {!showLanding && (
          <div className="border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('pitch-deck')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'pitch-deck'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  📊 Pitch Deck Generator
                </button>
                <button
                  onClick={() => setActiveTab('logo-branding')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'logo-branding'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  🎨 Logo & Brand Suite
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {showLanding && (
          <div className="animate-fadeInUp">
            <LandingSection onGetStarted={handleGetStarted} />
            
            {/* Quick Start Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                🚀 Try These Example Ideas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sampleIdeas.slice(0, 6).map((sampleIdea, index) => (
                  <button
                    key={index}
                    onClick={() => handleSampleClick(sampleIdea)}
                    className="text-left p-4 text-sm text-gray-700 bg-gradient-to-br from-gray-50 to-blue-50 hover:from-blue-50 hover:to-indigo-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200 hover:shadow-md transform hover:-translate-y-1"
                  >
                    <div className="font-medium text-blue-600 mb-1">💡 Startup Idea</div>
                    {sampleIdea}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {!showLanding && (
          <div className="animate-slideInRight">
            {/* Pitch Deck Tab Content */}
            {activeTab === 'pitch-deck' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Left Column - Input */}
                <div className="space-y-6" ref={formRef}>
                  <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  ✨ Describe Your Startup Idea
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Startup Idea *
                    </label>
                    <textarea
                      className="w-full p-4 border border-gray-300 rounded-lg resize-vertical focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 form-input"
                      placeholder="Describe your startup idea in detail... (e.g., A mobile app that connects dog owners with local dog walkers using geolocation and real-time scheduling)"
                      value={businessIdea}
                      onChange={(e) => setBusinessIdea(e.target.value)}
                      rows={5}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Be specific about the problem you're solving and your target market
                      </p>
                      <span className={`text-xs ${businessIdea.length < 10 ? 'text-red-500' : businessIdea.length > 500 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {businessIdea.length}/1000
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select
                        value={targetAudience}
                        onChange={(e) => setTargetAudience(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 form-input"
                      >
                        <option value="general investors">General Investors</option>
                        <option value="angel investors">Angel Investors</option>
                        <option value="VCs">Venture Capitalists</option>
                        <option value="accelerators">Accelerators</option>
                        <option value="corporate investors">Corporate Investors</option>
                        <option value="banks">Banks/Lenders</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Funding Stage
                      </label>
                      <select
                        value={fundingStage}
                        onChange={(e) => setFundingStage(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 form-input"
                      >
                        <option value="idea">Idea Stage</option>
                        <option value="pre-seed">Pre-Seed</option>
                        <option value="seed">Seed</option>
                        <option value="series-a">Series A</option>
                        <option value="series-b">Series B</option>
                        <option value="later-stage">Later Stage</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Industry (Optional)
                    </label>
                    <input
                      type="text"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      placeholder="e.g., FinTech, HealthTech, EdTech, SaaS, E-commerce"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 form-input"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Presentation Style
                      </label>
                      <select
                        value={presentationStyle}
                        onChange={(e) => setPresentationStyle(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 form-input"
                      >
                        <option value="balanced">Balanced Approach</option>
                        <option value="data-driven">Data-Driven & Analytical</option>
                        <option value="storytelling">Storytelling & Emotional</option>
                        <option value="technology-focused">Technology Innovation</option>
                        <option value="market-opportunity">Market Opportunity Driven</option>
                        <option value="problem-solving">Problem-Solving Focused</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Model (Optional)
                      </label>
                      <select
                        value={businessModel}
                        onChange={(e) => setBusinessModel(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 form-input"
                      >
                        <option value="">Auto-suggest</option>
                        <option value="subscription">Subscription/SaaS</option>
                        <option value="marketplace">Marketplace</option>
                        <option value="freemium">Freemium</option>
                        <option value="transaction">Transaction Fees</option>
                        <option value="advertising">Advertising Revenue</option>
                        <option value="enterprise">Enterprise Sales</option>
                        <option value="ecommerce">E-commerce</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Known Competitors (Optional)
                    </label>
                    <input
                      type="text"
                      value={competitorContext}
                      onChange={(e) => setCompetitorContext(e.target.value)}
                      placeholder="e.g., Uber, Airbnb, Slack (helps create better positioning)"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 form-input"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Naming competitors helps create more targeted differentiation
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <input
                      type="checkbox"
                      id="detailed"
                      checked={generateDetailed}
                      onChange={(e) => setGenerateDetailed(e.target.checked)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="detailed" className="text-sm text-gray-700">
                      <span className="font-medium">Generate detailed 10-slide deck</span>
                      <br />
                      <span className="text-gray-600">Includes financial projections, competition analysis, and traction metrics</span>
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleGenerate}
                      disabled={loading || serverStatus === 'offline'}
                      className={`flex-1 py-4 px-6 rounded-lg font-semibold text-white transition-all duration-200 btn-hover-scale ${
                        loading || serverStatus === 'offline'
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl'
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Generating...</span>
                        </div>
                      ) : (
                        `🚀 Generate ${generateDetailed ? 'Detailed ' : ''}Pitch Deck`
                      )}
                    </button>
                    
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Sample Ideas */}
              <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Need Inspiration? Try These Ideas:
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                  {sampleIdeas.map((sampleIdea, index) => (
                    <button
                      key={index}
                      onClick={() => handleSampleClick(sampleIdea)}
                      className="w-full text-left p-3 text-sm text-gray-700 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                    >
                      {sampleIdea}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Output */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 card-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    📊 Generated Pitch Deck
                  </h2>
                  {isValidOutput && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={copyToClipboard}
                        className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                          copySuccess 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {copySuccess ? '✓ Copied!' : '📋 Copy'}
                      </button>
                      
                      {/* PDF Download Button */}
                      <button
                        onClick={downloadAsPDF}
                        disabled={pdfDownloading}
                        className={`px-3 py-1 text-sm rounded-md transition-all duration-200 ${
                          pdfDownloading 
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                            : 'bg-red-100 hover:bg-red-200 text-red-700'
                        }`}
                      >
                        {pdfDownloading ? (
                          <span className="flex items-center space-x-1">
                            <div className="w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            <span>Generating PDF...</span>
                          </span>
                        ) : (
                          '📥 Download PDF'
                        )}
                      </button>
                      
                      <button
                        onClick={downloadAsTxt}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        💾 Download TXT
                      </button>
                      <button
                        onClick={shareViaEmail}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        📧 Share
                      </button>
                      
                      {/* Regenerate with different styles */}
                      <div className="relative group">
                        <button className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors">
                          🔄 Try Different Style
                        </button>
                        <div className="absolute right-0 top-8 hidden group-hover:block bg-white shadow-lg rounded-lg border z-10 min-w-48">
                          {[
                            { key: 'data-driven', label: '📊 Data-Driven', desc: 'Focus on metrics & ROI' },
                            { key: 'storytelling', label: '📖 Storytelling', desc: 'Emotional & narrative' },
                            { key: 'technology-focused', label: '🔧 Tech-Focused', desc: 'Innovation & IP' },
                            { key: 'market-opportunity', label: '🎯 Market-Driven', desc: 'Timing & disruption' },
                            { key: 'problem-solving', label: '🛠️ Problem-Solving', desc: 'Practical solutions' }
                          ].filter(style => style.key !== presentationStyle).map(style => (
                            <button
                              key={style.key}
                              onClick={() => handleRegenerateWithStyle(style.key)}
                              disabled={loading}
                              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm border-b last:border-b-0 disabled:opacity-50"
                            >
                              <div className="font-medium text-gray-700">{style.label}</div>
                              <div className="text-xs text-gray-500">{style.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="min-h-[500px]">
                  {!output && !loading ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-lg font-medium mb-2">Ready to Create Your Pitch?</h3>
                      <p className="text-center text-gray-400">
                        Enter your startup idea on the left and click "Generate Pitch Deck" to get started!
                      </p>
                    </div>
                  ) : loading ? (
                    <LoadingSpinner message={loadingMessage || "Generating your pitch deck..."} />
                  ) : (
                    <div className="prose max-w-none animate-fadeInUp">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800 bg-gray-50 p-6 rounded-lg border custom-scrollbar max-h-96 overflow-y-auto">
                        {output}
                      </div>
                      {isValidOutput && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-green-600">✅</span>
                            <span className="text-sm font-medium text-green-800">
                              Pitch deck generated successfully!
                            </span>
                          </div>
                          <p className="text-xs text-green-600 mt-1">
                            You can now copy, download as PDF/TXT, or share your pitch deck using the buttons above.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                        💡 Pro Tips for Better Results
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Be specific about your target market and the problem you're solving</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Choose a presentation style that matches your audience preferences</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Mention competitors to get better positioning and differentiation</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Select your business model for more targeted revenue strategies</span>
                      </li>
                      <li className="flex items-start space-x-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Try different settings to get varied perspectives on your idea</span>
                      </li>
                    </ul>
              </div>
                </div>
              </div>
              )}
              
              {/* Logo & Branding Tab Content */}
              {activeTab === 'logo-branding' && (
                <div className="w-full">
                  <LogoGenerator 
                    businessIdea={businessIdea}
                    industry={industry}
                    businessModel={businessModel}
                  />
                </div>
              )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-6 mb-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span>🤖</span>
                <span className="text-sm">Powered by AI</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>🚀</span>
                <span className="text-sm">Built for Entrepreneurs</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>⚡</span>
                <span className="text-sm">Instant Results</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              Transform your startup ideas into professional pitch decks in seconds • 
              <span className="text-blue-600 ml-1">Ready to turn your vision into reality?</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

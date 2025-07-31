import React, { useState, useEffect, useRef } from 'react';
import { generatePitchDeck, generateDetailedPitchDeck, checkServerHealth, validateStartupIdea } from './services/api';
import LandingSection from './components/LandingSection';

const App = () => {
  const [idea, setIdea] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');
  const [generateDetailed, setGenerateDetailed] = useState(false);
  const [targetAudience, setTargetAudience] = useState('general investors');
  const [industry, setIndustry] = useState('');
  const [fundingStage, setFundingStage] = useState('seed');
  const [showLanding, setShowLanding] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

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
    const validation = validateStartupIdea(idea);
    if (!validation.isValid) {
      setOutput(`❌ ${validation.error}`);
      return;
    }

    setLoading(true);
    setOutput('🚀 Analyzing your startup idea and generating professional pitch deck...');
    
    try {
      const options = {
        target_audience: targetAudience,
        industry: industry || null,
        funding_stage: fundingStage
      };

      const result = generateDetailed 
        ? await generateDetailedPitchDeck(idea, options)
        : await generatePitchDeck(idea, options);
      
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
    }
  };

  const handleSampleClick = (sampleIdea) => {
    setIdea(sampleIdea);
    setShowLanding(false);
    // Scroll to form
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleClearAll = () => {
    setIdea('');
    setOutput('');
    setIndustry('');
    setTargetAudience('general investors');
    setFundingStage('seed');
    setGenerateDetailed(false);
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
                <p className="text-sm text-gray-600">AI-Powered Pitch Deck Generator</p>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-slideInRight">
            
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
                      value={idea}
                      onChange={(e) => setIdea(e.target.value)}
                      rows={5}
                    />
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">
                        Be specific about the problem you're solving and your target market
                      </p>
                      <span className={`text-xs ${idea.length < 10 ? 'text-red-500' : idea.length > 500 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {idea.length}/1000
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
                    <div className="flex space-x-2">
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
                      <button
                        onClick={downloadAsTxt}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        💾 Download
                      </button>
                      <button
                        onClick={shareViaEmail}
                        className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                      >
                        📧 Share
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="min-h-[500px]">
                  {!output ? (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                      <div className="text-6xl mb-4">🎯</div>
                      <h3 className="text-lg font-medium mb-2">Ready to Create Your Pitch?</h3>
                      <p className="text-center text-gray-400">
                        Enter your startup idea on the left and click "Generate Pitch Deck" to get started!
                      </p>
                    </div>
                  ) : loading ? (
                    <div className="flex flex-col items-center justify-center h-96">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Creating Your Pitch Deck</h3>
                      <p className="text-gray-500 text-center max-w-md">
                        Our AI is analyzing your idea and generating a professional pitch deck tailored to your industry and audience...
                      </p>
                      <div className="mt-4 text-sm text-gray-400 loading-dots">
                        This usually takes 10-30 seconds
                      </div>
                    </div>
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
                            You can now copy, download, or share your pitch deck using the buttons above.
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
                    <span>Mention unique features, technology, or competitive advantages</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Include your business model or revenue strategy if known</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Try the detailed version for investor meetings and comprehensive analysis</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Customize the industry and audience fields for more targeted content</span>
                  </li>
                </ul>
              </div>
            </div>
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

import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <div className="text-3xl mb-3">{icon}</div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{description}</p>
  </div>
);

const LandingSection = ({ onGetStarted }) => {
  const features = [
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your idea and generate professional pitch decks tailored to your industry."
    },
    {
      icon: "📊",
      title: "Investor-Ready Format",
      description: "Structured presentations that follow proven frameworks used by successful startups and VCs."
    },
    {
      icon: "🎨",
      title: "Logo & Branding",
      description: "AI generates logos, brand colors, and typography based on your startup's theme and industry."
    },
    {
      icon: "⚡",
      title: "Instant Generation",
      description: "Get your pitch deck and branding assets in seconds, not days. Perfect for rapid iteration."
    }
  ];

  return (
    <div className="text-center mb-12">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Transform Your Startup Ideas Into 
          <span className="gradient-text"> Professional Pitch Decks & Branding</span>
        </h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Whether you're preparing for investors, accelerators, or building your brand identity, 
          our AI creates compelling pitch decks and branding assets that tell your story effectively.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>

      <button
        onClick={onGetStarted}
        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg"
      >
        🚀 Start Creating Your Pitch Deck
      </button>
    </div>
  );
};

export default LandingSection;

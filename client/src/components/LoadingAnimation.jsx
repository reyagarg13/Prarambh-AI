import React from 'react';

const LoadingAnimation = ({ message = "Generating your pitch deck..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      {/* Main spinner */}
      <div className="relative mb-6">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-pulse text-2xl">🚀</div>
        </div>
      </div>
      
      {/* Message */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{message}</h3>
      
      {/* Sub message with typing animation */}
      <p className="text-gray-600 mb-6 max-w-md">
        Our AI is analyzing your startup idea and crafting a professional pitch deck
        tailored to your industry and target audience...
      </p>
      
      {/* Progress indicators */}
      <div className="flex space-x-2 mb-4">
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
      
      {/* Time estimate */}
      <div className="text-sm text-gray-500">
        <span className="animate-pulse">⏱️ This usually takes 10-30 seconds</span>
      </div>
      
      {/* Processing steps */}
      <div className="mt-6 space-y-2 text-xs text-gray-400">
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-spin w-3 h-3 border border-gray-300 border-t-blue-500 rounded-full"></div>
          <span>Analyzing startup concept...</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-pulse w-3 h-3 bg-blue-200 rounded-full"></div>
          <span>Researching market insights...</span>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="animate-pulse w-3 h-3 bg-gray-200 rounded-full"></div>
          <span>Structuring presentation...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;

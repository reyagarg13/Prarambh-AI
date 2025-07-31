import React from 'react';

const LoadingSpinner = ({ message = "Generating your pitch deck..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96 space-y-6">
      {/* Main Spinner */}
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-600 rounded-full animate-spin animate-reverse" style={{ animationDuration: '1.5s' }}></div>
      </div>
      
      {/* Loading Message */}
      <div className="text-center space-y-2">
        <h3 className="text-lg font-medium text-gray-700">{message}</h3>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="w-full max-w-md">
        <div className="flex justify-between text-xs text-gray-500 mb-2">
          <span>Analyzing idea</span>
          <span>Creating content</span>
          <span>Finalizing deck</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full animate-pulse" style={{ width: '100%', animationDuration: '2s' }}></div>
        </div>
      </div>
      
      {/* Tips while waiting */}
      <div className="text-center max-w-md">
        <p className="text-sm text-gray-500">
          Our AI is analyzing your idea and crafting a professional pitch deck tailored to your audience...
        </p>
        <p className="text-xs text-gray-400 mt-2">
          This usually takes 10-30 seconds
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;

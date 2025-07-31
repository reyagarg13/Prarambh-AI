import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const generatePitchDeck = async (idea, options = {}) => {
  try {
    const requestData = {
      idea: idea,
      target_audience: options.target_audience || "general investors",
      industry: options.industry || null,
      funding_stage: options.funding_stage || "seed"
    };

    console.log('Sending request to:', `${API_BASE_URL}/generate`);
    console.log('Request data:', requestData);

    const response = await axios.post(`${API_BASE_URL}/generate`, requestData);
    
    console.log('API Response:', response.data);
    
    if (response.data.success) {
      return response.data.deck;
    } else {
      console.error('API returned error:', response.data.message);
      return response.data.message || 'Failed to generate pitch deck.';
    }
  } catch (error) {
    console.error('Error generating pitch deck:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // Return more specific error messages
      if (error.response.status === 503) {
        return 'Server is temporarily unavailable. Please try again in a moment.';
      } else if (error.response.status === 429) {
        return 'Too many requests. Please wait a moment before trying again.';
      }
    } else if (error.code === 'ECONNREFUSED') {
      return 'Cannot connect to server. Please make sure the server is running.';
    }
    return 'Failed to generate pitch deck. Please check if the server is running and try again.';
  }
};

export const generateDetailedPitchDeck = async (idea, options = {}) => {
  try {
    const requestData = {
      idea: idea,
      target_audience: options.target_audience || "general investors",
      industry: options.industry || null,
      funding_stage: options.funding_stage || "seed"
    };

    console.log('Sending detailed request to:', `${API_BASE_URL}/generate-detailed`);
    console.log('Request data:', requestData);

    const response = await axios.post(`${API_BASE_URL}/generate-detailed`, requestData);
    
    console.log('API Response:', response.data);
    
    if (response.data.success) {
      return response.data.deck;
    } else {
      console.error('API returned error:', response.data.message);
      return response.data.message || 'Failed to generate detailed pitch deck.';
    }
  } catch (error) {
    console.error('Error generating detailed pitch deck:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      
      // Return more specific error messages
      if (error.response.status === 503) {
        return 'Server is temporarily unavailable. Please try again in a moment.';
      } else if (error.response.status === 429) {
        return 'Too many requests. Please wait a moment before trying again.';
      }
    } else if (error.code === 'ECONNREFUSED') {
      return 'Cannot connect to server. Please make sure the server is running.';
    }
    return 'Failed to generate detailed pitch deck. Please check if the server is running and try again.';
  }
};

export const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 5000 // 5 second timeout
    });
    return response.data;
  } catch (error) {
    console.error('Server health check failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return { status: 'offline', error: 'Server is not running' };
    } else if (error.code === 'ECONNABORTED') {
      return { status: 'timeout', error: 'Server response timeout' };
    }
    
    return { status: 'unhealthy', error: error.message };
  }
};

// Utility function to validate startup ideas
export const validateStartupIdea = (idea) => {
  const minLength = 10;
  const maxLength = 1000;
  
  if (!idea || idea.trim().length < minLength) {
    return {
      isValid: false,
      error: `Please provide a more detailed description (at least ${minLength} characters)`
    };
  }
  
  if (idea.length > maxLength) {
    return {
      isValid: false,
      error: `Description is too long (maximum ${maxLength} characters)`
    };
  }
  
  return { isValid: true };
};

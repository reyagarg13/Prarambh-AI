import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance with proper timeout and retry configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes timeout for generation requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server may be processing');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused - server may be down');
    } else if (error.response?.status >= 500) {
      console.error('Server error - may be temporary');
    }
    
    return Promise.reject(error);
  }
);

// Retry function for failed requests
const retryRequest = async (requestFn, maxRetries = 2, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Don't retry on certain errors
      if (error.response?.status === 400 || error.response?.status === 401) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
};

export const generatePitchDeck = async (idea, options = {}) => {
  const requestData = {
    idea: idea,
    target_audience: options.target_audience || "general investors",
    industry: options.industry || null,
    funding_stage: options.funding_stage || "seed",
    presentation_style: options.presentation_style || "balanced",
    business_model: options.business_model || null,
    competitor_context: options.competitor_context || null,
    request_id: options.request_id || Date.now().toString()
  };

  console.log('Sending request to:', `${API_BASE_URL}/generate`);
  console.log('Request data:', requestData);

  const makeRequest = async () => {
    try {
      const response = await apiClient.post('/generate', requestData);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        return response.data.deck;
      } else {
        console.error('API returned error:', response.data.message);
        return response.data.message || 'Failed to generate pitch deck.';
      }
    } catch (error) {
      console.error('Error in generatePitchDeck:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        // Return more specific error messages
        if (error.response.status === 503) {
          throw new Error('Server is temporarily unavailable. Please try again in a moment.');
        } else if (error.response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else if (error.response.status >= 500) {
          throw new Error('Server error. Please try again.');
        } else {
          throw new Error(error.response.data?.message || 'Failed to generate pitch deck.');
        }
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Please make sure the server is running.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The server may be processing your request - please try again.');
      } else {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
  };

  try {
    return await retryRequest(makeRequest, 3, 2000);
  } catch (error) {
    console.error('Final error after retries:', error);
    return `❌ ${error.message}`;
  }
};

export const generateDetailedPitchDeck = async (idea, options = {}) => {
  const requestData = {
    idea: idea,
    target_audience: options.target_audience || "general investors",
    industry: options.industry || null,
    funding_stage: options.funding_stage || "seed",
    presentation_style: options.presentation_style || "balanced",
    business_model: options.business_model || null,
    competitor_context: options.competitor_context || null,
    request_id: options.request_id || Date.now().toString()
  };

  console.log('Sending detailed request to:', `${API_BASE_URL}/generate-detailed`);
  console.log('Request data:', requestData);

  const makeRequest = async () => {
    try {
      const response = await apiClient.post('/generate-detailed', requestData);
      
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        return response.data.deck;
      } else {
        console.error('API returned error:', response.data.message);
        return response.data.message || 'Failed to generate detailed pitch deck.';
      }
    } catch (error) {
      console.error('Error in generateDetailedPitchDeck:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        // Return more specific error messages
        if (error.response.status === 503) {
          throw new Error('Server is temporarily unavailable. Please try again in a moment.');
        } else if (error.response.status === 429) {
          throw new Error('Too many requests. Please wait a moment before trying again.');
        } else if (error.response.status >= 500) {
          throw new Error('Server error. Please try again.');
        } else {
          throw new Error(error.response.data?.message || 'Failed to generate detailed pitch deck.');
        }
      } else if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Please make sure the server is running.');
      } else if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. The server may be processing your request - please try again.');
      } else {
        throw new Error('Network error. Please check your connection and try again.');
      }
    }
  };

  try {
    return await retryRequest(makeRequest, 3, 2000);
  } catch (error) {
    console.error('Final error after retries:', error);
    return `❌ ${error.message}`;
  }
};

export const checkServerHealth = async () => {
  try {
    // Use a shorter timeout for health checks
    const response = await axios.get(`${API_BASE_URL}/health`, {
      timeout: 10000 // 10 second timeout for health checks
    });
    
    console.log('Health check response:', response.data);
    return { 
      status: 'healthy', 
      ...response.data 
    };
  } catch (error) {
    console.error('Server health check failed:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return { 
        status: 'offline', 
        error: 'Server is not running',
        details: 'Cannot connect to the server. Please start the server using "python run.py" in the server directory.'
      };
    } else if (error.code === 'ECONNABORTED') {
      return { 
        status: 'timeout', 
        error: 'Server response timeout',
        details: 'Server is running but not responding quickly. It may be processing requests.'
      };
    } else if (error.response?.status >= 500) {
      return { 
        status: 'unhealthy', 
        error: 'Server error',
        details: `Server returned ${error.response.status} error. Check server logs.`
      };
    }
    
    return { 
      status: 'unhealthy', 
      error: error.message,
      details: 'Unknown connection issue. Check network and server status.'
    };
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

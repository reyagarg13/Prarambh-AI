#!/usr/bin/env python3
"""
Test script for Gemini API integration
Run this to test if Gemini is working correctly
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

load_dotenv()

def test_gemini_setup():
    """Test if Gemini API is properly configured"""
    
    print("🔍 Testing Gemini API Setup...")
    print("=" * 50)
    
    # Check if API key is set
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        print("❌ GEMINI_API_KEY not found in .env file")
        print("   Please add your Gemini API key to .env file")
        print("   Get it from: https://makersuite.google.com/app/apikey")
        return False
    
    if gemini_key == "":
        print("❌ GEMINI_API_KEY is empty in .env file")
        print("   Please add your actual Gemini API key")
        return False
    
    print("✅ GEMINI_API_KEY found in environment")
    
    # Test import
    try:
        import google.generativeai as genai
        print("✅ Google Generative AI package imported successfully")
    except ImportError:
        print("❌ Google Generative AI package not found")
        print("   Run: pip install google-generativeai")
        return False
    
    # Test API configuration
    try:
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        print("✅ Gemini model configured successfully")
    except Exception as e:
        print(f"❌ Failed to configure Gemini: {e}")
        return False
    
    # Test API call
    print("\n🚀 Testing API call...")
    try:
        response = model.generate_content(
            "Write a one-sentence description of a revolutionary AI startup.",
            generation_config=genai.types.GenerationConfig(
                max_output_tokens=100,
                temperature=0.7,
            )
        )
        
        if response.text:
            print("✅ API call successful!")
            print(f"Sample response: {response.text[:100]}...")
            return True
        else:
            print("❌ API call returned empty response")
            return False
            
    except Exception as e:
        print(f"❌ API call failed: {e}")
        if "API_KEY_INVALID" in str(e):
            print("   Your API key might be invalid. Please check it.")
        elif "PERMISSION_DENIED" in str(e):
            print("   API key doesn't have proper permissions.")
        return False

def test_server_config():
    """Test server configuration"""
    print("\n🔧 Testing Server Configuration...")
    print("=" * 50)
    
    use_gemini = os.getenv("USE_GEMINI", "true").lower() == "true"
    mock_mode = os.getenv("MOCK_MODE", "false").lower() == "true"
    
    print(f"USE_GEMINI: {use_gemini}")
    print(f"MOCK_MODE: {mock_mode}")
    
    if mock_mode:
        print("⚠️  Mock mode is enabled - API won't be called")
        print("   Set MOCK_MODE=false to test real API")
    elif use_gemini:
        print("✅ Gemini is configured as primary API")
    else:
        print("ℹ️  OpenAI is configured as primary API")
    
    return True

def main():
    """Main test function"""
    print("🚀 Gemini API Integration Test")
    print("=" * 50)
    
    # Test Gemini setup
    gemini_ok = test_gemini_setup()
    
    # Test server config
    config_ok = test_server_config()
    
    print("\n" + "=" * 50)
    if gemini_ok and config_ok:
        print("🎉 All tests passed! Gemini is ready to use.")
        print("\nNext steps:")
        print("1. Restart your server")
        print("2. Set MOCK_MODE=false in .env")
        print("3. Test with: http://localhost:8000/api/health")
    else:
        print("❌ Some tests failed. Please fix the issues above.")
    
    return gemini_ok and config_ok

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

#!/usr/bin/env python3
"""
Comprehensive test script for Gemini API integration
"""

import requests
import json
import time

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get("http://localhost:8000/api/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Health endpoint working")
            print(f"   - AI Provider: {data.get('ai_provider', 'unknown')}")
            print(f"   - Mock Mode: {data.get('mock_mode', 'unknown')}")
            print(f"   - Gemini Available: {data.get('gemini_available', False)}")
            print(f"   - Gemini Configured: {data.get('gemini_configured', False)}")
            return True
        else:
            print(f"❌ Health endpoint failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False

def test_generate_endpoint():
    """Test the regular generate endpoint"""
    try:
        payload = {
            "idea": "Smart home automation system with AI integration",
            "target_audience": "venture capitalists",
            "funding_stage": "seed"
        }
        
        response = requests.post(
            "http://localhost:8000/api/generate",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Generate endpoint working")
                print(f"   - Deck length: {len(data.get('deck', ''))}")
                print(f"   - Message: {data.get('message', 'No message')}")
                return True
            else:
                print(f"❌ Generate endpoint returned error: {data.get('message')}")
                return False
        else:
            print(f"❌ Generate endpoint failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Generate endpoint error: {e}")
        return False

def test_detailed_endpoint():
    """Test the detailed generate endpoint"""
    try:
        payload = {
            "idea": "Virtual reality fitness platform with AI personal trainers",
            "target_audience": "angel investors",
            "funding_stage": "seed"
        }
        
        response = requests.post(
            "http://localhost:8000/api/generate-detailed",
            json=payload,
            headers={"Content-Type": "application/json"},
            timeout=45
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success'):
                print("✅ Detailed generate endpoint working")
                print(f"   - Deck length: {len(data.get('deck', ''))}")
                print(f"   - Message: {data.get('message', 'No message')}")
                return True
            else:
                print(f"❌ Detailed generate endpoint returned error: {data.get('message')}")
                return False
        else:
            print(f"❌ Detailed generate endpoint failed with status: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Detailed generate endpoint error: {e}")
        return False

def main():
    print("🚀 Comprehensive API Test")
    print("=" * 50)
    
    # Wait for server to be ready
    print("⏳ Waiting for server to be ready...")
    time.sleep(3)
    
    results = []
    
    print("\n1. Testing Health Endpoint...")
    results.append(test_health_endpoint())
    
    print("\n2. Testing Generate Endpoint...")
    results.append(test_generate_endpoint())
    
    print("\n3. Testing Detailed Generate Endpoint...")
    results.append(test_detailed_endpoint())
    
    print("\n" + "=" * 50)
    passed = sum(results)
    total = len(results)
    
    if passed == total:
        print(f"🎉 All tests passed! ({passed}/{total})")
        print("✅ Gemini API integration is working correctly!")
    else:
        print(f"⚠️  Some tests failed: {passed}/{total} passed")
        
    return passed == total

if __name__ == "__main__":
    main()

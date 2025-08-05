#!/usr/bin/env python3
"""
Test script to validate Cofoundr AI platform enhancement
Tests the enhanced pitch deck generation with co-founder platform features
"""

import requests
import json
import sys
import time

def test_cofoundr_ai_enhancement():
    """Test the enhanced Cofoundr AI platform features"""
    
    print("🚀 TESTING COFOUNDR AI PLATFORM ENHANCEMENT")
    print("=" * 60)
    
    # Test endpoint
    url = "http://localhost:8000/generate"
    
    # Test with a sample startup idea
    test_payload = {
        "idea": "A sustainable food delivery platform that connects local organic farms directly with urban consumers, reducing food waste and carbon footprint while providing fresh, affordable produce",
        "target_audience": "seed stage investors",
        "industry": "foodtech",
        "funding_stage": "seed",
        "presentation_style": "balanced",
        "business_model": "marketplace"
    }
    
    print(f"📝 Testing with idea: {test_payload['idea'][:80]}...")
    print(f"🎯 Target audience: {test_payload['target_audience']}")
    print(f"🏭 Industry: {test_payload['industry']}")
    print(f"💰 Funding stage: {test_payload['funding_stage']}")
    print()
    
    try:
        # Make request
        print("📡 Sending request to enhanced Cofoundr AI platform...")
        start_time = time.time()
        
        response = requests.post(url, json=test_payload, timeout=60)
        
        end_time = time.time()
        duration = end_time - start_time
        
        print(f"⏱️  Response time: {duration:.2f} seconds")
        print(f"📊 HTTP Status: {response.status_code}")
        print()
        
        if response.status_code == 200:
            data = response.json()
            
            if data.get("success", False):
                deck = data.get("deck", "")
                message = data.get("message", "")
                
                print("✅ SUCCESS - Enhanced Cofoundr AI Platform Working!")
                print(f"📄 Message: {message}")
                print()
                
                # Analyze the enhanced content
                print("🔍 ENHANCEMENT ANALYSIS:")
                print("-" * 40)
                
                # Check for co-founder platform elements
                cofoundr_indicators = [
                    "COFOUNDR AI",
                    "co-founder platform",
                    "AI co-founder",
                    "complete startup toolkit",
                    "pitch deck",
                    "logo",
                    "landing page",
                    "marketing copy",
                    "non-technical founder",
                    "democratiz",
                    "platform network effects"
                ]
                
                found_indicators = []
                for indicator in cofoundr_indicators:
                    if indicator.lower() in deck.lower():
                        found_indicators.append(indicator)
                
                print(f"🎯 Co-founder Platform Elements Found: {len(found_indicators)}/{len(cofoundr_indicators)}")
                if found_indicators:
                    print("   ✅ " + "\n   ✅ ".join(found_indicators))
                
                # Check for enhanced market analysis
                market_indicators = [
                    "$47B startup services",
                    "co-founder economy",
                    "startup launch barrier",
                    "95% cost reduction",
                    "90% time savings",
                    "$15,000-50,000+",
                    "$29-199/month"
                ]
                
                found_market = [ind for ind in market_indicators if ind.lower() in deck.lower()]
                print(f"📊 Enhanced Market Analysis: {len(found_market)}/{len(market_indicators)} elements")
                
                # Check for platform business model
                business_indicators = [
                    "Starter Co-founder",
                    "Pro Co-founder", 
                    "Enterprise Co-founder",
                    "89% gross margins",
                    "LTV/CAC ratio"
                ]
                
                found_business = [ind for ind in business_indicators if ind.lower() in deck.lower()]
                print(f"💰 Platform Business Model: {len(found_business)}/{len(business_indicators)} elements")
                
                print()
                print("📋 SAMPLE OUTPUT (First 500 chars):")
                print("-" * 40)
                print(deck[:500] + "..." if len(deck) > 500 else deck)
                print()
                
                if len(found_indicators) >= 5:
                    print("🎉 ENHANCEMENT VALIDATION: EXCELLENT!")
                    print("   The Cofoundr AI platform enhancements are working perfectly!")
                elif len(found_indicators) >= 3:
                    print("✅ ENHANCEMENT VALIDATION: GOOD!")
                    print("   Co-founder platform elements are present but could be stronger.")
                else:
                    print("⚠️  ENHANCEMENT VALIDATION: NEEDS IMPROVEMENT")
                    print("   Co-founder platform elements may not be prominent enough.")
                
            else:
                print("❌ FAILURE - Request succeeded but generation failed")
                print(f"📄 Error message: {data.get('message', 'Unknown error')}")
                
        else:
            print(f"❌ FAILURE - HTTP {response.status_code}")
            print(f"📄 Response: {response.text}")
            
    except requests.exceptions.Timeout:
        print("⏰ TIMEOUT - Request took longer than 60 seconds")
        print("   This might indicate the API is processing but slow")
        
    except requests.exceptions.ConnectionError:
        print("🔌 CONNECTION ERROR - Cannot connect to server")
        print("   Make sure the server is running on http://localhost:8000")
        
    except Exception as e:
        print(f"💥 UNEXPECTED ERROR: {str(e)}")
        
    print()
    print("🏁 Test completed!")

if __name__ == "__main__":
    test_cofoundr_ai_enhancement()

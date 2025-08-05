#!/usr/bin/env python3
"""
Enhanced API Testing Suite with Comprehensive Coverage
"""

import requests
import json
import time
from datetime import datetime

class EnhancedAPITester:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.session.headers.update({"Content-Type": "application/json"})
        self.test_results = []
    
    def print_header(self, title):
        print(f"\n{'='*60}")
        print(f"🧪 {title}")
        print(f"{'='*60}")
    
    def print_test(self, test_name, status, details=""):
        status_icon = "✅" if status else "❌"
        print(f"{status_icon} {test_name}")
        if details:
            print(f"   └── {details}")
        self.test_results.append((test_name, status))
    
    def test_server_connectivity(self):
        """Test basic server connectivity"""
        self.print_header("SERVER CONNECTIVITY TEST")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=5)
            connected = response.status_code in [200, 404, 422]  # Any response means server is up
            self.print_test("Server is responding", connected, 
                          f"Status: {response.status_code}" if connected else "No response")
            return connected
        except Exception as e:
            self.print_test("Server connectivity", False, f"Error: {e}")
            return False
    
    def test_health_endpoint(self):
        """Test the health endpoint in detail"""
        self.print_header("HEALTH ENDPOINT ANALYSIS")
        
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                self.print_test("Health endpoint accessible", True, "Returns 200 OK")
                
                # Analyze response structure
                critical_fields = ["status", "ai_provider"]
                optional_fields = ["mock_mode", "gemini_available", "gemini_configured", "openai_available"]
                
                for field in critical_fields:
                    has_field = field in data
                    self.print_test(f"Critical field '{field}'", has_field, 
                                  f"Value: {data.get(field, 'Missing')}")
                
                for field in optional_fields:
                    if field in data:
                        self.print_test(f"Optional field '{field}'", True, 
                                      f"Value: {data.get(field)}")
                
                # Check AI provider status
                ai_provider = data.get("ai_provider", "unknown")
                if ai_provider in ["gemini", "openai"]:
                    self.print_test("Valid AI provider configured", True, f"Using: {ai_provider}")
                else:
                    self.print_test("AI provider configured", False, f"Unknown provider: {ai_provider}")
                
                return True
            else:
                self.print_test("Health endpoint", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.print_test("Health endpoint test", False, f"Error: {e}")
            return False
    
    def test_pitch_generation_variety(self):
        """Test pitch generation with various scenarios"""
        self.print_header("PITCH GENERATION VARIETY TEST")
        
        test_scenarios = [
            {
                "name": "AI/Tech Startup",
                "idea": "AI-powered code review tool for developers",
                "audience": "venture capitalists",
                "stage": "seed"
            },
            {
                "name": "Healthcare Innovation",
                "idea": "Wearable device for early diabetes detection",
                "audience": "angel investors", 
                "stage": "pre-seed"
            },
            {
                "name": "Sustainability Focus",
                "idea": "Solar panel recycling and upcycling platform",
                "audience": "impact investors",
                "stage": "series-a"
            },
            {
                "name": "Consumer App",
                "idea": "Social media platform for book recommendations",
                "audience": "venture capitalists",
                "stage": "seed"
            }
        ]
        
        successful_generations = 0
        
        for i, scenario in enumerate(test_scenarios, 1):
            print(f"\n🔬 Test {i}/{len(test_scenarios)}: {scenario['name']}")
            
            payload = {
                "idea": scenario["idea"],
                "target_audience": scenario["audience"],
                "funding_stage": scenario["stage"]
            }
            
            try:
                response = self.session.post(
                    f"{self.base_url}/api/generate",
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data.get("success"):
                        deck = data.get("deck", "")
                        deck_length = len(deck)
                        
                        self.print_test(f"Generated {scenario['name']} pitch", True, 
                                      f"{deck_length} characters")
                        
                        # Content quality checks
                        deck_lower = deck.lower()
                        
                        # Check for key startup pitch elements
                        elements = [
                            ("problem/challenge", any(word in deck_lower for word in ["problem", "challenge", "pain", "issue"])),
                            ("solution", any(word in deck_lower for word in ["solution", "product", "platform", "service"])),
                            ("market size", any(word in deck_lower for word in ["market", "tam", "addressable", "billion", "million"])),
                            ("business model", any(word in deck_lower for word in ["revenue", "pricing", "subscription", "model"])),
                            ("competitive advantage", any(word in deck_lower for word in ["competitive", "advantage", "unique", "differentiation"])),
                        ]
                        
                        element_score = sum(1 for _, found in elements if found)
                        quality_good = element_score >= 3
                        
                        self.print_test(f"Content quality for {scenario['name']}", quality_good,
                                      f"{element_score}/5 key elements found")
                        
                        if quality_good:
                            successful_generations += 1
                            
                    else:
                        self.print_test(f"Failed to generate {scenario['name']}", False, 
                                      data.get("message", "Unknown error"))
                else:
                    self.print_test(f"API error for {scenario['name']}", False, 
                                  f"Status: {response.status_code}")
                    
            except Exception as e:
                self.print_test(f"Request failed for {scenario['name']}", False, f"Error: {e}")
            
            # Rate limiting
            time.sleep(1)
        
        success_rate = (successful_generations / len(test_scenarios)) * 100
        overall_success = success_rate >= 75
        
        self.print_test("Overall generation success rate", overall_success,
                       f"{success_rate:.1f}% ({successful_generations}/{len(test_scenarios)})")
        
        return overall_success
    
    def test_detailed_vs_regular(self):
        """Compare detailed vs regular pitch generation"""
        self.print_header("DETAILED VS REGULAR COMPARISON")
        
        test_idea = "Smart city IoT platform for traffic optimization"
        payload = {
            "idea": test_idea,
            "target_audience": "venture capitalists",
            "funding_stage": "seed"
        }
        
        regular_result = None
        detailed_result = None
        
        # Test regular endpoint
        try:
            response = self.session.post(f"{self.base_url}/api/generate", json=payload, timeout=30)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    regular_result = data.get("deck", "")
                    self.print_test("Regular pitch generated", True, f"{len(regular_result)} characters")
                else:
                    self.print_test("Regular pitch generation", False, data.get("message", "Unknown error"))
            else:
                self.print_test("Regular pitch API call", False, f"Status: {response.status_code}")
        except Exception as e:
            self.print_test("Regular pitch request", False, f"Error: {e}")
        
        time.sleep(2)  # Rate limiting
        
        # Test detailed endpoint
        try:
            response = self.session.post(f"{self.base_url}/api/generate-detailed", json=payload, timeout=45)
            if response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    detailed_result = data.get("deck", "")
                    self.print_test("Detailed pitch generated", True, f"{len(detailed_result)} characters")
                else:
                    self.print_test("Detailed pitch generation", False, data.get("message", "Unknown error"))
            else:
                self.print_test("Detailed pitch API call", False, f"Status: {response.status_code}")
        except Exception as e:
            self.print_test("Detailed pitch request", False, f"Error: {e}")
        
        # Compare results
        if regular_result and detailed_result:
            length_diff = len(detailed_result) - len(regular_result)
            is_longer = length_diff > 1000  # Detailed should be significantly longer
            
            self.print_test("Detailed pitch is significantly longer", is_longer,
                          f"Difference: {length_diff} characters")
            
            # Check for detailed-specific content
            detailed_lower = detailed_result.lower()
            detailed_indicators = [
                "roadmap", "timeline", "milestones", "competitive analysis", 
                "risk", "mitigation", "exit strategy", "financial projections"
            ]
            
            detailed_content_count = sum(1 for indicator in detailed_indicators if indicator in detailed_lower)
            has_detailed_content = detailed_content_count >= 3
            
            self.print_test("Contains detailed-specific content", has_detailed_content,
                          f"{detailed_content_count}/{len(detailed_indicators)} detailed elements found")
            
            return is_longer and has_detailed_content
        
        return False
    
    def test_content_completeness(self):
        """Test that generated content is complete and comprehensive"""
        self.print_header("CONTENT COMPLETENESS TEST")
        
        test_payload = {
            "idea": "AI-powered educational platform for personalized learning",
            "target_audience": "venture capitalists",
            "funding_stage": "seed"
        }
        
        # Test both regular and detailed endpoints for completeness
        endpoints = [
            ("Regular", "/api/generate"),
            ("Detailed", "/api/generate-detailed")
        ]
        
        completeness_results = []
        
        for endpoint_name, endpoint_url in endpoints:
            print(f"\n🔬 Testing {endpoint_name} endpoint completeness...")
            
            try:
                response = self.session.post(
                    f"{self.base_url}{endpoint_url}",
                    json=test_payload,
                    timeout=45
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if data.get("success"):
                        deck = data.get("deck", "")
                        deck_length = len(deck)
                        
                        # Comprehensive content analysis
                        content_checks = {
                            "sufficient_length": deck_length >= 1000,  # Minimum viable content
                            "has_structure": any(marker in deck.lower() for marker in ["slide", "section", "1.", "2."]),
                            "has_problem": any(word in deck.lower() for word in ["problem", "challenge", "pain", "issue"]),
                            "has_solution": any(word in deck.lower() for word in ["solution", "product", "platform", "approach"]),
                            "has_market": any(word in deck.lower() for word in ["market", "tam", "customers", "addressable"]),
                            "has_business_model": any(word in deck.lower() for word in ["revenue", "pricing", "business model", "monetization"]),
                            "has_competition": any(word in deck.lower() for word in ["competitor", "competitive", "advantage", "differentiation"]),
                            "has_team": any(word in deck.lower() for word in ["team", "founder", "experience", "expertise"]),
                            "has_financials": any(word in deck.lower() for word in ["funding", "investment", "financial", "growth"]),
                            "has_traction": any(word in deck.lower() for word in ["traction", "users", "customers", "metrics"]),
                            "well_formatted": deck.count('\n') >= 20,  # Has reasonable line breaks
                            "no_truncation": not deck.endswith("...") and not "truncated" in deck.lower()
                        }
                        
                        passed_checks = sum(content_checks.values())
                        total_checks = len(content_checks)
                        completeness_score = (passed_checks / total_checks) * 100
                        
                        self.print_test(f"{endpoint_name} content completeness", 
                                      completeness_score >= 75,
                                      f"{completeness_score:.1f}% ({passed_checks}/{total_checks} checks passed)")
                        
                        # Detailed breakdown
                        for check_name, passed in content_checks.items():
                            status_icon = "✅" if passed else "❌"
                            print(f"     {status_icon} {check_name.replace('_', ' ').title()}")
                        
                        # Character count analysis
                        if endpoint_name == "Detailed":
                            expected_min_length = 3000
                            is_detailed_length = deck_length >= expected_min_length
                            self.print_test(f"Detailed length sufficient", is_detailed_length,
                                          f"{deck_length} chars (min: {expected_min_length})")
                        
                        completeness_results.append(completeness_score >= 75)
                        
                    else:
                        self.print_test(f"{endpoint_name} content generation", False, 
                                      data.get("message", "Unknown error"))
                        completeness_results.append(False)
                else:
                    self.print_test(f"{endpoint_name} API response", False, 
                                  f"Status: {response.status_code}")
                    completeness_results.append(False)
                    
            except Exception as e:
                self.print_test(f"{endpoint_name} completeness test", False, f"Error: {e}")
                completeness_results.append(False)
            
            time.sleep(2)  # Rate limiting between tests
        
        overall_completeness = all(completeness_results)
        self.print_test("Overall content completeness", overall_completeness,
                       f"{sum(completeness_results)}/{len(completeness_results)} endpoints passed")
        
        return overall_completeness
        """Test various error scenarios and edge cases"""
        self.print_header("ERROR HANDLING & EDGE CASES")
        
        error_tests = [
            {
                "name": "Empty idea field",
                "payload": {"idea": "", "target_audience": "investors", "funding_stage": "seed"},
                "should_fail": True
            },
            {
                "name": "Very short idea",
                "payload": {"idea": "App", "target_audience": "investors", "funding_stage": "seed"},
                "should_fail": False  # Should work but might be basic
            },
            {
                "name": "Very long idea",
                "payload": {
                    "idea": "AI-powered " + "revolutionary " * 50 + "platform for transforming industries",
                    "target_audience": "investors", 
                    "funding_stage": "seed"
                },
                "should_fail": False
            },
            {
                "name": "Missing target audience",
                "payload": {"idea": "Great startup idea", "funding_stage": "seed"},
                "should_fail": True
            },
            {
                "name": "Invalid funding stage",
                "payload": {"idea": "Valid idea", "target_audience": "investors", "funding_stage": "invalid-stage"},
                "should_fail": False  # Should work with fallback
            },
            {
                "name": "Special characters in idea",
                "payload": {"idea": "AI app with émojis 🚀 & spëcial chars!", "target_audience": "investors", "funding_stage": "seed"},
                "should_fail": False
            }
        ]
        
        passed_tests = 0
        
        for test_case in error_tests:
            print(f"\n🧪 Testing: {test_case['name']}")
            
            try:
                response = self.session.post(
                    f"{self.base_url}/api/generate",
                    json=test_case["payload"],
                    timeout=20
                )
                
                if response.status_code == 200:
                    data = response.json()
                    success = data.get("success", False)
                    
                    if test_case["should_fail"]:
                        test_passed = not success
                        self.print_test(f"Correctly rejected: {test_case['name']}", test_passed,
                                      "Properly handled invalid input" if test_passed else "Should have failed")
                    else:
                        test_passed = success
                        self.print_test(f"Handled gracefully: {test_case['name']}", test_passed,
                                      f"Generated {len(data.get('deck', ''))} chars" if test_passed else f"Error: {data.get('message', 'Unknown')}")
                    
                elif response.status_code == 422:  # Validation error
                    test_passed = test_case["should_fail"]
                    self.print_test(f"Validation error: {test_case['name']}", test_passed,
                                  "Properly validated input" if test_passed else "Unexpected validation error")
                    
                else:
                    self.print_test(f"Unexpected response: {test_case['name']}", False,
                                  f"Status: {response.status_code}")
                    test_passed = False
                
                if test_passed:
                    passed_tests += 1
                    
            except Exception as e:
                self.print_test(f"Exception in {test_case['name']}", False, f"Error: {e}")
            
            time.sleep(0.5)  # Brief pause between tests
        
        error_handling_rate = (passed_tests / len(error_tests)) * 100
        overall_success = error_handling_rate >= 70
        
        self.print_test("Error handling success rate", overall_success,
                       f"{error_handling_rate:.1f}% ({passed_tests}/{len(error_tests)})")
        
        return overall_success
    
    def generate_comprehensive_report(self):
        """Generate a comprehensive test report"""
        self.print_header("COMPREHENSIVE TEST REPORT")
        
        # Calculate overall statistics
        total_tests = len(self.test_results)
        passed_tests = sum(1 for _, passed in self.test_results if passed)
        success_rate = (passed_tests / total_tests * 100) if total_tests > 0 else 0
        
        print(f"📊 Test Summary:")
        print(f"   Total Tests: {total_tests}")
        print(f"   Passed: {passed_tests}")
        print(f"   Failed: {total_tests - passed_tests}")
        print(f"   Success Rate: {success_rate:.1f}%")
        
        # Categorize results
        failed_tests = [name for name, passed in self.test_results if not passed]
        
        if success_rate == 100:
            print(f"\n🎉 PERFECT SCORE! All tests passed! 🚀")
            print(f"✅ Your API is working flawlessly!")
        elif success_rate >= 90:
            print(f"\n🌟 EXCELLENT! Almost perfect performance!")
            print(f"✅ Your API is working very well with minor issues.")
        elif success_rate >= 75:
            print(f"\n✅ GOOD! Most functionality working correctly.")
            print(f"⚠️  Some areas need attention.")
        elif success_rate >= 50:
            print(f"\n⚠️  MODERATE. Core functionality working but improvements needed.")
        else:
            print(f"\n❌ POOR. Significant issues found that need immediate attention.")
        
        if failed_tests:
            print(f"\n🔍 Failed Tests:")
            for test_name in failed_tests:
                print(f"   ❌ {test_name}")
        
        return success_rate >= 75
    
    def run_comprehensive_suite(self):
        """Run all tests in the comprehensive suite"""
        print("🚀 ENHANCED COMPREHENSIVE API TEST SUITE")
        print(f"⏰ Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"🌐 Target: {self.base_url}")
        
        # Clear previous results
        self.test_results = []
        
        # Run test categories
        connectivity_ok = self.test_server_connectivity()
        if not connectivity_ok:
            print("\n💥 Cannot proceed - server is not responding!")
            return False
        
        # Run all test suites
        health_ok = self.test_health_endpoint()
        generation_ok = self.test_pitch_generation_variety()
        comparison_ok = self.test_detailed_vs_regular()
        completeness_ok = self.test_content_completeness()
        error_handling_ok = self.test_error_scenarios()
        
        # Generate final report
        overall_success = self.generate_comprehensive_report()
        
        print(f"\n🏁 Testing completed at: {datetime.now().strftime('%H:%M:%S')}")
        
        return overall_success

def main():
    """Main function to run comprehensive API tests"""
    tester = EnhancedAPITester()
    success = tester.run_comprehensive_suite()
    
    print(f"\n{'🟢 COMPREHENSIVE TESTING COMPLETED SUCCESSFULLY' if success else '🔴 COMPREHENSIVE TESTING FOUND SIGNIFICANT ISSUES'}")
    
    return success

if __name__ == "__main__":
    import sys
    success = main()
    sys.exit(0 if success else 1)

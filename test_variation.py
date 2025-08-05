#!/usr/bin/env python3
"""
Enhanced test script to comprehensively verify that the pitch deck generator 
produces different outputs for various parameter combinations.
"""

import requests
import json
import time
import hashlib
import re
from datetime import datetime
from typing import List, Dict, Any
import statistics

API_BASE_URL = 'http://localhost:8000/api'

class PitchDeckTester:
    """Enhanced testing class for pitch deck variation analysis"""
    
    def __init__(self):
        self.results = []
        self.test_start_time = time.time()
        
    def run_comprehensive_test(self):
        """Run comprehensive variation testing with multiple scenarios"""
        print("🚀 ENHANCED PITCH DECK VARIATION TESTING")
        print("=" * 80)
        
        # Test server health first
        if not self._check_server_health():
            return False
            
        # Run multiple test scenarios
        scenarios = [
            self._test_audience_variation(),
            self._test_style_variation(), 
            self._test_stage_variation(),
            self._test_model_variation(),
            self._test_competitor_variation(),
            self._test_industry_variation(),
            self._test_combined_variation()
        ]
        
        # Analyze all results
        self._comprehensive_analysis()
        
        return True
    
    def _check_server_health(self) -> bool:
        """Check if server is running and get configuration"""
        try:
            print("🔍 Checking server health...")
            response = requests.get(f"{API_BASE_URL}/health", timeout=10)
            
            if response.status_code == 200:
                health_data = response.json()
                print(f"✅ Server Status: {health_data.get('status', 'unknown')}")
                print(f"🤖 AI Provider: {health_data.get('ai_provider', 'unknown')}")
                print(f"🎭 Mock Mode: {health_data.get('mock_mode', 'unknown')}")
                print(f"🔧 Gemini Available: {health_data.get('gemini_available', False)}")
                print(f"🔑 OpenAI Configured: {health_data.get('openai_configured', False)}")
                return True
            else:
                print(f"❌ Server health check failed: HTTP {response.status_code}")
                return False
                
        except Exception as e:
            print(f"❌ Cannot connect to server: {e}")
            print("Please ensure the server is running on http://localhost:8000")
            return False
    
    def _test_audience_variation(self) -> List[Dict]:
        """Test variation across different target audiences"""
        print("\n" + "="*60)
        print("📊 TESTING TARGET AUDIENCE VARIATION")
        print("="*60)
        
        base_idea = "A mobile app that helps students find part-time internships"
        audiences = ["angel investors", "VCs", "corporate investors", "accelerators", "banks"]
        
        test_cases = []
        for audience in audiences:
            test_cases.append({
                "idea": base_idea,
                "target_audience": audience,
                "presentation_style": "balanced",
                "funding_stage": "seed",
                "business_model": "subscription",
                "request_id": f"audience_{audience}_{int(time.time())}_{hash(audience) % 1000}"
            })
        
        results = self._execute_test_batch("Target Audience", test_cases)
        self._analyze_batch_variation(results, "target_audience")
        return results
    
    def _test_style_variation(self) -> List[Dict]:
        """Test variation across different presentation styles"""
        print("\n" + "="*60)
        print("🎨 TESTING PRESENTATION STYLE VARIATION")
        print("="*60)
        
        base_idea = "An AI-powered fitness platform for seniors"
        styles = ["data-driven", "storytelling", "technology-focused", "market-opportunity", "problem-solving"]
        
        test_cases = []
        for style in styles:
            test_cases.append({
                "idea": base_idea,
                "target_audience": "angel investors",
                "presentation_style": style,
                "funding_stage": "seed",
                "business_model": "freemium",
                "request_id": f"style_{style}_{int(time.time())}_{hash(style) % 1000}"
            })
        
        results = self._execute_test_batch("Presentation Style", test_cases)
        self._analyze_batch_variation(results, "presentation_style")
        return results
    
    def _test_stage_variation(self) -> List[Dict]:
        """Test variation across different funding stages"""
        print("\n" + "="*60)
        print("💰 TESTING FUNDING STAGE VARIATION")
        print("="*60)
        
        base_idea = "A blockchain-based platform for freelancers"
        stages = ["idea", "pre-seed", "seed", "series-a", "series-b"]
        
        test_cases = []
        for stage in stages:
            test_cases.append({
                "idea": base_idea,
                "target_audience": "VCs",
                "presentation_style": "balanced",
                "funding_stage": stage,
                "business_model": "marketplace",
                "request_id": f"stage_{stage}_{int(time.time())}_{hash(stage) % 1000}"
            })
        
        results = self._execute_test_batch("Funding Stage", test_cases)
        self._analyze_batch_variation(results, "funding_stage")
        return results
    
    def _test_model_variation(self) -> List[Dict]:
        """Test variation across different business models"""
        print("\n" + "="*60)
        print("🏢 TESTING BUSINESS MODEL VARIATION")
        print("="*60)
        
        base_idea = "A sustainable food delivery service"
        models = ["subscription", "marketplace", "freemium", "transaction", "advertising", "enterprise"]
        
        test_cases = []
        for model in models:
            test_cases.append({
                "idea": base_idea,
                "target_audience": "general investors",
                "presentation_style": "balanced",
                "funding_stage": "seed",
                "business_model": model,
                "request_id": f"model_{model}_{int(time.time())}_{hash(model) % 1000}"
            })
        
        results = self._execute_test_batch("Business Model", test_cases)
        self._analyze_batch_variation(results, "business_model")
        return results
    
    def _test_competitor_variation(self) -> List[Dict]:
        """Test variation with different competitor contexts"""
        print("\n" + "="*60)
        print("⚔️ TESTING COMPETITOR CONTEXT VARIATION")
        print("="*60)
        
        base_idea = "A virtual reality meditation app"
        competitor_contexts = [
            None,
            "Headspace, Calm",
            "Oculus, Meta",
            "Peloton, Mirror",
            "Apple Fitness, Nike Training"
        ]
        
        test_cases = []
        for i, competitors in enumerate(competitor_contexts):
            test_cases.append({
                "idea": base_idea,
                "target_audience": "angel investors",
                "presentation_style": "balanced",
                "funding_stage": "seed",
                "business_model": "subscription",
                "competitor_context": competitors,
                "request_id": f"competitor_{i}_{int(time.time())}_{hash(str(competitors)) % 1000}"
            })
        
        results = self._execute_test_batch("Competitor Context", test_cases)
        self._analyze_batch_variation(results, "competitor_context")
        return results
    
    def _test_industry_variation(self) -> List[Dict]:
        """Test variation across different industries"""
        print("\n" + "="*60)
        print("🏭 TESTING INDUSTRY VARIATION")
        print("="*60)
        
        base_idea = "An AI-powered platform that optimizes business operations"
        industries = ["FinTech", "HealthTech", "EdTech", "RetailTech", "FoodTech"]
        
        test_cases = []
        for industry in industries:
            test_cases.append({
                "idea": f"{base_idea} for {industry.lower().replace('tech', '')} companies",
                "target_audience": "VCs",
                "presentation_style": "balanced",
                "funding_stage": "seed",
                "business_model": "subscription",
                "industry": industry,
                "request_id": f"industry_{industry}_{int(time.time())}_{hash(industry) % 1000}"
            })
        
        results = self._execute_test_batch("Industry Focus", test_cases)
        self._analyze_batch_variation(results, "industry")
        return results
    
    def _test_combined_variation(self) -> List[Dict]:
        """Test with completely different parameter combinations"""
        print("\n" + "="*60)
        print("🌟 TESTING COMBINED PARAMETER VARIATION")
        print("="*60)
        
        test_cases = [
            {
                "idea": "A smart home security system using AI",
                "target_audience": "angel investors",
                "presentation_style": "storytelling",
                "funding_stage": "pre-seed",
                "business_model": "subscription",
                "industry": "HealthTech",
                "competitor_context": "Ring, Nest",
                "request_id": f"combined_1_{int(time.time())}"
            },
            {
                "idea": "A smart home security system using AI", 
                "target_audience": "corporate investors",
                "presentation_style": "data-driven",
                "funding_stage": "series-a",
                "business_model": "enterprise",
                "industry": "FinTech",
                "competitor_context": "ADT, SimpliSafe",
                "request_id": f"combined_2_{int(time.time())}"
            },
            {
                "idea": "A smart home security system using AI",
                "target_audience": "accelerators", 
                "presentation_style": "technology-focused",
                "funding_stage": "seed",
                "business_model": "freemium",
                "industry": "RetailTech", 
                "competitor_context": "Arlo, Wyze",
                "request_id": f"combined_3_{int(time.time())}"
            }
        ]
        
        results = self._execute_test_batch("Combined Parameters", test_cases)
        self._analyze_batch_variation(results, "combined")
        return results
    
    def _execute_test_batch(self, batch_name: str, test_cases: List[Dict]) -> List[Dict]:
        """Execute a batch of test cases and return results"""
        results = []
        
        for i, test_case in enumerate(test_cases, 1):
            print(f"\n📊 {batch_name} Test {i}:")
            
            # Display test parameters
            for key, value in test_case.items():
                if key != "idea" and key != "request_id" and value is not None:
                    print(f"   {key.replace('_', ' ').title()}: {value}")
            
            try:
                # Add retry logic for robustness
                max_retries = 2
                for attempt in range(max_retries + 1):
                    try:
                        response = requests.post(f"{API_BASE_URL}/generate", json=test_case, timeout=45)
                        break
                    except requests.Timeout:
                        if attempt < max_retries:
                            print(f"   ⏳ Timeout, retrying... (attempt {attempt + 2})")
                            time.sleep(2)
                        else:
                            raise
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get('success'):
                        deck_content = data.get('deck', '')
                        
                        # Enhanced result data
                        result = {
                            'batch': batch_name,
                            'test_case': i,
                            'params': test_case,
                            'content': deck_content,
                            'length': len(deck_content),
                            'word_count': len(deck_content.split()),
                            'hash': hashlib.md5(deck_content.encode()).hexdigest()[:8],
                            'timestamp': datetime.now().isoformat(),
                            'response_time': response.elapsed.total_seconds()
                        }
                        
                        results.append(result)
                        print(f"   ✅ Generated ({len(deck_content)} chars, {result['word_count']} words)")
                        print(f"   ⏱️ Response time: {result['response_time']:.2f}s")
                        print(f"   🔗 Content hash: {result['hash']}")
                        print(f"   📝 Preview: {deck_content[:100].replace(chr(10), ' ')}...")
                        
                    else:
                        print(f"   ❌ API Error: {data.get('message', 'Unknown error')}")
                else:
                    print(f"   ❌ HTTP Error: {response.status_code}")
                    
            except Exception as e:
                print(f"   ❌ Request failed: {e}")
            
            # Delay between requests to avoid rate limiting
            time.sleep(1.5)
        
        self.results.extend(results)
        return results
    
    def _analyze_batch_variation(self, results: List[Dict], param_name: str):
        """Analyze variation within a batch of results"""
        if len(results) < 2:
            print("   ⚠️ Need at least 2 results for comparison")
            return
        
        print(f"\n📈 {param_name.replace('_', ' ').title()} Variation Analysis:")
        print("-" * 50)
        
        # Calculate pairwise similarities
        similarities = []
        unique_hashes = set()
        
        for i in range(len(results)):
            unique_hashes.add(results[i]['hash'])
            for j in range(i + 1, len(results)):
                similarity = self._calculate_advanced_similarity(
                    results[i]['content'], 
                    results[j]['content']
                )
                similarities.append(similarity)
                
                param_i = results[i]['params'].get(param_name, 'default')
                param_j = results[j]['params'].get(param_name, 'default')
                
                print(f"   {param_i} vs {param_j}: {similarity:.1%} similarity")
        
        # Overall statistics
        if similarities:
            avg_similarity = statistics.mean(similarities)
            min_similarity = min(similarities)
            max_similarity = max(similarities)
            
            print(f"\n📊 Batch Statistics:")
            print(f"   Average Similarity: {avg_similarity:.1%}")
            print(f"   Range: {min_similarity:.1%} - {max_similarity:.1%}")
            print(f"   Unique Content Hashes: {len(unique_hashes)}/{len(results)}")
            
            # Quality assessment
            if avg_similarity < 0.3:
                print("   ✅ EXCELLENT VARIATION - Content is highly diverse")
            elif avg_similarity < 0.5:
                print("   ✅ GOOD VARIATION - Content shows solid differences")
            elif avg_similarity < 0.7:
                print("   ⚠️ MODERATE VARIATION - Some differences present")
            else:
                print("   ❌ LOW VARIATION - Content may be too similar")
    
    def _calculate_advanced_similarity(self, text1: str, text2: str) -> float:
        """Calculate advanced similarity between two texts"""
        if not text1 or not text2:
            return 0.0
        
        # Normalize texts
        text1_clean = re.sub(r'[^\w\s]', '', text1.lower())
        text2_clean = re.sub(r'[^\w\s]', '', text2.lower())
        
        # Word-based similarity (Jaccard index)
        words1 = set(text1_clean.split())
        words2 = set(text2_clean.split())
        
        if not words1 or not words2:
            return 0.0
        
        intersection = words1.intersection(words2)
        union = words1.union(words2)
        word_similarity = len(intersection) / len(union) if union else 0.0
        
        # Phrase-based similarity (bigrams)
        bigrams1 = set([f"{words1[i]} {words1[i+1]}" for i, w in enumerate(text1_clean.split()[:-1])])
        bigrams2 = set([f"{words2[i]} {words2[i+1]}" for i, w in enumerate(text2_clean.split()[:-1])])
        
        if bigrams1 and bigrams2:
            bigram_intersection = bigrams1.intersection(bigrams2)
            bigram_union = bigrams1.union(bigrams2)
            phrase_similarity = len(bigram_intersection) / len(bigram_union) if bigram_union else 0.0
        else:
            phrase_similarity = 0.0
        
        # Weighted combination
        return (word_similarity * 0.7) + (phrase_similarity * 0.3)
    
    def _comprehensive_analysis(self):
        """Perform comprehensive analysis of all test results"""
        print("\n" + "=" * 80)
        print("🎯 COMPREHENSIVE VARIATION ANALYSIS")
        print("=" * 80)
        
        if not self.results:
            print("❌ No results to analyze")
            return
        
        # Overall statistics
        total_tests = len(self.results)
        unique_hashes = len(set(r['hash'] for r in self.results))
        avg_length = statistics.mean([r['length'] for r in self.results])
        avg_words = statistics.mean([r['word_count'] for r in self.results])
        avg_response_time = statistics.mean([r['response_time'] for r in self.results])
        
        print(f"📊 Overall Test Statistics:")
        print(f"   Total Tests Executed: {total_tests}")
        print(f"   Unique Content Generated: {unique_hashes}/{total_tests} ({unique_hashes/total_tests:.1%})")
        print(f"   Average Content Length: {avg_length:.0f} characters")
        print(f"   Average Word Count: {avg_words:.0f} words")
        print(f"   Average Response Time: {avg_response_time:.2f} seconds")
        
        # Cross-batch similarity analysis
        print(f"\n🔍 Cross-Batch Similarity Analysis:")
        batches = {}
        for result in self.results:
            batch_name = result['batch']
            if batch_name not in batches:
                batches[batch_name] = []
            batches[batch_name].append(result)
        
        batch_names = list(batches.keys())
        for i in range(len(batch_names)):
            for j in range(i + 1, len(batch_names)):
                batch1_results = batches[batch_names[i]]
                batch2_results = batches[batch_names[j]]
                
                # Compare first result from each batch
                if batch1_results and batch2_results:
                    similarity = self._calculate_advanced_similarity(
                        batch1_results[0]['content'],
                        batch2_results[0]['content']
                    )
                    print(f"   {batch_names[i]} vs {batch_names[j]}: {similarity:.1%}")
        
        # Performance analysis
        print(f"\n⚡ Performance Analysis:")
        response_times = [r['response_time'] for r in self.results]
        print(f"   Fastest Response: {min(response_times):.2f}s")
        print(f"   Slowest Response: {max(response_times):.2f}s")
        print(f"   Response Time Range: {max(response_times) - min(response_times):.2f}s")
        
        # Final assessment
        total_time = time.time() - self.test_start_time
        print(f"\n🏁 Test Completion:")
        print(f"   Total Execution Time: {total_time:.1f} seconds")
        print(f"   Tests per Minute: {(total_tests / total_time) * 60:.1f}")
        
        if unique_hashes / total_tests > 0.9:
            print("   ✅ EXCELLENT: High content diversity achieved")
        elif unique_hashes / total_tests > 0.7:
            print("   ✅ GOOD: Solid content variation achieved") 
        elif unique_hashes / total_tests > 0.5:
            print("   ⚠️ MODERATE: Some content variation present")
        else:
            print("   ❌ POOR: Low content diversity - investigate parameter handling")
    
    def save_results_to_file(self, filename: str = None):
        """Save detailed results to JSON file"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"pitch_deck_test_results_{timestamp}.json"
        
        test_summary = {
            'test_metadata': {
                'timestamp': datetime.now().isoformat(),
                'total_tests': len(self.results),
                'unique_content': len(set(r['hash'] for r in self.results)),
                'execution_time': time.time() - self.test_start_time
            },
            'results': self.results
        }
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(test_summary, f, indent=2, ensure_ascii=False)
        
        print(f"📁 Results saved to: {filename}")


def calculate_similarity(text1, text2):
    """Legacy function for backward compatibility"""
    if not text1 or not text2:
        return 0.0
        
    # Simple word-based similarity
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    
    if not words1 or not words2:
        return 0.0
        
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    
    return len(intersection) / len(union) if union else 0.0


def run_quick_test():
    """Quick test function for simple testing"""
    tester = PitchDeckTester()
    
    # Simple 3-test variation
    base_idea = "A mobile app that helps students find part-time internships"
    test_cases = [
        {
            "idea": base_idea,
            "target_audience": "angel investors",
            "presentation_style": "data-driven",
            "funding_stage": "seed",
            "business_model": "subscription",
            "request_id": f"quick_1_{int(time.time())}"
        },
        {
            "idea": base_idea,
            "target_audience": "VCs",
            "presentation_style": "storytelling",
            "funding_stage": "series-a", 
            "business_model": "marketplace",
            "request_id": f"quick_2_{int(time.time())}"
        },
        {
            "idea": base_idea,
            "target_audience": "corporate investors",
            "presentation_style": "technology-focused",
            "funding_stage": "pre-seed",
            "business_model": "freemium",
            "competitor_context": "LinkedIn, Indeed",
            "request_id": f"quick_3_{int(time.time())}"
        }
    ]
    
    print("🚀 QUICK PITCH DECK VARIATION TEST")
    print("=" * 60)
    
    results = tester._execute_test_batch("Quick Test", test_cases)
    tester._analyze_batch_variation(results, "mixed_params")
    
    if results:
        print(f"\n✅ Quick test completed: {len(results)} results generated")
        tester.save_results_to_file("quick_test_results.json")
    else:
        print("\n❌ Quick test failed: No results generated")


if __name__ == "__main__":
    import sys
    
    try:
        # Check if server is running first
        health_response = requests.get(f"{API_BASE_URL}/health", timeout=5)
        if health_response.status_code != 200:
            print("� Server health check failed")
            sys.exit(1)
            
        # Command line argument handling
        if len(sys.argv) > 1 and sys.argv[1] == "--quick":
            run_quick_test()
        else:
            # Run comprehensive test
            tester = PitchDeckTester()
            success = tester.run_comprehensive_test()
            
            if success and tester.results:
                # Save results to file
                tester.save_results_to_file()
                print(f"\n🎉 Comprehensive testing completed successfully!")
                print(f"� Generated {len(tester.results)} unique test results")
            else:
                print(f"\n❌ Testing failed or no results generated")
                sys.exit(1)
                
    except Exception as e:
        print(f"🔴 Cannot connect to server: {e}")
        print("Please make sure the server is running on http://localhost:8000")
        print("\nTo run a quick test, use: python test_variation.py --quick")
        sys.exit(1)

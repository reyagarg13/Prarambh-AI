"""
Quick test to verify the import fix worked
"""
import asyncio

# Mock the required classes for testing
class MockPitchRequest:
    def __init__(self, idea, target_audience, funding_stage):
        self.idea = idea
        self.target_audience = target_audience
        self.funding_stage = funding_stage

async def test_detailed_function():
    """Test the detailed pitch generation function"""
    try:
        # Import the function
        import sys
        import os
        sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))
        
        from routes.generate import generate_detailed_pitch
        
        # Create a mock request
        mock_request = MockPitchRequest(
            idea="AI-powered fitness platform with virtual trainers",
            target_audience="angel investors", 
            funding_stage="seed"
        )
        
        print("🧪 Testing detailed pitch deck generation...")
        print("   Idea: AI-powered fitness platform with virtual trainers")
        
        # Call the function
        result = await generate_detailed_pitch(mock_request)
        
        if result and result.success:
            print("✅ SUCCESS: Detailed pitch deck generated!")
            print(f"   Generated: {len(result.deck)} characters")
            print(f"   Message: {result.message}")
            print("\n📄 First 300 characters of deck:")
            print(result.deck[:300] + "...")
            return True
        else:
            print("❌ FAILED: Function returned unsuccessful result")
            if result:
                print(f"   Error message: {result.message}")
            return False
            
    except Exception as e:
        print(f"❌ ERROR: Exception occurred: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = asyncio.run(test_detailed_function())
    if success:
        print("\n🎉 Import fix verified! The detailed function works correctly.")
    else:
        print("\n❌ There may still be issues with the function.")

"""
Simple test to verify the detailed pitch deck function works correctly
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.routes.generate import generate_detailed_pitch

def test_detailed_function():
    try:
        # Test the function directly
        idea = "AI-powered fitness app"
        target_audience = "venture capitalists"
        funding_stage = "seed"
        
        print("Testing detailed pitch deck generation...")
        result = generate_detailed_pitch(idea, target_audience, funding_stage)
        
        if result:
            print("✅ Detailed pitch deck function works!")
            print(f"Generated {len(result)} characters")
            print("\nFirst 200 characters:")
            print(result[:200] + "...")
            return True
        else:
            print("❌ Function returned empty result")
            return False
            
    except Exception as e:
        print(f"❌ Error in detailed function: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    test_detailed_function()

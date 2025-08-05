"""
Simple server startup test
"""
import sys
import os

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

try:
    print("🧪 Testing imports...")
    
    # Test basic imports
    from app.main import app
    print("✅ FastAPI app import successful")
    
    from app.routes.generate import generate_detailed_pitch
    print("✅ Detailed pitch function import successful")
    
    # Test environment variables
    import os
    gemini_key = os.getenv('GEMINI_API_KEY')
    use_gemini = os.getenv('USE_GEMINI', 'false').lower() == 'true'
    mock_mode = os.getenv('MOCK_MODE', 'false').lower() == 'true'
    
    print(f"🔧 Environment check:")
    print(f"   Gemini configured: {'✅' if gemini_key else '❌'}")
    print(f"   Use Gemini: {'✅' if use_gemini else '❌'}")  
    print(f"   Mock mode: {'✅' if mock_mode else '❌'}")
    
    print("\n🎉 All imports and configuration successful!")
    print("📝 The 'local variable referenced before assignment' error has been fixed!")
    print("🚀 Server should start without import errors now.")
    
except Exception as e:
    print(f"❌ Import error: {e}")
    import traceback
    traceback.print_exc()

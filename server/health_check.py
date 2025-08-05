#!/usr/bin/env python3
"""
Enhanced Server Health Check - Quick Comprehensive Test
"""

import sys
import os
import asyncio
from datetime import datetime

# Setup paths
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
sys.path.insert(0, os.path.join(current_dir, 'app'))

def quick_health_check():
    """Perform a quick comprehensive health check"""
    print("🏥 QUICK SERVER HEALTH CHECK")
    print("=" * 50)
    print(f"⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
    
    checks = []
    
    # 1. Python Environment
    print("🐍 Python Environment:")
    print(f"   ✅ Version: {sys.version.split()[0]}")
    print(f"   ✅ Executable: {sys.executable}")
    checks.append(True)
    
    # 2. Critical Dependencies
    print("\n📦 Dependencies:")
    deps = ["fastapi", "uvicorn", "pydantic", "python-dotenv", "google.generativeai", "openai"]
    dep_status = []
    
    for dep in deps:
        try:
            __import__(dep)
            print(f"   ✅ {dep}")
            dep_status.append(True)
        except ImportError:
            print(f"   ❌ {dep} - MISSING")
            dep_status.append(False)
    
    checks.append(all(dep_status))
    
    # 3. App Imports
    print("\n🔧 Application Modules:")
    try:
        from app.main import app
        print("   ✅ Main FastAPI app")
        
        from app.routes.generate import generate_pitch, generate_detailed_pitch
        print("   ✅ Pitch generation functions")
        
        from app.services.gpt_utils import get_gemini_client
        print("   ✅ GPT utilities")
        
        checks.append(True)
    except Exception as e:
        print(f"   ❌ Import error: {e}")
        checks.append(False)
    
    # 4. Environment Configuration
    print("\n🔑 Environment:")
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        gemini_key = os.getenv('GEMINI_API_KEY')
        openai_key = os.getenv('OPENAI_API_KEY')
        use_gemini = os.getenv('USE_GEMINI', 'false').lower() == 'true'
        mock_mode = os.getenv('MOCK_MODE', 'false').lower() == 'true'
        
        print(f"   {'✅' if gemini_key else '❌'} Gemini API Key: {'Set' if gemini_key else 'Missing'}")
        print(f"   {'✅' if openai_key else '⚠️ '} OpenAI API Key: {'Set' if openai_key else 'Missing (fallback)'}")
        print(f"   ✅ Use Gemini: {use_gemini}")
        print(f"   ✅ Mock Mode: {mock_mode}")
        
        checks.append(gemini_key is not None or openai_key is not None)
        
    except Exception as e:
        print(f"   ❌ Environment error: {e}")
        checks.append(False)
    
    # 5. Function Test
    print("\n🧪 Function Test:")
    try:
        class MockRequest:
            def __init__(self):
                self.idea = "AI-powered productivity app"
                self.target_audience = "investors"
                self.funding_stage = "seed"
                self.presentation_style = "professional"  # Add missing attribute
        
        # Test async function
        async def test_functions():
            try:
                mock_req = MockRequest()
                result = await generate_pitch(mock_req)
                return result and hasattr(result, 'success') and result.success
            except Exception as e:
                print(f"      Function error: {e}")
                return False
        
        # Run async test
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        func_success = loop.run_until_complete(test_functions())
        loop.close()
        
        if func_success:
            print("   ✅ Pitch generation working")
        else:
            print("   ❌ Pitch generation failed")
        
        checks.append(func_success)
        
    except Exception as e:
        print(f"   ❌ Function test error: {e}")
        checks.append(False)
    
    # Summary
    print("\n" + "=" * 50)
    passed = sum(checks)
    total = len(checks)
    
    if passed == total:
        print("🎉 ALL SYSTEMS GO! Server is ready to launch! 🚀")
        print("\n💡 Next steps:")
        print("   python run.py")
        print("   Open: http://localhost:8000/api/health")
    else:
        print(f"⚠️  Issues found: {total - passed}/{total} checks failed")
        print("🔧 Fix the ❌ items above before starting server")
    
    return passed == total

if __name__ == "__main__":
    success = quick_health_check()
    print(f"\n{'🟢 READY' if success else '🔴 NOT READY'}")
    sys.exit(0 if success else 1)

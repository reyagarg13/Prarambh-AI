#!/usr/bin/env python3
"""
Enhanced Server Startup Script with Comprehensive Logging
"""

import sys
import os
import asyncio
import uvicorn
from datetime import datetime

# Setup paths
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

def pre_startup_check():
    """Perform pre-startup validation"""
    print("🚀 COFOUNDR AI SERVER STARTUP")
    print("=" * 60)
    print(f"⏰ Starting at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📁 Working Directory: {os.getcwd()}")
    print(f"🐍 Python: {sys.version.split()[0]}")
    
    print("\n🔍 Pre-startup validation...")
    
    try:
        # Check critical imports
        print("   📦 Loading FastAPI...")
        from app.main import app
        print("   ✅ FastAPI app loaded")
        
        print("   📦 Loading routes...")
        from app.routes.generate import router
        print("   ✅ Routes loaded")
        
        print("   📦 Loading services...")
        from app.services.gpt_utils import get_gemini_client
        print("   ✅ Services loaded")
        
        print("   🔑 Checking environment...")
        from dotenv import load_dotenv
        load_dotenv()
        
        gemini_key = os.getenv('GEMINI_API_KEY')
        use_gemini = os.getenv('USE_GEMINI', 'false').lower() == 'true'
        mock_mode = os.getenv('MOCK_MODE', 'false').lower() == 'true'
        
        print(f"   {'✅' if gemini_key else '⚠️ '} Gemini API: {'Configured' if gemini_key else 'Not configured'}")
        print(f"   ✅ Primary Provider: {'Gemini' if use_gemini else 'OpenAI'}")
        print(f"   ✅ Mock Mode: {'Enabled' if mock_mode else 'Disabled'}")
        
        print("\n✅ All pre-startup checks passed!")
        return app
        
    except Exception as e:
        print(f"\n❌ Pre-startup check failed: {e}")
        import traceback
        traceback.print_exc()
        return None

def start_server():
    """Start server with enhanced configuration"""
    app = pre_startup_check()
    
    if not app:
        print("💥 Cannot start server due to validation errors")
        sys.exit(1)
    
    print("\n🌐 Starting server...")
    print("   📍 Host: localhost")
    print("   🔌 Port: 8000")
    print("   🔄 Reload: Enabled")
    print("   📊 Log Level: info")
    
    print("\n🔗 Server URLs:")
    print("   🏠 Health Check: http://localhost:8000/api/health")
    print("   📝 Generate Pitch: http://localhost:8000/api/generate")
    print("   📋 Detailed Pitch: http://localhost:8000/api/generate-detailed")
    print("   📚 API Docs: http://localhost:8000/docs")
    
    print("\n" + "=" * 60)
    print("🎉 SERVER READY! Press Ctrl+C to stop")
    print("=" * 60)
    
    try:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        print("\n\n👋 Server shutdown requested")
        print("✅ Server stopped gracefully")
    except Exception as e:
        print(f"\n💥 Server error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    start_server()

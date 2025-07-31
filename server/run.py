#!/usr/bin/env python3
"""
Run script for Cofoundr AI server
"""
import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    load_dotenv()
    
    # Check if OpenAI API key is configured
    if not os.getenv("OPENAI_API_KEY"):
        print("⚠️  WARNING: OPENAI_API_KEY not found in environment variables")
        print("   Please create a .env file with OPENAI_API_KEY=your_api_key")
    
    port = int(os.getenv("PORT", 8000))
    
    print(f"🚀 Starting Cofoundr AI server on port {port}")
    print(f"📖 API Documentation: http://localhost:{port}/docs")
    print(f"🏥 Health Check: http://localhost:{port}/health")
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )

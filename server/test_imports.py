#!/usr/bin/env python3
"""
Comprehensive test suite to verify server imports, configuration, and functionality
"""

import sys
import os
import asyncio
import traceback
from datetime import datetime

# Add the current directory to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)
sys.path.insert(0, os.path.join(current_dir, 'app'))

def print_section(title):
    """Print a formatted section header"""
    print(f"\n{'='*60}")
    print(f"🔍 {title}")
    print(f"{'='*60}")

def print_subsection(title):
    """Print a formatted subsection header"""
    print(f"\n📋 {title}")
    print("-" * 40)

def test_python_environment():
    """Test Python environment and basic setup"""
    print_subsection("Python Environment")
    
    print(f"✅ Python Version: {sys.version}")
    print(f"✅ Python Executable: {sys.executable}")
    print(f"✅ Current Working Directory: {os.getcwd()}")
    print(f"✅ Script Directory: {current_dir}")
    print(f"✅ Python Path Entries: {len(sys.path)} entries")
    
    # Check if key directories exist
    app_dir = os.path.join(current_dir, 'app')
    routes_dir = os.path.join(app_dir, 'routes')
    services_dir = os.path.join(app_dir, 'services')
    
    print(f"✅ App Directory Exists: {os.path.exists(app_dir)}")
    print(f"✅ Routes Directory Exists: {os.path.exists(routes_dir)}")
    print(f"✅ Services Directory Exists: {os.path.exists(services_dir)}")
    
    return True

def test_core_dependencies():
    """Test core Python dependencies"""
    print_subsection("Core Dependencies")
    
    dependencies = [
        ("fastapi", "FastAPI web framework"),
        ("uvicorn", "ASGI server"),
        ("pydantic", "Data validation"),
        ("python-dotenv", "Environment variables"),
        ("requests", "HTTP client"),
        ("openai", "OpenAI API client"),
        ("google.generativeai", "Google Gemini API client"),
    ]
    
    failed_imports = []
    
    for module_name, description in dependencies:
        try:
            __import__(module_name)
            print(f"✅ {module_name:<20} - {description}")
        except ImportError as e:
            print(f"❌ {module_name:<20} - FAILED: {e}")
            failed_imports.append(module_name)
    
    if failed_imports:
        print(f"\n⚠️  Missing dependencies: {', '.join(failed_imports)}")
        print("💡 Install with: pip install " + " ".join(failed_imports))
        return False
    
    return True

def test_app_imports():
    """Test application-specific imports"""
    print_subsection("Application Imports")
    
    import_tests = [
        ("app.main", "Main FastAPI application"),
        ("app.routes.generate", "Pitch generation routes"),
        ("app.services.gpt_utils", "GPT utility functions"),
    ]
    
    failed_imports = []
    
    for module_name, description in import_tests:
        try:
            module = __import__(module_name, fromlist=[''])
            print(f"✅ {module_name:<25} - {description}")
            
            # Additional checks for specific modules
            if module_name == "app.main":
                if hasattr(module, 'app'):
                    print(f"   ↳ FastAPI app instance found")
                else:
                    print(f"   ⚠️  FastAPI app instance not found")
                    
            elif module_name == "app.routes.generate":
                if hasattr(module, 'router'):
                    print(f"   ↳ Router instance found")
                if hasattr(module, 'generate_pitch'):
                    print(f"   ↳ generate_pitch function found")
                if hasattr(module, 'generate_detailed_pitch'):
                    print(f"   ↳ generate_detailed_pitch function found")
                    
        except ImportError as e:
            print(f"❌ {module_name:<25} - FAILED: {e}")
            failed_imports.append(module_name)
        except Exception as e:
            print(f"⚠️  {module_name:<25} - ERROR: {e}")
            failed_imports.append(module_name)
    
    return len(failed_imports) == 0

def test_environment_configuration():
    """Test environment configuration"""
    print_subsection("Environment Configuration")
    
    # Load environment variables
    try:
        from dotenv import load_dotenv
        load_dotenv()
        print("✅ Environment variables loaded from .env")
    except Exception as e:
        print(f"⚠️  Could not load .env file: {e}")
    
    # Check critical environment variables
    env_vars = [
        ("GEMINI_API_KEY", "Gemini API Key", True),
        ("OPENAI_API_KEY", "OpenAI API Key", False),
        ("USE_GEMINI", "Use Gemini Flag", False),
        ("MOCK_MODE", "Mock Mode Flag", False),
    ]
    
    for var_name, description, is_critical in env_vars:
        value = os.getenv(var_name)
        if value:
            # Hide sensitive values
            if "KEY" in var_name:
                display_value = f"{value[:8]}..." if len(value) > 8 else "***"
            else:
                display_value = value
            print(f"✅ {var_name:<15} = {display_value} ({description})")
        else:
            status = "❌" if is_critical else "⚠️ "
            print(f"{status} {var_name:<15} = Not set ({description})")
    
    return True

def test_api_providers():
    """Test API provider configurations"""
    print_subsection("API Provider Configuration")
    
    # Test Gemini configuration
    try:
        import google.generativeai as genai
        api_key = os.getenv('GEMINI_API_KEY')
        
        if api_key:
            try:
                genai.configure(api_key=api_key)
                print("✅ Gemini API configured successfully")
                
                # Test model listing (if API key is valid)
                try:
                    models = list(genai.list_models())
                    print(f"   ↳ Found {len(models)} available models")
                    # Find the model we use
                    flash_model = next((m for m in models if 'gemini-1.5-flash' in m.name), None)
                    if flash_model:
                        print("   ↳ gemini-1.5-flash model available ✅")
                    else:
                        print("   ⚠️  gemini-1.5-flash model not found")
                except Exception as e:
                    print(f"   ⚠️  Could not list models (API quota/network): {e}")
                    
            except Exception as e:
                print(f"❌ Gemini API configuration failed: {e}")
        else:
            print("⚠️  Gemini API key not configured")
            
    except ImportError:
        print("❌ Gemini library not available")
    
    # Test OpenAI configuration (if available)
    try:
        import openai
        api_key = os.getenv('OPENAI_API_KEY')
        
        if api_key:
            print("✅ OpenAI API key configured (fallback available)")
        else:
            print("⚠️  OpenAI API key not configured (no fallback)")
            
    except ImportError:
        print("⚠️  OpenAI library not available")
    
    return True

async def test_function_execution():
    """Test actual function execution"""
    print_subsection("Function Execution Test")
    
    try:
        from app.routes.generate import generate_pitch, generate_detailed_pitch
        
        # Mock request class
        class MockRequest:
            def __init__(self, idea, target_audience="investors", funding_stage="seed"):
                self.idea = idea
                self.target_audience = target_audience
                self.funding_stage = funding_stage
        
        # Test regular pitch generation
        print("🧪 Testing regular pitch generation...")
        mock_request = MockRequest("AI-powered task management app")
        
        try:
            result = await generate_pitch(mock_request)
            if result and hasattr(result, 'success') and result.success:
                print("✅ Regular pitch generation working")
                print(f"   ↳ Generated {len(result.deck)} characters")
            else:
                print(f"❌ Regular pitch generation failed: {getattr(result, 'message', 'Unknown error')}")
                
        except Exception as e:
            print(f"❌ Regular pitch generation error: {e}")
        
        # Test detailed pitch generation
        print("\n🧪 Testing detailed pitch generation...")
        try:
            result = await generate_detailed_pitch(mock_request)
            if result and hasattr(result, 'success') and result.success:
                print("✅ Detailed pitch generation working")
                print(f"   ↳ Generated {len(result.deck)} characters")
            else:
                print(f"❌ Detailed pitch generation failed: {getattr(result, 'message', 'Unknown error')}")
                
        except Exception as e:
            print(f"❌ Detailed pitch generation error: {e}")
            traceback.print_exc()
        
        return True
        
    except Exception as e:
        print(f"❌ Function execution test failed: {e}")
        traceback.print_exc()
        return False

def test_imports():
    """Legacy function for compatibility - now calls comprehensive tests"""
    success = True
    
    success &= test_python_environment()
    success &= test_core_dependencies()
    success &= test_app_imports()
    success &= test_environment_configuration()
    success &= test_api_providers()
    
    # Run async function execution test
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        success &= loop.run_until_complete(test_function_execution())
        loop.close()
    except Exception as e:
        print(f"❌ Async test execution failed: {e}")
        success = False
    
    return success

def generate_summary_report():
    """Generate a comprehensive summary report"""
    print_section("COMPREHENSIVE TEST SUMMARY")
    
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"� Test Run: {timestamp}")
    print(f"🐍 Python: {sys.version.split()[0]}")
    print(f"💻 Platform: {sys.platform}")
    print(f"📁 Working Directory: {os.getcwd()}")
    
    # Check server files
    key_files = [
        "run.py",
        "requirements.txt", 
        ".env",
        "app/main.py",
        "app/routes/generate.py",
        "app/services/gpt_utils.py"
    ]
    
    print(f"\n📂 Key Files Status:")
    for file_path in key_files:
        full_path = os.path.join(current_dir, file_path)
        exists = os.path.exists(full_path)
        status = "✅" if exists else "❌"
        size = ""
        if exists:
            try:
                size = f" ({os.path.getsize(full_path)} bytes)"
            except:
                size = " (size unknown)"
        print(f"   {status} {file_path}{size}")

def test_server_readiness():
    """Test if server is ready to start"""
    print_subsection("Server Readiness Check")
    
    readiness_checks = []
    
    # Check 1: All imports work
    try:
        from app.main import app
        readiness_checks.append(("FastAPI app import", True, "✅"))
    except Exception as e:
        readiness_checks.append(("FastAPI app import", False, f"❌ {e}"))
    
    # Check 2: Environment configured
    has_gemini = bool(os.getenv('GEMINI_API_KEY'))
    has_openai = bool(os.getenv('OPENAI_API_KEY'))
    readiness_checks.append(("API keys configured", has_gemini or has_openai, "✅" if (has_gemini or has_openai) else "❌"))
    
    # Check 3: Dependencies installed
    try:
        import google.generativeai
        import fastapi
        import uvicorn
        readiness_checks.append(("Core dependencies", True, "✅"))
    except ImportError as e:
        readiness_checks.append(("Core dependencies", False, f"❌ Missing: {e}"))
    
    # Check 4: Routes accessible
    try:
        from app.routes.generate import router, generate_pitch, generate_detailed_pitch
        readiness_checks.append(("Route functions", True, "✅"))
    except Exception as e:
        readiness_checks.append(("Route functions", False, f"❌ {e}"))
    
    print("\n🚀 Server Readiness Status:")
    all_ready = True
    for check_name, passed, status in readiness_checks:
        print(f"   {status} {check_name}")
        if not passed:
            all_ready = False
    
    if all_ready:
        print(f"\n🎉 SERVER IS READY TO START!")
        print(f"💡 Run: python run.py")
        print(f"🌐 Then test: http://localhost:8000/api/health")
    else:
        print(f"\n⚠️  SERVER NOT READY - Fix issues above first")
    
    return all_ready

def main():
    """Enhanced main function with comprehensive testing"""
    print(f"🚀 ENHANCED SERVER DIAGNOSTIC TOOL")
    print(f"{'='*60}")
    print(f"🔧 Comprehensive testing of Cofoundr AI server setup")
    print(f"📋 Testing imports, dependencies, configuration, and functionality")
    
    overall_success = True
    
    try:
        # Run all test suites
        overall_success &= test_imports()
        
        # Additional comprehensive tests
        generate_summary_report() 
        overall_success &= test_server_readiness()
        
        # Final status
        print_section("FINAL RESULTS")
        if overall_success:
            print("🎉 ALL TESTS PASSED!")
            print("✅ Your server is properly configured and ready to run")
            print("💡 Next steps:")
            print("   1. Start server: python run.py")
            print("   2. Test health: http://localhost:8000/api/health")
            print("   3. Test generate: POST http://localhost:8000/api/generate")
            print("   4. Test detailed: POST http://localhost:8000/api/generate-detailed")
        else:
            print("❌ SOME TESTS FAILED!")
            print("⚠️  Please fix the issues identified above")
            print("💡 Common fixes:")
            print("   - Install missing packages: pip install -r requirements.txt")
            print("   - Set up .env file with API keys")
            print("   - Check file paths and permissions")
        
        return overall_success
        
    except Exception as e:
        print(f"❌ CRITICAL ERROR during testing: {e}")
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)

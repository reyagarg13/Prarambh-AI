from fastapi import APIRouter, Request, HTTPException
from openai import OpenAI
import os
import logging
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import Optional

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()  # Load the .env file for OpenAI key
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Mock mode for testing when quota is exceeded
MOCK_MODE = os.getenv("MOCK_MODE", "false").lower() == "true"

router = APIRouter()

# Pydantic models for request/response validation
class PitchRequest(BaseModel):
    idea: str
    target_audience: Optional[str] = "general investors"
    industry: Optional[str] = None
    funding_stage: Optional[str] = "seed"

class PitchResponse(BaseModel):
    deck: str
    success: bool = True
    message: Optional[str] = None

@router.post("/generate", response_model=PitchResponse)
async def generate_pitch(pitch_request: PitchRequest):
    """
    Generate a comprehensive startup pitch deck based on the provided idea.
    """
    try:
        idea = pitch_request.idea.strip()
        
        if not idea:
            logger.warning("Empty idea provided")
            return PitchResponse(
                deck="",
                success=False,
                message="Please provide a valid startup idea."
            )

        logger.info(f"🔥 Generating pitch deck for idea: {idea[:100]}...")

        # Check if mock mode is enabled
        if MOCK_MODE:
            logger.info("🎭 Using mock mode - generating sample pitch deck")
            
            # Create dynamic mock content based on the idea
            idea_lower = idea.lower()
            
            # Determine industry context and customize content
            if any(word in idea_lower for word in ['food', 'delivery', 'restaurant', 'meal', 'kitchen']):
                industry_context = "food & delivery"
                market_size = "$150B food service market"
                solution_tech = "Smart logistics and recommendation engine"
                problem = "• Food delivery is slow, expensive, and unreliable\n• 45% of orders arrive late or incorrect\n• Limited options for dietary restrictions\n• High fees burden both customers and restaurants"
                business_model = "• Commission from restaurants: 15-25% per order\n• Delivery fees: $2-5 per order + surge pricing\n• Subscription model: $9.99/month for free delivery\n• Advertising revenue from featured restaurants"
                
            elif any(word in idea_lower for word in ['health', 'fitness', 'wellness', 'medical', 'exercise']):
                industry_context = "health & wellness"
                market_size = "$280B healthcare market"
                solution_tech = "Data-driven health optimization platform"
                problem = "• 73% of people struggle to maintain fitness routines\n• Lack of personalized health guidance\n• Expensive personal trainers and nutritionists\n• Poor tracking of health metrics and progress"
                business_model = "• Subscription tiers: Basic ($4.99), Premium ($14.99), Pro ($29.99)\n• Corporate wellness programs: $5-15 per employee/month\n• Wearable device partnerships and data licensing\n• In-app purchases for specialized programs"
                
            elif any(word in idea_lower for word in ['education', 'learning', 'student', 'school', 'course', 'teach']):
                industry_context = "education technology"
                market_size = "$75B education technology market"
                solution_tech = "Intelligent learning and matching platform"
                problem = "• Traditional education methods are outdated and ineffective\n• 67% of students struggle to find relevant learning resources\n• High cost of quality education creates barriers\n• Lack of personalized learning paths"
                business_model = "• Course fees: $99-499 per course\n• Subscription model: $29.99/month for unlimited access\n• Corporate training contracts: $10K-50K annually\n• Certification and placement fees"
                
            elif any(word in idea_lower for word in ['crypto', 'trading', 'bitcoin', 'blockchain', 'finance']):
                industry_context = "fintech & trading"
                market_size = "$180B cryptocurrency market"
                solution_tech = "AI-powered trading algorithms and risk management"
                problem = "• 80% of crypto traders lose money due to poor timing\n• Complex trading interfaces intimidate new users\n• Lack of automated risk management tools\n• Emotional trading leads to significant losses"
                business_model = "• Trading fees: 0.1-0.5% per transaction\n• Premium features: $49.99/month subscription\n• Copy-trading commissions: 10% of profits\n• API access for institutional clients"
                
            else:
                industry_context = "emerging technology"
                market_size = "$50B+ addressable market"
                solution_tech = "Innovative technology platform"
                problem = "• Current market solutions are fragmented and inefficient\n• 68% dissatisfaction with existing alternatives\n• High costs and poor user experience\n• Lack of modern, user-friendly solutions"
                business_model = "• Subscription model: $19.99/month for premium features\n• Transaction fees: 3-5% per successful transaction\n• Enterprise partnerships: $25K+ annual contracts\n• Freemium model with paid upgrades"
            
            mock_deck = f"""
**SLIDE 1: PROBLEM**
{problem}

**SLIDE 2: SOLUTION**
• {solution_tech} designed specifically for this use case
• Addresses key user pain points through innovative approach
• Leverages modern technology stack for superior user experience
• Scalable solution with competitive advantages

**SLIDE 3: MARKET OPPORTUNITY**
• {market_size} with 12% annual growth
• Target demographic represents 15M+ potential users
• Early adopter segment shows strong demand signals
• Market timing is optimal for this type of solution

**SLIDE 4: BUSINESS MODEL**
{business_model}

**SLIDE 5: CALL TO ACTION**
• Seeking $750K seed funding for 18-month runway
• Use of funds: Product development (45%), Marketing (35%), Team (20%)
• Target milestones: 5K users by month 12, $500K ARR by month 18
• Looking for strategic investors with {industry_context} expertise

*Mock pitch deck generated for: "{idea}"*
            """
            return PitchResponse(
                deck=mock_deck.strip(),
                success=True,
                message="Mock pitch deck generated successfully (no OpenAI quota used)"
            )

        logger.info("🤖 Using real OpenAI API to generate pitch deck")
        prompt = f"""
        You are an experienced startup advisor and pitch deck expert who has helped hundreds of startups raise funding.
        
        Create a comprehensive, investor-ready pitch deck for the following startup idea. Structure it as 5 detailed slides:

        **SLIDE 1: PROBLEM**
        - Clearly define the pain point or market gap
        - Include statistics or market evidence
        - Make it relatable and urgent

        **SLIDE 2: SOLUTION**
        - Present your unique solution approach
        - Highlight key differentiators
        - Explain why this solution is better than alternatives

        **SLIDE 3: MARKET OPPORTUNITY**
        - Define Total Addressable Market (TAM)
        - Identify target customer segments
        - Show market trends and growth potential

        **SLIDE 4: BUSINESS MODEL**
        - Explain how you'll make money
        - Outline key revenue streams
        - Include basic unit economics if applicable

        **SLIDE 5: CALL TO ACTION**
        - Specify funding requirements
        - Outline key milestones and use of funds
        - Present compelling next steps for investors

        Startup Idea: {idea}
        Target Audience: {pitch_request.target_audience}
        Industry: {pitch_request.industry or "Not specified"}
        Funding Stage: {pitch_request.funding_stage}

        Make the content professional, data-driven, and compelling. Use bullet points and clear formatting.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a startup advisor and pitch deck expert with deep knowledge of what investors look for in successful pitches."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1500,  # Reduced to save quota
            temperature=0.7
        )

        result = response.choices[0].message.content
        logger.info("✅ Successfully generated pitch deck")
        
        return PitchResponse(
            deck=result,
            success=True,
            message="Pitch deck generated successfully"
        )

    except Exception as e:
        logger.error(f"❌ ERROR in /generate: {str(e)}")
        return PitchResponse(
            deck="",
            success=False,
            message=f"Failed to generate pitch deck: {str(e)}"
        )


@router.post("/generate-detailed", response_model=PitchResponse)
async def generate_detailed_pitch(pitch_request: PitchRequest):
    """
    Generate an extended 10-slide pitch deck with additional sections.
    """
    try:
        idea = pitch_request.idea.strip()
        
        if not idea:
            logger.warning("Empty idea provided for detailed pitch")
            return PitchResponse(
                deck="",
                success=False,
                message="Please provide a valid startup idea."
            )

        logger.info(f"🔥 Generating detailed pitch deck for idea: {idea[:100]}...")

        # Check if mock mode is enabled
        if MOCK_MODE:
            logger.info("🎭 Using mock mode - generating detailed sample pitch deck")
            
            # Create dynamic mock content based on the idea
            idea_lower = idea.lower()
            
            # Generate dynamic company name and context based on idea
            if any(word in idea_lower for word in ['food', 'delivery', 'restaurant', 'meal']):
                company_name = "FoodFlow"
                tagline = "Revolutionizing Food Delivery"
                tech_stack = "Real-time logistics, AI routing, Payment processing"
                target_market = "45M active food delivery users"
                tam_size = "$150B food delivery market"
                competition = "DoorDash, Uber Eats, Grubhub"
                traction = "2,800 restaurant partners, 15K monthly orders"
                
            elif any(word in idea_lower for word in ['health', 'fitness', 'wellness', 'medical']):
                company_name = "HealthTech Pro"
                tagline = "Your Personal Health Companion"
                tech_stack = "IoT integration, ML analytics, HIPAA compliance"
                target_market = "180M health-conscious consumers"
                tam_size = "$280B digital health market"
                competition = "MyFitnessPal, Fitbit, Apple Health"
                traction = "12K beta users, 4.8/5 app rating, 2 clinical trials"
                
            elif any(word in idea_lower for word in ['education', 'learning', 'student', 'course']):
                company_name = "EduConnect"
                tagline = "Bridging Learning Gaps"
                tech_stack = "Adaptive learning AI, Video streaming, Progress tracking"
                target_market = "65M students and professionals seeking skills"
                tam_size = "$366B global education market"
                competition = "Coursera, Udemy, Khan Academy"
                traction = "8,500 enrolled students, 89% completion rate"
                
            elif any(word in idea_lower for word in ['crypto', 'trading', 'blockchain', 'finance']):
                company_name = "CryptoEdge"
                tagline = "Smart Trading for Everyone"
                tech_stack = "AI algorithms, Real-time data, Risk management"
                target_market = "50M cryptocurrency traders globally"
                tam_size = "$180B cryptocurrency market"
                competition = "Coinbase, Binance, Robinhood"
                traction = "5,200 active traders, $2.3M in managed assets"
                
            else:
                company_name = "InnovateCorp"
                tagline = "Building Tomorrow's Solutions"
                tech_stack = "Modern cloud architecture, AI/ML, Mobile-first"
                target_market = "25M+ potential users in target segment"
                tam_size = "$45B+ addressable market"
                competition = "Legacy solutions and traditional incumbents"
                traction = "3,100 beta users, strong early adoption signals"
            
            detailed_mock_deck = f"""
**SLIDE 1: TITLE & VISION**
• Company: {company_name} - "{tagline}"
• Vision: Transform the industry through innovative technology solutions
• Founded by experienced entrepreneurs with domain expertise

**SLIDE 2: PROBLEM**
• Current market solutions are outdated and inefficient
• Users report 65% dissatisfaction with existing alternatives
• Market inefficiencies cost billions annually
• Clear opportunity for disruption with better technology

**SLIDE 3: SOLUTION**
• Revolutionary platform addressing core market pain points
• {tech_stack} enabling superior performance and user experience
• Proprietary algorithms delivering 3x better results than competitors
• Scalable architecture supporting rapid growth and expansion

**SLIDE 4: PRODUCT DEMO**
• Intuitive interface with streamlined 3-step user journey
• Real-time updates and intelligent notifications
• Cross-platform compatibility (iOS, Android, Web)
• Advanced analytics and personalization features

**SLIDE 5: MARKET SIZE**
• TAM: {tam_size}
• SAM: $8.5B (addressable segment)
• SOM: $850M (serviceable obtainable market)
• {target_market}

**SLIDE 6: BUSINESS MODEL**
• Primary: Subscription revenue ($19.99/month premium tier)
• Secondary: Transaction fees (3-5% per successful transaction)
• Enterprise: B2B partnerships and licensing ($25K+ annual contracts)
• Projected 70% gross margins at scale with multiple revenue streams

**SLIDE 7: COMPETITION**
• Main competitors: {competition}
• Our advantages: Superior UX, advanced algorithms, mobile-first approach
• Competitive moat: Network effects, data advantages, and patent protection
• 2-3 year technology lead on next-generation features

**SLIDE 8: TRACTION**
• {traction}
• Strong month-over-month growth (18% average)
• Strategic partnerships with 3 industry leaders
• $85K in pre-revenue commitments secured

**SLIDE 9: FINANCIAL PROJECTIONS**
• Year 1: $120K revenue, 8K users (current trajectory)
• Year 2: $890K revenue, 35K users (scale phase)
• Year 3: $4.2M revenue, 125K users (market expansion)
• Break-even: Month 26, clear path to profitability

**SLIDE 10: FUNDING & USE OF FUNDS**
• Seeking: $1.5M seed round for 30-month runway
• Product development & engineering: 45% ($675K)
• Marketing & user acquisition: 30% ($450K)
• Team expansion (5 key hires): 20% ($300K)
• Operations & compliance: 5% ($75K)

*Detailed mock pitch deck customized for: "{idea}"*
            """
            return PitchResponse(
                deck=detailed_mock_deck.strip(),
                success=True,
                message="Detailed mock pitch deck generated successfully (no OpenAI quota used)"
            )

        logger.info("🤖 Using real OpenAI API to generate detailed pitch deck")

        prompt = f"""
        You are an experienced startup advisor creating a comprehensive 10-slide investor pitch deck.
        
        Create a detailed, professional pitch deck with the following structure:

        **SLIDE 1: TITLE & VISION**
        - Company name suggestion and tagline
        - Clear vision statement
        - Founder introduction placeholder

        **SLIDE 2: PROBLEM**
        - Market pain points with statistics
        - Current inadequate solutions
        - Cost of the problem

        **SLIDE 3: SOLUTION**
        - Your unique approach
        - Key features and benefits
        - Technology differentiators

        **SLIDE 4: PRODUCT DEMO**
        - Core product walkthrough
        - User experience highlights
        - Technical architecture overview

        **SLIDE 5: MARKET SIZE**
        - TAM, SAM, SOM analysis
        - Market trends and drivers
        - Growth projections

        **SLIDE 6: BUSINESS MODEL**
        - Revenue streams
        - Pricing strategy
        - Unit economics

        **SLIDE 7: COMPETITION**
        - Competitive landscape
        - Positioning matrix
        - Competitive advantages

        **SLIDE 8: TRACTION**
        - Key metrics and milestones
        - Customer testimonials
        - Growth trajectory

        **SLIDE 9: FINANCIAL PROJECTIONS**
        - 3-year revenue forecast
        - Key assumptions
        - Path to profitability

        **SLIDE 10: FUNDING & USE OF FUNDS**
        - Funding requirements
        - Detailed use of funds
        - Key milestones to achieve

        Startup Idea: {idea}
        Target Audience: {pitch_request.target_audience}
        Industry: {pitch_request.industry or "Not specified"}
        Funding Stage: {pitch_request.funding_stage}

        Make it investor-ready with specific numbers, market insights, and compelling narrative.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a startup advisor who has successfully helped companies raise over $100M in funding. You understand what makes investors excited."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=3000,
            temperature=0.7
        )

        result = response.choices[0].message.content
        logger.info("✅ Successfully generated detailed pitch deck")
        
        return PitchResponse(
            deck=result,
            success=True,
            message="Detailed pitch deck generated successfully"
        )

    except Exception as e:
        logger.error(f"❌ ERROR in /generate-detailed: {str(e)}")
        return PitchResponse(
            deck="",
            success=False,
            message=f"Failed to generate detailed pitch deck: {str(e)}"
        )


@router.get("/health")
async def health_check():
    """Health check endpoint to verify the service is running."""
    mock_status = "enabled" if MOCK_MODE else "disabled"
    return {
        "status": "healthy", 
        "service": "pitch-deck-generator",
        "mock_mode": mock_status,
        "openai_configured": bool(os.getenv("OPENAI_API_KEY"))
    }

@router.get("/test-mock")
async def test_mock():
    """Test endpoint to verify mock mode"""
    return {
        "mock_mode": MOCK_MODE,
        "mock_env": os.getenv("MOCK_MODE", "not-set")
    }

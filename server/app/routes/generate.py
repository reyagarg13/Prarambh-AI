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
    presentation_style: Optional[str] = "balanced"
    business_model: Optional[str] = None
    competitor_context: Optional[str] = None
    request_id: Optional[str] = None

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
            
            # Enhanced dynamic mock content with more variation
            import random
            import hashlib
            
            # Create consistent but varied responses based on idea
            idea_hash = hashlib.md5(idea.encode()).hexdigest()[:8]
            random.seed(int(idea_hash, 16))
            
            # More varied presentation styles
            mock_styles = [
                {"tone": "analytical and data-driven", "metrics_focus": "ROI and efficiency"},
                {"tone": "visionary and inspiring", "metrics_focus": "impact and growth"},
                {"tone": "practical and execution-focused", "metrics_focus": "scalability and operations"},
                {"tone": "technology-forward", "metrics_focus": "innovation and disruption"}
            ]
            
            style = random.choice(mock_styles)
            
            # Determine industry context and customize content with more variety
            idea_lower = idea.lower()
            
            if any(word in idea_lower for word in ['food', 'delivery', 'restaurant', 'meal', 'kitchen', 'dining']):
                industries = [
                    {"name": "food delivery", "market": "$150B global food delivery", "tech": "AI-powered logistics and demand prediction", 
                     "problem": "• 47% of food orders arrive late due to inefficient routing\n• Average delivery costs 25% higher than necessary\n• Food waste increases by 15% with current logistics\n• Limited real-time visibility for customers",
                     "model": "• Commission from restaurants: 12-18% per order\n• Dynamic delivery fees: $1.99-6.99 based on demand\n• Premium subscription: $14.99/month for priority delivery\n• White-label platform licensing: $50K+ annually"},
                    {"name": "sustainable food tech", "market": "$280B sustainable food", "tech": "Blockchain supply chain and carbon tracking",
                     "problem": "• 40% of consumers want sustainable food options but can't find them\n• Food industry accounts for 24% of global emissions\n• Supply chain transparency lacking in 73% of food products\n• Premium for sustainable options averages 31%",
                     "model": "• Marketplace commission: 8-15% on sustainable products\n• Carbon offset services: $2-5 per order\n• B2B sustainability consulting: $25K-100K contracts\n• Data analytics and reporting: $500-2K monthly subscriptions"}
                ]
                industry_context = random.choice(industries)
                
            elif any(word in idea_lower for word in ['health', 'fitness', 'wellness', 'medical', 'exercise', 'therapy']):
                industries = [
                    {"name": "digital health", "market": "$659B digital health", "tech": "AI-driven health insights and IoT integration",
                     "problem": "• 68% of people struggle to maintain healthy habits consistently\n• Healthcare costs rising 5% annually due to preventable conditions\n• Limited access to personalized health guidance for 2.3B people\n• Mental health support shortage affects 1 in 4 adults",
                     "model": "• Subscription tiers: Basic ($9.99), Premium ($24.99), Family ($39.99)\n• Corporate wellness: $8-25 per employee monthly\n• Insurance partnerships: $15-45 per member annually\n• Telehealth sessions: $75-150 per consultation"},
                    {"name": "fitness technology", "market": "$96B fitness technology", "tech": "Computer vision and biometric analysis",
                     "problem": "• 84% of gym memberships go unused after 5 months\n• Personal trainer costs average $70/session, limiting accessibility\n• Injury rates increase 23% due to improper form\n• Motivation drops 67% without personalized feedback",
                     "model": "• App subscriptions: $12.99-29.99 monthly tiers\n• Equipment sales and partnerships: 20-35% margins\n• Corporate fitness programs: $15-50 per employee\n• Certification and training courses: $199-999 per program"}
                ]
                industry_context = random.choice(industries)
                
            elif any(word in idea_lower for word in ['education', 'learning', 'student', 'school', 'course', 'teach', 'training']):
                industries = [
                    {"name": "education technology", "market": "$377B global education", "tech": "Adaptive learning AI and personalized curriculum",
                     "problem": "• 65% of students learn differently than traditional methods accommodate\n• Teacher-to-student ratios worsen globally (1:24 average)\n• Skills gap costs economy $1.2T annually\n• Remote learning engagement drops 40% without personalization",
                     "model": "• Course sales: $99-499 per course with 70% margins\n• Subscription platform: $19.99-49.99 monthly\n• Enterprise training: $50K-200K annual contracts\n• Certification and accreditation: $299-999 per certificate"},
                    {"name": "professional development", "market": "$156B corporate training", "tech": "Microlearning platform with skill assessment",
                     "problem": "• 76% of employees want more learning opportunities\n• Companies lose $62B annually to skills gaps\n• Traditional training has 13% retention rate\n• Career progression stagnates for 58% of knowledge workers",
                     "model": "• Individual subscriptions: $29.99-79.99 monthly\n• Corporate licenses: $25-100 per employee annually\n• Custom content development: $10K-50K per module\n• Career coaching services: $150-300 per session"}
                ]
                industry_context = random.choice(industries)
                
            else:
                # Generic technology/innovation
                industries = [
                    {"name": "emerging technology", "market": "$75B+ emerging tech", "tech": "Next-generation platform with smart automation",
                     "problem": "• Current solutions are fragmented across 5+ different platforms\n• 73% user dissatisfaction with existing alternatives\n• Manual processes cost businesses 15-30% efficiency\n• Integration complexity increases project timelines by 40%",
                     "model": "• SaaS subscriptions: $49-199 monthly per user\n• Enterprise licenses: $50K-250K annually\n• Professional services: $150-300 hourly\n• API usage fees: $0.01-0.10 per transaction"},
                    {"name": "digital transformation", "market": "$521B digital transformation", "tech": "Cloud-native platform with AI optimization",
                     "problem": "• 89% of companies struggle with digital transformation\n• Legacy systems cost 60% more to maintain\n• Data silos prevent 45% of strategic initiatives\n• Customer expectations exceed current capabilities by 2.5x",
                     "model": "• Platform subscriptions: $99-499 per organization monthly\n• Implementation services: $25K-100K per project\n• Ongoing support: $5K-20K monthly retainers\n• Training and certification: $1K-5K per person"}
                ]
                industry_context = random.choice(industries)
            
            # Varied funding amounts and use cases
            funding_scenarios = [
                {"amount": "$500K", "runway": "18 months", "priorities": "Product development (50%), Marketing (30%), Team (20%)"},
                {"amount": "$750K", "runway": "24 months", "priorities": "Engineering (40%), Customer acquisition (35%), Operations (25%)"},
                {"amount": "$1.2M", "runway": "30 months", "priorities": "Team expansion (45%), Technology (30%), Market expansion (25%)"}
            ]
            
            funding = random.choice(funding_scenarios)
            
            # Generate varied milestones
            milestone_sets = [
                ["10K active users by month 12", "$750K ARR by month 18", "Break-even by month 24"],
                ["5K paying customers by month 10", "50% month-over-month growth", "Series A readiness by month 20"],
                ["Market expansion to 3 cities", "Enterprise partnerships signed", "1M+ in committed revenue"]
            ]
            
            milestones = random.choice(milestone_sets)
            
            mock_deck = f"""
**SLIDE 1: PROBLEM** ({style["tone"]} approach)
{industry_context["problem"]}

**SLIDE 2: SOLUTION**
• {industry_context["tech"]} designed for {style["metrics_focus"]}
• Addresses critical market inefficiencies through innovative technology
• Leverages modern architecture for superior performance and user experience
• Built for scale with sustainable competitive advantages

**SLIDE 3: MARKET OPPORTUNITY**
• {industry_context["market"]} with 8-15% annual growth trajectory
• Target segment represents 12M+ addressable users in core markets
• Market timing optimal with increased demand for digital solutions
• Early mover advantage in rapidly expanding {industry_context["name"]} sector

**SLIDE 4: BUSINESS MODEL** (optimized for {style["metrics_focus"]})
{industry_context["model"]}

**SLIDE 5: CALL TO ACTION**
• Seeking {funding["amount"]} for {funding["runway"]} runway
• Use of funds: {funding["priorities"]}
• Key milestones: {', '.join(milestones)}
• Looking for strategic investors with {industry_context["name"]} experience

*Dynamic mock pitch deck generated for: "{idea}" using {style["tone"]} presentation style*
            """
            return PitchResponse(
                deck=mock_deck.strip(),
                success=True,
                message="Mock pitch deck generated successfully (no OpenAI quota used)"
            )

        logger.info("🤖 Using real OpenAI API to generate pitch deck")
        
        # Generate dynamic context and variations
        import random
        import hashlib
        
        # Create a unique seed based on the idea AND request parameters to ensure variety
        seed_string = f"{idea}{pitch_request.presentation_style}{pitch_request.business_model}{pitch_request.competitor_context}"
        idea_hash = hashlib.md5(seed_string.encode()).hexdigest()[:8]
        random.seed(int(idea_hash, 16))
        
        # Map presentation styles to specific approaches
        style_mappings = {
            "balanced": {"approach": "well-rounded and comprehensive", "focus": "balanced growth metrics"},
            "data-driven": {"approach": "analytical and metrics-focused", "focus": "ROI and performance indicators"},
            "storytelling": {"approach": "narrative-driven and emotionally compelling", "focus": "vision and impact"},
            "technology-focused": {"approach": "innovation and technical excellence", "focus": "competitive moats and IP"},
            "market-opportunity": {"approach": "market disruption and timing", "focus": "market capture and scale"},
            "problem-solving": {"approach": "solution-oriented and practical", "focus": "problem resolution and value creation"}
        }
        
        selected_style = style_mappings.get(pitch_request.presentation_style, style_mappings["balanced"])
        
        # Dynamic elements for more varied responses
        presentation_styles = [
            "data-driven and analytical",
            "storytelling with emotional appeal", 
            "problem-solving focused",
            "market opportunity driven",
            "technology innovation centered"
        ]
        
        # Use user-selected style or pick from available options
        if pitch_request.presentation_style and pitch_request.presentation_style != "balanced":
            presentation_style = selected_style["approach"]
            metrics_focus = selected_style["focus"]
        else:
            presentation_style = random.choice(presentation_styles)
            metrics_focus = random.choice(["user engagement", "revenue growth", "market penetration", "operational efficiency"])
        
        # Enhanced industry detection and context
        industry_contexts = {
            "fintech": ["financial inclusion", "payment efficiency", "risk management", "digital banking", "investment optimization"],
            "healthtech": ["patient outcomes", "healthcare accessibility", "medical innovation", "wellness optimization", "care coordination"],
            "edtech": ["learning effectiveness", "educational equity", "skill development", "knowledge accessibility", "student engagement"],
            "foodtech": ["food security", "nutritional optimization", "supply chain efficiency", "culinary innovation", "sustainability"],
            "retail": ["customer experience", "inventory optimization", "omnichannel integration", "personalization", "supply chain"],
            "default": ["user experience", "market efficiency", "social impact", "technological advancement", "customer satisfaction"]
        }
        
        industry_contexts = {
            "fintech": ["financial inclusion", "payment efficiency", "risk management", "digital banking"],
            "healthtech": ["patient outcomes", "healthcare accessibility", "medical innovation", "wellness optimization"],
            "edtech": ["learning effectiveness", "educational equity", "skill development", "knowledge accessibility"],
            "foodtech": ["food security", "nutritional optimization", "supply chain efficiency", "culinary innovation"],
            "default": ["user experience", "market efficiency", "social impact", "technological advancement"]
        }
        
        # Detect industry from idea or use provided industry
        detected_industry = pitch_request.industry or "default"
        if not pitch_request.industry:
            idea_lower = idea.lower()
            for industry, _ in industry_contexts.items():
                if industry != "default" and industry.replace("tech", "") in idea_lower:
                    detected_industry = industry
                    break
        
        focus_areas = industry_contexts.get(detected_industry, industry_contexts["default"])
        presentation_style = presentation_style
        primary_focus = random.choice(focus_areas)
        secondary_focus = random.choice([f for f in focus_areas if f != primary_focus])
        
        # Business model context
        business_model_context = ""
        if pitch_request.business_model:
            model_descriptions = {
                "subscription": "recurring revenue model with predictable cash flow",
                "marketplace": "platform connecting buyers and sellers with network effects",
                "freemium": "viral growth model with premium feature conversion",
                "transaction": "scalable transaction-based revenue with growing volume",
                "advertising": "user engagement monetization through targeted advertising",
                "enterprise": "high-value B2B sales with strong customer relationships",
                "ecommerce": "direct-to-consumer sales with inventory management"
            }
            business_model_context = f"Focus on {model_descriptions.get(pitch_request.business_model, 'innovative revenue model')}. "
        
        # Competitor context
        competitor_context = ""
        if pitch_request.competitor_context:
            competitor_context = f"Position strategically against {pitch_request.competitor_context} by highlighting unique differentiators. "
        
        # Dynamic funding stage context
        funding_contexts = {
            "idea": {"amount": "$50K-$250K", "runway": "12-18 months", "focus": "product development and market validation"},
            "pre-seed": {"amount": "$250K-$750K", "runway": "18-24 months", "focus": "team building and initial traction"},
            "seed": {"amount": "$750K-$3M", "runway": "24-36 months", "focus": "market expansion and scaling"},
            "series-a": {"amount": "$3M-$15M", "runway": "36-48 months", "focus": "rapid growth and market leadership"},
            "series-b": {"amount": "$15M-$50M", "runway": "48+ months", "focus": "international expansion and category dominance"},
            "later-stage": {"amount": "$50M+", "runway": "60+ months", "focus": "market consolidation and IPO preparation"}
        }
        
        funding_context = funding_contexts.get(pitch_request.funding_stage, funding_contexts["seed"])
        
        prompt = f"""
        You are an experienced startup advisor with expertise in {detected_industry} companies, known for creating {presentation_style} pitch presentations. 
        You've helped over 200 startups raise funding, with particular strength in {primary_focus} and {secondary_focus}.
        
        {business_model_context}{competitor_context}Create a comprehensive, investor-ready pitch deck for the following startup idea. Use a {presentation_style} approach and structure it as 5 detailed slides:

        **SLIDE 1: PROBLEM**
        - Frame the problem through the lens of {primary_focus}
        - Include specific market statistics and real-world evidence
        - Quantify the pain point with concrete numbers
        - Make it urgent and relatable to {pitch_request.target_audience}
        {f"- Position against known competitors: {pitch_request.competitor_context}" if pitch_request.competitor_context else ""}

        **SLIDE 2: SOLUTION**
        - Present your unique approach emphasizing {secondary_focus}
        - Highlight 3-4 key differentiators that set this apart
        - Explain the "why now" factor - timing and market readiness
        - Connect solution directly to the quantified problem
        {f"- Design for {business_model_context}" if business_model_context else ""}

        **SLIDE 3: MARKET OPPORTUNITY**
        - Define TAM/SAM/SOM with {detected_industry} market context
        - Identify specific customer segments and beachhead market
        - Show market trends supporting {primary_focus}
        - Include growth projections and market drivers focused on {metrics_focus}

        **SLIDE 4: BUSINESS MODEL**
        - Design revenue model optimized for {pitch_request.funding_stage} stage company
        {f"- Focus specifically on {pitch_request.business_model} revenue model" if pitch_request.business_model else "- Outline multiple revenue streams with realistic projections"}
        - Include unit economics showing path to profitability
        - Address scalability and margin improvement over time
        - Emphasize {metrics_focus} as key success metrics

        **SLIDE 5: CALL TO ACTION**
        - Request {funding_context["amount"]} for {funding_context["runway"]} runway
        - Focus use of funds on {funding_context["focus"]}
        - Set 3-4 specific milestones aligned with next funding round
        - Present compelling risk-adjusted returns for {pitch_request.target_audience}
        - Emphasize {presentation_style} value proposition

        **Context:**
        - Startup Idea: {idea}
        - Target Audience: {pitch_request.target_audience}
        - Industry Focus: {detected_industry}
        - Funding Stage: {pitch_request.funding_stage}
        - Presentation Style: {presentation_style}
        {f"- Business Model: {pitch_request.business_model}" if pitch_request.business_model else ""}
        {f"- Competitive Context: {pitch_request.competitor_context}" if pitch_request.competitor_context else ""}

        Make the content professional, data-driven, and compelling. Use bullet points, specific numbers, and compelling narrative. 
        Ensure each slide builds logically to the next and tells a cohesive story focused on {primary_focus}.
        Vary your language and approach to ensure this pitch deck feels fresh and unique.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": f"You are a top-tier startup advisor specializing in {detected_industry} companies with a {presentation_style} approach. You understand what makes {pitch_request.target_audience} excited about investing in {pitch_request.funding_stage} stage companies."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=1800,
            temperature=0.8,  # Increased for more creativity
            top_p=0.9,       # Added for more diverse outputs
            frequency_penalty=0.3,  # Reduce repetition
            presence_penalty=0.2    # Encourage new topics
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

        # Enhanced dynamic context generation for detailed decks
        import random
        import hashlib
        
        # Create consistent but varied responses based on idea
        idea_hash = hashlib.md5(idea.encode()).hexdigest()[:8]
        random.seed(int(idea_hash, 16))
        
        # More sophisticated presentation approaches for detailed decks
        detailed_approaches = [
            {"style": "venture capital focused", "emphasis": "scalability and market capture"},
            {"style": "product-led growth", "emphasis": "user acquisition and retention"},
            {"style": "technology innovation", "emphasis": "competitive moats and IP"},
            {"style": "market disruption", "emphasis": "transformation and timing"},
            {"style": "sustainable business", "emphasis": "long-term value creation"}
        ]
        
        approach = random.choice(detailed_approaches)
        
        # Industry-specific metrics and KPIs
        industry_metrics = {
            "fintech": ["CAC payback period", "AUM growth", "transaction volume", "regulatory compliance score"],
            "healthtech": ["patient outcomes", "clinical validation", "provider adoption", "cost savings"],
            "edtech": ["learner engagement", "completion rates", "skill acquisition", "teacher satisfaction"],
            "foodtech": ["order frequency", "delivery efficiency", "supplier satisfaction", "waste reduction"],
            "default": ["user engagement", "revenue per user", "market penetration", "customer satisfaction"]
        }
        
        # Detect industry
        detected_industry = pitch_request.industry or "default"
        if not pitch_request.industry:
            idea_lower = idea.lower()
            for industry, _ in industry_metrics.items():
                if industry != "default" and industry.replace("tech", "") in idea_lower:
                    detected_industry = industry
                    break
        
        key_metrics = industry_metrics.get(detected_industry, industry_metrics["default"])
        primary_metric = random.choice(key_metrics)
        secondary_metrics = [m for m in key_metrics if m != primary_metric][:2]
        
        # Dynamic competitive positioning
        positioning_angles = [
            "first-mover advantage in emerging market segment",
            "superior technology stack and user experience", 
            "unique data advantages and network effects",
            "vertically integrated solution with cost advantages",
            "platform approach enabling ecosystem growth"
        ]
        
        competitive_angle = random.choice(positioning_angles)
        
        # Stage-specific financial modeling
        financial_models = {
            "idea": {"focus": "proof of concept and initial validation", "timeframe": "12-18 months"},
            "pre-seed": {"focus": "product-market fit and early traction", "timeframe": "18-30 months"},
            "seed": {"focus": "scaling operations and market expansion", "timeframe": "36 months"},
            "series-a": {"focus": "rapid growth and market leadership", "timeframe": "48 months"},
            "series-b": {"focus": "category dominance and profitability", "timeframe": "60 months"},
            "later-stage": {"focus": "market consolidation and exit strategy", "timeframe": "72+ months"}
        }
        
        financial_context = financial_models.get(pitch_request.funding_stage, financial_models["seed"])

        prompt = f"""
        You are a seasoned startup advisor with deep expertise in {detected_industry} companies, known for your {approach["style"]} methodology. 
        You've guided 50+ companies through successful funding rounds, with particular strength in {approach["emphasis"]}.
        
        Create a comprehensive, investor-ready 10-slide pitch deck with the following structure. Use a {approach["style"]} approach:

        **SLIDE 1: TITLE & VISION**
        - Compelling company name suggestion that reflects the {detected_industry} focus
        - Clear value proposition emphasizing {approach["emphasis"]}
        - Vision statement aligned with {pitch_request.target_audience} investment thesis

        **SLIDE 2: PROBLEM**
        - Frame problem through {detected_industry} industry lens
        - Quantify market inefficiencies with specific data points
        - Highlight why existing solutions fail at {approach["emphasis"]}
        - Create urgency around timing and market readiness

        **SLIDE 3: SOLUTION**
        - Present solution architecture emphasizing {competitive_angle}
        - Detail key technology components and innovation
        - Explain why your approach enables superior {approach["emphasis"]}
        - Address scalability from day one

        **SLIDE 4: PRODUCT DEMO**
        - Core user journey optimized for {primary_metric}
        - Technical architecture highlighting competitive advantages
        - Integration capabilities and ecosystem positioning
        - Mobile and platform strategy

        **SLIDE 5: MARKET SIZE**
        - TAM/SAM/SOM analysis specific to {detected_industry}
        - Market segmentation with clear beachhead strategy
        - Growth drivers supporting {approach["emphasis"]}
        - Regulatory environment and market timing factors

        **SLIDE 6: BUSINESS MODEL**
        - Revenue model optimized for {pitch_request.funding_stage} stage growth
        - Multiple revenue streams with {primary_metric} as primary driver
        - Unit economics showing path to {financial_context["focus"]}
        - Pricing strategy and margin expansion opportunities

        **SLIDE 7: COMPETITION**
        - Competitive landscape with {competitive_angle} positioning
        - Feature comparison highlighting unique advantages
        - Barriers to entry and sustainable competitive moats
        - Partnership and acquisition landscape

        **SLIDE 8: TRACTION**
        - Key performance metrics focused on {primary_metric}
        - Secondary metrics: {', '.join(secondary_metrics)}
        - Customer validation and early adoption signals
        - Strategic partnerships and market validation

        **SLIDE 9: FINANCIAL PROJECTIONS**
        - {financial_context["timeframe"]} forecast focused on {financial_context["focus"]}
        - Revenue model assumptions and growth drivers
        - Key milestone timeline and scaling plan
        - Path to profitability and exit opportunity sizing

        **SLIDE 10: FUNDING & USE OF FUNDS**
        - Funding requirement aligned with {financial_context["focus"]}
        - Detailed allocation prioritizing {approach["emphasis"]}
        - Key hires and capability building plan
        - Milestone-driven roadmap to next funding round

        **Startup Idea:** {idea}
        **Target Audience:** {pitch_request.target_audience}
        **Industry:** {detected_industry}
        **Funding Stage:** {pitch_request.funding_stage}
        **Approach:** {approach["style"]} with focus on {approach["emphasis"]}

        Make it comprehensive and investor-ready with specific numbers, market insights, and compelling narrative.
        Focus on demonstrating {competitive_angle} and strong {primary_metric} potential.
        """

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system", 
                    "content": f"You are a top-tier startup advisor with deep {detected_industry} expertise, using a {approach['style']} methodology. You understand what makes {pitch_request.target_audience} excited about {approach['emphasis']} in {pitch_request.funding_stage} companies. You've successfully helped companies raise over $100M."
                },
                {"role": "user", "content": prompt}
            ],
            max_tokens=3500,  # Increased for detailed content
            temperature=0.85, # Higher creativity for detailed decks
            top_p=0.9,
            frequency_penalty=0.4,  # Stronger repetition reduction
            presence_penalty=0.3    # Encourage diverse topics
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

// Enhanced PDF Generation Test Suite
// This file can be run in browser console or as a separate test

import { 
  generatePDF, 
  downloadPDF, 
  generatePDFBlob, 
  validateContentForPDF, 
  previewPDFStructure,
  generatePDFBase64 
} from '../src/utils/pdfGenerator.js';

// Test data - various pitch deck formats
const testPitchDecks = {
  structured: `
╔══════════════════════════════════════════════════════════════════════════════════╗
║                              INNOVATEAI - PITCH DECK                            ║
║                          Revolutionizing Business Intelligence                   ║
╚══════════════════════════════════════════════════════════════════════════════════╝

🏢 **SLIDE 1: COMPANY OVERVIEW**
• Company: InnovateAI Solutions
• Mission: Democratize AI-powered business intelligence
• Founded: 2024
• Location: San Francisco, CA

🎯 **SLIDE 2: PROBLEM STATEMENT**
• 73% of businesses struggle with data-driven decision making
• Existing BI tools are too complex for small-medium businesses
• Average setup time: 6+ months
• High costs: $50K+ annual licensing

💡 **SLIDE 3: SOLUTION**
• AI-powered, no-code business intelligence platform
• Automated insights generation
• Natural language queries
• 5-minute setup process

🌍 **SLIDE 4: MARKET OPPORTUNITY**
• Total Addressable Market: $29.5B (Business Intelligence)
• Serviceable Addressable Market: $8.2B (SMB segment)
• Growing at 13% CAGR

🏆 **SLIDE 5: COMPETITIVE ADVANTAGE**
• Patent-pending AI algorithms
• 90% faster setup than competitors
• 60% lower total cost of ownership
• Industry-specific templates

📈 **SLIDE 6: TRACTION & METRICS**
• 1,200+ beta users
• 89% user retention rate
• $180K ARR
• 25+ enterprise partnerships

💰 **SLIDE 7: BUSINESS MODEL**
• SaaS subscription: $49-299/month
• Enterprise licenses: $50K-250K annually
• Professional services: $150/hour
• Marketplace revenue share: 15%

👥 **SLIDE 8: TEAM**
• John Smith, CEO - Ex-Google PM, Stanford MBA
• Sarah Johnson, CTO - Ex-Meta Engineer, MIT PhD
• Mike Chen, VP Sales - 15 years enterprise sales

💸 **SLIDE 9: FUNDING REQUEST**
• Seeking: $2M Series A
• Use of funds: 60% engineering, 25% sales, 15% marketing
• 18-month runway to profitability

🚀 **SLIDE 10: THE ASK**
• Join us in revolutionizing business intelligence
• Target: $10M ARR by 2026
• Exit potential: $100M+ in 5 years
`,

  simple: `
BUSINESS IDEA: Smart Home Automation Platform

1. PROBLEM
Current smart home solutions are fragmented and complex to set up.

2. SOLUTION  
Unified platform with AI-powered automation and simple setup.

3. MARKET
$80B smart home market growing at 25% annually.

4. BUSINESS MODEL
$29/month subscription + hardware sales.

5. TEAM
Experienced engineers from Apple and Google.

6. FUNDING
Seeking $500K seed funding for product development.
`,

  unstructured: `
Our revolutionary AI-powered fitness app combines personalized workout plans with real-time form correction using computer vision technology. The global fitness app market is worth $4.4 billion and growing rapidly. We've already gained significant traction with over 10,000 beta users and partnerships with 3 major gym chains. Our team includes former Apple and Google engineers with deep expertise in machine learning and mobile development. We're seeking $1.5M in Series A funding to accelerate growth and expand internationally. The funding will be used primarily for hiring additional engineers, marketing expansion, and international market entry. Our revenue model includes premium subscriptions at $9.99/month and enterprise partnerships with gyms and corporate wellness programs.
`,

  veryLong: `
${'EXECUTIVE SUMMARY\n'.repeat(10)}
${'• ' + 'This is a very detailed point about our business strategy and market approach that goes on for quite a while to test how the PDF generator handles very long content. '.repeat(5) + '\n'}.repeat(20)}

MARKET ANALYSIS
${'The market opportunity is extensive and continues to grow at an unprecedented rate. '.repeat(30)}

FINANCIAL PROJECTIONS
${'Year 1: $500K revenue, Year 2: $2M revenue, Year 3: $8M revenue. '.repeat(15)}

COMPETITIVE LANDSCAPE
${'Our competitors include various established players, but we have significant advantages. '.repeat(25)}
`,

  withSpecialChars: `
🚀 STARTUP PITCH: TéchΣolutions™

📊 OVERVIEW:
• Company: TéchΣolutions™ (formerly "Tech & Co.")
• Industry: AI/ML + IoT
• Founded: 2024 (Q1)
• Valuation: $2.5M+ (pre-money)

🎯 PROBLEM & OPPORTUNITY:
Current solutions have 50%+ failure rates & cost $10K+/month.
Market size: €25B+ globally, growing @15% CAGR.

💡 SOLUTION:
Next-gen platform with 95%+ accuracy & <$1K/month pricing.

📈 TRACTION:
• 1,000+ users (β-testing)
• €150K ARR (recurring)
• 5★ rating (App Store)

💰 FUNDING:
Seeking $500K–$1M (Series A) for R&D + scaling.
`
};

class PDFTestSuite {
  constructor() {
    this.results = [];
    this.startTime = Date.now();
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async runTest(testName, testFn) {
    this.log(`Running: ${testName}`);
    try {
      const result = await testFn();
      this.results.push({ name: testName, passed: true, result });
      this.log(`PASSED: ${testName}`, 'success');
      return result;
    } catch (error) {
      this.results.push({ name: testName, passed: false, error: error.message });
      this.log(`FAILED: ${testName} - ${error.message}`, 'error');
      return null;
    }
  }

  async testContentValidation() {
    const tests = [
      { name: 'Valid structured content', content: testPitchDecks.structured, shouldPass: true },
      { name: 'Valid simple content', content: testPitchDecks.simple, shouldPass: true },
      { name: 'Empty content', content: '', shouldPass: false },
      { name: 'Too short content', content: 'Short', shouldPass: false },
      { name: 'Null content', content: null, shouldPass: false },
      { name: 'Non-string content', content: { test: 'object' }, shouldPass: false }
    ];

    const results = [];
    
    for (const test of tests) {
      const validation = validateContentForPDF(test.content);
      const passed = validation.isValid === test.shouldPass;
      
      results.push({
        testName: test.name,
        expected: test.shouldPass,
        actual: validation.isValid,
        passed,
        issues: validation.issues,
        suggestions: validation.suggestions
      });
      
      this.log(`Validation ${test.name}: ${passed ? 'PASS' : 'FAIL'}`, passed ? 'success' : 'error');
    }
    
    return results;
  }

  async testStructurePreview() {
    const results = {};
    
    for (const [type, content] of Object.entries(testPitchDecks)) {
      const structure = previewPDFStructure(content);
      results[type] = structure;
      
      this.log(`Structure preview for ${type}: ${structure.totalSlides} slides, ~${structure.estimatedPages} pages`);
      
      if (structure.error) {
        throw new Error(`Structure preview failed for ${type}: ${structure.error}`);
      }
    }
    
    return results;
  }

  async testPDFGeneration() {
    const results = {};
    
    for (const [type, content] of Object.entries(testPitchDecks)) {
      try {
        const pdf = generatePDF(content);
        const pageCount = pdf.internal.getNumberOfPages();
        
        results[type] = {
          success: true,
          pageCount,
          size: pdf.output('blob').size
        };
        
        this.log(`PDF generation for ${type}: ${pageCount} pages, ${results[type].size} bytes`);
        
      } catch (error) {
        results[type] = {
          success: false,
          error: error.message
        };
        
        this.log(`PDF generation failed for ${type}: ${error.message}`, 'error');
      }
    }
    
    return results;
  }

  async testBlobGeneration() {
    const content = testPitchDecks.structured;
    const blob = generatePDFBlob(content);
    
    if (!(blob instanceof Blob)) {
      throw new Error('Generated object is not a Blob');
    }
    
    if (blob.size === 0) {
      throw new Error('Generated blob is empty');
    }
    
    if (blob.type !== 'application/pdf') {
      throw new Error(`Incorrect MIME type: ${blob.type}`);
    }
    
    return {
      size: blob.size,
      type: blob.type,
      isValid: true
    };
  }

  async testBase64Generation() {
    const content = testPitchDecks.simple;
    const base64 = generatePDFBase64(content);
    
    if (!base64.startsWith('data:application/pdf;base64,')) {
      throw new Error('Invalid base64 data URI format');
    }
    
    const base64Data = base64.split(',')[1];
    if (!base64Data || base64Data.length < 100) {
      throw new Error('Base64 data appears to be empty or too short');
    }
    
    return {
      length: base64Data.length,
      format: 'data:application/pdf;base64',
      isValid: true
    };
  }

  async testPerformance() {
    const content = testPitchDecks.veryLong;
    const startTime = performance.now();
    
    const pdf = generatePDF(content);
    const endTime = performance.now();
    
    const generationTime = endTime - startTime;
    const pageCount = pdf.internal.getNumberOfPages();
    const size = pdf.output('blob').size;
    
    return {
      generationTime: Math.round(generationTime),
      pageCount,
      size,
      performanceRating: generationTime < 5000 ? 'Good' : generationTime < 10000 ? 'Fair' : 'Slow'
    };
  }

  async testSpecialCharacters() {
    const content = testPitchDecks.withSpecialChars;
    
    try {
      const pdf = generatePDF(content);
      const blob = pdf.output('blob');
      
      return {
        success: true,
        size: blob.size,
        pageCount: pdf.internal.getNumberOfPages(),
        handledSpecialChars: true
      };
    } catch (error) {
      throw new Error(`Special character handling failed: ${error.message}`);
    }
  }

  async runAllTests() {
    this.log('🚀 Starting PDF Generation Test Suite');
    this.log('=====================================');

    await this.runTest('Content Validation', () => this.testContentValidation());
    await this.runTest('Structure Preview', () => this.testStructurePreview());
    await this.runTest('PDF Generation', () => this.testPDFGeneration());
    await this.runTest('Blob Generation', () => this.testBlobGeneration());
    await this.runTest('Base64 Generation', () => this.testBase64Generation());
    await this.runTest('Performance Testing', () => this.testPerformance());
    await this.runTest('Special Characters', () => this.testSpecialCharacters());

    this.generateReport();
  }

  generateReport() {
    const endTime = Date.now();
    const totalTime = endTime - this.startTime;
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const successRate = (passed / total * 100).toFixed(1);

    this.log('=====================================');
    this.log('📊 TEST SUITE RESULTS');
    this.log('=====================================');
    this.log(`Total Tests: ${total}`);
    this.log(`Passed: ${passed}`);
    this.log(`Failed: ${total - passed}`);
    this.log(`Success Rate: ${successRate}%`);
    this.log(`Total Time: ${totalTime}ms`);
    this.log('=====================================');

    if (passed === total) {
      this.log('🎉 ALL TESTS PASSED! PDF generation is working correctly.', 'success');
    } else {
      this.log('❌ Some tests failed. Check the logs above for details.', 'error');
    }

    // Log individual test results
    this.results.forEach(result => {
      const status = result.passed ? '✅ PASS' : '❌ FAIL';
      this.log(`${status} ${result.name}`);
    });

    return {
      passed,
      total,
      successRate: parseFloat(successRate),
      totalTime,
      results: this.results
    };
  }
}

// Export for use
export { PDFTestSuite, testPitchDecks };

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  window.PDFTestSuite = PDFTestSuite;
  window.testPitchDecks = testPitchDecks;
  
  // Provide easy test runner
  window.runPDFTests = async () => {
    const suite = new PDFTestSuite();
    return await suite.runAllTests();
  };
  
  console.log('PDF Test Suite loaded! Run window.runPDFTests() to start testing.');
}

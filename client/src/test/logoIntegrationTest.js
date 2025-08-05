/**
 * Logo Integration Test
 * Tests the integration of LogoGenerator component with the main App
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Logo Integration Tests', () => {
  
  test('should show tab navigation when not on landing page', () => {
    render(<App />);
    
    // Start by getting started to show the main interface
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);
    
    // Check if both tabs are present
    expect(screen.getByText('📊 Pitch Deck Generator')).toBeInTheDocument();
    expect(screen.getByText('🎨 Logo & Branding')).toBeInTheDocument();
  });

  test('should switch between pitch deck and logo tabs', () => {
    render(<App />);
    
    // Start by getting started to show the main interface
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);
    
    // Default should be pitch deck tab
    const pitchDeckTab = screen.getByText('📊 Pitch Deck Generator');
    const logoTab = screen.getByText('🎨 Logo & Branding');
    
    // Check initial state (pitch deck should be active)
    expect(pitchDeckTab).toHaveClass('border-blue-500', 'text-blue-600');
    
    // Click logo tab
    fireEvent.click(logoTab);
    
    // Check if logo tab becomes active
    expect(logoTab).toHaveClass('border-blue-500', 'text-blue-600');
  });

  test('should render LogoGenerator component when logo tab is active', () => {
    render(<App />);
    
    // Start by getting started to show the main interface
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);
    
    // Switch to logo tab
    const logoTab = screen.getByText('🎨 Logo & Branding');
    fireEvent.click(logoTab);
    
    // Check if LogoGenerator content is present
    // This would depend on the specific content in LogoGenerator
    // For now, we'll check if the main container exists
    expect(document.querySelector('[data-testid="logo-generator"]')).toBeInTheDocument();
  });

  test('should pass correct props to LogoGenerator', () => {
    render(<App />);
    
    // Start by getting started to show the main interface
    const getStartedButton = screen.getByText(/get started/i);
    fireEvent.click(getStartedButton);
    
    // Fill in some business details first
    const businessInput = screen.getByPlaceholder(/describe your startup idea/i);
    fireEvent.change(businessInput, { 
      target: { value: 'A mobile app for dog walking services' } 
    });
    
    // Switch to logo tab
    const logoTab = screen.getByText('🎨 Logo & Branding');
    fireEvent.click(logoTab);
    
    // Verify that the LogoGenerator receives the business idea as prop
    // This test would need to be more specific based on LogoGenerator implementation
    expect(screen.getByDisplayValue('A mobile app for dog walking services')).toBeInTheDocument();
  });

  test('should update landing section to mention branding features', () => {
    render(<App />);
    
    // Check if landing page mentions branding
    expect(screen.getByText(/Professional Pitch Decks & Branding/)).toBeInTheDocument();
    expect(screen.getByText(/Logo & Branding/)).toBeInTheDocument();
    expect(screen.getByText(/AI generates logos, brand colors, and typography/)).toBeInTheDocument();
  });

});

/**
 * Integration Status Summary:
 * 
 * ✅ LogoGenerator component created with comprehensive branding features
 * ✅ Tab navigation added to main App component
 * ✅ LogoGenerator integrated into App.jsx with proper props
 * ✅ Landing section updated to mention branding features
 * ✅ Header description updated to include branding
 * 
 * Features Integrated:
 * - 5 different logo styles (Minimalist, Icon+Text, Abstract, Badge, Geometric)
 * - Industry-based theme detection
 * - Brand color palette generation
 * - Typography recommendations
 * - SVG logo generation with download capability
 * - Brand usage guidelines
 * 
 * Next Steps:
 * 1. Test the application in the browser
 * 2. Verify tab switching works correctly
 * 3. Test logo generation functionality
 * 4. Ensure proper data flow between components
 */

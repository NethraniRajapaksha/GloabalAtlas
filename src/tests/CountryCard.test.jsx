// CountryCard.test.jsx

// Mock react-router-dom BEFORE any imports
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

// Now import React and testing utilities
import React from 'react';
import { render, screen } from '@testing-library/react';
import CountryCard from '../components/CountryCard';

// Mock country data
const mockCountry = {
  cca3: 'USA',
  name: { common: 'United States of America' },
  capital: ['Washington, D.C.'],
  region: 'Americas',
  flags: { png: 'https://example.com/usa-flag.png' },
};

describe('CountryCard Component', () => {
  it('renders country card with correct details', () => {
    render(<CountryCard country={mockCountry} />);

    // Check for country name
    expect(screen.getByText('United States of America')).toBeInTheDocument();

    // Check for capital
    expect(screen.getByText(/Capital/i)).toHaveTextContent('Capital : Washington, D.C.');

    // Check for region
    expect(screen.getByText(/Region/i)).toHaveTextContent('Region | Americas');

    // Check image alt and src
    const flagImg = screen.getByAltText('United States of America flag');
    expect(flagImg).toBeInTheDocument();
    expect(flagImg).toHaveAttribute('src', mockCountry.flags.png);
  });

  it('handles countries with missing data gracefully', () => {
    const incompleteCountry = {
      cca3: 'ABC',
      name: { common: 'Test Country' },
      // Missing capital and region
      flags: { png: 'https://example.com/test-flag.png' },
    };

    render(<CountryCard country={incompleteCountry} />);

    // Check that the component renders without crashing
    expect(screen.getByText('Test Country')).toBeInTheDocument();
    
    // Check that capital shows appropriate fallback
    expect(screen.getByText(/Capital/i)).toHaveTextContent('Capital : N/A');
    
    // Check that region shows appropriate fallback
    expect(screen.getByText(/Region/i)).toHaveTextContent('Region | N/A');
  });
});
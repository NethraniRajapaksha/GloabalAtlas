// Mock react-router-dom BEFORE importing anything else
jest.mock('react-router-dom', () => ({
  // Mock any hooks or components you need from react-router-dom
  useNavigate: () => jest.fn()
}), { virtual: true });  // The virtual flag tells Jest it's ok if the module doesn't exist

// Mock the service modules
jest.mock('../services/countryService', () => ({
  getAllCountries: jest.fn(),
  getCountryByName: jest.fn(),
  getCountriesByRegion: jest.fn()
}));

// Mock child components to simplify testing
jest.mock('../components/Header', () => ({ user }) => <div data-testid="header-mock">Header</div>);
jest.mock('../components/Footer', () => () => <div data-testid="footer-mock">Footer</div>);
jest.mock('../components/CountryCard', () => ({ country }) => (
  <div data-testid="country-card">
    {country.name.common || (typeof country.name === 'object' ? country.name.common : country.name)}
  </div>
));
jest.mock('../components/SearchBar', () => ({ searchTerm, setSearchTerm, sx }) => (
  <input 
    data-testid="search-bar-mock" 
    placeholder="Search for a country" 
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
));
jest.mock('../components/FilterMenu', () => ({ selectedRegion, setSelectedRegion, sx }) => (
  <select 
    data-testid="filter-menu-mock" 
    value={selectedRegion} 
    onChange={(e) => setSelectedRegion(e.target.value)}
  >
    <option value="">Filter by Region</option>
    <option value="Africa">Africa</option>
    <option value="Americas">Americas</option>
    <option value="Asia">Asia</option>
    <option value="Europe">Europe</option>
    <option value="Oceania">Oceania</option>
  </select>
));

// Now import React and testing utilities
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Import the component to test after all mocks are set up
import Home from '../pages/Home';

// Import the mocked service functions
import { 
  getAllCountries, 
  getCountryByName, 
  getCountriesByRegion 
} from '../services/countryService';

describe('Home Page', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  // it('should fetch and display countries on initial load', async () => {
  //   // Mock data for getAllCountries
  //   const mockCountries = [
  //     { cca3: 'USA', name: { common: 'United States of America' }, flags: { png: 'url_to_flag' } },
  //     { cca3: 'CAN', name: { common: 'Canada' }, flags: { png: 'url_to_flag' } }
  //   ];
    
  //   getAllCountries.mockResolvedValue(mockCountries);

  //   render(<Home />);

  //   // Check if loading indicator appears during load
  //   expect(screen.getByRole('progressbar')).toBeInTheDocument();

  //   // Wait for countries to load
  //   await waitFor(() => {
  //     expect(screen.getByText(`Showing ${mockCountries.length} countries`)).toBeInTheDocument();
  //   });

  //   // Check if countries are displayed
  //   expect(screen.getAllByTestId('country-card').length).toBe(2);
    
  //   // Verify the API was called exactly once
  //   expect(getAllCountries).toHaveBeenCalledTimes(1);
  // });

  it('handles search functionality correctly', async () => {
    // Set up initial countries
    getAllCountries.mockResolvedValue([
      { cca3: 'USA', name: { common: 'United States of America' }, flags: { png: 'url_to_flag' } },
      { cca3: 'CAN', name: { common: 'Canada' }, flags: { png: 'url_to_flag' } }
    ]);

    // Mock search result
    const searchResult = [
      { cca3: 'USA', name: { common: 'United States of America' }, flags: { png: 'url_to_flag' } }
    ];
    getCountryByName.mockResolvedValue(searchResult);

    render(<Home />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find the search input and type
    const searchInput = screen.getByTestId('search-bar-mock');
    fireEvent.change(searchInput, { target: { value: 'United' } });

    // Wait for search results
    await waitFor(() => {
      expect(screen.getAllByTestId('country-card').length).toBe(1);
    });

    // Verify API was called with correct params
    expect(getCountryByName).toHaveBeenCalledWith('United');
  });

  it('handles region filtering correctly', async () => {
    // Set up initial countries
    getAllCountries.mockResolvedValue([
      { cca3: 'USA', name: { common: 'United States of America' }, flags: { png: 'url_to_flag' } },
      { cca3: 'CAN', name: { common: 'Canada' }, flags: { png: 'url_to_flag' } },
      { cca3: 'DEU', name: { common: 'Germany' }, flags: { png: 'url_to_flag' } }
    ]);

    // Mock region filter result
    const regionResult = [
      { cca3: 'USA', name: { common: 'United States of America' }, flags: { png: 'url_to_flag' } },
      { cca3: 'CAN', name: { common: 'Canada' }, flags: { png: 'url_to_flag' } }
    ];
    getCountriesByRegion.mockResolvedValue(regionResult);

    render(<Home />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Find the region selector and change it
    const regionSelect = screen.getByTestId('filter-menu-mock');
    fireEvent.change(regionSelect, { target: { value: 'Americas' } });

    // Wait for filter results
    await waitFor(() => {
      expect(screen.getAllByTestId('country-card').length).toBe(2);
    });

    // Verify API was called with correct params
    expect(getCountriesByRegion).toHaveBeenCalledWith('Americas');
  });

  it('handles error states correctly', async () => {
    // Mock an API error
    getAllCountries.mockRejectedValue(new Error('Network error'));

    render(<Home />);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to load countries. Please try again later.')).toBeInTheDocument();
    });
  });

  it('displays "No countries found" when the search returns no results', async () => {
    // Initial load
    getAllCountries.mockResolvedValue([
      { cca3: 'USA', name: { common: 'United States of America' }, flags: { png: 'url_to_flag' } }
    ]);

    // Empty search result
    getCountryByName.mockResolvedValue([]);

    render(<Home />);

    // Wait for initial load to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Search for a non-existent country
    const searchInput = screen.getByTestId('search-bar-mock');
    fireEvent.change(searchInput, { target: { value: 'NonExistentCountry' } });

    // Wait for the no results message
    await waitFor(() => {
      expect(screen.getByText('No countries found')).toBeInTheDocument();
    });
  });
});
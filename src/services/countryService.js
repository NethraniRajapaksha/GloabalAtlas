// services/countryService.js

const BASE_URL = "https://restcountries.com/v3.1";

export const getAllCountries = async () => {
  const response = await fetch(`${BASE_URL}/all`);
  return await response.json();
};

export const getCountryByName = async (name) => {
  const response = await fetch(`${BASE_URL}/name/${name}`);
  return await response.json();
};

export const getCountriesByRegion = async (region) => {
  const response = await fetch(`${BASE_URL}/region/${region}`);
  return await response.json();
};

export const getCountryByCode = async (code) => {
  const response = await fetch(`${BASE_URL}/alpha/${code}`);
  return await response.json();
};

/**
 * Fetches multiple countries by their codes
 * @param {Array<string>} codes - Array of country codes (cca3)
 * @returns {Promise<Array>} Array of country objects
 */
export const getCountriesByCodes = async (codes) => {
  if (!codes || codes.length === 0) {
    return [];
  }
  
  try {
    // Create a comma-separated string of codes
    const codesString = codes.join(',');
    const response = await fetch(`${BASE_URL}/alpha?codes=${codesString}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching countries by codes:', error);
    throw error;
  }
};

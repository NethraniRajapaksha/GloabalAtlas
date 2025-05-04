// Mock the MUI dependencies that FilterMenu might be using
jest.mock('@mui/material', () => ({
  FormControl: ({ children, ...props }) => <div data-testid="form-control" {...props}>{children}</div>,
  InputLabel: ({ children, ...props }) => <label data-testid="input-label" {...props}>{children}</label>,
  Select: ({ children, value, onChange, ...props }) => (
    <select 
      data-testid="mui-select" 
      value={value} 
      onChange={onChange}
      {...props}
    >
      {children}
    </select>
  ),
  MenuItem: ({ children, value, ...props }) => <option value={value} {...props}>{children}</option>,
}));

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterMenu from '../components/FilterMenu'; // Adjust the import path as necessary
import '@testing-library/jest-dom';

describe('FilterMenu component', () => {
  const setup = (selectedRegion = '', setSelectedRegion = jest.fn()) => {
    render(<FilterMenu selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />);
    return { setSelectedRegion };
  };

  it('renders the filter label and form control', () => {
    setup();
    // Check for the form control component
    expect(screen.getByTestId('form-control')).toBeInTheDocument();
    // Check for the label
    expect(screen.getByTestId('input-label')).toBeInTheDocument();
    expect(screen.getByText(/Filter by Region/i)).toBeInTheDocument();
  });

  it('renders with the correct selected region', () => {
    setup('Asia');
    // The select should have the value "Asia"
    const select = screen.getByTestId('mui-select');
    expect(select.value).toBe('Asia');
  });

  it('calls setSelectedRegion when a region is selected', () => {
    const mockSetSelectedRegion = jest.fn();
    setup('', mockSetSelectedRegion);

    // Simulate changing the select value
    const select = screen.getByTestId('mui-select');
    fireEvent.change(select, { target: { value: 'Asia' } });

    // Verify that the callback was called with the correct value
    expect(mockSetSelectedRegion).toHaveBeenCalledWith('Asia');
  });

  it('displays all region options', () => {
    setup();
    
    // Get the select element
    const select = screen.getByTestId('mui-select');
    
    // Open the select dropdown (not needed in this mock since we're testing the rendered options)
    // In a real environment with actual MUI components, you would need different approach
    
    // Check that all options are in the document
    ['All', 'Africa', 'Americas', 'Asia', 'Europe', 'Oceania'].forEach(region => {
      expect(screen.getByText(region)).toBeInTheDocument();
    });
  });

  it('clears the selection when "All" is selected', () => {
    const mockSetSelectedRegion = jest.fn();
    setup('Asia', mockSetSelectedRegion);

    // Get the select element and change to "All"
    const select = screen.getByTestId('mui-select');
    fireEvent.change(select, { target: { value: '' } });

    // The handler should be called with an empty string
    expect(mockSetSelectedRegion).toHaveBeenCalledWith('');
  });
});
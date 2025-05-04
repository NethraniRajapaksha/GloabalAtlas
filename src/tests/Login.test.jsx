import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/Login';

// Mock function for onLogin prop
const mockOnLogin = jest.fn();

// Mocking the saveUserSession utility function
jest.mock('../utils/session', () => ({
  saveUserSession: jest.fn(),
}));

describe('Login Page', () => {
  beforeEach(() => {
    render(<Login onLogin={mockOnLogin} />);
  });

  test('renders login form correctly', () => {
    // Check if the login title is rendered
    expect(screen.getByText(/World Explorer/i)).toBeInTheDocument();
    // Check if the username input field is rendered
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    // Check if the login button is rendered
    expect(screen.getByRole('button', { name: /LOGIN/i })).toBeInTheDocument();
  });

  test('calls onLogin when username is entered and login button is clicked', async () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const loginButton = screen.getByRole('button', { name: /LOGIN/i });

    // Simulate typing a username
    fireEvent.change(usernameInput, { target: { value: 'testuser' } });

    // Simulate clicking the login button
    fireEvent.click(loginButton);

    // Wait for the onLogin function to be called
    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('testuser');
    });

    // Ensure that saveUserSession was called with the correct data
    expect(require('../utils/session').saveUserSession).toHaveBeenCalledWith({ username: 'testuser' });
  });

  test('does not call onLogin if username is empty', () => {
    const usernameInput = screen.getByLabelText(/Username/i);
    const loginButton = screen.getByRole('button', { name: /LOGIN/i });

    // Simulate clicking the login button with an empty input
    fireEvent.change(usernameInput, { target: { value: '' } });
    fireEvent.click(loginButton);

    // Ensure that onLogin is not called
    expect(mockOnLogin).not.toHaveBeenCalled();
  });
});

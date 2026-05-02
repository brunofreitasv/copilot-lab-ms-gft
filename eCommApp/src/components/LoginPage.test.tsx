import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import LoginPage from './LoginPage';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe('LoginPage', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
  });

  it('logs in with admin credentials and navigates to admin page', async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('Username'), 'admin');
    await user.type(screen.getByPlaceholderText('Password'), 'admin');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
    expect(screen.queryByText('Invalid credentials')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toHaveValue('');
    expect(screen.getByPlaceholderText('Password')).toHaveValue('');
  });

  it('shows an error for invalid credentials and does not navigate', async () => {
    const user = userEvent.setup();

    render(<LoginPage />);

    await user.type(screen.getByPlaceholderText('Username'), 'user');
    await user.type(screen.getByPlaceholderText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Login' }));

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
  });
});

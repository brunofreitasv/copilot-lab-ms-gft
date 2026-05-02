import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AdminPage from './AdminPage';

vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

describe('AdminPage', () => {
  it('shows default state and applies a valid sale percent', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('No sale active.')).toBeInTheDocument();

    const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
    await user.clear(input);
    await user.type(input, '25');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText('All products are 25% off!')).toBeInTheDocument();
  });

  it('shows validation message for invalid numeric input', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
    await user.clear(input);
    await user.type(input, 'abc');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByText(/Invalid input/)).toBeInTheDocument();
    expect(screen.getByText(/Please enter a valid number/)).toBeInTheDocument();
  });

  it('resets sale when ending sale', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>,
    );

    const input = screen.getByLabelText('Set Sale Percent (% off for all items):');
    await user.clear(input);
    await user.type(input, '50');
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('All products are 50% off!')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'End Sale' }));

    expect(screen.getByText('No sale active.')).toBeInTheDocument();
    expect(input).toHaveValue('0');
  });
});

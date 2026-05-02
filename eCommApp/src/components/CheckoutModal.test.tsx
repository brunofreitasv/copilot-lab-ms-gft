import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import CheckoutModal from './CheckoutModal';

describe('CheckoutModal', () => {
  it('renders confirmation text and triggers callbacks', async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(<CheckoutModal onConfirm={onConfirm} onCancel={onCancel} />);

    expect(screen.getByRole('heading', { name: 'Are you sure?' })).toBeInTheDocument();
    expect(screen.getByText('Do you want to proceed with the checkout?')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue Checkout' }));
    expect(onConfirm).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Return to cart' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});

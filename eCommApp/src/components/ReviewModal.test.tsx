import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import ReviewModal from './ReviewModal';
import { Product } from '../types';

const product: Product = {
  id: 'orange',
  name: 'Orange',
  price: 3.75,
  inStock: true,
  reviews: [
    {
      author: 'Alice',
      comment: 'Fresh and sweet',
      date: '2026-01-01T00:00:00.000Z',
    },
  ],
};

describe('ReviewModal', () => {
  it('renders nothing when product is null', () => {
    const { container } = render(
      <ReviewModal product={null} onClose={vi.fn()} onSubmit={vi.fn()} />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it('shows existing reviews and closes on backdrop/click on close button', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(<ReviewModal product={product} onClose={onClose} onSubmit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Reviews for Orange' })).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Fresh and sweet')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));
    await user.click(document.querySelector('.modal-backdrop') as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('submits a new review and does not close when clicking inside modal content', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    const onClose = vi.fn();

    render(
      <ReviewModal
        product={{ ...product, reviews: [] }}
        onClose={onClose}
        onSubmit={onSubmit}
      />,
    );

    expect(screen.getByText('No reviews yet.')).toBeInTheDocument();

    await user.click(document.querySelector('.modal-content') as HTMLElement);
    expect(onClose).not.toHaveBeenCalled();

    await user.type(screen.getByPlaceholderText('Your name'), 'Bruno');
    await user.type(screen.getByPlaceholderText('Your review'), 'Great quality');
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        author: 'Bruno',
        comment: 'Great quality',
        date: expect.any(String),
      }),
    );
  });
});

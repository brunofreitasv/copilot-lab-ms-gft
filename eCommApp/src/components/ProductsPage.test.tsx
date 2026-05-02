import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';
import { Product } from '../types';

vi.mock('./Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}));

vi.mock('./Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('./ReviewModal', () => ({
  default: ({ product, onClose, onSubmit }: { product: Product | null; onClose: () => void; onSubmit: (review: { author: string; comment: string; date: string }) => void }) =>
    product ? (
      <div data-testid="review-modal">
        <span data-testid="selected-product">{product.name}</span>
        <span data-testid="selected-review-count">{product.reviews.length}</span>
        <button
          onClick={() => onSubmit({ author: 'Tester', comment: 'Nice', date: '2026-03-01T00:00:00.000Z' })}
        >
          Submit Mock Review
        </button>
        <button onClick={onClose}>Close Mock Review</button>
      </div>
    ) : null,
}));

const products: Product[] = [
  {
    id: 'apple',
    name: 'Apple',
    price: 1.99,
    description: 'Fresh apple',
    image: 'apple.jpg',
    reviews: [],
    inStock: true,
  },
  {
    id: 'grapes',
    name: 'Grapes',
    price: 2.5,
    reviews: [],
    inStock: false,
  },
  {
    id: 'orange',
    name: 'Orange',
    price: 3.75,
    image: 'orange.jpg',
    reviews: [],
    inStock: true,
  },
  {
    id: 'pear',
    name: 'Pear',
    price: 4,
    description: 'Sweet pear',
    image: 'pear.jpg',
    reviews: [],
    inStock: true,
  },
  {
    id: 'ubs-cosplay',
    name: 'UBS Cosplay',
    price: 9.99,
    image: 'ubs-cosplay.jpg',
    reviews: [],
    inStock: true,
  },
];

const createFetchResponse = (product: Product, ok = true) =>
  Promise.resolve({
    ok,
    json: async () => product,
  } as Response);

const mockProductsFetch = () => {
  const productByFile = new Map(
    products.map((product) => [`${product.id}.json`, product]),
  );

  return vi.spyOn(global, 'fetch').mockImplementation((input) => {
    const url = String(input);
    const file = url.split('/').pop() ?? '';
    const matchedProduct = productByFile.get(file);

    if (matchedProduct) {
      return createFetchResponse(matchedProduct);
    }

    const fallbackName = file.replace('.json', '').replace(/[-_]/g, ' ') || 'Fallback Product';
    return createFetchResponse({
      id: file.replace('.json', '') || 'fallback-product',
      name: fallbackName,
      price: 1,
      reviews: [],
      inStock: true,
    });
  });
};

const renderWithCart = (addToCart = vi.fn()) => {
  return render(
    <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
      <ProductsPage />
    </CartContext.Provider>,
  );
};

describe('ProductsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads products, renders stock states, and adds in-stock product to cart', async () => {
    const user = userEvent.setup();
    const addToCart = vi.fn();

    mockProductsFetch();

    renderWithCart(addToCart);

    expect(screen.getByText('Loading products...')).toBeInTheDocument();

    expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Apple' })).toBeInTheDocument();
    expect(screen.getByText('$1.99')).toBeInTheDocument();
    expect(screen.getByText('Fresh apple')).toBeInTheDocument();

    const outOfStockButton = screen.getByRole('button', { name: 'Out of Stock' });
    expect(outOfStockButton).toBeDisabled();

    await user.click(screen.getAllByRole('button', { name: 'Add to Cart' })[0]);
    expect(addToCart).toHaveBeenCalledTimes(1);
    expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ id: 'apple' }));
  });

  it('opens review modal, submits review, updates selected product, and closes modal', async () => {
    const user = userEvent.setup();

    mockProductsFetch();

    renderWithCart();

    const appleImage = await screen.findByRole('img', { name: 'Apple' });
    await user.click(appleImage);

    expect(screen.getByTestId('review-modal')).toBeInTheDocument();
    expect(screen.getByTestId('selected-product')).toHaveTextContent('Apple');
    expect(screen.getByTestId('selected-review-count')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Submit Mock Review' }));

    await waitFor(() => {
      expect(screen.getByTestId('selected-review-count')).toHaveTextContent('1');
    });

    await user.click(screen.getByRole('button', { name: 'Close Mock Review' }));
    expect(screen.queryByTestId('review-modal')).not.toBeInTheDocument();
  });

  it('handles product loading failures and exits loading state', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    vi.spyOn(global, 'fetch').mockResolvedValue({ ok: false } as Response);

    try {
      renderWithCart();

      expect(await screen.findByRole('heading', { name: 'Our Products' })).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });

  it('throws a helpful error when used outside CartProvider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      expect(() => render(<ProductsPage />)).toThrow('CartContext must be used within a CartProvider');
    } finally {
      consoleErrorSpy.mockRestore();
    }
  });
});

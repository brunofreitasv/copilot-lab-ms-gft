import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import ProductsPage from './ProductsPage';
import { CartContext } from '../context/CartContext';

vi.mock('./Header', () => ({ default: () => <div data-testid="header">Header</div> }));
vi.mock('./Footer', () => ({ default: () => <div data-testid="footer">Footer</div> }));
vi.mock('./ReviewModal', () => ({ default: () => null }));

const addToCart = vi.fn();

const productsByFile: Record<string, unknown> = {
    'products/apple.json': { id: '1', name: 'Apple', price: 1, reviews: [], inStock: true },
    'products/grapes.json': { id: '2', name: 'Grapes', price: 2, reviews: [], inStock: true },
    'products/orange.json': { id: '3', name: 'Orange', price: 3, reviews: [], inStock: true },
    'products/pear.json': { id: '4', name: 'Pear', price: 4, reviews: [], inStock: true },
    'products/ubs-cosplay.json': {
        id: '5',
        name: 'UBS Cosplay',
        price: 149.99,
        reviews: [],
        inStock: true,
        sku: 'UBS-COS-001',
        stock: 50,
        image: 'pear.png'
    }
};

describe('ProductsPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.stubGlobal('fetch', vi.fn(async (input: RequestInfo | URL) => {
            const key = typeof input === 'string' ? input : input.toString();
            const product = productsByFile[key];
            if (!product) {
                return { ok: false, json: async () => ({}) } as Response;
            }

            return {
                ok: true,
                json: async () => product,
            } as Response;
        }));
    });

    it('loads and renders the UBS Cosplay product and allows adding to cart', async () => {
        render(
            <CartContext.Provider value={{ cartItems: [], addToCart, clearCart: vi.fn() }}>
                <ProductsPage />
            </CartContext.Provider>
        );

        await waitFor(() => expect(screen.getByText('UBS Cosplay')).toBeInTheDocument());

        const addButtons = screen.getAllByRole('button', { name: 'Add to Cart' });
        const ubsButton = addButtons[addButtons.length - 1];
        ubsButton.click();

        expect(addToCart).toHaveBeenCalledWith(expect.objectContaining({ name: 'UBS Cosplay' }));
    });
});

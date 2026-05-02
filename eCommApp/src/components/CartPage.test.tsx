import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import CartPage from './CartPage';
import { CartContext, CartItem } from '../context/CartContext';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

vi.mock('./CheckoutModal', () => ({
    default: ({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) => (
        <div data-testid="checkout-modal">
            <button onClick={onConfirm} data-testid="confirm-checkout">Confirm</button>
            <button onClick={onCancel} data-testid="cancel-checkout">Cancel</button>
        </div>
    )
}));

const mockCartItems: CartItem[] = [
    {
        id: '1',
        name: 'Test Product 1',
        price: 29.99,
        quantity: 2,
        image: 'test1.jpg',
        reviews: [],
        inStock: true
    },
    {
        id: '2',
        name: 'Test Product 2',
        price: 49.99,
        quantity: 1,
        image: 'test2.jpg',
        reviews: [],
        inStock: true
    }
];

const edgeCaseCartItems: CartItem[] = [
    {
        id: 'free-item',
        name: 'Free Sample',
        price: 0,
        quantity: 0,
        image: 'free-sample.png',
        reviews: [],
        inStock: false
    },
    {
        id: 'discount-adjustment',
        name: 'Discount Adjustment',
        price: -5,
        quantity: -1,
        image: 'discount.png',
        reviews: [],
        inStock: true
    }
];

const createCartContext = (cartItems: CartItem[] = mockCartItems) => ({
    cartItems,
    addToCart: vi.fn(),
    clearCart: vi.fn()
});

const renderWithCartContext = (cartContext = createCartContext()) => {
    return render(
        <CartContext.Provider value={cartContext}>
            <CartPage />
        </CartContext.Provider>
    );
};

describe('CartPage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders header, footer, and the empty-cart message when there are no items', () => {
        renderWithCartContext(createCartContext([]));

        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
        expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();
    });

    it('displays all cart items with formatted price, quantity, and product image', () => {
        renderWithCartContext();

        expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();

        for (const item of mockCartItems) {
            expect(screen.getByRole('heading', { name: item.name })).toBeInTheDocument();
            expect(screen.getByText(`Price: $${item.price.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(`Quantity: ${item.quantity}`)).toBeInTheDocument();

            const image = screen.getByRole('img', { name: item.name });
            expect(image).toHaveAttribute('src', `products/productImages/${item.image}`);
            expect(image).toHaveClass('cart-item-image');
        }
    });

    it('opens the checkout modal only after the user clicks Checkout', async () => {
        const user = userEvent.setup();

        renderWithCartContext();

        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Checkout' }));

        expect(screen.getByTestId('checkout-modal')).toBeInTheDocument();
        expect(screen.getByTestId('confirm-checkout')).toBeInTheDocument();
        expect(screen.getByTestId('cancel-checkout')).toBeInTheDocument();
    });

    it('closes the checkout modal without clearing the cart when checkout is canceled', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();

        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByTestId('cancel-checkout'));

        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(cartContext.clearCart).not.toHaveBeenCalled();
        expect(screen.getByRole('heading', { name: 'Your Cart' })).toBeInTheDocument();
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('confirms checkout, clears the cart, and shows the processed order summary', async () => {
        const user = userEvent.setup();
        const cartContext = createCartContext();

        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByTestId('confirm-checkout'));

        expect(cartContext.clearCart).toHaveBeenCalledTimes(1);
        expect(screen.queryByTestId('checkout-modal')).not.toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Your order has been processed!' })).toBeInTheDocument();
        expect(screen.queryByRole('heading', { name: 'Your Cart' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Checkout' })).not.toBeInTheDocument();

        for (const item of mockCartItems) {
            expect(screen.getByRole('heading', { name: item.name })).toBeInTheDocument();
            expect(screen.getByText(`Price: $${item.price.toFixed(2)}`)).toBeInTheDocument();
            expect(screen.getByText(`Quantity: ${item.quantity}`)).toBeInTheDocument();
        }
    });

    it('keeps a snapshot of processed items even when clearCart changes the source array', async () => {
        const user = userEvent.setup();
        const mutableItems = [...mockCartItems];
        const cartContext = {
            cartItems: mutableItems,
            addToCart: vi.fn(),
            clearCart: vi.fn(() => {
                mutableItems.length = 0;
            })
        };

        renderWithCartContext(cartContext);

        await user.click(screen.getByRole('button', { name: 'Checkout' }));
        await user.click(screen.getByTestId('confirm-checkout'));

        expect(cartContext.clearCart).toHaveBeenCalledTimes(1);
        expect(screen.getByRole('heading', { name: 'Test Product 1' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Test Product 2' })).toBeInTheDocument();
    });

    it('renders edge-case numeric values without hiding the item', () => {
        renderWithCartContext(createCartContext(edgeCaseCartItems));

        expect(screen.getByRole('heading', { name: 'Free Sample' })).toBeInTheDocument();
        expect(screen.getByText('Price: $0.00')).toBeInTheDocument();
        expect(screen.getByText('Quantity: 0')).toBeInTheDocument();

        const discountItem = screen.getByRole('heading', { name: 'Discount Adjustment' }).closest('.cart-item-card');
        expect(discountItem).not.toBeNull();
        expect(within(discountItem as HTMLElement).getByText('Price: $-5.00')).toBeInTheDocument();
        expect(within(discountItem as HTMLElement).getByText('Quantity: -1')).toBeInTheDocument();
    });

    it('throws a helpful error when rendered outside CartProvider', () => {
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);

        try {
            expect(() => render(<CartPage />)).toThrow('CartContext must be used within a CartProvider');
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });
});

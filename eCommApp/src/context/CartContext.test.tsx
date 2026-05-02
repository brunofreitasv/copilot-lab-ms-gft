import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types';

const firstProduct: Product = {
  id: 'apple',
  name: 'Apple',
  price: 1.5,
  reviews: [],
  inStock: true,
};

const secondProduct: Product = {
  id: 'pear',
  name: 'Pear',
  price: 2,
  reviews: [],
  inStock: true,
};

const CartConsumer = () => (
  <CartContext.Consumer>
    {(context) => {
      if (!context) {
        return <div>no-context</div>;
      }

      return (
        <div>
          <div data-testid="count">{context.cartItems.length}</div>
          <div data-testid="first-qty">{context.cartItems[0]?.quantity ?? 0}</div>
          <button onClick={() => context.addToCart(firstProduct)}>Add Apple</button>
          <button onClick={() => context.addToCart(secondProduct)}>Add Pear</button>
          <button onClick={context.clearCart}>Clear</button>
        </div>
      );
    }}
  </CartContext.Consumer>
);

describe('CartProvider', () => {
  it('adds a new item and increments quantity for the same product', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('0');

    await user.click(screen.getByRole('button', { name: 'Add Apple' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('1');

    await user.click(screen.getByRole('button', { name: 'Add Apple' }));
    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('2');
  });

  it('tracks different products and clears all cart items', async () => {
    const user = userEvent.setup();

    render(
      <CartProvider>
        <CartConsumer />
      </CartProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Add Apple' }));
    await user.click(screen.getByRole('button', { name: 'Add Pear' }));

    expect(screen.getByTestId('count')).toHaveTextContent('2');

    await user.click(screen.getByRole('button', { name: 'Clear' }));

    expect(screen.getByTestId('count')).toHaveTextContent('0');
    expect(screen.getByTestId('first-qty')).toHaveTextContent('0');
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

vi.mock('./components/HomePage', () => ({
  default: () => <div>Home Route</div>,
}));

vi.mock('./components/ProductsPage', () => ({
  default: () => <div>Products Route</div>,
}));

vi.mock('./components/LoginPage', () => ({
  default: () => <div>Login Route</div>,
}));

vi.mock('./components/AdminPage', () => ({
  default: () => <div>Admin Route</div>,
}));

vi.mock('./components/CartPage', () => ({
  default: () => <div>Cart Route</div>,
}));

describe('App routes', () => {
  it('renders home route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Home Route')).toBeInTheDocument();
  });

  it('renders products route', () => {
    render(
      <MemoryRouter initialEntries={['/products']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Products Route')).toBeInTheDocument();
  });

  it('renders login route', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Route')).toBeInTheDocument();
  });

  it('renders admin route', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Admin Route')).toBeInTheDocument();
  });

  it('renders cart route', () => {
    render(
      <MemoryRouter initialEntries={['/cart']}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Cart Route')).toBeInTheDocument();
  });
});

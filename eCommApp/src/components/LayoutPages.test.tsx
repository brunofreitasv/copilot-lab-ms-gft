import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import HomePage from './HomePage';

vi.mock('./Header', async () => {
  const actual = await vi.importActual<typeof import('./Header')>('./Header');
  return actual;
});

vi.mock('./Footer', async () => {
  const actual = await vi.importActual<typeof import('./Footer')>('./Footer');
  return actual;
});

describe('Header/Footer/HomePage', () => {
  it('renders header links and admin login button', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products');
    expect(screen.getByRole('link', { name: 'Cart' })).toHaveAttribute('href', '/cart');
    expect(screen.getByRole('button', { name: 'Admin Login' })).toBeInTheDocument();
  });

  it('renders footer copyright', () => {
    render(<Footer />);

    expect(screen.getByText(/2025 The Daily Harvest/)).toBeInTheDocument();
  });

  it('renders homepage messaging with shared layout', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: 'Welcome to the The Daily Harvest!' })).toBeInTheDocument();
    expect(screen.getByText('Check out our products page for some great deals.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'The Daily Harvest' })).toBeInTheDocument();
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });
});

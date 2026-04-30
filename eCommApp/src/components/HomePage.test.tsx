import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import HomePage from './HomePage';

vi.mock('./Header', () => ({
    default: () => <div data-testid="header">Header</div>
}));

vi.mock('./Footer', () => ({
    default: () => <div data-testid="footer">Footer</div>
}));

describe('HomePage', () => {
    it('shows contact form, submits, and clears entries after continue', async () => {
        const user = userEvent.setup();
        render(<HomePage />);

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        const nameInput = screen.getByLabelText('Name');
        const emailInput = screen.getByLabelText('Email');
        const requestInput = screen.getByLabelText('Request');

        await user.type(nameInput, 'Jane Doe');
        await user.type(emailInput, 'jane@example.com');
        await user.type(requestInput, 'Need help with my order.');

        await user.click(screen.getByRole('button', { name: 'Submit' }));

        expect(screen.getByText('Thank you for your message.')).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Continue' }));

        await user.click(screen.getByRole('button', { name: 'Contact Us' }));

        expect(screen.getByLabelText('Name')).toHaveValue('');
        expect(screen.getByLabelText('Email')).toHaveValue('');
        expect(screen.getByLabelText('Request')).toHaveValue('');
    });
});

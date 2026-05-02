import { describe, expect, it } from 'vitest';
import { calculateTotal, formatPrice, validateEmail } from './helpers';

describe('helpers', () => {
  it('formats price as USD currency', () => {
    expect(formatPrice(0)).toBe('$0.00');
    expect(formatPrice(1234.56)).toBe('$1,234.56');
    expect(formatPrice(-5)).toBe('-$5.00');
  });

  it('calculates total from price and quantity pairs', () => {
    expect(calculateTotal([])).toBe(0);
    expect(
      calculateTotal([
        { price: 10, quantity: 2 },
        { price: 3.5, quantity: 4 },
      ]),
    ).toBe(34);
    expect(calculateTotal([{ price: -5, quantity: 1 }])).toBe(-5);
  });

  it('validates common email formats', () => {
    expect(validateEmail('user@example.com')).toBe(true);
    expect(validateEmail('user.name+tag@sub.domain.com')).toBe(true);
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('spaces are@invalid.com')).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

vi.mock('./hooks/useServerSync', () => ({
  useServerSync: () => ({
    syncNow: vi.fn(),
    isLoading: false,
  }),
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Basic smoke test - adjust based on actual app content
    expect(document.body).toBeDefined();
  });
});

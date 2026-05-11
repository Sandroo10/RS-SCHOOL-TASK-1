import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '../ErrorBoundary';
import { ErrorTestButton } from '.';

describe('ErrorTestButton', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders test error button', () => {
    render(<ErrorTestButton />);

    expect(
      screen.getByRole('button', { name: 'Test error' })
    ).toBeInTheDocument();
  });

  it('triggers error boundary fallback when clicked', async () => {
    const user = userEvent.setup();
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ErrorTestButton />
      </ErrorBoundary>
    );

    await user.click(screen.getByRole('button', { name: 'Test error' }));

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
  });
});

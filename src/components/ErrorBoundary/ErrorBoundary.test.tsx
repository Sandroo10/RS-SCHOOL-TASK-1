import { Component, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from '.';

interface ThrowingChildProps {
  shouldThrow: boolean;
  children: ReactNode;
}

class ThrowingChild extends Component<ThrowingChildProps> {
  render() {
    if (this.props.shouldThrow) {
      throw new Error('Broken child');
    }

    return this.props.children;
  }
}

describe('ErrorBoundary', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={false}>Working child</ThrowingChild>
      </ErrorBoundary>
    );

    expect(screen.getByText('Working child')).toBeInTheDocument();
  });

  it('logs error and renders fallback UI when a child throws', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true}>Working child</ThrowingChild>
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(
      screen.getByText('Please refresh the page and try again.')
    ).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
  });
});

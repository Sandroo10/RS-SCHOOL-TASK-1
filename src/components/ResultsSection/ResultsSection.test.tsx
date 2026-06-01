import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { characterCards } from '../../test-utils/characters';
import { ResultsSection } from '.';

const defaultProps = {
  currentPage: 1,
  totalPages: 2,
  onPageChange: () => undefined,
  onSelectCharacter: () => undefined,
  onRefresh: () => undefined,
};

describe('ResultsSection', () => {
  it('shows loading spinner while data is loading', () => {
    render(
      <ResultsSection
        {...defaultProps}
        characters={[]}
        isLoading={true}
        errorMessage=""
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent(
      'Loading characters...'
    );
    expect(
      screen.queryByText('No characters to display.')
    ).not.toBeInTheDocument();
  });

  it('shows API error message', () => {
    render(
      <ResultsSection
        characters={[]}
        isLoading={false}
        errorMessage="No characters found. Try another name."
        {...defaultProps}
      />
    );

    expect(
      screen.getByText('No characters found. Try another name.')
    ).toBeInTheDocument();
  });

  it('shows cards when data is loaded', () => {
    render(
      <ResultsSection
        characters={characterCards}
        isLoading={false}
        errorMessage=""
        {...defaultProps}
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Test error' })
    ).toBeInTheDocument();
  });

  it('calls page change handlers from pagination controls', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <ResultsSection
        {...defaultProps}
        characters={characterCards}
        isLoading={false}
        errorMessage=""
        currentPage={2}
        totalPages={3}
        onPageChange={onPageChange}
      />
    );

    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Previous' }));
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(onPageChange).toHaveBeenNthCalledWith(1, 1);
    expect(onPageChange).toHaveBeenNthCalledWith(2, 3);
  });

  it('calls refresh handler from refresh button', async () => {
    const user = userEvent.setup();
    const onRefresh = vi.fn();

    render(
      <ResultsSection
        {...defaultProps}
        characters={characterCards}
        isLoading={false}
        errorMessage=""
        onRefresh={onRefresh}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Refresh' }));

    expect(onRefresh).toHaveBeenCalled();
  });
});

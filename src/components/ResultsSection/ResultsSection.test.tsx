import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { characterCards } from '../../test-utils/characters';
import { ResultsSection } from '.';

describe('ResultsSection', () => {
  it('shows loading spinner while data is loading', () => {
    render(<ResultsSection characters={[]} isLoading={true} errorMessage="" />);

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
      />
    );

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Test error' })
    ).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { characterCards } from '../../test-utils/characters';
import { CardList } from '.';

describe('CardList', () => {
  it('renders one card for each character', () => {
    render(<CardList characters={characterCards} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  it('renders empty state when there are no characters', () => {
    render(<CardList characters={[]} />);

    expect(screen.getByText('No characters to display.')).toBeInTheDocument();
  });
});

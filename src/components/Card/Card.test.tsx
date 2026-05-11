import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { characterCards } from '../../test-utils/characters';
import { Card } from '.';

describe('Card', () => {
  it('renders character name, description, and image', () => {
    render(<Card character={characterCards[0]} />);

    expect(
      screen.getByRole('heading', { name: 'Rick Sanchez' })
    ).toBeInTheDocument();
    expect(
      screen.getByText('Human | Alive | Last seen in Citadel of Ricks')
    ).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Rick Sanchez' })).toHaveAttribute(
      'src',
      characterCards[0].image
    );
  });
});

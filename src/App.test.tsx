import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { characterCards } from './test-utils/characters';
import { fetchCharacters } from './api/characters';
import App from './App';

vi.mock('./api/characters', () => ({
  fetchCharacters: vi.fn(),
}));

const fetchCharactersMock = vi.mocked(fetchCharacters);

describe('App', () => {
  beforeEach(() => {
    fetchCharactersMock.mockReset();
  });

  it('loads first page of all characters on initial render', async () => {
    fetchCharactersMock.mockResolvedValue(characterCards);

    render(<App />);

    expect(fetchCharactersMock).toHaveBeenCalledWith({
      searchTerm: '',
      page: 1,
    });
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('uses saved search term for initial request and input value', async () => {
    localStorage.setItem('characterSearchTerm', 'rick');
    fetchCharactersMock.mockResolvedValue([characterCards[0]]);

    render(<App />);

    expect(screen.getByRole('textbox')).toHaveValue('rick');
    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenCalledWith({
        searchTerm: 'rick',
        page: 1,
      });
    });
  });

  it('shows loading state and disables search button while request is pending', async () => {
    fetchCharactersMock.mockReturnValue(new Promise(() => undefined));

    render(<App />);

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Loading characters...'
    );
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('searches with trimmed term and saves it to localStorage', async () => {
    const user = userEvent.setup();
    fetchCharactersMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([characterCards[1]]);

    render(<App />);

    await screen.findByText('No characters to display.');
    await user.type(screen.getByRole('textbox'), '  morty  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenLastCalledWith({
        searchTerm: 'morty',
        page: 1,
      });
    });
    expect(localStorage.getItem('characterSearchTerm')).toBe('morty');
    expect(await screen.findByText('Morty Smith')).toBeInTheDocument();
  });

  it('does not request again when search term has not changed', async () => {
    const user = userEvent.setup();
    localStorage.setItem('characterSearchTerm', 'rick');
    fetchCharactersMock.mockResolvedValue([characterCards[0]]);

    render(<App />);

    await screen.findByText('Rick Sanchez');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(fetchCharactersMock).toHaveBeenCalledTimes(1);
  });

  it('shows readable error message when API request fails', async () => {
    fetchCharactersMock.mockRejectedValue(
      new Error('No characters found. Try another name.')
    );

    render(<App />);

    expect(
      await screen.findByText('No characters found. Try another name.')
    ).toBeInTheDocument();
  });
});

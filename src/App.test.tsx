import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { characterCards, characterDetails } from './test-utils/characters';
import { fetchCharacterDetails, fetchCharacters } from './api/characters';
import App from './App';

vi.mock('./api/characters', () => ({
  fetchCharacters: vi.fn(),
  fetchCharacterDetails: vi.fn(),
}));

const fetchCharactersMock = vi.mocked(fetchCharacters);
const fetchCharacterDetailsMock = vi.mocked(fetchCharacterDetails);

const charactersPage = {
  characters: characterCards,
  totalPages: 42,
};

function LocationDisplay() {
  const location = useLocation();

  return (
    <span data-testid="location">{`${location.pathname}${location.search}`}</span>
  );
}

function renderApp(initialEntry = '/?page=1') {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <App />
      <LocationDisplay />
    </MemoryRouter>
  );
}

describe('App', () => {
  beforeEach(() => {
    fetchCharactersMock.mockReset();
    fetchCharacterDetailsMock.mockReset();
  });

  it('loads first page of all characters on initial render', async () => {
    fetchCharactersMock.mockResolvedValue(charactersPage);

    renderApp();

    expect(fetchCharactersMock).toHaveBeenCalledWith({
      searchTerm: '',
      page: 1,
    });
    expect(await screen.findByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
  });

  it('uses saved search term for initial request and input value', async () => {
    localStorage.setItem('characterSearchTerm', 'rick');
    fetchCharactersMock.mockResolvedValue({
      characters: [characterCards[0]],
      totalPages: 1,
    });

    renderApp();

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

    renderApp();

    expect(await screen.findByRole('status')).toHaveTextContent(
      'Loading characters...'
    );
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('searches with trimmed term and saves it to localStorage', async () => {
    const user = userEvent.setup();
    fetchCharactersMock
      .mockResolvedValueOnce({ characters: [], totalPages: 1 })
      .mockResolvedValueOnce({
        characters: [characterCards[1]],
        totalPages: 1,
      });

    renderApp();

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
    fetchCharactersMock.mockResolvedValue({
      characters: [characterCards[0]],
      totalPages: 1,
    });

    renderApp();

    await screen.findByText('Rick Sanchez');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(fetchCharactersMock).toHaveBeenCalledTimes(1);
  });

  it('shows readable error message when API request fails', async () => {
    fetchCharactersMock.mockRejectedValue(
      new Error('No characters found. Try another name.')
    );

    renderApp();

    expect(
      await screen.findByText('No characters found. Try another name.')
    ).toBeInTheDocument();
  });

  it('updates URL and loads selected page when pagination is used', async () => {
    const user = userEvent.setup();
    fetchCharactersMock.mockResolvedValue(charactersPage);

    renderApp();

    await screen.findByText('Rick Sanchez');
    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/?page=2');
    await waitFor(() => {
      expect(fetchCharactersMock).toHaveBeenLastCalledWith({
        searchTerm: '',
        page: 2,
      });
    });
  });

  it('keeps selected items visible when navigating between pages', async () => {
    const user = userEvent.setup();
    fetchCharactersMock.mockResolvedValue(charactersPage);

    renderApp();

    await screen.findByText('Rick Sanchez');
    await user.click(
      screen.getByRole('checkbox', { name: 'Select Rick Sanchez' })
    );

    expect(screen.getByLabelText('Selected items')).toHaveTextContent(
      '1 selected'
    );

    await user.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByLabelText('Selected items')).toHaveTextContent(
      '1 selected'
    );
  });

  it('resets URL to first page when search input changes', async () => {
    const user = userEvent.setup();
    fetchCharactersMock.mockResolvedValue(charactersPage);
    fetchCharacterDetailsMock.mockResolvedValue(characterDetails);

    renderApp('/?page=3&details=1');

    await screen.findAllByRole('button', { name: 'View details' });
    await user.type(screen.getByRole('textbox'), 'm');

    expect(screen.getByTestId('location')).toHaveTextContent('/?page=1');
  });

  it('opens and closes details panel through URL params', async () => {
    const user = userEvent.setup();
    fetchCharactersMock.mockResolvedValue(charactersPage);
    fetchCharacterDetailsMock.mockResolvedValue(characterDetails);

    renderApp();

    await screen.findByText('Rick Sanchez');
    await user.click(
      screen.getAllByRole('button', { name: 'View details' })[0]
    );

    expect(screen.getByTestId('location')).toHaveTextContent(
      '/?page=1&details=1'
    );
    expect(await screen.findByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(fetchCharacterDetailsMock).toHaveBeenCalledWith('1');

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(screen.getByTestId('location')).toHaveTextContent('/?page=1');
  });

  it('renders about page from navigation route', () => {
    renderApp('/about');

    expect(screen.getByRole('heading', { name: 'About' })).toBeInTheDocument();
    expect(screen.getByText('Author: Sandro')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'RS School React course' })
    ).toHaveAttribute('href', 'https://rs.school/courses/reactjs');
  });

  it('renders not found page for unknown route', () => {
    renderApp('/unknown-route');

    expect(screen.getByRole('heading', { name: '404' })).toBeInTheDocument();
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Return to the main app' })
    ).toHaveAttribute('href', '/?page=1');
  });
});

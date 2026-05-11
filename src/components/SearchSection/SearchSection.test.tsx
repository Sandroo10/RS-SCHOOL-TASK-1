import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchSection } from '.';

describe('SearchSection', () => {
  it('renders empty input when localStorage is empty', () => {
    const onInitialLoad = vi.fn();

    render(
      <SearchSection
        searchTerm=""
        isLoading={false}
        onInitialLoad={onInitialLoad}
        onSearch={vi.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('');
    expect(onInitialLoad).toHaveBeenCalledWith('');
  });

  it('fills input with saved search term from localStorage', () => {
    localStorage.setItem('characterSearchTerm', 'rick');
    const onInitialLoad = vi.fn();

    render(
      <SearchSection
        searchTerm=""
        isLoading={false}
        onInitialLoad={onInitialLoad}
        onSearch={vi.fn()}
      />
    );

    expect(screen.getByRole('textbox')).toHaveValue('rick');
    expect(onInitialLoad).toHaveBeenCalledWith('rick');
  });

  it('updates input when user types', async () => {
    const user = userEvent.setup();

    render(
      <SearchSection
        searchTerm=""
        isLoading={false}
        onInitialLoad={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    await user.type(screen.getByRole('textbox'), 'morty');

    expect(screen.getByRole('textbox')).toHaveValue('morty');
  });

  it('trims and saves changed search term on submit', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    render(
      <SearchSection
        searchTerm=""
        isLoading={false}
        onInitialLoad={vi.fn()}
        onSearch={onSearch}
      />
    );

    await user.type(screen.getByRole('textbox'), '  summer  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('textbox')).toHaveValue('summer');
    expect(localStorage.getItem('characterSearchTerm')).toBe('summer');
    expect(onSearch).toHaveBeenCalledWith('summer');
  });

  it('does nothing when trimmed search term has not changed', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    localStorage.setItem('characterSearchTerm', 'rick');

    render(
      <SearchSection
        searchTerm="rick"
        isLoading={false}
        onInitialLoad={vi.fn()}
        onSearch={onSearch}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(localStorage.getItem('characterSearchTerm')).toBe('rick');
  });

  it('disables search button while loading', () => {
    render(
      <SearchSection
        searchTerm=""
        isLoading={true}
        onInitialLoad={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import { SearchSection } from '.';

function renderSearchSection(
  props: Partial<ComponentProps<typeof SearchSection>> = {}
) {
  const defaultProps: ComponentProps<typeof SearchSection> = {
    searchTerm: '',
    isLoading: false,
    onSearch: vi.fn(),
    onSearchTermChange: vi.fn(),
    ...props,
  };

  return render(
    <MemoryRouter>
      <SearchSection {...defaultProps} />
    </MemoryRouter>
  );
}

describe('SearchSection', () => {
  it('renders empty input when search term is empty', () => {
    renderSearchSection({
      searchTerm: '',
      isLoading: false,
      onSearch: vi.fn(),
    });

    expect(screen.getByRole('textbox')).toHaveValue('');
  });

  it('fills input with provided search term', () => {
    renderSearchSection({
      searchTerm: 'rick',
      isLoading: false,
      onSearch: vi.fn(),
    });

    expect(screen.getByRole('textbox')).toHaveValue('rick');
  });

  it('updates input when user types', async () => {
    const user = userEvent.setup();
    const onSearchTermChange = vi.fn();

    renderSearchSection({
      onSearchTermChange,
    });

    await user.type(screen.getByRole('textbox'), 'morty');

    expect(screen.getByRole('textbox')).toHaveValue('morty');
    expect(onSearchTermChange).toHaveBeenCalled();
  });

  it('trims and saves changed search term on submit', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    renderSearchSection({
      searchTerm: '',
      isLoading: false,
      onSearch,
    });

    await user.type(screen.getByRole('textbox'), '  summer  ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(screen.getByRole('textbox')).toHaveValue('summer');
    expect(onSearch).toHaveBeenCalledWith('summer');
  });

  it('submits the trimmed search term', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    renderSearchSection({
      searchTerm: 'rick',
      isLoading: false,
      onSearch,
    });

    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('rick');
  });

  it('disables search button while loading', () => {
    renderSearchSection({
      searchTerm: '',
      isLoading: true,
      onSearch: vi.fn(),
    });

    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });
});

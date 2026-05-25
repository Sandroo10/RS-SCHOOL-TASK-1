import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { characterCards } from '../../test-utils/characters';
import { useSelectedItemsStore } from '../../store/selectedItemsStore';
import { SelectedItemsFlyout } from '.';

describe('SelectedItemsFlyout', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:selected-items'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not render when no items are selected', () => {
    render(<SelectedItemsFlyout />);

    expect(screen.queryByLabelText('Selected items')).not.toBeInTheDocument();
  });

  it('shows selected count and clears selected items', async () => {
    const user = userEvent.setup();

    useSelectedItemsStore.getState().toggleItem(characterCards[0]);
    useSelectedItemsStore.getState().toggleItem(characterCards[1]);

    render(<SelectedItemsFlyout />);

    expect(screen.getByText('2 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unselect all' }));

    expect(screen.queryByLabelText('Selected items')).not.toBeInTheDocument();
  });

  it('downloads selected items as a CSV file', async () => {
    const user = userEvent.setup();
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    const anchor = originalCreateElement('a');

    anchor.click = clickMock;

    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockImplementation((tagName, options) => {
        if (tagName === 'a') {
          return anchor;
        }

        return originalCreateElement(tagName, options);
      });

    useSelectedItemsStore.getState().toggleItem(characterCards[0]);

    render(<SelectedItemsFlyout />);

    await user.click(screen.getByRole('button', { name: 'Download' }));

    expect(anchor.download).toBe('1_items.csv');
    expect(clickMock).toHaveBeenCalled();
    expect(URL.createObjectURL).toHaveBeenCalled();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:selected-items');

    createElementSpy.mockRestore();
  });
});

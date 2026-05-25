import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ThemeProvider } from '../../context/ThemeProvider';
import { ThemeSelector } from '.';

describe('ThemeSelector', () => {
  it('switches the document theme through Context API', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeSelector />
      </ThemeProvider>
    );

    await user.selectOptions(screen.getByLabelText('Theme'), 'dark');

    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');

    await user.selectOptions(screen.getByLabelText('Theme'), 'light');

    expect(document.documentElement).toHaveAttribute('data-theme', 'light');
  });
});

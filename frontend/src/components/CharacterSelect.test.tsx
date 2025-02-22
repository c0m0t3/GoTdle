import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent, act } from '../../tests/test-utils';
import { CharacterSelect } from './CharacterSelect';

describe('CharacterSelect Component', () => {
  it('displays "Character not found" when no results are found', async () => {
    const loadOptions = vi.fn(() => Promise.resolve([]));
    render(
      <CharacterSelect
        name="character-select"
        selectProps={{
          loadOptions,
        }}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'unknown' } });

    expect(await screen.findByText('Character not found')).toBeInTheDocument();
  });

  it('displays options when valid input is provided', async () => {
    const loadOptions = vi.fn((inputValue) =>
      Promise.resolve(
        inputValue === 'valid'
          ? [{ label: 'Valid Option', value: 'valid-option' }]
          : [],
      ),
    );

    render(
      <CharacterSelect
        name="character-select"
        selectProps={{
          loadOptions,
        }}
      />,
    );

    const input = screen.getByRole('combobox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'valid' } });

    expect(await screen.findByText('Valid Option')).toBeInTheDocument();
  });
});

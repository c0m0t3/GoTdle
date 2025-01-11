import { describe, expect, it } from 'vitest';
import { render } from '../../tests/test-utils.tsx';
import { BaseBox } from './BaseBox';

describe('BaseBox Component', () => {
  it('renders with default props and content', () => {
    const { getByText, getByTestId } = render(
      <BaseBox data-testid="base-box"></BaseBox>,
    );

    const box = getByTestId('base-box');
    expect(box).toBeInTheDocument();
  });

  it('applies additional props correctly', () => {
    const { getByTestId } = render(
      <BaseBox data-testid="base-box" bg="red.500">
        Custom Content
      </BaseBox>,
    );

    const box = getByTestId('base-box');
    expect(box).toHaveTextContent('Custom Content');
    expect(box).toHaveStyle({
      backgroundColor: 'red.500',
    });
  });
});

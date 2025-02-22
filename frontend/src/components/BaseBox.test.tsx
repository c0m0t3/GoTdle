import { describe, expect, it } from 'vitest';
import { render } from '../../tests/test-utils.tsx';
import { BaseBox } from './BaseBox';

describe('BaseBox Component', () => {
  it('renders with default props and content', () => {
    const { getByTestId } = render(
      <BaseBox data-testid="base-box">Default Content</BaseBox>,
    );

    const box = getByTestId('base-box');
    const computedStyles = window.getComputedStyle(box);

    expect(box).toBeInTheDocument();
    expect(box).toHaveTextContent('Default Content');
    expect(computedStyles.backgroundImage).toBe('url(/bg_border.png)');
    expect(computedStyles.backgroundPosition).toBe('top');
    expect(computedStyles.backgroundRepeat).toBe('no-repeat');
    expect(computedStyles.backgroundSize).toBe('100% 100%');

    expect(computedStyles.borderRadius).toBe('var(--chakra-radii-md)');
    expect(computedStyles.padding).toBe('var(--chakra-space-4)');
    expect(computedStyles.textAlign).toBe('center');
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

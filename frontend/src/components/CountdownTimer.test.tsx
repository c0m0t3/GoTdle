import { describe, expect, it, vi } from 'vitest';
import { render, act } from '../../tests/test-utils.tsx';
import { CountdownTimer } from './CountdownTimer';

vi.useFakeTimers();

describe('CountdownTimer Component', () => {
  it('renders with initial time and static content', () => {
    const { getByText } = render(<CountdownTimer />);

    const label = getByText(/Next character in/i);
    const timeZone = getByText(
      /Time zone: Europe\/Berlin \(Midnight UTC\+1\)/i,
    );
    const timeDisplay = getByText(/\d{2} : \d{2} : \d{2}/);

    expect(label).toBeInTheDocument();
    expect(timeZone).toBeInTheDocument();
    expect(timeDisplay).toBeInTheDocument();
  });

  it('updates the timer every second', () => {
    const { getByText } = render(<CountdownTimer />);

    const initialTime = getByText(/\d{2} : \d{2} : \d{2}/).textContent;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    const updatedTime = getByText(/\d{2} : \d{2} : \d{2}/).textContent;

    expect(updatedTime).not.toBe(initialTime);
  });

  it('calculates the correct time until midnight', () => {
    const now = new Date();
    const nextMidnight = new Date();
    nextMidnight.setHours(0, 0, 0, 0);
    nextMidnight.setDate(nextMidnight.getDate() + 1);

    const difference = nextMidnight.getTime() - now.getTime();
    const expectedHours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const expectedMinutes = Math.floor((difference / (1000 * 60)) % 60);
    const expectedSeconds = Math.floor((difference / 1000) % 60);

    const { getByText } = render(<CountdownTimer />);

    const expectedTimeRegex = new RegExp(
      `${String(expectedHours).padStart(2, '0')} : ${String(expectedMinutes).padStart(2, '0')} : ${String(expectedSeconds).padStart(2, '0')}`,
    );

    const displayedTime = getByText(expectedTimeRegex);
    expect(displayedTime).toBeInTheDocument();
  });
});

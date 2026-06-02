import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModelCard from './ModelCard';
import type { Model } from '@/types/types';

function makeModel(overrides: Partial<Model> = {}): Model {
  return {
    id: 1,
    name: 'Patrick',
    profilePicture: 'https://example.com/patrick.jpg',
    gender: 'male',
    selected: false,
    ...overrides,
  };
}

describe('ModelCard', () => {
  it('renders the model name, gender and profile picture', () => {
    render(<ModelCard model={makeModel()} onToggle={vi.fn()} />);

    expect(screen.getByText('Patrick')).toBeInTheDocument();
    expect(screen.getByText('male')).toBeInTheDocument();

    const img = screen.getByAltText('Patrick') as HTMLImageElement;
    expect(img.src).toBe('https://example.com/patrick.jpg');
  });

  it('shows "Tap to select" and aria-pressed=false when not selected', () => {
    render(<ModelCard model={makeModel({ selected: false })} onToggle={vi.fn()} />);

    expect(screen.getByText('Tap to select')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });

  it('shows "Selected" and aria-pressed=true when selected', () => {
    render(<ModelCard model={makeModel({ selected: true })} onToggle={vi.fn()} />);

    expect(screen.getByText('Selected')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onToggle with the model id when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<ModelCard model={makeModel({ id: 42 })} onToggle={onToggle} />);

    await user.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledExactlyOnceWith(42);
  });
});

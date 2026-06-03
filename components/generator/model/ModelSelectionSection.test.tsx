import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ModelSelectionSection } from './ModelSelectionSection';
import type { Model } from '@/types/types';

function makeModel(overrides: Partial<Model> = {}): Model {
  return {
    id: 1,
    name: 'Patrick',
    profilePicture: 'https://example.com/p.jpg',
    gender: 'male',
    selected: false,
    ...overrides,
  };
}

function renderSection(props: Partial<React.ComponentProps<typeof ModelSelectionSection>> = {}) {
  const defaults = {
    models: [] as Model[],
    selectedModels: [] as Model[],
    subtitle: 'Pick at least one model',
    onToggleModel: vi.fn(),
    onAddModel: vi.fn().mockResolvedValue(undefined),
    onUpdateModel: vi.fn().mockResolvedValue(undefined),
    onDeleteModel: vi.fn().mockResolvedValue(undefined),
  };
  return { ...defaults, ...props, ...render(<ModelSelectionSection {...defaults} {...props} />) };
}

describe('ModelSelectionSection', () => {
  it('shows the subtitle when not loading', () => {
    renderSection({ subtitle: 'Pick at least one model' });
    expect(screen.getByText('Pick at least one model')).toBeInTheDocument();
  });

  it('shows a loading subtitle and disables the add button while loading', () => {
    renderSection({ loading: true });
    expect(screen.getByText('Loading…')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add model/i })).toBeDisabled();
  });

  it('renders no model cards when nothing is selected and labels the button "Add model"', () => {
    renderSection({ selectedModels: [] });
    expect(screen.getByRole('button', { name: /add model/i })).toBeInTheDocument();
    expect(screen.queryByText('Tap to select')).not.toBeInTheDocument();
  });

  it('renders a card per selected model and labels the button "Change model"', () => {
    const selected = [
      makeModel({ id: 1, name: 'Patrick', selected: true }),
      makeModel({ id: 2, name: 'Gaelle', selected: true }),
    ];
    renderSection({ selectedModels: selected, models: selected });

    expect(screen.getByText('Patrick')).toBeInTheDocument();
    expect(screen.getByText('Gaelle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /change model/i })).toBeInTheDocument();
  });

  it('forwards the toggle from a selected card up to onToggleModel', async () => {
    const user = userEvent.setup();
    const onToggleModel = vi.fn();
    const selected = [makeModel({ id: 7, name: 'Patrick', selected: true })];
    renderSection({ selectedModels: selected, models: selected, onToggleModel });

    await user.click(screen.getByText('Patrick'));

    expect(onToggleModel).toHaveBeenCalledWith(7);
  });

  it('opens the management modal when the add/change button is clicked', async () => {
    const user = userEvent.setup();
    renderSection({ models: [makeModel({ name: 'Patrick' })] });

    // Modal content is not mounted while closed.
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add model/i }));

    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).getByText('Models')).toBeInTheDocument();
  });
});

import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import type { TourStep } from '../../data/tour';
import { GuidedTour } from './GuidedTour';

const steps: TourStep[] = [
  { id: 'a', title: 'Primeiro', body: 'Texto A' },
  {
    id: 'b',
    title: 'Segundo',
    body: 'Texto B',
    interactive: { hint: 'Faça isso', success: 'Feito!', done: (p) => p.get('x') === '1' },
  },
  { id: 'c', target: 'inexistente', title: 'Terceiro', body: 'Texto C' },
  { id: 'd', title: 'Quarto', body: 'Texto D' },
];

function Harness({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  return (
    <>
      <button onClick={() => navigate('/?x=1')}>agir</button>
      <GuidedTour steps={steps} index={index} onIndexChange={setIndex} onClose={onClose} />
    </>
  );
}

describe('GuidedTour', () => {
  it('guia pelos passos, espera a ação e pula passos sem alvo', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <Harness onClose={onClose} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Passo 1 de 4')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Começar' }));

    expect(screen.getByText('Faça isso')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continuar' })).toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'agir' }));
    expect(screen.getByText('Feito!')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Continuar' }));

    expect(screen.getByText('Passo 4 de 4')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Concluir' }));
    expect(onClose).toHaveBeenCalled();
  });

  it('fecha com Esc', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <MemoryRouter>
        <Harness onClose={onClose} />
      </MemoryRouter>,
    );
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

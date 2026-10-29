import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { MyVote, VoteState, VoteSummary } from '../../services/types';
import { VoteBar } from './VoteBar';

const ensureCanVote = vi.fn();
const setVote = vi.fn();
const toastError = vi.fn();

vi.mock('../../contexts/VerifyEmailContext', () => ({ useVerifyEmail: () => ({ ensureCanVote }) }));
vi.mock('../../services/voting/votingService', () => ({
  votingService: { setVote: (...args: unknown[]) => setVote(...args) },
}));
vi.mock('../common', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../common')>()),
  useToast: () => ({ success: vi.fn(), info: vi.fn(), error: toastError }),
}));

const hidden: VoteSummary = {
  charges: 0,
  chargesHidden: false,
  good: 0,
  bad: 0,
  ratingsHidden: false,
};

function renderBar(myVote: MyVote | null = null, votes: VoteSummary = hidden, onChange = vi.fn()) {
  render(
    <MemoryRouter>
      <VoteBar commitmentId="ECON-006" myVote={myVote} votes={votes} onChange={onChange} />
    </MemoryRouter>,
  );
  return onChange;
}

const state = (myVote: MyVote | null): VoteState => ({
  commitmentId: 'ECON-006',
  myVote,
  votes: hidden,
});

beforeEach(() => {
  ensureCanVote.mockReset().mockResolvedValue(true);
  setVote.mockReset();
  toastError.mockReset();
});

describe('VoteBar', () => {
  it('reflete o voto da pessoa com aria-pressed', () => {
    renderBar({ rating: 'boa', charge: true });

    expect(screen.getByRole('button', { name: 'Cobrar' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Boa proposta' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Má proposta' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('sem votos mostra as contagens zeradas', () => {
    renderBar();
    expect(
      screen.getByText(/0 cobranças, 0 avaliações boas, 0 avaliações más/),
    ).toBeInTheDocument();
  });

  it('mostra as contagens públicas', () => {
    renderBar(null, { charges: 25, chargesHidden: false, good: 12, bad: 8, ratingsHidden: false });
    expect(
      screen.getByText(/25 cobranças, 12 avaliações boas, 8 avaliações más/),
    ).toBeInTheDocument();
  });

  it('"Cobrar" grava o voto e entrega o estado ao chamador', async () => {
    setVote.mockResolvedValue(state({ rating: null, charge: true }));
    const onChange = renderBar();

    await userEvent.click(screen.getByRole('button', { name: 'Cobrar' }));

    expect(setVote).toHaveBeenCalledWith('ECON-006', { rating: null, charge: true });
    await waitFor(() =>
      expect(onChange).toHaveBeenCalledWith(state({ rating: null, charge: true })),
    );
  });

  it('clicar de novo na avaliação marcada a remove, preservando "cobrar"', async () => {
    setVote.mockResolvedValue(state({ rating: null, charge: true }));
    renderBar({ rating: 'ma', charge: true });

    await userEvent.click(screen.getByRole('button', { name: 'Má proposta' }));

    expect(setVote).toHaveBeenCalledWith('ECON-006', { rating: null, charge: true });
  });

  it('trocar a avaliação mantém o "cobrar" já marcado', async () => {
    setVote.mockResolvedValue(state({ rating: 'ma', charge: true }));
    renderBar({ rating: 'boa', charge: true });

    await userEvent.click(screen.getByRole('button', { name: 'Má proposta' }));

    expect(setVote).toHaveBeenCalledWith('ECON-006', { rating: 'ma', charge: true });
  });

  it('se a pessoa desiste de confirmar o e-mail, nada é gravado', async () => {
    ensureCanVote.mockResolvedValue(false);
    renderBar();

    await userEvent.click(screen.getByRole('button', { name: 'Cobrar' }));

    expect(setVote).not.toHaveBeenCalled();
  });

  it('mostra o erro da API (ex.: bloqueio por rajada) sem derrubar a tela', async () => {
    setVote.mockRejectedValue(new Error('falhou'));
    renderBar();

    await userEvent.click(screen.getByRole('button', { name: 'Cobrar' }));

    await waitFor(() => expect(toastError).toHaveBeenCalled());
    expect(screen.getByRole('button', { name: 'Cobrar' })).toBeEnabled();
  });
});

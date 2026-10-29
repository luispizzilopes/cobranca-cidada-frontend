import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { CommitmentSummary } from '../../services/types';
import { CommitmentCard } from './CommitmentCard';

vi.mock('../../contexts/VerifyEmailContext', () => ({
  useVerifyEmail: () => ({ ensureCanVote: vi.fn() }),
}));

const base: CommitmentSummary = {
  id: 'ECON-006',
  title: 'Pacote MEI',
  shortDescription: 'Eleva o teto do MEI.',
  area: { code: 'ECON', name: 'Economia' },
  origin: { code: 'plano-de-governo', name: 'Plano de governo' },
  status: { value: 'InProgress', label: 'Em andamento' },
  statusDate: '2026-10-26',
  date: null,
  dateKind: null,
  deadlineText: '"em 2027"',
  goalOrCondition: 'teto R$ 110 mil',
  classification: [],
  evidence: [],
  planPage: '49',
  hasPlanDetail: true,
  votes: { charges: 0, chargesHidden: false, good: 0, bad: 0, ratingsHidden: false },
  myVote: null,
};

const renderCard = (c: CommitmentSummary) =>
  render(
    <MemoryRouter>
      <CommitmentCard commitment={c} onVoteChange={() => {}} />
    </MemoryRouter>,
  );

describe('CommitmentCard', () => {
  it('mostra título como link, situação, prazo sem aspas e página do plano', () => {
    renderCard(base);

    expect(screen.getByRole('link', { name: 'Pacote MEI' })).toHaveAttribute(
      'href',
      '/compromissos/ECON-006',
    );
    expect(screen.getByText('Em andamento')).toBeInTheDocument();
    expect(screen.getByText('em 2027')).toBeInTheDocument();
    expect(screen.getByText('Plano de governo, p. 49')).toBeInTheDocument();
  });

  it('item de fora do plano é sinalizado e não aparece com página do plano', () => {
    renderCard({
      ...base,
      origin: {
        code: 'imprensa-nao-localizado-no-plano',
        name: 'Imprensa (não localizado no plano)',
      },
      planPage: null,
    });

    expect(screen.getByText('Imprensa (não localizado no plano)')).toBeInTheDocument();
    expect(screen.getByText('Não consta do texto do plano')).toBeInTheDocument();
  });

  it('a situação é exibida com texto (não só cor) e o voto é opinião separada', () => {
    renderCard({
      ...base,
      status: { value: 'Unfulfilled', label: 'Descumprido' },
      myVote: { rating: null, charge: true },
    });

    expect(screen.getByText('Descumprido')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cobrar' })).toHaveAttribute('aria-pressed', 'true');
  });
});

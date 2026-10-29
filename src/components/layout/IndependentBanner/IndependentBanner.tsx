import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { INDEPENDENT_NOTICE } from '../../../data/site';

const Bar = styled.div`
  background: var(--primary-dark);
  color: #fff;
  font-size: 0.857rem;
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px 12px;
  max-width: var(--container);
  margin: 0 auto;
  padding: 6px var(--gutter);
  text-align: center;

  a {
    color: #fff;
    font-weight: 600;
  }
  a:hover {
    color: #dbe8fb;
  }

  @media (max-width: 480px) {
    gap: 4px 8px;
    padding: 6px 12px;
    font-size: 0.75rem;

    svg {
      display: none;
    }
  }
`;

const Notice = styled.span`
  white-space: nowrap;
`;

/** Aviso fixo, no topo de todas as páginas: este site não é um canal oficial do governo. */
export function IndependentBanner() {
  return (
    <Bar role="region" aria-label="Aviso">
      <Inner>
        <Info size={16} aria-hidden="true" />
        <Notice>{INDEPENDENT_NOTICE}</Notice>
        <Link to="/metodologia">Como trabalhamos</Link>
      </Inner>
    </Bar>
  );
}

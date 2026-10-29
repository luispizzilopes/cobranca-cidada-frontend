import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { INDEPENDENT_NOTICE } from '../../../data/site';
import { Bar, Inner, Notice } from './IndependentBanner.styles';

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

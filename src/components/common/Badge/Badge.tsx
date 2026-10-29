import type { ReactNode } from 'react';
import { toneOf, type Tone } from '../../../data/statusMeta';
import { Pill } from './Badge.styles';

export function Badge({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) {
  return <Pill $tone={tone}>{children}</Pill>;
}
/** Situação de execução (editorial). O rótulo vem da API e a cor só reforça. */
export function StatusBadge({ status }: { status: { value: string; label: string } }) {
  return (
    <Badge tone={toneOf(status.value)}>
      <span className="sr-only">Situação: </span>
      {status.label}
    </Badge>
  );
}

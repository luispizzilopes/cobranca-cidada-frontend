import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { toneOf, type Tone } from '../../../data/statusMeta';

const tones: Record<Tone, ReturnType<typeof css>> = {
  neutral: css`
    background: var(--neutral-bg);
    color: var(--text);
  `,
  info: css`
    background: var(--info-bg);
    color: var(--info);
  `,
  success: css`
    background: var(--success-bg);
    color: var(--success);
  `,
  warning: css`
    background: var(--warning-bg);
    color: var(--warning);
  `,
  danger: css`
    background: var(--danger-bg);
    color: var(--danger);
  `,
  purple: css`
    background: var(--purple-bg);
    color: var(--purple);
  `,
  orange: css`
    background: var(--orange-bg);
    color: var(--orange);
  `,
};

const Pill = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  border-radius: 100em;
  border: 1px solid currentColor;
  font-size: 0.857rem;
  font-weight: 600;
  line-height: 1.4;
  ${({ $tone }) => tones[$tone]}
`;

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

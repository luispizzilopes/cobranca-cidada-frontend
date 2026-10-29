import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import styled, { css } from 'styled-components';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger';

const tones = {
  info: css`
    background: var(--info-bg);
    border-color: var(--info);
    --tone: var(--info);
  `,
  success: css`
    background: var(--success-bg);
    border-color: var(--success);
    --tone: var(--success);
  `,
  warning: css`
    background: var(--warning-bg);
    border-color: var(--warning);
    --tone: var(--warning);
  `,
  danger: css`
    background: var(--danger-bg);
    border-color: var(--danger);
    --tone: var(--danger);
  `,
};

const Box = styled.div<{ $tone: AlertTone }>`
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  margin-bottom: 16px;
  border: 1px solid;
  border-left-width: 6px;
  border-radius: var(--radius);
  ${({ $tone }) => tones[$tone]}

  svg {
    flex: none;
    color: var(--tone);
    margin-top: 2px;
  }
  p:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.strong`
  display: block;
  margin-bottom: 2px;
`;

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger: XCircle,
};

interface AlertProps {
  tone?: AlertTone;
  title?: string;
  children: ReactNode;
  /** Use "alert" para erros que surgem após uma ação; "status" para avisos neutros. */
  role?: 'alert' | 'status' | 'none';
}

export function Alert({ tone = 'info', title, children, role = 'status' }: AlertProps) {
  const Icon = icons[tone];
  return (
    <Box $tone={tone} role={role === 'none' ? undefined : role}>
      <Icon size={20} aria-hidden="true" />
      <div>
        {title && <Title>{title}</Title>}
        {children}
      </div>
    </Box>
  );
}

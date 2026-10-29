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

export const Box = styled.div<{ $tone: AlertTone }>`
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

export const Title = styled.strong`
  display: block;
  margin-bottom: 2px;
`;

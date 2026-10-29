import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

export const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Toggle = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 8px 0 16px;
  border: 1px solid var(--primary);
  border-radius: 100em;
  background: ${({ $on }) => ($on ? 'var(--primary)' : 'transparent')};
  color: ${({ $on }) => ($on ? 'var(--on-primary)' : 'var(--primary)')};
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${({ $on }) => ($on ? 'var(--primary-hover)' : 'var(--hover)')};
  }
  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
`;

export /** Contagem pública dentro do botão: o número fica junto da ação a que se refere. */
const Count = styled.span<{ $on: boolean }>`
  display: inline-grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: 100em;
  background: ${({ $on }) => ($on ? 'rgb(255 255 255 / 0.22)' : 'var(--hover)')};
  font-size: 0.857rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

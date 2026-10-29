import styled from 'styled-components';

export type ToastType = 'success' | 'error' | 'info';

export const Region = styled.div`
  position: fixed;
  z-index: 1100;
  right: 16px;
  bottom: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: none;
`;

export const Item = styled.div<{ $type: ToastType }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 420px;
  padding: 12px 16px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-left: 6px solid
    ${({ $type }) => ($type === 'success' ? 'var(--success)' : $type === 'error' ? 'var(--danger)' : 'var(--info)')};
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;

export const Close = styled.button`
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 2px;
  margin-left: auto;
`;

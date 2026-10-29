import styled from 'styled-components';

export const StyledTextarea = styled.textarea<{ $hasError: boolean }>`
  width: 100%;
  min-height: 96px;
  padding: 8px 12px;
  background: var(--surface);
  border: 1px solid ${({ $hasError }) => ($hasError ? 'var(--danger)' : 'var(--border-strong)')};
  border-radius: var(--radius);
  resize: vertical;
`;

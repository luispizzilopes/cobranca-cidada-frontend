import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
`;

export const StyledSelect = styled.select`
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
`;

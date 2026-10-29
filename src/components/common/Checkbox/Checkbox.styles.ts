import styled from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: 16px;
`;

export const Line = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-weight: 600;
  font-size: 0.875rem;

  input {
    flex: none;
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: var(--primary);
  }
`;

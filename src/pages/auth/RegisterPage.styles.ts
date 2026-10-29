import styled from 'styled-components';

export const Check = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;

  input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    flex: none;
  }
`;

export const ErrorLine = styled.p`
  margin: -8px 0 12px;
  color: var(--danger);
  font-weight: 500;
`;

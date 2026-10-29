import styled from 'styled-components';

export const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0 16px;
  color: var(--muted);
  font-size: 0.929rem;

  &::before,
  &::after {
    content: '';
    flex: 1;
    border-top: 1px solid var(--border);
  }
`;

export const Consent = styled.div`
  display: grid;
  gap: 12px;
  padding: 16px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  label {
    display: flex;
    align-items: flex-start;
    gap: 10px;
  }

  input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    flex: none;
  }
`;

export const ErrorLine = styled.p`
  margin: 0;
  color: var(--danger);
  font-weight: 500;
`;

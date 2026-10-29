import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-weight: 600;
  font-size: 0.875rem;
`;

export const Hint = styled.span`
  color: var(--muted);
  font-size: 0.875rem;
`;

export const InputContainer = styled.div`
  position: relative;
`;

export const StyledInput = styled.input<{ $hasError: boolean; $hasPasswordToggle: boolean }>`
  width: 100%;
  min-height: 40px;
  padding: 0 ${({ $hasPasswordToggle }) => ($hasPasswordToggle ? '44px' : '12px')} 0 12px;
  background: var(--surface);
  border: 1px solid ${({ $hasError }) => ($hasError ? 'var(--danger)' : 'var(--border-strong)')};
  border-radius: var(--radius);

  &::placeholder {
    color: var(--muted);
    opacity: 0.8;
  }
`;

export const PasswordToggle = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  width: 40px;
  display: grid;
  place-items: center;
  border: 0;
  background: transparent;
  color: var(--muted);
`;

export const ErrorText = styled.span`
  color: var(--danger);
  font-size: 0.875rem;
  font-weight: 500;
`;

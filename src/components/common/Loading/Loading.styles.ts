import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export const Wrapper = styled.div`
  display: grid;
  place-items: center;
  padding: 48px 0;
`;

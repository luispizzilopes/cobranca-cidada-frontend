import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.span`
  display: inline-block;
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Wrapper = styled.div`
  display: grid;
  place-items: center;
  padding: 48px 0;
`;

export function Loading({
  inline = false,
  label = 'Carregando...',
}: {
  inline?: boolean;
  label?: string;
}) {
  const spinner = <Spinner role="status" aria-label={label} />;
  return inline ? spinner : <Wrapper>{spinner}</Wrapper>;
}

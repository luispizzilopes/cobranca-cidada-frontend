import styled from 'styled-components';
import { Container } from '../Page/Page.styles';

export const Wrap = styled(Container)`
  display: grid;
  place-items: start center;
  padding-top: 40px;
  padding-bottom: 24px;
`;

export const Card = styled.form`
  width: 100%;
  max-width: 460px;
  padding: 32px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);

  h1 {
    font-size: 1.714rem;
    margin-bottom: 8px;
  }
`;

export const Subtitle = styled.p`
  color: var(--muted);
`;

export const Footer = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: grid;
  gap: 8px;
  font-size: 0.929rem;
`;

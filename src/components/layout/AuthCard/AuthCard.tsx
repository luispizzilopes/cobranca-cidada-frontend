import type { FormEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { Container } from '../Page/Page';
import { usePageTitle } from '../../../hooks/usePageTitle';

const Wrap = styled(Container)`
  display: grid;
  place-items: start center;
  padding-top: 40px;
  padding-bottom: 24px;
`;

const Card = styled.form`
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

const Subtitle = styled.p`
  color: var(--muted);
`;

const Footer = styled.div`
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  display: grid;
  gap: 8px;
  font-size: 0.929rem;
`;

interface AuthCardProps {
  title: string;
  subtitle?: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  footer?: ReactNode;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, onSubmit, footer, children }: AuthCardProps) {
  usePageTitle(title);
  return (
    <Wrap>
      <Card onSubmit={onSubmit} noValidate aria-labelledby="auth-title">
        <h1 id="auth-title">{title}</h1>
        {subtitle && <Subtitle>{subtitle}</Subtitle>}
        {children}
        {footer && <Footer>{footer}</Footer>}
      </Card>
    </Wrap>
  );
}

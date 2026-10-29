import type { FormEvent, ReactNode } from 'react';
import { usePageTitle } from '../../../hooks/usePageTitle';
import { Card, Footer, Subtitle, Wrap } from './AuthCard.styles';

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

import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Container, Crumbs, PageTitle } from './Page.styles';

export interface Crumb {
  label: string;
  to?: string;
}
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <Crumbs aria-label="Você está em">
      <ol>
        {items.map((item, index) => (
          <li key={item.label}>
            {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
            {item.to ? (
              <Link to={item.to}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </Crumbs>
  );
}
export function Page({
  crumbs,
  title,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  children: ReactNode;
}) {
  return (
    <Container>
      <Breadcrumb items={crumbs} />
      <PageTitle>{title}</PageTitle>
      {children}
    </Container>
  );
}

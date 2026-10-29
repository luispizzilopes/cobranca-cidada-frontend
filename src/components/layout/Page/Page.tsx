import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Container = styled.div`
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
`;

const Crumbs = styled.nav`
  padding: 16px 0 8px;
  font-size: 0.929rem;

  ol {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
  [aria-current='page'] {
    color: var(--muted);
  }
`;

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

export const PageTitle = styled.h1`
  margin: 8px 0 16px;
  font-size: 2rem;
  line-height: 1.15;
`;

export const Section = styled.section`
  margin-bottom: 32px;
`;

export const SectionTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 1.429rem;
`;

export const Panel = styled.div`
  padding: 20px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
`;

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

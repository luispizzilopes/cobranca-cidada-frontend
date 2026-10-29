import { ChevronLeft, ChevronRight } from 'lucide-react';
import styled from 'styled-components';

const Nav = styled.nav`
  margin: 24px 0;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const PageButton = styled.button<{ $current?: boolean }>`
  display: grid;
  place-items: center;
  min-width: 40px;
  height: 40px;
  padding: 0 8px;
  border: 1px solid ${({ $current }) => ($current ? 'var(--primary)' : 'transparent')};
  border-radius: 50%;
  background: ${({ $current }) => ($current ? 'var(--primary)' : 'transparent')};
  color: ${({ $current }) => ($current ? 'var(--on-primary)' : 'var(--primary)')};
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${({ $current }) => ($current ? 'var(--primary-hover)' : 'var(--hover)')};
  }
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Gap = styled.span`
  padding: 0 4px;
  color: var(--muted);
`;

export function pageWindow(current: number, total: number): (number | 'gap')[] {
  const pages = new Set([1, total, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | 'gap')[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) result.push('gap');
    result.push(page);
  });
  return result;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <Nav aria-label="Paginação">
      <List>
        <li>
          <PageButton
            type="button"
            disabled={page <= 1}
            onClick={() => onChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </PageButton>
        </li>
        {pageWindow(page, totalPages).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden="true">
              <Gap>…</Gap>
            </li>
          ) : (
            <li key={item}>
              <PageButton
                type="button"
                $current={item === page}
                onClick={() => onChange(item)}
                aria-label={`Página ${item}`}
                aria-current={item === page ? 'page' : undefined}
              >
                {item}
              </PageButton>
            </li>
          ),
        )}
        <li>
          <PageButton
            type="button"
            disabled={page >= totalPages}
            onClick={() => onChange(page + 1)}
            aria-label="Próxima página"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </PageButton>
        </li>
      </List>
    </Nav>
  );
}

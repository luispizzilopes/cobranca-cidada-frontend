import styled from 'styled-components';

export const Nav = styled.nav`
  margin: 24px 0;
`;

export const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const PageButton = styled.button<{ $current?: boolean }>`
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

export const Gap = styled.span`
  padding: 0 4px;
  color: var(--muted);
`;

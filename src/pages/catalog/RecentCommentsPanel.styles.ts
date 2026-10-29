import styled from 'styled-components';

export const List = styled.ul`
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    gap: 6px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  > li:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

export const Quote = styled.blockquote`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  padding-left: 12px;
  border-left: 3px solid var(--border-strong);
  overflow-wrap: anywhere;
`;

export const Meta = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.857rem;
`;

export const Note = styled.p`
  margin: 0;
  color: var(--muted);
`;

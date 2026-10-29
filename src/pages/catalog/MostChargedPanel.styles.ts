import styled from 'styled-components';

export const List = styled.ol`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: rank;

  > li {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 8px;
    counter-increment: rank;
  }

  > li::before {
    content: counter(rank);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--on-primary);
    font-weight: 700;
  }
`;

export const Counts = styled.div`
  margin-top: 6px;
`;

export const Note = styled.p`
  margin: 0;
  color: var(--muted);
`;

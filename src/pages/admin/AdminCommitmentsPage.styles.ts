import styled from 'styled-components';

export const Filters = styled.form`
  display: grid;
  gap: 0 12px;
  margin-bottom: 16px;
  padding: 16px 20px 4px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  @media (min-width: 700px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .wide {
    @media (min-width: 700px) {
      grid-column: 1 / -1;
    }
  }
  select {
    margin-bottom: 16px;
  }
`;

export const List = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const Row = styled.li`
  display: grid;
  gap: 6px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  h3 {
    margin: 0;
    font-size: 1rem;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: center;
    color: var(--muted);
    font-size: 0.857rem;
  }
`;

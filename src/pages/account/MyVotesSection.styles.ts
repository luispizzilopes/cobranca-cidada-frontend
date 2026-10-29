import styled from 'styled-components';

export const List = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0 0 20px;
  padding: 0;
  list-style: none;

  li {
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  small {
    display: block;
    color: var(--muted);
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

export const Toolbar = styled(Actions)`
  padding-top: 16px;
  border-top: 1px solid var(--border);
`;

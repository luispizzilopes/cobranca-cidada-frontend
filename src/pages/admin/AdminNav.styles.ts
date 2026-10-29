import styled from 'styled-components';

export const Nav = styled.nav`
  margin-bottom: 20px;
  border-bottom: 1px solid var(--border);

  ul {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  a {
    display: block;
    padding: 8px 16px;
    color: var(--text);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 4px solid transparent;
  }

  a:hover {
    background: var(--hover);
  }

  a[aria-current='page'] {
    color: var(--primary);
    border-bottom-color: var(--primary);
  }
`;

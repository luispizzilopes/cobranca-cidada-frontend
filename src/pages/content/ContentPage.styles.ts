import styled from 'styled-components';

export const Article = styled.article`
  max-width: 920px;
  padding-bottom: 24px;

  h1 {
    margin: 8px 0 16px;
    font-size: 2rem;
  }
  h2 {
    margin-top: 32px;
    font-size: 1.571rem;
  }
  h3 {
    margin-top: 24px;
    font-size: 1.286rem;
  }
  li {
    margin-bottom: 4px;
  }
  hr {
    border: 0;
    border-top: 1px solid var(--border);
    margin: 24px 0;
  }

  .table-scroll {
    overflow-x: auto;
    margin-bottom: 16px;
  }
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 0.929rem;
  }
  th,
  td {
    padding: 8px 12px;
    border: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
  }
  th {
    background: var(--bg-alt);
  }
`;

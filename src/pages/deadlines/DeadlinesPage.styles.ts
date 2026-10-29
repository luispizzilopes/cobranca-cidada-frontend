import styled from 'styled-components';

export const Banner = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: var(--hero-bg);
  color: var(--hero-text);
  border-radius: var(--radius-lg);
  border-bottom: 6px solid var(--yellow);
`;

export const Year = styled.ol`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0 0 0 20px;
  list-style: none;
  border-left: 4px solid var(--green);

  li {
    padding: 8px 12px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  small {
    display: block;
    color: var(--muted);
  }
`;

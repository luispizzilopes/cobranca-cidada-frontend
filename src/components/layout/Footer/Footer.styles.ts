import styled from 'styled-components';

export const Wrapper = styled.footer`
  margin-top: 48px;
  background: var(--footer-bg);
  color: var(--footer-text);
  border-top: 6px solid transparent;
  border-image: var(--stripe) 1;

  a {
    color: var(--footer-text);
  }
  a:hover {
    color: #dbe8fb;
  }
`;

export const Inner = styled.div`
  display: grid;
  gap: 32px;
  max-width: var(--container);
  margin: 0 auto;
  padding: 40px var(--gutter);

  @media (min-width: 800px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

export const Heading = styled.h2`
  margin: 0 0 12px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
`;

export const Legal = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding: 16px var(--gutter);
  text-align: center;
  font-size: 0.857rem;
`;

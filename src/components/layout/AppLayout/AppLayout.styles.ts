import styled from 'styled-components';

export const Shell = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
`;

export const Main = styled.main`
  flex: 1;
  outline: none;
`;

export const SkipLinks = styled.nav`
  a {
    position: absolute;
    left: 8px;
    top: -100px;
    z-index: 2000;
    padding: 8px 16px;
    background: var(--primary);
    color: var(--on-primary);
    font-weight: 600;
  }

  a:focus {
    top: 8px;
  }
`;

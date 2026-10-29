import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { VerifyEmailProvider } from '../../../contexts/VerifyEmailContext';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { IndependentBanner } from '../IndependentBanner/IndependentBanner';

const Shell = styled.div`
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--bg);
`;

const Main = styled.main`
  flex: 1;
  outline: none;
`;

const SkipLinks = styled.nav`
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

export function AppLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <VerifyEmailProvider>
      <Shell>
        <SkipLinks aria-label="Atalhos">
          <a href="#conteudo">Ir para o conteúdo</a>
          <a href="#menu-principal">Ir para o menu</a>
          <a href="#busca-global">Ir para a busca</a>
        </SkipLinks>
        <IndependentBanner />
        <Header />
        <Main id="conteudo" ref={mainRef} tabIndex={-1}>
          <Outlet />
        </Main>
        <Footer />
      </Shell>
    </VerifyEmailProvider>
  );
}

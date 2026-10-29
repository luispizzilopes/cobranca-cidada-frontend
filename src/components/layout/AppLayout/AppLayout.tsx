import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { VerifyEmailProvider } from '../../../contexts/VerifyEmailContext';
import { Footer } from '../Footer/Footer';
import { Header } from '../Header/Header';
import { IndependentBanner } from '../IndependentBanner/IndependentBanner';
import { Main, Shell, SkipLinks } from './AppLayout.styles';

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

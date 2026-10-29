import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useSession } from '../../../contexts/SessionContext';
import { INDEPENDENT_NOTICE, SITE_NAME } from '../../../data/site';

const Wrapper = styled.footer`
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

const Inner = styled.div`
  display: grid;
  gap: 32px;
  max-width: var(--container);
  margin: 0 auto;
  padding: 40px var(--gutter);

  @media (min-width: 800px) {
    grid-template-columns: 2fr 1fr 1fr;
  }
`;

const Heading = styled.h2`
  margin: 0 0 12px;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const List = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
`;

const Legal = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.25);
  padding: 16px var(--gutter);
  text-align: center;
  font-size: 0.857rem;
`;

export function Footer() {
  const { kind } = useSession();
  return (
    <Wrapper>
      <Inner>
        <div>
          <Heading>{SITE_NAME}</Heading>
          <p>
            Promessa de campanha é compromisso. Aqui cada promessa do presidente Lula é conferida em
            fonte pública, para mostrar o que saiu do papel, o que está em andamento e o que ficou
            pelo caminho.
          </p>
          <p>
            <strong>{INDEPENDENT_NOTICE}</strong> Sem brasão, sem marca oficial: quem cobra aqui é o
            cidadão.
          </p>
        </div>
        <nav aria-label="Informações">
          <Heading>Transparência</Heading>
          <List>
            <li>
              <Link to="/metodologia">Metodologia</Link>
            </li>
            <li>
              <Link to="/limitacoes">Limitações</Link>
            </li>
            <li>
              <Link to="/prazos">Prazos</Link>
            </li>
          </List>
        </nav>
        <nav aria-label="Privacidade e conta">
          <Heading>Você</Heading>
          <List>
            <li>
              <Link to="/privacidade">Política de privacidade</Link>
            </li>
            <li>
              <Link to="/conta">Meus dados e votos</Link>
            </li>
            {kind === 'anonymous' && (
              <li>
                <Link to="/entrar">Entrar</Link>
              </li>
            )}
          </List>
        </nav>
      </Inner>
      <Legal>
        Voto é opinião, não pesquisa. O que vale para dizer se uma promessa foi cumprida é a fonte.
      </Legal>
    </Wrapper>
  );
}

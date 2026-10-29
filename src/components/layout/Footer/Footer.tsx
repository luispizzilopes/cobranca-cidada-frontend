import { Link } from 'react-router-dom';
import { useSession } from '../../../contexts/SessionContext';
import { INDEPENDENT_NOTICE, SITE_NAME } from '../../../data/site';
import { Heading, Inner, Legal, List, Wrapper } from './Footer.styles';

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

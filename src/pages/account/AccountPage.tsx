import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Alert, Button, LinkButton, Loading } from '../../components/common';
import { Page, Panel, SectionTitle } from '../../components/layout/Page/Page';
import { useSession } from '../../contexts/SessionContext';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useProfile } from '../../hooks/useProfile';
import { useMyVotes } from '../../hooks/useMyVotes';
import { authService } from '../../services/auth/authService';
import { ChangePasswordSection } from './ChangePasswordSection';
import { DeleteAccountSection } from './DeleteAccountSection';
import { MyVotesSection } from './MyVotesSection';

const Layout = styled.div`
  display: grid;
  gap: 24px;
  align-items: start;
  grid-template-areas: 'account' 'votes' 'password' 'delete';

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) 360px;
    grid-template-areas:
      'votes account'
      'votes password'
      'votes delete'
      'votes .';
    grid-template-rows: auto auto auto 1fr;
  }
`;

const Area = styled.div<{ $name: string }>`
  grid-area: ${({ $name }) => $name};
  min-width: 0;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

const Avatar = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 1.5rem;
  font-weight: 700;
`;

const Identity = styled.div`
  min-width: 0;

  strong,
  span {
    display: block;
    overflow-wrap: anywhere;
  }
  span {
    color: var(--muted);
  }
`;

export function AccountPage() {
  usePageTitle('Meus dados e votos');
  const navigate = useNavigate();
  const { kind, user, ready, forgetVoter } = useSession();
  const votes = useMyVotes(kind !== 'anonymous');
  const { profile, loaded: profileLoaded } = useProfile(ready && kind === 'account');
  const [leaving, setLeaving] = useState(false);
  const hasPassword = profile?.hasPassword ?? true;

  const crumbs = [{ label: 'Compromissos', to: '/' }, { label: 'Meus dados e votos' }];

  if (!ready) {
    return (
      <Page crumbs={crumbs} title="Meus dados e votos">
        <Loading />
      </Page>
    );
  }

  if (kind === 'anonymous') {
    return (
      <Page crumbs={crumbs} title="Meus dados e votos">
        <Alert tone="info" title="Você ainda não votou neste navegador">
          <p>
            Para ver, exportar ou apagar seus votos, confirme seu e-mail ao votar em algum
            compromisso ou entre na sua conta.
          </p>
        </Alert>
        <LinkButton to="/">Ver compromissos</LinkButton>{' '}
        <LinkButton to="/entrar" variant="secondary">
          Entrar
        </LinkButton>
      </Page>
    );
  }

  async function logout() {
    setLeaving(true);
    try {
      await authService.logout();
    } finally {
      navigate('/', { replace: true });
    }
  }

  return (
    <Page crumbs={crumbs} title="Meus dados e votos">
      <Layout>
        <Area $name="account">
          {kind === 'account' ? (
            <Panel>
              <Profile>
                <Avatar aria-hidden="true">
                  {(user?.name ?? user?.email ?? '?').charAt(0).toUpperCase()}
                </Avatar>
                <Identity>
                  <SectionTitle as="h2" style={{ margin: 0, fontSize: '1.143rem' }}>
                    {user?.name}
                  </SectionTitle>
                  <span>{user?.email}</span>
                  {profile?.googleLinked && <span>Entra também com o Google</span>}
                </Identity>
              </Profile>
              <Button variant="secondary" size="sm" loading={leaving} onClick={() => void logout()}>
                Sair
              </Button>
            </Panel>
          ) : (
            <Alert tone="info" title="Você está votando só com e-mail verificado">
              <p>
                Não há conta nem senha. Seus votos ficam ligados a uma chave derivada do seu e-mail,
                nunca ao e-mail em si. Se preferir, <Link to="/cadastro">crie uma conta</Link> com o
                mesmo e-mail e seus votos serão mantidos.
              </p>
              <Button variant="secondary" size="sm" onClick={forgetVoter}>
                Sair deste navegador
              </Button>
            </Alert>
          )}
        </Area>

        <Area $name="votes">
          <MyVotesSection {...votes} voterOnly={kind === 'voter'} />
        </Area>

        {kind === 'account' && (
          <>
            <Area $name="password">
              {profileLoaded && <ChangePasswordSection hasPassword={hasPassword} />}
            </Area>
            <Area $name="delete">
              {profileLoaded && <DeleteAccountSection hasPassword={hasPassword} />}
            </Area>
          </>
        )}
      </Layout>
    </Page>
  );
}

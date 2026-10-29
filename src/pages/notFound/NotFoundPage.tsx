import { LinkButton } from '../../components/common';
import { Page } from '../../components/layout/Page/Page';
import { usePageTitle } from '../../hooks/usePageTitle';

export function NotFoundPage() {
  usePageTitle('Página não encontrada', { noindex: true });
  return (
    <Page
      crumbs={[{ label: 'Compromissos', to: '/' }, { label: 'Página não encontrada' }]}
      title="Página não encontrada"
    >
      <p>O endereço que você abriu não existe ou foi movido.</p>
      <LinkButton to="/">Ver compromissos</LinkButton>
    </Page>
  );
}

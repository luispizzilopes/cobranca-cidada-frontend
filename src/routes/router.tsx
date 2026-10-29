import { lazy, Suspense, type ReactNode } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { Loading, RouteErrorFallback } from '../components/common';
import { AppLayout } from '../components/layout/AppLayout/AppLayout';
import { RequireAdmin } from '../components/layout/RequireAdmin/RequireAdmin';
import { AccountPage } from '../pages/account/AccountPage';
import { ForgotPasswordPage } from '../pages/auth/ForgotPasswordPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { CatalogPage } from '../pages/catalog/CatalogPage';
import { CommitmentPage } from '../pages/commitment/CommitmentPage';
import { DeadlinesPage } from '../pages/deadlines/DeadlinesPage';
import { NotFoundPage } from '../pages/notFound/NotFoundPage';
import limitacoes from '../content/limitacoes.md?raw';
import metodologia from '../content/metodologia.md?raw';
import privacidade from '../content/privacidade.md?raw';

const ContentPage = lazy(() =>
  import('../pages/content/ContentPage').then((m) => ({ default: m.ContentPage })),
);

const AdminCommitmentsPage = lazy(() =>
  import('../pages/admin/AdminCommitmentsPage').then((m) => ({ default: m.AdminCommitmentsPage })),
);
const AdminCommitmentPage = lazy(() =>
  import('../pages/admin/AdminCommitmentPage').then((m) => ({ default: m.AdminCommitmentPage })),
);
const AdminNewCommitmentPage = lazy(() =>
  import('../pages/admin/AdminNewCommitmentPage').then((m) => ({
    default: m.AdminNewCommitmentPage,
  })),
);
const AdminCatalogPage = lazy(() =>
  import('../pages/admin/AdminCatalogPage').then((m) => ({ default: m.AdminCatalogPage })),
);

function Admin({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}

function Content({ title, markdown }: { title: string; markdown: string }) {
  return (
    <Suspense fallback={<Loading />}>
      <ContentPage title={title} markdown={markdown} />
    </Suspense>
  );
}

export const routes = [
  {
    element: <AppLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      { path: '/', element: <CatalogPage /> },
      { path: '/compromissos/:id', element: <CommitmentPage /> },
      { path: '/prazos', element: <DeadlinesPage /> },
      { path: '/metodologia', element: <Content title="Metodologia" markdown={metodologia} /> },
      { path: '/limitacoes', element: <Content title="Limitações" markdown={limitacoes} /> },
      {
        path: '/privacidade',
        element: <Content title="Política de privacidade" markdown={privacidade} />,
      },
      { path: '/entrar', element: <LoginPage /> },
      { path: '/cadastro', element: <RegisterPage /> },
      { path: '/esqueci-a-senha', element: <ForgotPasswordPage /> },
      { path: '/conta', element: <AccountPage /> },
      {
        element: <RequireAdmin />,
        children: [
          {
            path: '/admin',
            element: (
              <Admin>
                <AdminCommitmentsPage />
              </Admin>
            ),
          },
          {
            path: '/admin/compromissos/novo',
            element: (
              <Admin>
                <AdminNewCommitmentPage />
              </Admin>
            ),
          },
          {
            path: '/admin/compromissos/:id',
            element: (
              <Admin>
                <AdminCommitmentPage />
              </Admin>
            ),
          },
          {
            path: '/admin/catalogo',
            element: (
              <Admin>
                <AdminCatalogPage />
              </Admin>
            ),
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);

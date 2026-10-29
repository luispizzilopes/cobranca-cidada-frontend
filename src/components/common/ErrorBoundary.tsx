import { Component, type ErrorInfo, type ReactNode } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Container } from '../layout/Page/Page.styles';
import { Alert } from './Alert/Alert';
import { Button } from './Button/Button';

function Fallback({ onRetry }: { onRetry: () => void }) {
  return (
    <Container>
      <h1>Algo deu errado</h1>
      <Alert tone="danger" role="alert">
        Ocorreu um erro inesperado ao exibir esta página.
      </Alert>
      <Button onClick={onRetry}>Recarregar</Button>
    </Container>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }

  render() {
    return this.state.failed ? (
      <Fallback onRetry={() => window.location.reload()} />
    ) : (
      this.props.children
    );
  }
}

export function RouteErrorFallback() {
  const error = useRouteError();
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <Container>
        <h1>Página não encontrada</h1>
        <p>O endereço que você abriu não existe.</p>
        <Button onClick={() => window.location.assign('/')}>Ir para o início</Button>
      </Container>
    );
  }
  return <Fallback onRetry={() => window.location.reload()} />;
}

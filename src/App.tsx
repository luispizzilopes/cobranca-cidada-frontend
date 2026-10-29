import { ErrorBoundary, ToastProvider } from './components/common';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import GlobalStyle from './globalStyle';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <GlobalStyle />
      <ToastProvider>
        <ErrorBoundary>
          <SessionProvider>
            <AppRoutes />
          </SessionProvider>
        </ErrorBoundary>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

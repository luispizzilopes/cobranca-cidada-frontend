import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, FormError, Input } from '../../components/common';
import { GoogleAuthSection } from '../../components/auth/GoogleAuthSection';
import { AuthCard } from '../../components/layout/AuthCard/AuthCard';
import { useRedirectIfSignedIn } from '../../hooks/useRedirectIfSignedIn';
import { authService } from '../../services/auth/authService';
import { extractApiError } from '../../utils/apiError';
import { EMAIL_PATTERN, safeRedirect } from '../../utils/password';

export function LoginPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const markSubmitting = useRedirectIfSignedIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const next = {
      email: EMAIL_PATTERN.test(email.trim()) ? '' : 'Informe um e-mail válido.',
      password: password ? '' : 'Informe a senha.',
    };
    setErrors(next);
    setError(null);
    if (next.email || next.password) return;

    setLoading(true);
    try {
      markSubmitting();
      await authService.login(email.trim(), password);
      navigate(safeRedirect(params.get('voltar')), { replace: true });
    } catch (err) {
      setError(extractApiError(err, { on401: 'E-mail ou senha inválidos.' }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthCard
      title="Entrar"
      subtitle="Use sua conta para guardar suas cobranças e opiniões."
      onSubmit={submit}
      footer={
        <>
          <span>
            Não tem conta? <Link to="/cadastro">Criar conta</Link>
          </span>
          <span>
            Só quer votar? Você não precisa de conta: ao votar, basta{' '}
            <Link to="/">confirmar seu e-mail</Link>.
          </span>
        </>
      }
    >
      <FormError message={error} />
      <Input
        id="email"
        label="E-mail"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <Input
        id="senha"
        label="Senha"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <p>
        <Link to="/esqueci-a-senha">Esqueci minha senha</Link>
      </p>
      <Button type="submit" fullWidth loading={loading}>
        Entrar
      </Button>
      <GoogleAuthSection text="signin_with" markSubmitting={markSubmitting} />
    </AuthCard>
  );
}

import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, FormError, Input, LinkButton } from '../../components/common';
import { AuthCard } from '../../components/layout/AuthCard/AuthCard';
import { authService } from '../../services/auth/authService';
import { extractApiError } from '../../utils/apiError';
import { EMAIL_PATTERN, PASSWORD_HINT, passwordError } from '../../utils/password';

export function ForgotPasswordPage() {
  const [step, setStep] = useState<'email' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!EMAIL_PATTERN.test(email.trim())) {
      setErrors({ email: 'Informe um e-mail válido.' });
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await authService.requestPasswordReset(email.trim());
      setStep('reset');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function reset(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const next: Record<string, string> = {};
    if (!/^[0-9]{6}$/.test(code.trim())) next.code = 'O código tem 6 números.';
    const pwd = passwordError(password);
    if (pwd) next.password = pwd;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      await authService.confirmPasswordReset({
        email: email.trim(),
        code: code.trim(),
        newPassword: password,
      });
      setStep('done');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  if (step === 'done') {
    return (
      <AuthCard title="Senha alterada" onSubmit={(e) => e.preventDefault()}>
        <Alert tone="success">
          Sua senha foi alterada e as outras sessões foram encerradas. Entre com a nova senha.
        </Alert>
        <LinkButton to="/entrar" fullWidth>
          Entrar
        </LinkButton>
      </AuthCard>
    );
  }

  if (step === 'email') {
    return (
      <AuthCard
        title="Recuperar senha"
        subtitle="Informe o e-mail da conta. Se ela existir, enviaremos um código."
        onSubmit={sendCode}
        footer={<Link to="/entrar">Voltar para o login</Link>}
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
        <Button type="submit" fullWidth loading={loading}>
          Enviar código
        </Button>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Definir nova senha"
      subtitle={`Se existe uma conta para ${email.trim()}, enviamos um código de 6 números. Ele vale por 15 minutos.`}
      onSubmit={reset}
      footer={
        <Button variant="ghost" size="sm" onClick={() => setStep('email')}>
          Pedir outro código
        </Button>
      }
    >
      <FormError message={error} />
      <Input
        id="codigo"
        label="Código de verificação"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={6}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        error={errors.code}
      />
      <Input
        id="nova-senha"
        label="Nova senha"
        type="password"
        autoComplete="new-password"
        hint={PASSWORD_HINT}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Button type="submit" fullWidth loading={loading}>
        Alterar senha
      </Button>
    </AuthCard>
  );
}

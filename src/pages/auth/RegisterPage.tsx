import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Button, FormError, Input } from '../../components/common';
import { GoogleAuthSection } from '../../components/auth/GoogleAuthSection';
import { AuthCard } from '../../components/layout/AuthCard/AuthCard';
import { useRedirectIfSignedIn } from '../../hooks/useRedirectIfSignedIn';
import { authService } from '../../services/auth/authService';
import { extractApiError } from '../../utils/apiError';
import { EMAIL_PATTERN, PASSWORD_HINT, passwordError, safeRedirect } from '../../utils/password';

const Check = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 16px;

  input {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    flex: none;
  }
`;

const ErrorLine = styled.p`
  margin: -8px 0 12px;
  color: var(--danger);
  font-weight: 500;
`;

export function RegisterPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const markSubmitting = useRedirectIfSignedIn();
  const [step, setStep] = useState<'email' | 'details'>('email');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
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
      await authService.requestRegistrationCode(email.trim());
      setStep('details');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function register(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const next: Record<string, string> = {};
    if (!name.trim()) next.name = 'Informe seu nome.';
    if (!/^[0-9]{6}$/.test(code.trim())) next.code = 'O código tem 6 números.';
    const pwd = passwordError(password);
    if (pwd) next.password = pwd;
    if (!consent) next.consent = 'É preciso aceitar a política de privacidade para criar a conta.';
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setLoading(true);
    try {
      markSubmitting();
      await authService.register({
        name: name.trim(),
        email: email.trim(),
        password,
        code: code.trim(),
        acceptedPrivacyPolicy: true,
      });
      navigate(safeRedirect(params.get('voltar')), { replace: true });
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  const footer = (
    <span>
      Já tem conta? <Link to="/entrar">Entrar</Link>
    </span>
  );

  if (step === 'email') {
    return (
      <AuthCard
        title="Criar conta"
        subtitle="Primeiro confirmamos que o e-mail é seu, com um código."
        onSubmit={sendCode}
        footer={footer}
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
        <GoogleAuthSection text="signup_with" markSubmitting={markSubmitting} />
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Concluir cadastro"
      subtitle={`Enviamos um código de 6 números para ${email.trim()}. Ele vale por 15 minutos.`}
      onSubmit={register}
      footer={
        <>
          {footer}
          <span>
            <Button variant="ghost" size="sm" onClick={() => setStep('email')}>
              Trocar e-mail
            </Button>
          </span>
        </>
      }
    >
      <FormError message={error} />
      <Input
        id="nome"
        label="Nome"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
      />
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
        id="senha"
        label="Senha"
        type="password"
        autoComplete="new-password"
        hint={PASSWORD_HINT}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />
      <Check htmlFor="consentimento">
        <input
          id="consentimento"
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          aria-describedby={errors.consent ? 'consentimento-erro' : undefined}
        />
        <span>
          Li e aceito a{' '}
          <Link to="/privacidade" target="_blank">
            política de privacidade
          </Link>
          . Sei que minhas opiniões são dados sensíveis e que posso exportar ou apagar tudo quando
          quiser.
        </span>
      </Check>
      {errors.consent && <ErrorLine id="consentimento-erro">{errors.consent}</ErrorLine>}
      <Button type="submit" fullWidth loading={loading}>
        Criar conta
      </Button>
    </AuthCard>
  );
}

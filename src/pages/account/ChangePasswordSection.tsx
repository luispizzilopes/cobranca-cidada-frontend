import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, FormError, Input } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page';
import { authService } from '../../services/auth/authService';
import { extractApiError } from '../../utils/apiError';
import { PASSWORD_HINT, passwordError } from '../../utils/password';

export function ChangePasswordSection({ hasPassword }: { hasPassword: boolean }) {
  const navigate = useNavigate();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const found: Record<string, string> = {};
    if (!current) found.current = 'Informe sua senha atual.';
    const weak = passwordError(next);
    if (weak) found.next = weak;
    else if (next === current) found.next = 'A nova senha deve ser diferente da atual.';
    if (confirmation !== next) found.confirmation = 'A confirmação não confere com a nova senha.';
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      await authService.changePassword(current, next);
      navigate('/entrar', { replace: true });
    } catch (err) {
      setError(extractApiError(err, { on401: 'Senha atual incorreta.' }));
    } finally {
      setLoading(false);
    }
  }

  if (!hasPassword) {
    return (
      <Panel as="div">
        <SectionTitle id="alterar-senha">Senha</SectionTitle>
        <Alert tone="info">
          Sua conta entra com o Google e não tem senha. Se quiser entrar também com e-mail e senha,
          crie uma em <Link to="/esqueci-a-senha">Esqueci minha senha</Link>: enviamos um código ao
          seu e-mail.
        </Alert>
      </Panel>
    );
  }

  return (
    <Panel as="div">
      <SectionTitle id="alterar-senha">Alterar senha</SectionTitle>
      <form onSubmit={submit} noValidate>
        <p>
          Por segurança, depois da troca você precisará entrar de novo em todos os dispositivos.
        </p>
        <FormError message={error} />
        <Input
          id="senha-atual-troca"
          label="Senha atual"
          type="password"
          autoComplete="current-password"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          error={errors.current}
        />
        <Input
          id="nova-senha"
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          hint={PASSWORD_HINT}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          error={errors.next}
        />
        <Input
          id="confirmar-nova-senha"
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          error={errors.confirmation}
        />
        <Button type="submit" loading={loading}>
          Alterar senha
        </Button>
      </form>
    </Panel>
  );
}

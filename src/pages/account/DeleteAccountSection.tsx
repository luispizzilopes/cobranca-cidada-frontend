import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, FormError, Input, Modal } from '../../components/common';
import { GoogleSignInButton } from '../../components/auth/GoogleSignInButton';
import { Panel, SectionTitle } from '../../components/layout/Page/Page.styles';
import { googleClientId } from '../../data/domains';
import { authService, type IdentityProof } from '../../services/auth/authService';
import { extractApiError } from '../../utils/apiError';

export function DeleteAccountSection({ hasPassword }: { hasPassword: boolean }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function removeWith(proof: IdentityProof, on401: string) {
    setError(null);
    setLoading(true);
    try {
      await authService.deleteAccount(proof);
      navigate('/', { replace: true });
    } catch (err) {
      setError(extractApiError(err, { on401 }));
    } finally {
      setLoading(false);
    }
  }

  function remove(event: FormEvent) {
    event.preventDefault();
    if (!password) {
      setError('Informe sua senha para confirmar.');
      return;
    }
    void removeWith({ password }, 'Senha incorreta.');
  }

  return (
    <Panel as="div" style={{ borderColor: 'var(--danger)' }}>
      <SectionTitle id="excluir-conta">Excluir conta</SectionTitle>
      <p>
        Apaga seu cadastro, suas sessões e todos os votos ligados ao seu e-mail. Não é possível
        desfazer.
      </p>
      <Button variant="danger" onClick={() => setOpen(true)}>
        Excluir minha conta
      </Button>

      {open && (
        <Modal title="Excluir conta" onClose={() => setOpen(false)}>
          <form onSubmit={remove} noValidate>
            <Alert tone="warning">Todos os seus votos serão apagados junto com a conta.</Alert>
            <FormError message={error} />
            {hasPassword ? (
              <>
                <Input
                  id="senha-exclusao"
                  data-autofocus
                  label="Confirme sua senha"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="danger" loading={loading}>
                  Excluir definitivamente
                </Button>{' '}
              </>
            ) : googleClientId ? (
              <>
                <p>
                  Sua conta entra com o Google e não tem senha. Confirme com o Google para excluir
                  definitivamente.
                </p>
                <GoogleSignInButton
                  text="continue_with"
                  onCredential={(googleCredential) =>
                    void removeWith(
                      { googleCredential },
                      'Não foi possível confirmar com o Google.',
                    )
                  }
                />
              </>
            ) : (
              <p>
                Sua conta não tem senha e o login com o Google não está disponível agora. Crie uma
                senha em “Esqueci minha senha” para poder excluir a conta.
              </p>
            )}
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
          </form>
        </Modal>
      )}
    </Panel>
  );
}

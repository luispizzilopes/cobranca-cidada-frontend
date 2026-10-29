import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Button, FormError, Input, Modal, useToast } from '../common';
import { votingService } from '../../services/voting/votingService';
import { extractApiError } from '../../utils/apiError';

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const Aside = styled.p`
  margin: 16px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 0.929rem;
  color: var(--muted);
`;

const LinkButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: var(--link);
  text-decoration: underline;
  font-weight: 600;
`;

const RESEND_SECONDS = 60;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  onVerified: () => void;
  onDismiss: () => void;
}

/** Votar só com e-mail verificado: a pessoa confirma a caixa postal com um código, sem criar conta nem senha. */
export function VerifyEmailDialog({ onVerified, onDismiss }: Props) {
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((n) => n - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function sendCode() {
    setError(null);
    if (!EMAIL_PATTERN.test(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }
    setLoading(true);
    try {
      await votingService.requestVoterCode(email.trim());
      setStep('code');
      setCode('');
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  async function confirm() {
    setError(null);
    if (!/^[0-9]{6}$/.test(code.trim())) {
      setError('O código tem 6 números.');
      return;
    }
    setLoading(true);
    try {
      await votingService.verifyVoterCode(email.trim(), code.trim());
      toast.success('E-mail confirmado. Você já pode votar.');
      onVerified();
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  function goToLogin() {
    onDismiss();
    navigate(`/entrar?voltar=${encodeURIComponent(location.pathname + location.search)}`);
  }

  return (
    <Modal title="Confirme seu e-mail para votar" onClose={onDismiss}>
      {step === 'email' ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void sendCode();
          }}
          noValidate
        >
          <p>
            Você não precisa criar conta. Enviamos um código ao seu e-mail para confirmar que a
            caixa postal é sua. Seu e-mail não aparece junto com seus votos.
          </p>
          <FormError message={error} />
          <Input
            id="voter-email"
            data-autofocus
            label="Seu e-mail"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Actions>
            <Button type="submit" loading={loading}>
              Enviar código
            </Button>
            <Button variant="ghost" onClick={onDismiss}>
              Cancelar
            </Button>
          </Actions>
        </form>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void confirm();
          }}
          noValidate
        >
          <p>
            Enviamos um código de 6 números para <strong>{email.trim()}</strong>. Ele vale por 15
            minutos.
          </p>
          <FormError message={error} />
          <Input
            id="voter-code"
            data-autofocus
            label="Código de verificação"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
          />
          <Actions>
            <Button type="submit" loading={loading}>
              Confirmar e votar
            </Button>
            <Button
              variant="secondary"
              disabled={cooldown > 0 || loading}
              onClick={() => void sendCode()}
            >
              {cooldown > 0 ? `Reenviar código (${cooldown}s)` : 'Reenviar código'}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setStep('email');
                setError(null);
              }}
            >
              Trocar e-mail
            </Button>
          </Actions>
        </form>
      )}
      <Aside>
        Prefere guardar seus votos numa conta?{' '}
        <LinkButton type="button" onClick={goToLogin}>
          Entrar ou criar conta
        </LinkButton>
      </Aside>
    </Modal>
  );
}

import { useEffect, useId, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(7, 29, 65, 0.6);
`;

const Dialog = styled.div`
  position: relative;
  width: 100%;
  max-width: 480px;
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 24px;
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);

  &:hover {
    background: var(--hover);
  }
`;

const Title = styled.h2`
  margin: 0 32px 16px 0;
  font-size: 1.286rem;
`;

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

/** Diálogo acessível: foco preso, Esc fecha, foco volta a quem abriu e a rolagem do fundo é travada. */
export function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const dialog = dialogRef.current!;
    (
      dialog.querySelector<HTMLElement>('[data-autofocus]') ??
      dialog.querySelector<HTMLElement>(FOCUSABLE)
    )?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;

      const items = [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  return createPortal(
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Dialog ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <CloseButton type="button" onClick={onClose} aria-label="Fechar">
          <X size={20} aria-hidden="true" />
        </CloseButton>
        <Title id={titleId}>{title}</Title>
        {children}
      </Dialog>
    </Backdrop>,
    document.body,
  );
}

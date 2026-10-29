import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { Modal } from './Modal';

function Harness({ onClose }: { onClose?: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Abrir</button>
      {open && (
        <Modal
          title="Título do diálogo"
          onClose={() => {
            onClose?.();
            setOpen(false);
          }}
        >
          <input aria-label="Campo" />
          <button>Confirmar</button>
        </Modal>
      )}
    </>
  );
}

describe('Modal', () => {
  it('expõe um diálogo nomeado e leva o foco para dentro', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));

    const dialog = screen.getByRole('dialog', { name: 'Título do diálogo' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('Esc fecha e devolve o foco a quem abriu', async () => {
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole('button', { name: 'Abrir' });
    await userEvent.click(opener);

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });

  it('prende o Tab dentro do diálogo', async () => {
    render(<Harness />);
    await userEvent.click(screen.getByRole('button', { name: 'Abrir' }));
    const dialog = screen.getByRole('dialog');

    for (let i = 0; i < 6; i++) {
      await userEvent.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
  });
});

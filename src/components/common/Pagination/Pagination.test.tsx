import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination, pageWindow } from './Pagination';

describe('pageWindow', () => {
  it('mostra primeira, última e vizinhas, com reticências nos saltos', () => {
    expect(pageWindow(1, 5)).toEqual([1, 2, 'gap', 5]);
    expect(pageWindow(5, 10)).toEqual([1, 'gap', 4, 5, 6, 'gap', 10]);
    expect(pageWindow(2, 3)).toEqual([1, 2, 3]);
  });
});

describe('Pagination', () => {
  it('não aparece com uma página só', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('marca a página atual e navega', async () => {
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onChange={onChange} />);

    expect(screen.getByRole('button', { name: 'Página 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Próxima página' }));
    expect(onChange).toHaveBeenCalledWith(3);
    await userEvent.click(screen.getByRole('button', { name: 'Página anterior' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('desabilita anterior na primeira e próxima na última', () => {
    const { rerender } = render(<Pagination page={1} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
    rerender(<Pagination page={3} totalPages={3} onChange={() => {}} />);
    expect(screen.getByRole('button', { name: 'Próxima página' })).toBeDisabled();
  });
});

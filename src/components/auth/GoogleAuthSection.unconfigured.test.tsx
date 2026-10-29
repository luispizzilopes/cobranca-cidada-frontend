import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { GoogleAuthSection } from './GoogleAuthSection';

vi.mock('../../data/domains', () => ({ googleClientId: '', domains: { api: '' }, API_PREFIX: '' }));

describe('GoogleAuthSection sem VITE_GOOGLE_CLIENT_ID', () => {
  it('não mostra nada: o site funciona só com e-mail e senha', () => {
    const { container } = render(
      <MemoryRouter>
        <GoogleAuthSection text="signin_with" markSubmitting={() => undefined} />
      </MemoryRouter>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

import styled from 'styled-components';

export const Holder = styled.div`
  display: flex;
  justify-content: center;
  min-height: 44px;
  /* O botão do Google é desenhado em um iframe com fundo próprio; no tema escuro ele ganha uma moldura clara. */
  color-scheme: light;
`;

export const Unavailable = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.929rem;
  text-align: center;
`;

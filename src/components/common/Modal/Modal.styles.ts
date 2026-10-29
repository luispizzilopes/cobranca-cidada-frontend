import styled from 'styled-components';

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(7, 29, 65, 0.6);
`;

export const Dialog = styled.div`
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

export const CloseButton = styled.button`
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

export const Title = styled.h2`
  margin: 0 32px 16px 0;
  font-size: 1.286rem;
`;

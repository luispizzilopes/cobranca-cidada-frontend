import styled from 'styled-components';

export const Blocker = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1200;
`;

/** O recorte vem da sombra gigante: o elemento destacado fica "aceso" e o resto escurece. */
export const Spotlight = styled.div`
  position: fixed;
  z-index: 1201;
  border-radius: var(--radius-lg);
  box-shadow:
    0 0 0 3px var(--yellow),
    0 0 0 9999px rgba(7, 29, 65, 0.62);
  pointer-events: none;
  transition:
    top 0.25s,
    left 0.25s,
    width 0.25s,
    height 0.25s;
`;

export const Curtain = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1201;
  background: rgba(7, 29, 65, 0.62);
  pointer-events: none;
`;

export const Popover = styled.div`
  position: fixed;
  z-index: 1202;
  width: min(380px, calc(100vw - 32px));
  max-height: calc(100dvh - 32px);
  overflow-y: auto;
  padding: 20px;
  background: var(--surface);
  color: var(--text);
  border-radius: var(--radius-lg);
  border-top: 4px solid var(--primary);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);

  h2 {
    margin: 0 0 8px;
    font-size: 1.286rem;
  }
  p {
    margin: 0 0 12px;
  }
`;

export const Progress = styled.p`
  margin: 0 0 4px !important;
  font-size: 0.857rem;
  font-weight: 600;
  color: var(--muted);
`;

export const Task = styled.p<{ $done: boolean }>`
  padding: 10px 12px;
  border-radius: var(--radius);
  font-weight: 600;
  background: ${({ $done }) => ($done ? 'var(--success-bg)' : 'var(--info-bg)')};
  color: ${({ $done }) => ($done ? 'var(--success)' : 'var(--info)')};
`;

export const Dots = styled.ol`
  display: flex;
  gap: 6px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;
`;

export const Dot = styled.li<{ $state: 'done' | 'current' | 'todo' }>`
  flex: 1;
  height: 4px;
  border-radius: 2px;
  background: ${({ $state }) => ($state === 'todo' ? 'var(--border)' : 'var(--primary)')};
  opacity: ${({ $state }) => ($state === 'current' ? 1 : $state === 'done' ? 0.55 : 1)};
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;

  .spacer {
    flex: 1;
  }
`;

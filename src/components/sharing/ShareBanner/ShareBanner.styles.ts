import styled from 'styled-components';

export const Formats = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;

  button {
    padding: 6px 12px;
    border: 1px solid var(--border-strong);
    border-radius: var(--radius);
    background: var(--surface);
    font-weight: 600;
  }
  button[aria-pressed='true'] {
    background: var(--primary);
    border-color: var(--primary);
    color: var(--on-primary);
  }
  small {
    display: block;
    font-weight: 400;
  }
`;

export const Preview = styled.canvas`
  display: block;
  width: 100%;
  max-height: 480px;
  object-fit: contain;
  margin-bottom: 12px;
  border: 1px solid var(--border);
  border-radius: var(--radius);
`;

export const Actions = styled.div`
  display: grid;
  gap: 8px;
`;

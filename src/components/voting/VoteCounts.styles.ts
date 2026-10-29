import styled from 'styled-components';

export const Row = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  margin: 0;
  font-size: 0.929rem;
  color: var(--muted);
`;

export const Highlight = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary);
  font-weight: 600;

  strong {
    font-size: 1.143rem;
    font-weight: 700;
  }
`;

export const Rating = styled.span<{ $tone: 'success' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    color: var(--${({ $tone }) => $tone});
  }
  strong {
    color: var(--text);
    font-weight: 600;
  }
`;

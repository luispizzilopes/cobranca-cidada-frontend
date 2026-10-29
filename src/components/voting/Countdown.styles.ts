import styled from 'styled-components';

export const Box = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: var(--radius-lg);
`;

export const Big = styled.span`
  font-size: 2.571rem;
  font-weight: 700;
  line-height: 1;
`;

export const Label = styled.span`
  display: block;
  font-size: 0.929rem;
`;

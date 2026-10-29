import styled from 'styled-components';

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const Aside = styled.p`
  margin: 16px 0 0;
  padding-top: 16px;
  border-top: 1px solid var(--border);
  font-size: 0.929rem;
  color: var(--muted);
`;

export const LinkButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  color: var(--link);
  text-decoration: underline;
  font-weight: 600;
`;

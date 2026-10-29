import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
`;

export const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

export const Code = styled.span`
  color: var(--muted);
  font-size: 0.857rem;
  font-weight: 600;
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 1.286rem;

  a {
    color: var(--text);
    text-decoration: none;
  }
  a:hover {
    color: var(--primary);
    text-decoration: underline;
  }
`;

export const Description = styled.p`
  margin: 0;
  color: var(--text);
`;

export const Facts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--muted);
  font-size: 0.929rem;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

export const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
`;

export const DetailLink = styled(Link)`
  font-weight: 600;
`;

import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Wrapper = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--primary);

  &:hover {
    color: var(--primary-hover);
  }
`;

export const Mark = styled.span`
  display: grid;
  place-items: center;
  width: 44px;
  height: 31px;
`;

export const Text = styled.span`
  display: grid;
  gap: 3px;
`;

export const Name = styled.span`
  font-size: 1.286rem;
  font-weight: 700;
  line-height: 1;
`;

export const Tagline = styled.span`
  color: var(--muted);
  font-size: 0.786rem;
  font-weight: 600;
  line-height: 1;
`;

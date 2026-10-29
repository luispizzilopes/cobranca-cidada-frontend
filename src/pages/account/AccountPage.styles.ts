import styled from 'styled-components';

export const Layout = styled.div`
  display: grid;
  gap: 24px;
  align-items: start;
  grid-template-areas: 'account' 'votes' 'password' 'delete';

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) 360px;
    grid-template-areas:
      'votes account'
      'votes password'
      'votes delete'
      'votes .';
    grid-template-rows: auto auto auto 1fr;
  }
`;

export const Area = styled.div<{ $name: string }>`
  grid-area: ${({ $name }) => $name};
  min-width: 0;
`;

export const Profile = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
`;

export const Avatar = styled.span`
  display: grid;
  flex: none;
  place-items: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 1.5rem;
  font-weight: 700;
`;

export const Identity = styled.div`
  min-width: 0;

  strong,
  span {
    display: block;
    overflow-wrap: anywhere;
  }
  span {
    color: var(--muted);
  }
`;

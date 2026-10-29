import { Link } from 'react-router-dom';
import styled from 'styled-components';

export const Wrapper = styled.header`
  background: var(--header-bg);
  box-shadow: var(--shadow);
  position: relative;
  z-index: 10;
  border-top: 6px solid transparent;
  border-image: var(--stripe) 1;
`;

const Container = styled.div`
  max-width: var(--container);
  margin: 0 auto;
  padding: 0 var(--gutter);
`;

export const Top = styled(Container)`
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 72px;
  flex-wrap: wrap;
  padding-top: 8px;
  padding-bottom: 8px;

  @media (max-width: 899px) {
    gap: 8px 12px;
  }
`;

export const SearchForm = styled.form`
  display: flex;
  flex: 1 1 280px;
  max-width: 520px;
  margin-left: auto;

  @media (max-width: 899px) {
    order: 3;
    flex-basis: 100%;
    max-width: none;
    margin-left: 0;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--border-strong);
  border-right: 0;
  border-radius: 100em 0 0 100em;
  background: var(--surface);
`;

export const SearchButton = styled.button`
  display: grid;
  place-items: center;
  width: 48px;
  min-height: 40px;
  border: 1px solid var(--primary);
  border-radius: 0 100em 100em 0;
  background: var(--primary);
  color: var(--on-primary);

  &:hover {
    background: var(--primary-hover);
  }
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 899px) {
    order: 2;
    margin-left: auto;
  }
`;

export const IconButton = styled.button`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: var(--primary);

  &:hover {
    background: var(--hover);
  }
`;

export const MenuToggle = styled(IconButton)`
  @media (min-width: 900px) {
    display: none;
  }
`;

export const Nav = styled.nav<{ $open: boolean }>`
  border-top: 1px solid var(--border);

  ul {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    max-width: var(--container);
    margin: 0 auto;
    padding: 0 var(--gutter);
    list-style: none;
  }

  @media (min-width: 900px) {
    ul {
      display: flex;
      flex-direction: row;
      gap: 4px;
    }
  }

  a {
    display: block;
    padding: 12px 16px;
    color: var(--text);
    font-weight: 600;
    text-decoration: none;
    border-bottom: 4px solid transparent;
  }

  a:hover {
    background: var(--hover);
    border-bottom-color: var(--yellow);
  }

  a[aria-current='page'] {
    color: var(--primary);
    border-bottom-color: var(--green);
  }
`;

export const UserName = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  max-width: 200px;
  padding: 0 14px 0 4px;
  border: 1px solid var(--border);
  border-radius: 100em;
  color: var(--text);
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: var(--hover);
    color: var(--text);
  }

  @media (max-width: 899px) {
    padding: 0;
    border: 0;
  }
`;

export const Avatar = styled.span`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--primary);
  color: var(--on-primary);
  font-size: 0.857rem;
  font-weight: 700;
  text-transform: uppercase;
`;

export const UserLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 899px) {
    display: none;
  }
`;

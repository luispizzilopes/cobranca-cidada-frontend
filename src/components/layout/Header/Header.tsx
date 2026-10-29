import { useState, type FormEvent } from 'react';
import { Menu, Moon, Search, Sun, User, X } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Logo, LinkButton } from '../../common';
import { navItems } from '../../../data/site';
import { useSession } from '../../../contexts/SessionContext';
import { useTheme } from '../../../contexts/ThemeContext';

const Wrapper = styled.header`
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

const Top = styled(Container)`
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

const SearchForm = styled.form`
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

const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  min-height: 40px;
  padding: 0 16px;
  border: 1px solid var(--border-strong);
  border-right: 0;
  border-radius: 100em 0 0 100em;
  background: var(--surface);
`;

const SearchButton = styled.button`
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

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 899px) {
    order: 2;
    margin-left: auto;
  }
`;

const IconButton = styled.button`
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

const MenuToggle = styled(IconButton)`
  @media (min-width: 900px) {
    display: none;
  }
`;

const Nav = styled.nav<{ $open: boolean }>`
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

const UserName = styled(Link)`
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

const Avatar = styled.span`
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

const UserLabel = styled.span`
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  @media (max-width: 899px) {
    display: none;
  }
`;

export function Header() {
  const navigate = useNavigate();
  const { kind, user, isAdmin } = useSession();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [term, setTerm] = useState('');
  const displayName = kind === 'account' ? (user?.name ?? 'Minha conta') : 'E-mail verificado';

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = term.trim();
    navigate(value ? `/?busca=${encodeURIComponent(value)}` : '/');
    setMenuOpen(false);
  }

  return (
    <Wrapper>
      <Top>
        <MenuToggle
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="menu-principal"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </MenuToggle>
        <Logo />
        <SearchForm role="search" onSubmit={submit}>
          <label htmlFor="busca-global" className="sr-only">
            Buscar compromissos
          </label>
          <SearchInput
            id="busca-global"
            type="search"
            placeholder="Buscar compromissos"
            value={term}
            onChange={(event) => setTerm(event.target.value)}
          />
          <SearchButton type="submit" aria-label="Pesquisar no site">
            <Search size={18} aria-hidden="true" />
          </SearchButton>
        </SearchForm>
        <Actions>
          <IconButton
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Usar tema claro' : 'Usar tema escuro'}
            title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
          >
            {theme === 'dark' ? (
              <Sun size={20} aria-hidden="true" />
            ) : (
              <Moon size={20} aria-hidden="true" />
            )}
          </IconButton>
          {kind === 'anonymous' ? (
            <LinkButton to="/entrar" size="sm">
              <User size={16} aria-hidden="true" />
              Entrar
            </LinkButton>
          ) : (
            <UserName to="/conta" aria-label={displayName} title={displayName}>
              <Avatar aria-hidden="true">{displayName.trim().charAt(0)}</Avatar>
              <UserLabel>{displayName}</UserLabel>
            </UserName>
          )}
        </Actions>
      </Top>
      <Nav id="menu-principal" aria-label="Principal" $open={menuOpen}>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={'end' in item ? item.end : false}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          {isAdmin && (
            <li>
              <NavLink to="/admin" onClick={() => setMenuOpen(false)}>
                Administração
              </NavLink>
            </li>
          )}
        </ul>
      </Nav>
    </Wrapper>
  );
}

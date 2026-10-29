import { useState, type FormEvent } from 'react';
import { Menu, Moon, Search, Sun, User, X } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo, LinkButton } from '../../common';
import { navItems } from '../../../data/site';
import { useSession } from '../../../contexts/SessionContext';
import { useTheme } from '../../../contexts/ThemeContext';
import {
  Actions,
  Avatar,
  IconButton,
  MenuToggle,
  Nav,
  SearchButton,
  SearchForm,
  SearchInput,
  Top,
  UserLabel,
  UserName,
  Wrapper,
} from './Header.styles';

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

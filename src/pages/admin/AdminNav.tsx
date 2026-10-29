import { NavLink } from 'react-router-dom';
import { Nav } from './AdminNav.styles';

export function AdminNav() {
  return (
    <Nav aria-label="Administração">
      <ul>
        <li>
          <NavLink to="/admin" end>
            Compromissos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/catalogo">Áreas e origens</NavLink>
        </li>
      </ul>
    </Nav>
  );
}

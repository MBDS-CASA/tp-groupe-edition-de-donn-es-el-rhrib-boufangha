import { useState } from 'react';
import { Link } from 'react-router';

function HamburgerMenu({ menuItems }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="hamburger-menu">
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      {menuOpen && (
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.path} onClick={() => setMenuOpen(false)}>
              <Link to={item.path}>{item.text}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HamburgerMenu;

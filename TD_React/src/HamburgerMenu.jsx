import { useState } from 'react';

function HamburgerMenu({ menuItems, onSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleItemClick = (item) => {
    onSelect(item);
    setMenuOpen(false);
  };

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
            <li key={item} onClick={() => handleItemClick(item)}>
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default HamburgerMenu;
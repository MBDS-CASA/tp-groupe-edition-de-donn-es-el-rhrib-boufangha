import { useState } from 'react';
import university from './assets/azurelogo.png';
import './App.css';
import data from './../../data.json';
import ShowData from './ShowData';










function Header({ title1, title2, logo }) {
  return (
    <header>
      <img src={logo} alt="Logo" />
      <h1>{title1}</h1>
      <h2>{title2}</h2>
    </header>
  );
}
function Footer({annee, nom, prenom}) {
  return (
    <footer>
      
      © {annee} - {prenom}.{nom}, Tous droits réservés.
    
    </footer>
  )
}
function MainContent({jour, mois, annee, heure, minute, seconde}) {
  return (
    <main>
      <p>
      Bonjour, on est le {jour}, {mois}, {annee} et il est {heure}:{minute}:{seconde}
      </p>
    </main>
  )
}


function HamburgerMenu({ menuItems, onSelect, ...props }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(menuItems[0]);
  

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  

  const handleItemClick = (item) => {
    setActiveItem(item);
    onSelect(item);
    setMenuOpen(false); 
  };

  return (
    <div className="hamburger-menu" {...props}>
      
      <div className="hamburger-icon" onClick={toggleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
      
      
      {menuOpen && (
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li
              key={item}
              onClick={() => handleItemClick(item)}
              className={`menu-item ${item === activeItem ? "active" : ""}`} 
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
function App() {
  const [currentPage, setCurrentPage] = useState("Notes");

  const handleMenuSelect = (item) => {
    setCurrentPage(item);
  };
  return (
    <>
      <HamburgerMenu
        menuItems={["Notes", "Etudiants", "Matières", "A propos"] }
        onSelect={handleMenuSelect}
      />
      <main>
        <p>Vous êtes dans la page : {currentPage}</p>
      </main>

      <div>
        <Header
          title1="Introduction à React"
          title2="A la découverte des premières notions de React"
          logo={university}
        />
        
        
        <MainContent jour='Lundi' mois='Decembre' annee='2024' heure='16' minute='30' seconde='00' />
      </div>
      <ShowData data={data} menuItem={currentPage} />
      <Footer annee='2024' nom='EL RHRIB' prenom='Oussama'/>
    </>
  );
}

export default App;

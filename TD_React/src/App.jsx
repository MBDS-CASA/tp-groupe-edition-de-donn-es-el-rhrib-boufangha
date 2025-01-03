import university from './assets/azurelogo.png';
import './App.css';
import HamburgerMenu from './HamburgerMenu';
import { useState } from 'react';
import { Scripts } from 'react-router';
import AppRoute from './Routes';
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


function App() {
  const [currentPage, setCurrentPage] = useState("Notes");
  const menuItems = ["Notes", "Etudiants", "Matières", "A propos"];

  const handleMenuSelect = (item) => setCurrentPage(item);

  return (
    <>
      <HamburgerMenu menuItems={menuItems} onSelect={handleMenuSelect} />

      <div>
        <Header
          title1="Introduction à React"
          title2="A la découverte des premières notions de React"
          logo={university}
        />
        
        
        <MainContent jour='Lundi' mois='Decembre' annee='2024' heure='16' minute='30' seconde='00' />
      </div>
      <AppRoute />
      
      
      
      <Footer annee='2024' nom='EL RHRIB' prenom='Oussama'/>
    </>
  );
}


export default App;

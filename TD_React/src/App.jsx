import React, { useState } from 'react'; // Import useState
import university from './assets/azurelogo.png';
import './App.css';
import AppRoute from './AppRoutes';
import Authentication from './Authentication'; // Import the Authentication component

function Header({ title1, title2, logo }) {
  return (
    <header>
      <img src={logo} alt="Logo" />
      <h1>{title1}</h1>
      <h2>{title2}</h2>
    </header>
  );
}

function Footer({ annee, nom, prenom }) {
  return (
    <footer>
      © {annee} - {prenom}.{nom}, Tous droits réservés.
    </footer>
  );
}

function MainContent({ jour, mois, annee, heure, minute, seconde }) {
  return (
    <main>
      <p>
        Bonjour, on est le {jour}, {mois}, {annee} et il est {heure}:{minute}:{seconde}
      </p>
    </main>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth state

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleAuthLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <>
      <AppRoute isAuthenticated={isAuthenticated} />

      <div>
        <Header
          title1="Introduction à React"
          title2="A la découverte des premières notions de React"
          logo={university}
        />

        {/* Pass authentication state updater to Authentication */}
        <Authentication onAuthSuccess={handleAuthSuccess} onAuthLogout={handleAuthLogout} />

        <p>is logged: {isAuthenticated ? 'Yes' : 'No'}</p>

        <MainContent jour="Lundi" mois="Décembre" annee="2024" heure="16" minute="30" seconde="00" />
      </div>

      <Footer annee="2024" nom="EL RHRIB" prenom="Oussama" />
    </>
  );
}

export default App;

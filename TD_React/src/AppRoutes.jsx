import { Route, Routes } from "react-router";
import ShowData from "./ShowData";
import { BrowserRouter as Router } from "react-router"; // Fix import
import HamburgerMenu from "./HamburgerMenu";

function AppRoute({ isAuthenticated }) {
  const menuItems = [
    { text: "Étudiants", path: "/etudiants" },
    { text: "Notes", path: "/notes" },
    { text: "Matières", path: "/matieres" },
    { text: "À propos", path: "/apropos" },
  ];

  return (
    <Router>
      {/* Show menu only if user is authenticated */}
      {isAuthenticated && <HamburgerMenu menuItems={menuItems} />}

      <Routes>
        <Route path="/etudiants" element={<ShowData menuItem="Etudiants" />} />
        <Route path="/notes" element={<ShowData menuItem="Notes" />} />
        <Route path="/matieres" element={<ShowData menuItem="Matières" />} />
        <Route path="/apropos" element={<ShowData menuItem="A propos" />} />
      </Routes>
    </Router>
  );
}

export default AppRoute;

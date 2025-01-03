import { Route, Routes } from "react-router";
import ShowData from "./ShowData";
import { BrowserRouter as Router } from "react-router";
// import { useParams } from "react-router";
// import data from "./../../data.json";



function AppRoute() {
  return (
    <Router>
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
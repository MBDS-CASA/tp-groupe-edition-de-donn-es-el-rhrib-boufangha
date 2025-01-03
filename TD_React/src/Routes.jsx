import { Route, Routes } from "react-router";
import ShowData from "./ShowData";
// import { useParams } from "react-router";
// import data from "./../../data.json";



function AppRoute() {
  return (
    <Routes>
      <Route path="/etudiants" element={<ShowData menuItem="Etudiants" />} />
      <Route path="/notes" element={<ShowData menuItem="Notes" />} />
      <Route path="/matieres" element={<ShowData menuItem="Matières" />} />
      <Route path="/apropos" element={<ShowData menuItem="A propos" />} />
    </Routes>
  );
}

export default AppRoute;
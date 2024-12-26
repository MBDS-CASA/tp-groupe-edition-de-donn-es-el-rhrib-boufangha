import { Route, Routes } from "react-router";
import ShowData from "./App.jsx";
// import { useParams } from "react-router";



import { BrowserRouter as Router, NavLink } from "react-router";


function AppRoute() {
  const data = {
    notes: [
      {
        course: "Mathématiques",
        student: { firstname: "Jean", lastname: "Dupont" },
        grade: 15,
        date: "2023-12-25",
      },
    ],
    students: [
      { student: { firstname: "Jean", lastname: "Dupont", id: 1 } },
      { student: { firstname: "Marie", lastname: "Curie", id: 2 } },
    ],
    matieres: [{ course: "Mathématiques" }],
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {/* Menu de navigation */}
        <nav style={{ padding: "1rem", width: "200px", background: "#f0f0f0" }}>
          <h3>Menu</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li>
              <NavLink
                to="/data/notes"
                style={({ isActive }) => ({
                  color: isActive ? "blue" : "black",
                  textDecoration: "none",
                })}
              >
                Notes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/data/students"
                style={({ isActive }) => ({
                  color: isActive ? "blue" : "black",
                  textDecoration: "none",
                })}
              >
                Étudiants
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/data/matieres"
                style={({ isActive }) => ({
                  color: isActive ? "blue" : "black",
                  textDecoration: "none",
                })}
              >
                Matières
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Contenu dynamique en fonction de la route */}
        <div style={{ flex: 1, padding: "1rem" }}>
          <Routes>
            <Route
              path="/data/:menuItem"
              element={<ShowData data={data} />}
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default AppRoute;
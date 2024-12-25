import { useState } from 'react';
import university from './assets/azurelogo.png';
import './App.css';
import data from './../../data.json';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { saveAs } from "file-saver";



function ShowData({ data, menuItem }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [dataState, setDataState] = useState(data); // Gérer les données dynamiquement
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const formFields = {
    Notes: [
      { name: "course", label: "Cours" },
      { name: "student", label: "Étudiant (Nom Prénom)" },
      { name: "grade", label: "Note" },
      { name: "date", label: "Date" },
    ],
    Etudiants: [
      { name: "firstname", label: "Prénom" },
      { name: "lastname", label: "Nom" },
      { name: "id", label: "ID Étudiant" },
    ],
    Matières: [{ name: "course", label: "Nom du Cours" }],
  };

  // Filtrage des données en fonction du menu sélectionné
  let filteredData;
  switch (menuItem) {
    case "Notes":
      filteredData = dataState.map(({ course, student, grade, date }) => ({
        course,
        student: `${student.firstname} ${student.lastname}`,
        grade,
        date,
      }));
      break;
    case "Etudiants":
      filteredData = dataState.map(({ student }) => ({
        firstname: student.firstname,
        lastname: student.lastname,
        id: student.id,
      }));
      break;
    case "Matières":
      filteredData = dataState.map(({ course }) => ({ course }));
      break;
    default:
      filteredData = [];
  }

  if (searchQuery) {
    filteredData = filteredData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  // Pagination
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Gestion du formulaire
  const handleOpenForm = (data, index = null) => {
    setFormData(data || {});
    setIsEditing(index !== null);
    setEditIndex(index);
    setShowForm(true);
  };
  const handleCloseForm = () => setShowForm(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    let newDataState;
    if (isEditing) {
      // Modifier une entrée existante
      newDataState = [...dataState];
      newDataState[editIndex] = createDataObject();
    } else {
      // Ajouter une nouvelle entrée
      newDataState = [...dataState, createDataObject()];
    }
    setDataState(newDataState);
    handleCloseForm();
  };

  const handleDelete = (index) => {
    const newDataState = dataState.filter((_, i) => i !== index);
    setDataState(newDataState);
  };

  const calculateStatistics = () => {
    if (menuItem === "Notes") {
      const grades = dataState.map((item) => parseFloat(item.grade));
      const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
      const studentsCount = [...new Set(dataState.map((item) => item.student))].length;
      return {
        averageGrade: average.toFixed(2),
        totalStudents: studentsCount,
      };
    }
    return {};
  };

  const exportToCSV = () => {
    const csvContent =
      Object.keys(dataState[0] || {})
        .join(",") +
      "\n" +
      dataState
        .map((row) =>
          Object.values(row)
            .map((value) => (typeof value === "object" ? JSON.stringify(value) : value))
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${menuItem}-data.csv`);
  };

  const createDataObject = () => {
    switch (menuItem) {
      case "Notes":
        const [firstname, lastname] = formData.student.split(" ");
        return {
          course: formData.course,
          student: { firstname, lastname },
          grade: formData.grade,
          date: formData.date,
        };
      case "Etudiants":
        return {
          student: {
            firstname: formData.firstname,
            lastname: formData.lastname,
            id: formData.id,
          },
        };
      case "Matières":
        return { course: formData.course };
      default:
        return {};
    }
  };
  const statistics = calculateStatistics();
  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenForm()}
        style={{ marginBottom: "16px" }}
      >
        Ajouter {menuItem.toLowerCase()}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={exportToCSV}
        style={{ marginBottom: "16px", marginLeft: "16px" }}
      >
        Exporter en CSV
      </Button>

      <Dialog open={showForm} onClose={handleCloseForm}>
        <DialogTitle>
          {isEditing ? "Modifier" : "Ajouter"} {menuItem.toLowerCase()}
        </DialogTitle>
        <DialogContent>
          {formFields[menuItem]?.map((field) => (
            <TextField
              key={field.name}
              margin="dense"
              name={field.name}
              label={field.label}
              fullWidth
              value={formData[field.name] || ""}
              onChange={handleInputChange}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="secondary">
            Annuler
          </Button>
          <Button onClick={handleSave} color="primary">
            {isEditing ? "Modifier" : "Ajouter"}
          </Button>
        </DialogActions>
      </Dialog>

      <TextField
        label="Rechercher"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          backgroundColor: "white",
        }}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(filteredData[0] || {}).map((key, index) => (
                <TableCell key={index}>{key}</TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {Object.values(row).map((value, idx) => (
                  <TableCell key={idx}>{value}</TableCell>
                ))}
                <TableCell>
                  <IconButton
                    onClick={() => handleOpenForm(dataState[index], index)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(index)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredData.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      {menuItem === "Notes" && (
        <div style={{ marginTop: "20px" }}>
          <h3>Statistiques :</h3>
          <p>Note moyenne : {statistics.averageGrade}</p>
          <p>Nombre total d'étudiants : {statistics.totalStudents}</p>
        </div>
      )}
    </div>
  );
}






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

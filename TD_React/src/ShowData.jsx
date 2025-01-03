import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { saveAs } from "file-saver";

function ShowData({ menuItem }) {
  const [dataState, setDataState] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_ENDPOINTS = {
    Notes: "http://localhost:8010/api/grades",
    Etudiants: "http://localhost:8010/api/students",
    Matières: "http://localhost:8010/api/courses",
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await fetch(API_ENDPOINTS[menuItem]);
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }
        const data = await response.json();
        setDataState(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (API_ENDPOINTS[menuItem]) {
      fetchData();
    }
  }, [menuItem]);

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

  const handleDataMapping = () => {
    switch (menuItem) {
      case "Notes":
        return dataState.map(({ course, student, grade, date }) => ({
          course,
          student: `${student.firstname} ${student.lastname}`,
          grade,
          date,
        }));
      case "Etudiants":
        return dataState.map(({ firstname, lastname, id }) => ({
          firstname,
          lastname,
          id,
        }));
      case "Matières":
        return dataState.map(({ course }) => ({ course }));
      default:
        return [];
    }
  };

  let filteredData = handleDataMapping();

  if (searchQuery) {
    filteredData = filteredData.filter((row) =>
      Object.values(row).some((value) =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }

  const handlePageChange = (event, newPage) => setPage(newPage);
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleFormOpen = (data = {}, index = null) => {
    setFormData(data);
    setIsEditing(index !== null);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleFormClose = () => setShowForm(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    let newDataState;
    if (isEditing) {
      newDataState = [...dataState];
      newDataState[editIndex] = formData;
    } else {
      newDataState = [...dataState, formData];
    }
    setDataState(newDataState);
    handleFormClose();
  };

  const handleDelete = (index) => {
    const newDataState = dataState.filter((_, i) => i !== index);
    setDataState(newDataState);
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

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>Erreur : {error}</p>;

  return (
    <div>
      <Button variant="contained" color="primary" onClick={() => handleFormOpen()}>
        Ajouter {menuItem.toLowerCase()}
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={exportToCSV}
        style={{ marginLeft: "16px" }}
      >
        Exporter en CSV
      </Button>

      <Dialog open={showForm} onClose={handleFormClose}>
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
          <Button onClick={handleFormClose} color="secondary">
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
                    onClick={() => handleFormOpen(dataState[index], index)}
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
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handlePageChange}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}

export default ShowData;

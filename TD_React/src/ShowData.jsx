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

  const API_BASE_URL = "http://localhost:8010/api";

  const endpoints = {
    Etudiants: `${API_BASE_URL}/students`,
    Matières: `${API_BASE_URL}/courses`,
    Notes: `${API_BASE_URL}/grades`,
  };

  useEffect(() => {
    if (!menuItem) return;
    setLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        const response = await fetch(endpoints[menuItem]);
        if (!response.ok) {
          throw new Error(`Error fetching ${menuItem}: ${response.status}`);
        }
        const data = await response.json();
        setDataState(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [menuItem]);

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

  const handleSave = async () => {
    const endpoint = endpoints[menuItem];
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${endpoint}/${dataState[editIndex].id}` : endpoint;

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to save ${menuItem}: ${response.statusText}`);
      }

      const updatedData = isEditing
        ? dataState.map((item, idx) =>
            idx === editIndex ? { ...item, ...formData } : item
          )
        : [...dataState, formData];

      setDataState(updatedData);
      handleFormClose();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (index) => {
    const endpoint = `${endpoints[menuItem]}/${dataState[index].id}`;
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`Failed to delete ${menuItem}: ${response.statusText}`);
      }

      setDataState(dataState.filter((_, idx) => idx !== index));
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredData = dataState.filter((item) =>
    Object.values(item)
      .join(" ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleFormOpen()}
        style={{ marginBottom: "16px" }}
      >
        Ajouter {menuItem.toLowerCase()}
      </Button>

      <Dialog open={showForm} onClose={handleFormClose}>
        <DialogTitle>
          {isEditing ? "Modifier" : "Ajouter"} {menuItem.toLowerCase()}
        </DialogTitle>
        <DialogContent>
          {Object.keys(formData).map((key) => (
            <TextField
              key={key}
              margin="dense"
              name={key}
              label={key}
              fullWidth
              value={formData[key] || ""}
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
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(dataState[0] || {}).map((key, idx) => (
                <TableCell key={idx}>{key}</TableCell>
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
                    onClick={() => handleFormOpen(row, index)}
                    color="primary"
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(index)}
                    color="secondary"
                  >
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
    </div>
  );
}

export default ShowData;

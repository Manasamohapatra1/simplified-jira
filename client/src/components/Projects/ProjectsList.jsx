import { useEffect, useState } from "react";
import { Box, Button, Typography, Card, CardContent, CardActions } from "@mui/material";
import { apiFetch } from "../../api";
import ProjectForm from "./ProjectForm";
import { useNavigate } from "react-router-dom";
const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await apiFetch("projects", { 
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, // Include token in headers
            },
        });
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await apiFetch(`projects/${id}`, { 
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      alert(`Failed to delete project: ${err.message}`);
    }
  };

  const handleEdit = (project) => {
    setEditProject(project);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setEditProject(null);
    setShowForm(false);
  };

  const handleFormSubmit = (newProject) => {
    if (editProject) {
      setProjects((prev) =>
        prev.map((project) => (project._id === newProject._id ? newProject : project))
      );
    } else {
      setProjects((prev) => [...prev, newProject]);
    }
    handleFormClose();
  };

  if (loading) {
    return <Typography>Loading projects...</Typography>;
  }

  if (error) {
    if(error === "Invalid token") {
        navigate("/login");
    }

    return <Typography color="error">Failed to load projects: {error}</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Projects
      </Typography>
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Add New Project
      </Button>
      {projects.map((project) => (
        <Card key={project._id} sx={{ mt: 2 }}>
          <CardContent>
            <Typography variant="h5">{project.name}</Typography>
            <Typography variant="body2">{project.description}</Typography>
          </CardContent>
          <CardActions>
            <Button size="small" onClick={() => handleEdit(project)}>
              Edit
            </Button>
            <Button variant="contained" onClick={() => navigate(`/projects/${project._id}/issues`)} >
              View Issues
            </Button>
            <Button size="small" color="error" onClick={() => handleDelete(project._id)}>
              Delete
            </Button>
          </CardActions>
        </Card>
      ))}
      {showForm && (
        <ProjectForm
          project={editProject}
          onClose={handleFormClose}
          onSubmit={handleFormSubmit}
        />
      )}
    </Box>
  );
};

export default ProjectsList;

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
} from "@mui/material";
import { apiFetch } from "../../api";
import ProjectForm from "./ProjectForm";
import { useNavigate } from "react-router-dom";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
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

        // Sort projects by createdAt in descending order
        const sortedProjects = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProjects(sortedProjects);
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
    setEditingProjectId(project._id);
  };

  const handleFormClose = () => {
    setEditingProjectId(null);
  };

  const handleFormSubmit = (updatedProject) => {
    setProjects((prevProjects) => {
      // Check if the project already exists in the list
      const existingProject = prevProjects.find(
        (project) => project._id === updatedProject._id
      );

      if (existingProject) {
        // Update the existing project
        return prevProjects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );
      } else {
        // Add the new project to the list
        return [updatedProject, ...prevProjects];
      }
    });

    handleFormClose(); // Close the form after updating or adding
  };

  if (loading) {
    return <Typography>Loading projects...</Typography>;
  }

  if (error) {
    if (error === "Invalid token") {
      navigate("/login");
    }

    return (
      <Typography color="error">Failed to load projects: {error}</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Projects
      </Typography>
      <Button variant="contained" onClick={() => setEditingProjectId("new")}>
        Add New Project
      </Button>
      {editingProjectId === "new" && (
        <ProjectForm onClose={handleFormClose} onSubmit={handleFormSubmit} />
      )}
      {projects.map((project) => (
        <Box key={project._id} sx={{ mt: 2 }}>
          <Card>
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
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(project._id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
          {editingProjectId === project._id && (
            <ProjectForm
              project={project}
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
            />
          )}
        </Box>  
      ))}
    </Box>
  );
};

export default ProjectsList;

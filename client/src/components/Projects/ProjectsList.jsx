import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardActions,
  Grid,
  Tooltip,
  IconButton,
  SvgIcon,
} from "@mui/material";
import { apiFetch } from "../../api/apiUtility";
import ProjectForm from "./ProjectForm";
import { useNavigate } from "react-router-dom";
import ProjectIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import DnsIcon from "@mui/icons-material/Dns";
import { motion } from "framer-motion";
import Loader from "../Loader/Loader";

// Placeholder SVG Icon
function PlaceholderIcon(props) {
  return (
    <SvgIcon {...props}>
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14H7v-2h3v2zm0-4H7v-2h3v2zm5 4h-3v-2h3v2zm0-4h-3v-2h3v2zm3-7H6V6h12v2z" />
    </SvgIcon>
  );
}

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("projects", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

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
          Authorization: `Bearer ${token}`,
        },
      });
      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      alert(`Failed to delete project: ${err.message}`);
    }
  };

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setProjectToEdit(project);
  };

  const handleFormClose = () => {
    setEditingProjectId(null);
    setProjectToEdit(null);
  };

  const handleFormSubmit = (updatedProject) => {
    setProjects((prevProjects) => {
      const existingProject = prevProjects.find(
        (project) => project._id === updatedProject._id
      );

      if (existingProject) {
        return prevProjects.map((project) =>
          project._id === updatedProject._id ? updatedProject : project
        );
      } else {
        return [updatedProject, ...prevProjects];
      }
    });

    handleFormClose();
  };

  if (loading) {
    return (
      <Typography>
        <Loader />
      </Typography>
    );
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
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        px: 2,
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 5,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 600,
            fontSize: { xs: "6vw", md: "3vw" },
          }}
        >
          <ProjectIcon sx={{ mr: 1, fontSize: { md: "inherit" } }} />
          My Projects
        </Typography>

        {projects.length > 0 && (
          <Tooltip title="Add New Project" arrow>
            <Button
              variant="contained"
              onClick={() => setEditingProjectId("new")}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
                transition: "transform 0.3s ease",
                fontSize: { xs: "3vw", md: "1.2vw" },
              }}
            >
              <AddIcon sx={{ mr: 1, fontSize: "inherit" }} />
              Add Project
            </Button>
          </Tooltip>
        )}
      </Box>

      {(editingProjectId === "new" || editingProjectId) && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: "50%",
              bgcolor: "white",
              p: 3,
              borderRadius: 2,
              boxShadow: 4,
            }}
          >
            <ProjectForm
              onClose={handleFormClose}
              onSubmit={handleFormSubmit}
              project={projectToEdit}
            />
          </Box>
        </motion.div>
      )}

      {projects.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            textAlign: "center",
          }}
        >
          <PlaceholderIcon sx={{ fontSize: 120, color: "#1976d2" }} />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Add projects to your workspace
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setEditingProjectId("new")}
            sx={{
              mt: 2,
              px: 4,
              py: 1,
              fontSize: "16px",
            }}
          >
            <AddIcon sx={{ mr: 1 }} />
            Add Project
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project._id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <Card
                  sx={{
                    position: "relative",
                    borderRadius: 2,
                    boxShadow: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    overflow: "hidden",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                >
                  {project.ownerId.email === email && (
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 8,
                        right: 8,
                        color: "red",
                        backgroundColor: "white",
                        "&:hover": {
                          backgroundColor: "#ffcccb",
                        },
                      }}
                      onClick={() => handleDelete(project._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}

                  <CardContent sx={{ overflow: "hidden" }}>
                    <Typography variant="h5" noWrap sx={{ fontWeight: 500 }}>
                      {project.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        opacity: 0.7,
                        height: 40,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "wrap",
                      }}
                    >
                      {project.description}
                    </Typography>
                    <Typography variant="caption">
                      Role:{" "}
                      {project.ownerId.email === email
                        ? "Owner"
                        : project.members.find((m) => m.userId.email === email)
                            .role}
                    </Typography>
                  </CardContent>

                  <CardActions
                    sx={{
                      display: "flex",
                      justifyContent: "space-evenly",
                      mt: "auto",
                    }}
                  >
                    {project.ownerId.email === email && (
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleEdit(project)}
                      >
                        <EditIcon sx={{ mr: 1 }} />
                        Edit
                      </Button>
                    )}
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(`/projects/${project._id}`)}
                    >
                      <VisibilityIcon sx={{ mr: 1 }} />
                      View
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() =>
                        navigate(`/projects/${project._id}/issues`)
                      }
                    >
                      <DnsIcon sx={{ mr: 1 }} />
                      Issues
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default ProjectsList;

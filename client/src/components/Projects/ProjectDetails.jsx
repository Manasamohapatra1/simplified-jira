import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
} from "@mui/material";
import { apiFetch } from "../../api/apiUtility";
import AddMemberForm from "./AddMemberForm";
import ProjectMembersList from "./ProjectMembersList";
import ProjectForm from "./ProjectForm";
import { motion } from "framer-motion";

const ProjectDetails = () => {
  const { projectId } = useParams(); // Extract projectId from route params
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [userRole, setUserRole] = useState(null); // Store the user's role
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  // Fetch project details on mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiFetch(`projects/${projectId}`, { 
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
        const data = await response.json();
        setProject(data);
        // Determine the user's role
        if (data.ownerId.email === email) {
          setUserRole("Owner");
        } else {
          const member = data.members.find((m) => m.userId.email === email);
          setUserRole(member?.role || "Contributor");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId, token]);

  const handleDelete = async () => {
    try {
      await apiFetch(`projects/${projectId}`, { 
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });
      navigate("/projects"); // Redirect to projects list after deletion
    } catch (err) {
      alert(`Failed to delete project: ${err.message}`);
    }
  };

  const handleFormClose = () => {
    setEditingProjectId(null);
    setProjectToEdit(null);
  };

  const handleEdit = (project) => {
    setEditingProjectId(project._id);
    setProjectToEdit(project);
  };

  const handleFormSubmit = (updatedProject) => {
    setProject(updatedProject);
    handleFormClose();
  };

  const handleAddMember = async (email) => {
    try {
      const response = await apiFetch(`projects/${projectId}/members`, {
        method: "POST",
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, role: "Contributor" }),
      });
      const data = await response.json();
      setProject(data); // Update project with the new member
    } catch (err) {
      alert(`Failed to add member: ${err.message}`);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await apiFetch(`projects/${projectId}/members/${memberId}`, {
        method: "DELETE",
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setProject(data); // Update project after removing member
    } catch (err) {
      alert(`Failed to remove member: ${err.message}`);
    }
  };

  const handleUpdateRole = async (memberId, role) => {
    try {
      const response = await apiFetch(`projects/${projectId}/members/${memberId}`, {
        method: "PUT",
        headers: {  
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });
      const data  = await response.json();
      setProject(data); // Update project with updated role
    } catch (err) {
      alert(`Failed to update role: ${err.message}`);
    }
  };


  if (loading) return <Typography>Loading project details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ display: "flex", gap: 4 }}>

      {(editingProjectId) && (
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
      {/* Left Content: Project Details */}
      <Box sx={{ flex: 3 }}>
        <Typography variant="h4" gutterBottom>
          {project.name}
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          {project.description}
        </Typography>
        {project.ownerId.email === email && (
          <>
          <Button
            variant="contained"
            sx={{ mr: 2 }}
            onClick={() => handleEdit(project)}
          >
            Edit Project
          </Button>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete Project
          </Button>     
        </>)}
        <Button
          variant="contained"
          color="primary"
          sx={{ ml: 2 }}
          onClick={() => navigate(`/projects/${projectId}/issues`)} // Navigate to issues page
        >
          View Issues
        </Button>
      </Box>

      {/* Right Panel: Members List */}
      <Paper sx={{ flex: 1, padding: 2, height: "100%", overflowY: "auto" }}>
        <ProjectMembersList
          members={project.members}
          userRole={userRole}
          onRemoveMember={handleRemoveMember}
          onUpdateRole={handleUpdateRole}
        />
        <AddMemberForm userRole={userRole} onAddMember={handleAddMember} />
      </Paper>
    </Box>
  );
};

export default ProjectDetails;

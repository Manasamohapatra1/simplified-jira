import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { apiFetch } from "../../api/apiUtility";
import AddMemberForm from "./AddMemberForm";
import ProjectMembersList from "./ProjectMembersList";
import ProjectForm from "./ProjectForm";
import { motion } from "framer-motion";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import BugReportIcon from "@mui/icons-material/BugReport";
import TaskIcon from "@mui/icons-material/Task";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [issuesSummary, setIssuesSummary] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("email");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiFetch(`projects/${projectId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        setProject(data);
        if (data.ownerId.email === email) {
          setUserRole("Owner");
        } else {
          const member = data.members.find((m) => m.userId.email === email);
          setUserRole(member?.role || "Contributor");
        }
        const issuesResponse = await apiFetch(`projects/${projectId}/stats`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const issuesData = await issuesResponse.json();
        setIssuesSummary(issuesData);
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
        },
      });
      navigate("/projects");
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
      setProject(data);
    } catch (err) {
      alert(`Failed to add member: ${err.message}`);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      const response = await apiFetch(
        `projects/${projectId}/members/${memberId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setProject(data);
    } catch (err) {
      alert(`Failed to remove member: ${err.message}`);
    }
  };

  const handleUpdateRole = async (memberId, role) => {
    try {
      const response = await apiFetch(
        `projects/${projectId}/members/${memberId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role }),
        }
      );
      const data = await response.json();
      setProject(data);
    } catch (err) {
      alert(`Failed to update role: ${err.message}`);
    }
  };

  if (loading) return <Typography>Loading project details...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const renderCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "story":
        return <EmojiEventsIcon fontSize="small" />;
      case "task":
        return <TaskIcon fontSize="small" />;
      case "bug":
        return <BugReportIcon fontSize="small" />;
      case "epic":
        return <LocalOfferIcon fontSize="small" />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 4, flexDirection: "row", padding: 3 }}>
      {editingProjectId && (
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
      <Box sx={{ flex: 3, display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h4" gutterBottom
          component="h1" 
          sx={{ fontWeight: "bold", mx: 2 }}
        >
          {project.name}
        </Typography>
        <Card>
          <CardContent sx={{ position: "relative", minHeight: 150 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, opacity: 0.8 }}>
              {project.description}
            </Typography>
            {project.ownerId.email === email && (
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                }}
              >
                <IconButton
                  color="primary"
                  onClick={() => handleEdit(project)}
                  aria-label="edit project"
                >
                  <EditIcon />
                </IconButton>
              </Box>
            )}
          </CardContent>
        </Card>
        {/* Issues Summary and Button */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 2,
            mt: 3,
          }}
        >
          <Card sx={{ p: 2, textAlign: "center" }}>
            <Typography>Issues</Typography>
            <Typography variant="h5" color="primary">
              {issuesSummary?.totalIssues || 0}
            </Typography>
          </Card>
          <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/projects/${projectId}/issues`)}
            >
              View All Issues
            </Button>
          </Box>
          <Card sx={{ p: 2 }}>
            {/* <Typography >By Category</Typography> */}
            {Object.entries(issuesSummary?.issuesByCategory || {}).map(
              ([category, count]) => (
                <Typography
                  key={category}
                  variant="body2"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {renderCategoryIcon(category)} {category}: {count}
                </Typography>
              )
            )}
          </Card>
          <Card sx={{ p: 2 }}>
            {/* <Typography >By Status</Typography> */}
            {Object.entries(issuesSummary?.issuesByStatus || {}).map(
              ([status, count]) => (
                <Typography key={status} variant="body2">
                  {status}: {count}
                </Typography>
              )
            )}
          </Card>
        </Box>
        
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

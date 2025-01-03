import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  IconButton,
  Grid,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { apiFetch } from "../../api/apiUtility";
import IssueForm from "./IssueForm";
import { useNavigate, useParams } from "react-router-dom";
import BugReportIcon from "@mui/icons-material/BugReport";
import AssignmentIcon from "@mui/icons-material/Assignment";
import StoryIcon from "@mui/icons-material/AutoStories";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { motion } from "framer-motion";

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIssueId, setEditIssueId] = useState(null);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await apiFetch(`issues/${projectId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setIssues(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [projectId, token]);

  const handleDelete = async (id) => {
    try {
      await apiFetch(`issues/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (err) {
      alert(`Failed to delete issue: ${err.message}`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue._id === id ? { ...issue, status: newStatus } : issue
      )
    );
  };

  const handleFormSubmit = (newIssue) => {
    if (editIssueId && editIssueId !== "new") {
      setIssues((prev) =>
        prev.map((issue) => (issue._id === newIssue._id ? newIssue : issue))
      );
    } else {
      setIssues((prev) => [newIssue, ...prev]);
    }
    setEditIssueId(null);
  };

  const getIconByType = (type) => {
    switch (type) {
      case "Task":
        return <AssignmentIcon color="primary" />;
      case "Bug":
        return <BugReportIcon color="error" />;
      case "Story":
        return <StoryIcon color="secondary" />;
      case "Epic":
        return <RocketLaunchIcon color="success" />;
      default:
        return <AssignmentIcon />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "To Do":
        return "text.secondary";
      case "In Progress":
        return "info.main";
      case "Done":
        return "success.main";
      default:
        return "text.secondary";
    }
  };

  if (loading) return <Typography>Loading issues...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
        mt: 4,
        px: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4">Issues</Typography>
        <Tooltip title="Add New Issue" arrow>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{ display: "inline-block" }}
          >
            <Button
              variant="contained"
              onClick={() => setEditIssueId("new")}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
              }}
            >
              <AddIcon sx={{ mr: 1 }} />
              Add Issue
            </Button>
          </motion.div>
        </Tooltip>
      </Box>

      <Grid container spacing={2}>
        {issues.map((issue) => (
          <Grid item xs={12} key={issue._id}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  boxShadow: 4,
                  borderRadius: 2,
                  transition: "box-shadow 0.3s ease",
                  "&:hover": {
                    boxShadow: 6,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mr: 2,
                  }}
                >
                  {getIconByType(issue.type)}
                </Box>

                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    variant="h6"
                    noWrap
                    sx={{
                      maxWidth: "70%",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {issue.title}
                  </Typography>
                  <Tooltip title="Edit Issue">
                    <IconButton onClick={() => setEditIssueId(issue._id)}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <FormControl size="small">
                    <Select
                      value={issue.status}
                      onChange={(e) =>
                        handleStatusChange(issue._id, e.target.value)
                      }
                      sx={{
                        minWidth: 120,
                        "& .MuiSelect-select": {
                          color: getStatusColor(issue.status),
                        },
                      }}
                    >
                      <MenuItem value="To Do">To Do</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Done">Done</MenuItem>
                    </Select>
                  </FormControl>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(`/issues/${issue._id}`)}
                  >
                    <VisibilityIcon sx={{ mr: 1 }} />
                    View
                  </Button>
                  <Tooltip title="Delete Issue">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(issue._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Card>
            </motion.div>

            {editIssueId === issue._id && (
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
                  <IssueForm
                    projectId={projectId}
                    issue={issue}
                    onClose={() => setEditIssueId(null)}
                    onSubmit={handleFormSubmit}
                  />
                </Box>
              </motion.div>
            )}
          </Grid>
        ))}
      </Grid>

      {editIssueId === "new" && (
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
            <IssueForm
              projectId={projectId}
              onClose={() => setEditIssueId(null)}
              onSubmit={handleFormSubmit}
            />
          </Box>
        </motion.div>
      )}
    </Box>
  );
};

export default IssuesList;

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
import IssueForm from "./IssueForm";
import { useNavigate, useParams } from "react-router-dom";

const IssuesList = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editIssue, setEditIssue] = useState(null);
  const [showForm, setShowForm] = useState(false);
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
        console.log(data);
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
          Authorization: `Bearer ${token}`, // Include token in headers
        },
      });
      setIssues((prev) => prev.filter((issue) => issue._id !== id));
    } catch (err) {
      alert(`Failed to delete issue: ${err.message}`);
    }
  };

  const handleFormSubmit = (newIssue) => {
    if (editIssue) {
      setIssues((prev) =>
        prev.map((issue) => (issue._id === newIssue._id ? newIssue : issue))
      );
    } else {
      setIssues((prev) => {
        console.log(prev);
        return [...prev, newIssue];
      });
    }
    setShowForm(false);
    setEditIssue(null);
  };

  if (loading) return <Typography>Loading issues...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box>
      <Typography variant="h4">Issues</Typography>
      <Button
        variant="contained"
        onClick={() => setShowForm(true)}
        sx={{ mb: 2 }}
      >
        Add Issue
      </Button>
      {(issues || []).map((issue) => (
          <Card key={issue._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6">{issue.title}</Typography>
              <Typography variant="body2">{issue.description}</Typography>
              <Typography variant="caption">Type: {issue.type}</Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                onClick={() => navigate(`/issues/${issue._id}`)}
              >
                View
              </Button>
              <Button
                size="small"
                onClick={() => {
                  setEditIssue(issue);
                  setShowForm(true);
                }}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => handleDelete(issue._id)}
              >
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      {showForm && (
        <IssueForm
          projectId={projectId}
          issue={editIssue}
          onClose={() => {
            setShowForm(false);
            setEditIssue(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </Box>
  );
};

export default IssuesList;

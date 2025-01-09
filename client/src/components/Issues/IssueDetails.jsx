import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
} from "@mui/material";
import { apiFetch } from "../../api/apiUtility";
import { useParams } from "react-router-dom";

const IssueDetails = () => {
  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { issueId } = useParams();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchIssue = async () => {
      const response = await apiFetch(`issues/issue/${issueId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setIssue(data);
      setComments(data.comments || []);
    };

    fetchIssue();
  }, [issueId, token]);

  const handleAddComment = async () => {
    if (!newComment) return;

    const response = await apiFetch(`issues/${issueId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newComment }),
    });

    const comment = await response.json();
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  if (!issue) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          color: "#1976d2",
          transition: "color 0.3s",
          "&:hover": { color: "#004ba0" },
        }}
      >
        {issue.title}
      </Typography>

      <Box
        sx={{
          mb: 3,
          p: 2,
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#f9f9f9",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Typography>{issue.description}</Typography>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography sx={{ color: "#757575" }}>
          Status: {issue.status}
        </Typography>
        <Typography sx={{ color: "#757575" }}>Type: {issue.type}</Typography>
        <Typography sx={{ color: "#757575" }}>
          Assignee: {issue.assignee?.name || "Unassigned"}
        </Typography>
      </Box>

      <Box
        sx={{
          p: 2,
          border: "1px solid #ddd",
          borderRadius: "4px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          transition: "transform 0.3s, box-shadow 0.3s",
          "&:hover": {
            transform: "scale(1.02)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, color: "#1976d2" }}>
          Comments
        </Typography>
        <List sx={{ mb: 2 }}>
          {comments.map((comment) => (
            <ListItem
              key={comment._id}
              sx={{
                p: 0,
                mb: 1,
                transition: "background-color 0.3s",
                "&:hover": {
                  backgroundColor: "#f0f0f0",
                },
              }}
            >
              <Typography>
                <strong style={{ color: "#1976d2" }}>
                  {comment.authorId?.name}:
                </strong>{" "}
                {comment.text}
              </Typography>
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <TextField
            label="Add a Comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            sx={{
              mr: 2,
              "& .MuiOutlinedInput-root": {
                "&:hover fieldset": {
                  borderColor: "#1976d2",
                },
              },
            }}
          />
          <Button
            onClick={handleAddComment}
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              "&:hover": {
                backgroundColor: "#004ba0",
              },
              transition: "background-color 0.3s",
            }}
          >
            Add Comment
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default IssueDetails;

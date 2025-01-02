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
          Authorization: `Bearer ${token}`, // Include token in headers
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

    const comment = await apiFetch(`issues/${issueId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newComment }),
    });

    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  if (!issue) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h4">{issue.title}</Typography>
      <Typography>{issue.description}</Typography>
      <Typography>Status: {issue.status}</Typography>
      <Typography>Type: {issue.type}</Typography>
      <Typography>Assignee: {issue.assignee?.name || "Unassigned"}</Typography>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Comments</Typography>
        <List>
          {comments.map((comment) => (
            <ListItem key={comment._id}>
              <Typography>
                <strong>{comment.authorId?.name}:</strong> {comment.text}
              </Typography>
            </ListItem>
          ))}
        </List>
        <TextField
          label="Add a Comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        />
        <Button onClick={handleAddComment} variant="contained" sx={{ mt: 1 }}>
          Add Comment
        </Button>
      </Box>
    </Box>
  );
};

export default IssueDetails;

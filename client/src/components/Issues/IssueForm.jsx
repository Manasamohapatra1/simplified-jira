import { useState } from "react";
import { Box, TextField, Select, MenuItem, Button } from "@mui/material";
import { apiFetch } from "../../api";

const IssueForm = ({ projectId, issue, onClose, onSubmit }) => {
  const [title, setTitle] = useState(issue?.title || "");
  const [description, setDescription] = useState(issue?.description || "");
  const [type, setType] = useState(issue?.type || "Task");
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const issueData = { title, description, type };

    try {
      const savedIssue = issue
        ? await apiFetch(`issues/${issue._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify(issueData),
          })
        : await apiFetch(`issues/${projectId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify(issueData),
          });

      onSubmit(savedIssue);
    } catch (err) {
      alert(`Failed to save issue: ${err.message}`);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ mt: 2 }}
      />
      <Select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
        fullWidth
        sx={{ mt: 2 }}
      >
        <MenuItem value="Task">Task</MenuItem>
        <MenuItem value="Bug">Bug</MenuItem>
        <MenuItem value="Story">Story</MenuItem>
        <MenuItem value="Epic">Epic</MenuItem>
      </Select>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button type="submit" variant="contained" sx={{ ml: 2 }}>
          {issue ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default IssueForm;

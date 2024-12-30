import { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { apiFetch } from "../../api";

const ProjectForm = ({ project, onClose, onSubmit }) => {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = project
        ? 
        await apiFetch(`projects/${project._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify({ name, description }),
          })
        : await apiFetch("projects", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token in headers
            },
            body: JSON.stringify({ name, description }),
          });
          console.log(data);
          console.log(JSON.stringify({ name, description }));
      onSubmit(data);
    } catch (err) {
      alert(`Failed to save project: ${err.message}`);
    } finally {
      setLoading(false);
      window.location.reload();
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        label="Project Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" disabled={loading} sx={{ ml: 2 }}>
          {project ? "Update" : "Create"}
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectForm;

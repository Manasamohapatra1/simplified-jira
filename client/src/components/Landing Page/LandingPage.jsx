import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user session or token if any
    console.log("User logged out");
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Welcome to Simplified Jira
      </Typography>
      <Typography variant="body1" gutterBottom>
        You are successfully logged in! Start managing your tasks and projects effortlessly.
      </Typography>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "center", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
        >
          Go to Dashboard
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;

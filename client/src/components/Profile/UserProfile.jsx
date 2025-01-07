import {
  Box,
  Typography,
  CircularProgress,
  Avatar,
  Stack,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/apiUtility";

const UserProfile = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user profile data and check authentication
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // Redirect if token is missing
        return;
      }
      try {
        const response = await apiFetch("auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Include token in headers
          },
        });
        const data = await response.json();
        console.log("User Profile Data:", data.username);
        if (!data || !data.username) {
          throw new Error("Invalid user data");
        }
        setUserInfo(data); // Update user info in state
      } catch (err) {
        console.error("Authentication failed:", err.message);
        setError(err.message);
        navigate("/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" sx={{ mt: 4 }}>
        Failed to load profile: {error}
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 3,
        mt: 4,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "background.paper",
      }}
    >
      <Stack direction="column" alignItems="center" spacing={2}>
        {/* Profile Avatar */}
        <Avatar
          sx={{
            width: 100,
            height: 100,
            bgcolor: "primary.main",
            fontSize: "2rem",
          }}
        >
          {userInfo.username[0].toUpperCase()}
        </Avatar>
        <Typography variant="h5" gutterBottom>
          Welcome, {userInfo.username}!
        </Typography>
      </Stack>
      <Box sx={{ mt: 3 }}>
        <Typography variant="body1" gutterBottom>
          <strong>Full Name:</strong> {userInfo.username}
        </Typography>
        <Typography variant="body1" gutterBottom>
          <strong>Email:</strong> {userInfo.email}
        </Typography>
        {/* Add more fields as needed */}
      </Box>
    </Box>
  );
};

export default UserProfile;

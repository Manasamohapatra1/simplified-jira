import { Box, Typography, Card, CardContent } from "@mui/material";

const UserProfile = ({ user }) => {
  // Example: Mock user data if not passed as a prop
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
  };

  const { name, email } = user || mockUser;

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: "white",
      }}
    >
      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            User Profile
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 2 }}>
            Name:
          </Typography>
          <Typography variant="body1">{name}</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold", mt: 2 }}>
            Email:
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserProfile;

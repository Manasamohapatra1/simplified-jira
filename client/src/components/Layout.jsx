import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  IconButton,
} from "@mui/material";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useVisibility } from "../contexts/VisibilityContext";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { useTheme } from "@mui/material/styles";
import { LightMode, DarkMode } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";

const Layout = () => {
  const { visibleButton } = useVisibility();
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const { isAuthenticated, logout } = useAuth();
  return (
    <div id="layout-container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* AppBar */}
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" className="white-link">
              Simplified Jira
            </Link>
          </Typography>
          <IconButton color="alternate" onClick={toggleTheme}>
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          {!isAuthenticated ? (
            <>
              {(visibleButton === "both" || visibleButton === "login") && (
                <Button color="inherit">
                  <Link to="/login" className="white-link">
                    Login
                  </Link>
                </Button>
              )}
              {(visibleButton === "both" || visibleButton === "signup") && (
                <Button color="inherit">
                  <Link to="/register" className="white-link">
                    Sign Up
                  </Link>
                </Button>
              )}
            </>
          ) : (
            <>
              <Button color="inherit">
                <Link to="/profile" className="white-link">
                  Profile
                </Link>
              </Button>
              <Button color="inherit">
                <Link to="/projects" className="white-link">
                  Projects
                </Link>
              </Button>
              <Button color="inherit" onClick={logout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ flex: 1, marginTop: 2, marginBottom: 2 }}>
        <Outlet />
      </Container>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          padding: "1rem",
          textAlign: "center",
          marginTop: "auto",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          © 2024 Simplified Jira. All Rights Reserved.
        </Typography>
      </footer>
    </div>
  );
};

export default Layout;

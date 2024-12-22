import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useVisibility } from "../contexts/VisibilityContext";


const Layout = () => {
    const { visibleButton } = useVisibility();
    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* AppBar */}
            <AppBar position="sticky" color="primary">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <Link to="/" className="white-link">
                            Simplified Jira
                        </Link>
                    </Typography>
                    {(visibleButton === "both" || visibleButton === 'login') && (
                        <Button color="inherit">
                            <Link to="/login" className="white-link">Login</Link>
                        </Button>
                    )}
                    {(visibleButton === "both" || visibleButton === 'signup') && (
                        <Button color="inherit">
                            <Link to="/register" className="white-link">Sign Up</Link>
                        </Button>
                    )}
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Container
                sx={{ flex: 1, marginTop: 2, marginBottom: 2 }}
            >
                <Outlet />
            </Container>

            {/* Footer */}
            <footer
                style={{
                    backgroundColor: "#f5f5f5",
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

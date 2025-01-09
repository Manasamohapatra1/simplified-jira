import {
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Card,
    CardContent
} from "@mui/material";
import { Link } from "react-router-dom";
import BugReportIcon from "@mui/icons-material/BugReport";
import TaskIcon from "@mui/icons-material/Task";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { useAuth } from "../contexts/AuthContext";


const HomePage = () => {

    const { isAuthenticated } = useAuth();
    return (
        <div 
            style={{ 
                display: "flex", 
                flexDirection: "column",
            }}
        >

            {/* Main Section */}
            <Container
                maxWidth="md"
                sx={{ textAlign: "center", marginTop: 8, marginBottom: "auto" }}
            >
                <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }}>
                    Welcome to Simplified Jira
                </Typography>
                <Typography variant="subtitle1" paragraph>
                    A lightweight project management tool for your team. <br/> Organize your
                    tasks, collaborate efficiently, and achieve your goals.
                </Typography>
                {/* Replacing Grid with Box */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2, // Space between buttons
                        marginTop: 4,
                    }}
                >
                    <Button variant="contained" color="primary" size="large"
                        sx={{ borderRadius: 3}}
                    >
                        <Link to="/projects" className="white-link">
                            {isAuthenticated ? "View Your Projects" : "Get Started"}
                        </Link>
                    </Button>
                    {/* <Button variant="outlined" color="primary" size="large">
                        Learn More
                    </Button> */}
                </Box>
            </Container>
            {/* Features Section */}
            <Container maxWidth="lg" sx={{ marginTop: 8, textAlign: "center" }}>
                <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 4 }}>
                Features Designed for Your Team
                </Typography>
                <Grid container spacing={4}>
                <Grid item xs={12} sm={4}>
                    <Card
                    sx={{
                        padding: 3,
                        textAlign: "center",
                    }}
                    >
                    <BugReportIcon fontSize="large" sx={{ marginBottom: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Bug Tracking
                    </Typography>
                    <Typography>
                        Easily report and track bugs to ensure your project runs
                        smoothly.
                    </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card
                    sx={{
                        padding: 3,
                        textAlign: "center",
                    }}
                    >
                    <TaskIcon fontSize="large" sx={{ marginBottom: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Task Management
                    </Typography>
                    <Typography>
                        Assign and manage tasks effectively to keep everyone on track.
                    </Typography>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card
                    sx={{
                        padding: 3,
                        textAlign: "center",
                    }}
                    >
                    <EmojiEventsIcon fontSize="large" sx={{ marginBottom: 2 }} />
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Achieve Goals
                    </Typography>
                    <Typography>
                        Monitor progress and ensure your team meets their goals on time.
                    </Typography>
                    </Card>
                </Grid>
                </Grid>
            </Container>
        </div>
    );
};

export default HomePage;
